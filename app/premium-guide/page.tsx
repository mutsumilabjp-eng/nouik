/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { freeMemoFormUrl, premiumGuideUrl } from "../site";

export const metadata: Metadata = {
  title: "脳イキ研究ノート 詳細ガイド",
  description:
    "脳イキ音声で何も感じない、途中で止まる、怖くなる、再現できない時に、自分の止まり方を整理し、次に見る条件を決めるための実践ガイド。",
  alternates: {
    canonical: "/premium-guide",
  },
  openGraph: {
    title: "脳イキ研究ノート 詳細ガイド",
    description:
      "脳イキ音声で何も感じない、途中で止まる、怖くなる、再現できない時に、自分の止まり方を整理し、次に見る条件を決めるための実践ガイド。",
    type: "article",
    images: ["/images/premium-guide-cover.png"],
  },
};

const stopTypes = [
  "何も感じない",
  "反応はあるのに快くない",
  "途中で確認して冷める",
  "怖くなって力が入る",
  "条件を変えても変化がない",
  "一度だけ近かった感覚を追いかけている",
];

const guideContents = [
  "6つの止まり方を見分ける入口",
  "検証前に見ておきたい体調・環境・不安のチェック",
  "一度に1つだけ変えるための考え方",
  "3回分を比べる記録の残し方",
  "続けるより止めた方がいい時の目安",
  "別紙4点と記入例",
];

export default function PremiumGuidePage() {
  return (
    <main className="premium-page">
      <section className="premium-hero">
        <div className="premium-hero-copy">
          <p className="kicker">18歳以上向け / 詳細ガイド</p>
          <h1>脳イキ研究ノート 詳細ガイド</h1>
          <p>
            できた人の話を増やすより、自分がどこで止まっているのかを一度見たい。そんな人のために、6つの止まり方から次に見る条件を整理する実践ガイドです。
          </p>
          <div className="premium-meta" aria-label="詳細ガイドの概要">
            <span>約38,000文字</span>
            <span>5,980円</span>
            <span>18歳以上向け</span>
          </div>
        </div>
        <figure className="premium-cover">
          <img src="/images/premium-guide-cover.png"
            alt="脳イキ研究ノート 詳細ガイドの表紙"
            width={1086}
            height={1448} />
        </figure>
      </section>

      <section className="premium-section">
        <div className="section-head">
          <p className="kicker">こんな止まり方に心当たりがある人へ</p>
          <h2>「できた / できない」の二択にすると、次に見る場所が消えます。</h2>
          <p>
            脳イキ音声やASMRを試したあと、何も起きなかった日もあれば、少し近づいた気がしたのに途中で冷めた日もある。怖くなって閉じた日や、一度だけの感覚を追いかけている日もあります。
          </p>
        </div>
        <div className="stop-type-grid">
          {stopTypes.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>

      <section className="premium-split">
        <div>
          <p className="kicker">このガイドで扱うこと</p>
          <h2>方法を増やす前に、見る条件を減らす。</h2>
          <p>
            詳細ガイドでは、6つの止まり方を入口に、何を固定し、何を1つだけ変え、どう記録して比較するかを整理しています。
          </p>
          <p>
            「これを読めば起きる」と約束するものではありません。自分に起きていることを雑にまとめず、次に試す条件を小さくするためのガイドです。
          </p>
        </div>
        <ul className="premium-list">
          {guideContents.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="premium-section">
        <div className="section-head">
          <p className="kicker">向いている人 / 向いていない人</p>
          <h2>成功談を集めるより、自分の記録を見たい人向けです。</h2>
        </div>
        <div className="fit-grid">
          <div>
            <h3>向いている人</h3>
            <ul>
              <li>何も感じない理由を、感度だけで片づけたくない</li>
              <li>途中で冷める、怖くなる、再現できない違いを分けたい</li>
              <li>同じ音声を何度も試す前に、条件を整理したい</li>
            </ul>
          </div>
          <div>
            <h3>向いていない人</h3>
            <ul>
              <li>すぐに結果を約束する方法を探している</li>
              <li>記録や比較より、新しい刺激だけを増やしたい</li>
              <li>痛みや強い不安が続いていて、休む判断が先に必要</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="list-cta premium-page-memo" aria-labelledby="premium-memo-title">
        <div className="list-cta-primary">
          <p className="kicker">まだ整理しきれていない人へ</p>
          <h2 id="premium-memo-title">先に、昨日の状態だけ分けてもかまいません。</h2>
          <p>
            何から見ればいいか迷っているなら、詳細ガイドへ進む前に「昨日の状態を1分で分けるメモ」から始められます。
          </p>
          <div className="list-cta-actions">
            <a className="button" href={freeMemoFormUrl} data-cta="top-free-memo" rel="noreferrer" target="_blank">
              無料メモを受け取る
            </a>
            <p>18歳以上向け / Googleフォームへ移動します</p>
          </div>
        </div>
      </section>

      <section className="premium-final" aria-labelledby="premium-purchase-title">
        <div>
          <p className="kicker">詳細を見る</p>
          <h2 id="premium-purchase-title">脳イキ研究ノート 詳細ガイド</h2>
          <p>
            約38,000文字 / 5,980円。18歳以上向けの有料コンテンツです。特定の体験や結果を保証するものではありません。
          </p>
        </div>
        <a className="button" href={premiumGuideUrl} data-cta="premium-guide" rel="noreferrer" target="_blank">
          deeps.meで詳細ガイドを見る
        </a>
      </section>

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: "脳イキ研究ノート 詳細ガイド",
            description:
              "脳イキ音声で何も感じない、途中で止まる、怖くなる、再現できない時に、自分の止まり方を整理し、次に見る条件を決めるための実践ガイド。",
            image: "https://nouiki-lab.com/images/premium-guide-cover.png",
            offers: {
              "@type": "Offer",
              price: "5980",
              priceCurrency: "JPY",
              url: premiumGuideUrl,
              availability: "https://schema.org/InStock",
            },
          }),
        }}
      />
    </main>
  );
}
