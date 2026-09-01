"use client";

import { useId, useState } from "react";

type SubscriptionKind = "content" | "paid";

type Props = {
  cta: string;
  description: string;
  heading: string;
  kind: SubscriptionKind;
  submitLabel: string;
};

type Status = "idle" | "loading" | "success" | "error";

export default function SubscriptionForm({ cta, description, heading, kind, submitLabel }: Props) {
  const emailId = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "").trim();

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          kind,
          source: cta,
          page: window.location.pathname,
        }),
      });
      const result = (await response.json().catch(() => ({}))) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message || "送信できませんでした。");
      }

      form.reset();
      setStatus("success");
      setMessage(result.message || "登録を受け付けました。");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "送信できませんでした。");
    }
  }

  return (
    <form className="subscription-form" data-subscription-kind={kind} onSubmit={handleSubmit}>
      <div>
        <h3>{heading}</h3>
        <p>{description}</p>
      </div>
      <label htmlFor={emailId}>メールアドレス</label>
      <label className="subscription-trap">
        会社名
        <input name="company" type="text" tabIndex={-1} autoComplete="off" />
      </label>
      <div className="subscription-form-row">
        <input
          id={emailId}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="mail@example.com"
          required
        />
        <button className="button" disabled={status === "loading"} type="submit">
          {status === "loading" ? "送信中" : submitLabel}
        </button>
      </div>
      <p className={`subscription-status subscription-status-${status}`} role="status">
        {message || "18歳以上向け。いつでも解除できます。"}
      </p>
    </form>
  );
}
