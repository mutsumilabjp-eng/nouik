/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  DB?: D1Database;
  EMAIL?: SendEmail;
  RESEND_API_KEY?: string;
  SUBSCRIBE_FROM_EMAIL?: string;
  SUBSCRIBE_NOTIFY_EMAIL?: string;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface SendEmail {
  send(message: {
    from: string | { email: string; name?: string };
    to: string | { email: string; name?: string };
    subject: string;
    text: string;
    html?: string;
    replyTo?: string | { email: string; name?: string };
  }): Promise<{ messageId: string }>;
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

type SubscriptionKind = "content" | "paid";

const fromEmailFallback = "notify@nouiki-lab.com";
const subscriptionLabels: Record<SubscriptionKind, string> = {
  content: "昨日の状態を1分で分けるメモ",
  paid: "詳細ガイドの更新通知",
};

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function sendResendNotification(input: {
  apiKey: string;
  fromEmail: string;
  html: string;
  notifyEmail: string;
  replyTo: string;
  subject: string;
  text: string;
}) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${input.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `脳イキ研究ノート <${input.fromEmail}>`,
      to: [input.notifyEmail],
      reply_to: input.replyTo,
      subject: input.subject,
      text: input.text,
      html: input.html,
    }),
  });

  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(`Resend送信失敗: ${response.status} ${message}`);
  }
}

async function sha256(value: string) {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function saveSubscription(
  db: D1Database,
  input: { email: string; kind: SubscriptionKind; source: string; page: string; submittedAt: string },
) {
  const emailHash = await sha256(input.email);
  await db.batch([
    db.prepare(
      `CREATE TABLE IF NOT EXISTS subscriptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        email_hash TEXT NOT NULL,
        kind TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'active',
        source TEXT,
        first_page TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        UNIQUE(email_hash, kind)
      )`,
    ),
    db.prepare(
      `CREATE TABLE IF NOT EXISTS subscription_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email_hash TEXT NOT NULL,
        kind TEXT NOT NULL,
        source TEXT,
        page TEXT,
        event_type TEXT NOT NULL,
        created_at TEXT NOT NULL
      )`,
    ),
  ]);
  await db.batch([
    db
      .prepare(
        `INSERT INTO subscriptions (email, email_hash, kind, status, source, first_page, created_at, updated_at)
         VALUES (?, ?, ?, 'active', ?, ?, ?, ?)
         ON CONFLICT(email_hash, kind) DO UPDATE SET
           email = excluded.email,
           status = 'active',
           source = excluded.source,
           updated_at = excluded.updated_at`,
      )
      .bind(input.email, emailHash, input.kind, input.source, input.page, input.submittedAt, input.submittedAt),
    db
      .prepare(
        `INSERT INTO subscription_events (email_hash, kind, source, page, event_type, created_at)
         VALUES (?, ?, ?, ?, 'subscribe', ?)`,
      )
      .bind(emailHash, input.kind, input.source, input.page, input.submittedAt),
  ]);
}

async function handleSubscribe(request: Request, env: Env) {
  if (request.method !== "POST") {
    return jsonResponse({ message: "POSTで送信してください。" }, 405);
  }

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return jsonResponse({ message: "送信形式が正しくありません。" }, 415);
  }

  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return jsonResponse({ message: "入力内容を読み取れませんでした。" }, 400);
  }

  const email = String(payload.email || "").trim().toLowerCase();
  const kind = String(payload.kind || "") as SubscriptionKind;
  const source = String(payload.source || "unknown").slice(0, 80);
  const page = String(payload.page || "/").slice(0, 160);
  const trap = String(payload.company || "");

  if (trap) {
    return jsonResponse({ message: "登録を受け付けました。" });
  }

  if (!isEmail(email) || !(kind in subscriptionLabels)) {
    return jsonResponse({ message: "メールアドレスを確認してください。" }, 400);
  }

  const label = subscriptionLabels[kind];
  const submittedAt = new Date().toISOString();
  let storageStatus = "D1未接続のためメール通知のみ";
  let storageSaved = false;
  if (env.DB) {
    try {
      await saveSubscription(env.DB, { email, kind, source, page, submittedAt });
      storageStatus = "D1保存済み";
      storageSaved = true;
    } catch (error) {
      storageStatus = `D1保存失敗: ${error instanceof Error ? error.message : "unknown error"}`;
    }
  }
  const notifyEmail = env.SUBSCRIBE_NOTIFY_EMAIL;
  const fromEmail = env.SUBSCRIBE_FROM_EMAIL || fromEmailFallback;
  const lines = [
    "脳イキ研究ノートの購読フォームから登録がありました。",
    "",
    `登録種別: ${label}`,
    `メールアドレス: ${email}`,
    `流入元: ${source}`,
    `ページ: ${page}`,
    `日時: ${submittedAt}`,
    `保存状態: ${storageStatus}`,
  ];
  const subject = `【脳イキ研究ノート】${label} 登録`;
  const html = `<p>脳イキ研究ノートの購読フォームから登録がありました。</p>
<dl>
<dt>登録種別</dt><dd>${escapeHtml(label)}</dd>
<dt>メールアドレス</dt><dd>${escapeHtml(email)}</dd>
<dt>流入元</dt><dd>${escapeHtml(source)}</dd>
<dt>ページ</dt><dd>${escapeHtml(page)}</dd>
<dt>日時</dt><dd>${escapeHtml(submittedAt)}</dd>
<dt>保存状態</dt><dd>${escapeHtml(storageStatus)}</dd>
</dl>`;

  let notificationSent = false;
  if (env.RESEND_API_KEY && notifyEmail) {
    try {
      await sendResendNotification({
        apiKey: env.RESEND_API_KEY,
        fromEmail,
        html,
        notifyEmail,
        replyTo: email,
        subject,
        text: lines.join("\n"),
      });
      notificationSent = true;
    } catch {
      // D1 remains source truth when email delivery unavailable.
    }
  } else if (env.EMAIL && notifyEmail) {
    try {
      await env.EMAIL.send({
        from: { email: fromEmail, name: "脳イキ研究ノート" },
        to: notifyEmail,
        replyTo: email,
        subject,
        text: lines.join("\n"),
        html,
      });
      notificationSent = true;
    } catch {
      // D1 remains the source of truth when email delivery is unavailable.
    }
  }

  if (!storageSaved && !notificationSent) {
    return jsonResponse({ message: "登録保存の準備中です。少し時間をおいてください。" }, 503);
  }

  return jsonResponse({ message: "登録を受け付けました。" });
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env = {}, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/subscribe") {
      return handleSubscribe(request, env ?? {});
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
