/* eslint-disable @next/next/no-html-link-for-pages */
import type { Metadata } from "next";
import AgeGate from "./age-gate";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://nouiki-lab.com"),
  title: {
    default: "脳イキ研究ノート",
    template: "%s | 脳イキ研究ノート",
  },
  description:
    "脳イキ音声やASMRで何も感じない、怖くなる、途中で止まる人へ。できた人の話だけでは分からない、今の状態に近い記事を探せるサイトです。",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "脳イキ研究ノート",
    description: "脳イキできた人のコメントばかり見えるのに、自分には何も起きない。そんな時に、今の状態に近い記事から読めます。",
    images: ["/images/hero-desk.jpg"],
    locale: "ja_JP",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <div id="site-shell">
          <header className="site-header">
            <a className="brand" href="/">
              脳イキ研究ノート
            </a>
            <nav aria-label="主要ナビゲーション">
              <a href="/#start">はじめに</a>
              <a href="/#cannot">うまくいかない時</a>
              <a href="/articles/f-09-safety">安全性</a>
              <a href="/evidence">根拠</a>
              <a href="/guide">記録ガイド</a>
              <a href="/premium-guide">詳細ガイド</a>
            </nav>
          </header>
          {children}
          <AgeGate />
          <footer className="site-footer">
            <div>
              <strong>脳イキ研究ノート</strong>
          <p>脳イキ音声で何も感じない、怖い、途中で止まる時に、今の状態を見直すための情報サイトです。</p>
            </div>
            <div className="footer-links">
              <a href="/about">このサイトについて</a>
              <a href="/evidence">根拠</a>
              <a href="/disclaimer">免責事項</a>
              <a href="/privacy">プライバシー</a>
              <a href="/contact">問い合わせ</a>
              <a href="/premium-guide">詳細ガイド</a>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
