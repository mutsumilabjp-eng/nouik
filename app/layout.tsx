import type { Metadata } from "next";
import Link from "next/link";
import AgeGate from "./age-gate";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"),
  title: {
    default: "脳イキ研究ノート",
    template: "%s | 脳イキ研究ノート",
  },
  description:
    "脳イキという通称について、医学用語ではない前提から、できない理由・安全性・現在地の整理を行う無料情報サイトです。",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "脳イキ研究ノート",
    description:
      "できる・できないの前に、言葉の意味、安全性、つまずき方を静かに確認する無料ノートです。",
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
        <AgeGate />
        <header className="site-header">
          <Link className="brand" href="/">
            脳イキ研究ノート
          </Link>
          <nav aria-label="主要ナビゲーション">
            <Link href="/#start">はじめに</Link>
            <Link href="/#cannot">できない理由</Link>
            <Link href="/articles/f-09-safety">安全性</Link>
            <Link href="/evidence">方針</Link>
            <Link href="/guide">完全ガイド</Link>
          </nav>
        </header>
        {children}
        <footer className="site-footer">
          <div>
            <strong>脳イキ研究ノート</strong>
            <p>医学用語ではない通称を、断定を避けながら整理する無料情報サイトです。</p>
          </div>
          <div className="footer-links">
            <Link href="/about">このサイトについて</Link>
            <Link href="/evidence">出典・確認方針</Link>
            <Link href="/disclaimer">免責事項</Link>
            <Link href="/privacy">プライバシー</Link>
            <Link href="/contact">問い合わせ</Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
