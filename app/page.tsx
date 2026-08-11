import Image from "next/image";
import Link from "next/link";
import { articleCard, categoryOrder, getArticlesByGroup, getArticleById, guideCta } from "./site";

export default function Home() {
  const byGroup = getArticlesByGroup();

  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="kicker">18歳以上向け / 医学用語ではありません</p>
          <h1>脳イキを、あおらず整理する。</h1>
          <p>できる・できないの前に、言葉の意味、安全性、つまずき方を静かに確認する無料ノートです。</p>
          <div className="hero-actions">
            <a className="button" href="#cannot">
              困りごとから探す
            </a>
            <Link className="text-link" href="/articles/f-01-what-is/">
              まず意味を読む
            </Link>
          </div>
        </div>
        <figure className="hero-media">
          <Image src="/images/hero-desk.jpg" alt="夜の静かな机に開かれたノートとランプが置かれている" width={1200} height={900} priority />
        </figure>
      </section>

      <section className="notice-band">
        <strong>公開前確認中</strong>
        <span>本サイトは医療診断・治療・効果保証を提供しません。F03(科学的根拠と論文)は、出典確認が揃うまで公開しません。</span>
      </section>

      <section id="cannot" className="section">
        <div className="section-head">
          <h2>いま困っていることから探す</h2>
          <p>「何も感じない」「集中できない」「怖い」など、検索されやすい長尾キーワードを入口にしています。</p>
        </div>
        <div className="problem-grid">
          {["F05", "F06", "F07", "F08", "F11", "F12"].map((id) => articleCard(getArticleById(id)))}
        </div>
      </section>

      <section id="start" className="feature-row">
        <Image src="/images/notebook-sun.jpg" alt="日差しの入る机に開いたノートが置かれている" width={1200} height={900} />
        <div>
          <h2>初めて読むなら、この3本から</h2>
          <div className="stacked-links">
            {["F01", "F02", "F04"].map((id) => articleCard(getArticleById(id)))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>全記事一覧</h2>
          <p>特化サイトとして、近い悩みの記事同士を内部リンクでつなぎます。</p>
        </div>
        {categoryOrder.map((group) => (
          <div className="category-block" key={group}>
            <h3>{group}</h3>
            <div className="article-grid">{byGroup[group].map(articleCard)}</div>
          </div>
        ))}
      </section>

      <section className="evidence-strip">
        <Image src="/images/study-window.jpg" alt="窓辺の明るい学習机に本とノートが並んでいる" width={1200} height={900} />
        <div>
          <h2>出典が弱いものは、強く言わない</h2>
          <p>論文や公的情報は確認中です。現時点では「研究で確立」とは書かず、報告・可能性・未確立を分けて表示します。</p>
          <Link className="text-link" href="/evidence/">
            出典・確認方針を見る
          </Link>
        </div>
      </section>

      {guideCta()}

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "脳イキ研究ノート",
            description:
              "脳イキという通称について、医学用語ではない前提から、できない理由・安全性・現在地の整理を行う無料情報サイトです。",
            inLanguage: "ja",
          }),
        }}
      />
    </main>
  );
}
