import Image from "next/image";
import Link from "next/link";
import { articleCard, categoryOrder, getArticlesByGroup, getArticleById, guideCta } from "./site";

export default function Home() {
  const byGroup = getArticlesByGroup();

  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="kicker">音声を聞いたあと、検索しているあなたへ</p>
          <h1>
            効いた人ばかりに
            <br />
            見えるのに、
            <br />
            自分には何も起きない。
          </h1>
          <p>それ、焦りますよね。脳イキ音声やASMRを試しても何も感じない。少し反応しても怖くなる。途中で冷める。ここでは、体験談だけでは見えない反応の分かれ目を一緒に見ていきます。</p>
          <div className="hero-actions">
            <a className="button" href="#cannot">
              困りごとから探す
            </a>
            <Link className="text-link" href="/articles/f-01-what-is">
              まず意味を読む
            </Link>
          </div>
          <div className="hero-chips" aria-label="このサイトで扱う入口">
            <span>脳イキ とは</span>
            <span>できない理由</span>
            <span>安全性</span>
          </div>
        </div>
        <figure className="hero-media">
          <Image src="/images/hero-desk.jpg" alt="夜の静かな机に開かれたノートとランプが置かれている" width={1200} height={900} priority />
          <figcaption>効いた人の話だけでは、自分の反応は見えてきません。</figcaption>
        </figure>
      </section>

      <section className="statement-panel">
        <p>「本当にあるの？」と「自分にも起きるの？」は、別の問いです。</p>
        <h2>体験談を追うほど分からなくなる前に、今の反応を見てみましょう。</h2>
      </section>

      <section className="trust-ribbon" aria-label="このサイトで読めること">
        <div>
          <span>REAL?</span>
          <strong>本当にあるのか知りたい</strong>
          <p>コメント欄や体験談を読むほど、信じたい気持ちと疑う気持ちが混ざる時に。</p>
        </div>
        <div>
          <span>NO FEEL</span>
          <strong>何も感じない</strong>
          <p>何度聞いても変化がない。自分だけ鈍いのかも、と思った時に。</p>
        </div>
        <div>
          <span>FEAR</span>
          <strong>怖くなった・不安が残る</strong>
          <p>ムズムズする、眠れない、戻ったか不安。そんな時は、続ける前にまず止まりましょう。</p>
        </div>
      </section>

      <section className="notice-band">
        <strong>18歳以上向け</strong>
        <span>本サイトは医療診断・治療・効果保証を提供しません。痛み、不安、強い苦痛がある場合は閲覧や試行を中断してください。</span>
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

      <section className="reason-band" aria-labelledby="reason-title">
        <div className="section-head">
          <h2 id="reason-title">「できない」の中身を見る</h2>
          <p>何も起きないのか、少し来るけど止まるのか、怖さが先に出るのか。同じ「効かない」でも、次に読む記事は変わります。</p>
        </div>
        <div className="reason-grid">
          <div>
            <span>01</span>
            <h3>言葉の意味</h3>
            <p>言葉の使われ方と、誤解されやすいポイントを先に見ていきます。</p>
          </div>
          <div>
            <span>02</span>
            <h3>つまずき方</h3>
            <p>感じない、怖い、途中で止まるなど、検索される悩みを別々の記事へ分けます。</p>
          </div>
          <div>
            <span>03</span>
            <h3>安全ライン</h3>
            <p>安全を断定せず、不安や苦痛が強い場合の中断・相談を優先します。</p>
          </div>
        </div>
      </section>

      <section id="start" className="feature-row">
        <Image src="/images/notebook-sun.jpg" alt="日差しの入る机に開いたノートが置かれている" width={1200} height={900} />
        <div>
          <h2>まず読みたい3本</h2>
          <div className="stacked-links">
            {["F01", "F02", "F04"].map((id) => articleCard(getArticleById(id)))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>悩みから探す</h2>
          <p>「何も感じない」「怖い」「途中で止まる」など、今の状態にいちばん近いところからどうぞ。</p>
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
          <h2>できた人の話だけで、自分を責めない</h2>
          <p>体験談は参考になります。でも、成功保証ではありません。できない人を責める言葉や、強すぎるコツから少し距離を置いて、今の反応を見ます。</p>
          <Link className="text-link" href="/evidence">
            判断のしかたを見る
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
              "脳イキ音声やASMRで反応する人と何も起きない人の差を、感じない・怖い・途中で止まる状態別に見ていく情報サイトです。",
            inLanguage: "ja",
          }),
        }}
      />
    </main>
  );
}
