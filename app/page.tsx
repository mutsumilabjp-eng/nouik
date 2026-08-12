import Image from "next/image";
import Link from "next/link";
import { articleCard, getArticleById, getArticlesByGroup, guideCta } from "./site";

export default function Home() {
  const byGroup = getArticlesByGroup();
  const first = getArticleById("F02");
  const safety = getArticleById("F09");
  const hub = getArticleById("F13");

  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="kicker">昨日、脳イキ音声を止めたあとに検索したあなたへ</p>
          <h1>
            脳イキできた人の
            <br />
            コメントばかり。
            <br />
            自分には何もない。
          </h1>
          <p>
            脳イキ音声やASMRで何も感じない、少し来るのに途中で止まる、怖くなって閉じる。これ、私だけ？と思ったなら、まず昨日に近い状態から見てください。
          </p>
          <div className="hero-actions">
            <a className="button" href="#cannot">
              今の状態から探す
            </a>
            {first ? (
              <Link className="text-link" href={`/articles/${first.slug}`}>
                本当にあるのか読む
              </Link>
            ) : null}
          </div>
          <div className="hero-chips" aria-label="よくある検索のきっかけ">
            <span>何も感じない</span>
            <span>怖くなった</span>
            <span>途中で止まる</span>
          </div>
        </div>
        <figure className="hero-media">
          <Image src="/images/hero-desk.jpg" alt="夜の静かな机に開かれたノートとランプが置かれている" width={1200} height={900} priority />
          <figcaption>効いた人の話だけでは、止まった場所は見えてきません。</figcaption>
        </figure>
      </section>

      <section className="statement-panel">
        <p>信じたい気持ちと、疑う気持ちが同時にある。</p>
        <h2>まずは「起きた人の話」と「自分に起きるか」を分けて読みます。</h2>
      </section>

      <section className="trust-ribbon" aria-label="このサイトの読み方">
        <div>
          <span>01</span>
            <strong>できた人の声だけで決めない</strong>
          <p>コメント欄が熱いほど、自分だけ遅れている気がします。まず、その見え方から離れます。</p>
        </div>
        <div>
          <span>02</span>
          <strong>昨日の場面から読む</strong>
            <p>何も感じない、怖い、止まる。検索した理由に近いところから入ります。</p>
        </div>
        <div>
          <span>03</span>
          <strong>無理に続けない</strong>
            <p>不快感や生活への影響がある時は、コツ探しより中断を先に置きます。</p>
        </div>
      </section>

      <section className="section" id="start">
        <div className="section-head">
          <p className="kicker">最初に読みたい人へ</p>
          <h2>「本当なの？」が頭から離れない時に。</h2>
          <p>
            コメント欄を見るほど、自分だけ置いていかれた感じがする。そんな時は、成功談を増やすより、まず問いを小さく分けた方が読みやすくなります。
          </p>
        </div>
        <div className="article-grid">{byGroup["はじめに"].map(articleCard)}</div>
      </section>

      <section className="feature-row">
        <Image src="/images/notebook-sun.jpg" alt="窓辺のノートとやわらかい日差し" width={1000} height={750} />
        <div>
          <p className="kicker">自分を責める前に</p>
          <h2>効かなかった日は、失敗の日とは限りません。</h2>
          <p>
            音量、体調、眠気、怖さ、期待しすぎ。あとから見ると、小さな要因が重なっていたと分かることがあります。ここでは「できない人」と決めつけず、止まった場所を見る読み方に寄せています。
          </p>
          {hub ? (
            <Link className="button" href={`/articles/${hub.slug}`}>
              止まった場所を見る
            </Link>
          ) : null}
        </div>
      </section>

      <section className="section" id="cannot">
        <div className="section-head">
          <p className="kicker">今の状態から選ぶ</p>
          <h2>「できない」の中身は、人によってかなり違います。</h2>
          <p>
            何もないのか、少しあるのに快くないのか、怖さで止まるのか。似て見える悩みでも、読む順番は変わります。
          </p>
        </div>
        <div className="article-grid">{byGroup["うまくいかない時"].map(articleCard)}</div>
      </section>

      <section className="section">
        <div className="section-head">
          <p className="kicker">状態別</p>
          <h2>「自分はどれだろう」と迷う時に。</h2>
          <p>ひとつに決めきれなくてもかまいません。複数に当てはまる人もいます。</p>
        </div>
        <div className="article-grid">{byGroup["状態別"].map(articleCard)}</div>
      </section>

      <section className="evidence-strip">
        <div>
          <p className="kicker">気になる人へ</p>
          <h2>研究で分かることと、体験談に残ることがあります。</h2>
          <p>
            論文や公的情報は確認しています。ただし、個別の体験を「研究で証明済み」とは扱いません。気になる人が元資料まで戻れるように、確認した資料をまとめています。
          </p>
          <Link className="text-link" href="/evidence">
            参考資料を見る
          </Link>
        </div>
        <Image src="/images/study-window.jpg" alt="窓辺の机で資料を読む静かな作業風景" width={1000} height={750} />
      </section>

      <section className="section">
        <div className="section-head">
          <p className="kicker">怖さや不安がある時</p>
          <h2>続けるか迷ったら、先に止まる目安を見てください。</h2>
          <p>不快感、眠れなさ、日常への影響がある時は、うまくなる方法を探す前に距離を置く方が合う場合があります。</p>
        </div>
        <div className="article-grid">{byGroup["安全性"].map(articleCard)}</div>
        {safety ? (
          <Link className="button secondary-button" href={`/articles/${safety.slug}`}>
            安全性の記事を読む
          </Link>
        ) : null}
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
