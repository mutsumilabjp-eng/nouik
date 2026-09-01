import type { Metadata } from "next";
import Link from "next/link";
import SubscriptionForm from "../subscription-form";

export const metadata: Metadata = {
  title: "詳細ガイドの更新連絡",
  description: "脳イキ研究ノート 詳細ガイドに追加や改訂があった時だけ、短くお知らせします。",
  alternates: {
    canonical: "/premium-updates",
  },
  openGraph: {
    title: "詳細ガイドの更新連絡",
    description: "脳イキ研究ノート 詳細ガイドに追加や改訂があった時だけ、短くお知らせします。",
    type: "website",
  },
};

export default function PremiumUpdatesPage() {
  return (
    <main className="premium-shell">
      <nav className="breadcrumb" aria-label="パンくず">
        <Link href="/">ホーム</Link>
        <span>/</span>
        <Link href="/premium-guide">詳細ガイド</Link>
        <span>/</span>
        <span>更新連絡</span>
      </nav>

      <section className="premium-hero" aria-labelledby="premium-updates-title">
        <div>
          <p className="kicker">詳細ガイドを読んでいる人へ</p>
          <h1 id="premium-updates-title">追加や改訂があった時だけ知らせます。</h1>
          <p>
            新しい記事の案内ではなく、詳細ガイドそのものに追記や見直しがあった時だけ届く短い連絡です。
          </p>
        </div>
      </section>

      <section className="premium-section premium-page-memo" aria-labelledby="premium-updates-form-title">
        <SubscriptionForm
          cta="premium-updates-page"
          description="詳細ガイドの追加や改訂があった時だけ、短くお知らせします。"
          heading="詳細ガイドの更新だけ受け取る"
          kind="paid"
          submitLabel="更新連絡を受け取る"
        />
      </section>
    </main>
  );
}
