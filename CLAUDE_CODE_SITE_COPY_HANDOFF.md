---
title: "Claude Code handoff: free-site copy double check"
last_updated: "2026-08-14"
status: "handoff"
target: "Claude Code"
---

# Claude Code handoff: サイト文章ダブルチェック

## 最初に読む

必ず以下を読んでから作業する。

1. `/Users/mutsumi/AI_WorkSpace/CLAUDE.md`
2. `/Users/mutsumi/AI_WorkSpace/nouiki-lab/STATE.md`
3. `/Users/mutsumi/AI_WorkSpace/nouiki-lab/PERSONA.md`
4. `/Users/mutsumi/AI_WorkSpace/nouiki-lab/SEO_SITE_STRUCTURE.md`
5. `/Users/mutsumi/AI_WorkSpace/nouiki-lab/free-site/README.md`
6. `/Users/mutsumi/AI_WorkSpace/nouiki-lab/mailmag/kit_setup.md`
7. `/Users/mutsumi/AI_WorkSpace/nouiki-lab/mailmag/CLAUDE_CODE_HANDOFF.md`

## 現状

公開サイトはすでにSitesで公開済み。

- Live URL: `https://nouiki-lab.com`
- Free-site repo: `/Users/mutsumi/AI_WorkSpace/nouiki-lab/free-site`
- Kit登録フォームは作成済み。埋め込みコードは `/Users/mutsumi/AI_WorkSpace/nouiki-lab/mailmag/kit_setup.md`
- ただし今回の主作業は「サイト文章のダブルチェック」。Kit操作やデプロイは別判断

## 今回やること

公開サイト全体の文章を、以下の観点でチェックし、必要ならリライトする。

目的は「脳イキ特化サイトとして、検索から来た読者が“これは自分の悩みを分かっている”と思って読み進める状態」にすること。

## 対象ファイル

まず見るべき本文Markdown:

- `/Users/mutsumi/AI_WorkSpace/nouiki-lab/free-site/F01_what_is.md`
- `/Users/mutsumi/AI_WorkSpace/nouiki-lab/free-site/F02_is_it_real.md`
- `/Users/mutsumi/AI_WorkSpace/nouiki-lab/free-site/F04_myths.md`
- `/Users/mutsumi/AI_WorkSpace/nouiki-lab/free-site/F05_no_sensation.md`
- `/Users/mutsumi/AI_WorkSpace/nouiki-lab/free-site/F06_cant_concentrate.md`
- `/Users/mutsumi/AI_WorkSpace/nouiki-lab/free-site/F07_fear_tension.md`
- `/Users/mutsumi/AI_WorkSpace/nouiki-lab/free-site/F08_stops_midway.md`
- `/Users/mutsumi/AI_WorkSpace/nouiki-lab/free-site/F09_safety.md`
- `/Users/mutsumi/AI_WorkSpace/nouiki-lab/free-site/F10_six_types.md`
- `/Users/mutsumi/AI_WorkSpace/nouiki-lab/free-site/F11_not_pleasant.md`
- `/Users/mutsumi/AI_WorkSpace/nouiki-lab/free-site/F12_cant_reproduce.md`
- `/Users/mutsumi/AI_WorkSpace/nouiki-lab/free-site/F13_hub_cannot.md`

UI/メタ/固定文言:

- `/Users/mutsumi/AI_WorkSpace/nouiki-lab/free-site/app/page.tsx`
- `/Users/mutsumi/AI_WorkSpace/nouiki-lab/free-site/app/[page]/page.tsx`
- `/Users/mutsumi/AI_WorkSpace/nouiki-lab/free-site/app/layout.tsx`
- `/Users/mutsumi/AI_WorkSpace/nouiki-lab/free-site/app/content-data.ts`
- `/Users/mutsumi/AI_WorkSpace/nouiki-lab/free-site/app/age-gate.tsx`
- `/Users/mutsumi/AI_WorkSpace/nouiki-lab/free-site/app/evidence/page.tsx`
- `/Users/mutsumi/AI_WorkSpace/nouiki-lab/free-site/app/about/page.tsx`
- `/Users/mutsumi/AI_WorkSpace/nouiki-lab/free-site/app/privacy/page.tsx`
- `/Users/mutsumi/AI_WorkSpace/nouiki-lab/free-site/app/terms/page.tsx`

注意:

`app/content-data.ts` はMarkdown記事を埋め込んだ生成/同期ファイルの可能性がある。記事本文を直すなら、原則として `Fxx_*.md` を正本として編集し、必要に応じて既存の同期手順を確認すること。いきなり `content-data.ts` だけを手で直さない。

## 読者像

検索流入の主な読者は、次のどれか。

- 「脳イキ できない」で検索している
- 「脳イキ 何も感じない」で検索している
- 「脳イキ 怖い」で検索している
- 「脳イキ 途中で止まる」で検索している
- 「脳イキ 再現できない」で検索している
- 体験談やコメント欄を見て、自分だけ起きない気がしている

読者は「文章を読みたい」のではなく、「このサイトは自分の止まり方を分かっているか」を見ている。

## 文章の方向性

良い文章:

- 最初の3行で読者の具体的な場面を言い当てる
- 「AなのにBしてしまう」という矛盾を扱う
- 成功談ではなく、止まり方の整理として見せる
- 言い切れないことは、報告/可能性/未確立に分ける
- 汐は編集・調査担当として控えめに出す
- 一記事ごとに「次に読む理由」が自然にある

悪い文章:

- 管理者視点のメタ説明
- 「このサイトでは〜を提供します」のような平板な案内
- R18に寄せた煽り
- 逆に薄すぎる健康コラム風
- 「研究で確立」「医学的に証明」など出典以上の断定
- 失敗した読者を責めるように見える言い回し

## ユーザーから出た重要フィードバック

過去にユーザーが違和感を出した点を必ず反映する。

- 「脳イキでつまずいた時に読む場所。」は弱い。ひっかからない
- R18に寄せてはいけないが、薄すぎると滑稽
- メタ言語が多い
- あおらず、整理
- 「言葉にできる場所」を目指す
- 出典が弱いものは強く言わない
- 「研究で確立」とは書かず、報告/可能性/未確立を分ける
- 「無料」は全部削ってもいい
- 「医学用語ではありません」はよくない。不要
- 「それぞれ別の入口から読めます」はあまり良くない
- ターゲットが求める文章、読み進める文章を考える
- キャラクター口調は検討可。ただし汐をかわいい案内キャラにしない
- 人間から見たら内部の情報に見える文言は出さない

## 禁止・注意表現

公開サイト本文・見出し・ボタン・メタディスクリプションで避ける。

- 無料
- 医学用語ではありません
- 内部リンク
- ファネル
- リード獲得
- SEO対策として
- 誰でも
- 簡単
- 最短
- 必ず
- 絶対
- 覚醒
- 感度爆上げ
- 研究で確立
- 医学的に証明
- 治る
- 改善します
- 安心してください

成人向けテーマとしての注意:

- 露骨な性的描写に寄せない
- 性的サービスの販売やポルノ的な印象にしない
- 18歳未満不可、無理に続けない、体調不良/痛み/強い不安なら中止、という線は自然に残す
- Kitの規約上も「教育的/編集的な整理」に寄せる

## SEO観点

SEOは「キーワードを詰める」ではなく、検索意図に対して記事冒頭で具体的に応える。

主な検索意図:

- 脳イキとは: 言葉の意味、体験談との距離、自分にも起きるのか
- 脳イキ 本当/嘘: 成功談と誇張を分けたい
- 脳イキ できない: 自分の止まり方を知りたい
- 脳イキ 何も感じない: 無反応の理由を探している
- 脳イキ 集中できない: 頭が働く、確認してしまう
- 脳イキ 怖い: 来そうな瞬間の不安、止めていい基準
- 脳イキ 途中で止まる: 確認/期待/怖さで途切れる
- 脳イキ 気持ちよくない: 義務感や違和感を整理したい
- 脳イキ 再現できない: 一度だけ起きた感覚を追っている

各記事の冒頭は、検索語を自然に含めつつ、読者の昨日の場面から始める。

## 汐の扱い

`PERSONA.md` を優先。

- 汐は脳イキ経験者ではない
- 編集・調査担当
- 「体験談を横断的に読んで、整理されていない欠落に気づいた人」
- About/evidence/署名では使ってよい
- トップや記事本文で前に出しすぎない
- 先生キャラ/案内キャラにしすぎない

## 具体的な修正方針

1. 各記事の冒頭3行をチェックする
2. 「昨日ありそうな場面」から始まっていない記事は修正する
3. 抽象的な見出しを、具体的な矛盾＋短いラベルに変える
4. 断定が強い文は、出典の強さに合わせて弱める
5. 読者を次の記事またはメール登録へ進ませる文を、管理用語なしで整える
6. メタディスクリプションも、検索意図に合わせて見直す
7. 年齢確認や安全注意は、言い訳っぽくせず自然な境界線として書く

## メール登録導線

Kitフォームは作成済み。

埋め込みコード:

```html
<script async data-uid="188cf734d9" src="https://motivated-artist-4115.kit.com/188cf734d9/index.js"></script>
```

登録導線の言葉は、サイト側では以下を基準にする。

- 表示名: 昨日の状態を1分で分けるメモ
- ボタン: 最初のメモを受け取る
- 説明: できた人の真似を続ける前に、まず「何が起きていないのか」を分けてみる

避ける:

- メルマガ登録
- 無料プレゼント
- リード獲得
- ステップメール

## 納品形式

推奨:

1. サイト文章の監査結果を `/Users/mutsumi/AI_WorkSpace/nouiki-lab/free-site/COPY_REVIEW_NOTES.md` に作成
2. 修正が必要なものは、該当ファイルを直接編集
3. 変更後に `COPY_REVIEW_NOTES.md` へ「直した箇所/残した懸念/未対応理由」を追記

大きく変える前に確認が必要なもの:

- サイト構成そのもの
- 記事追加/削除
- 有料商品導線の強化
- Kitフォーム埋め込み実装
- デプロイ

## 検収チェック

完了前に以下を実行する。

```bash
rg -n "無料|医学用語ではありません|内部リンク|ファネル|リード獲得|SEO対策として|誰でも|簡単|最短|必ず|絶対|覚醒|爆上げ|研究で確立|医学的に証明|治る|改善します|安心してください" /Users/mutsumi/AI_WorkSpace/nouiki-lab/free-site
```

```bash
rg -n "研究|論文|科学|証明|確立|安全|医療|診断|治療" /Users/mutsumi/AI_WorkSpace/nouiki-lab/free-site/F*.md /Users/mutsumi/AI_WorkSpace/nouiki-lab/free-site/app
```

必要なら以下も実行。

```bash
cd /Users/mutsumi/AI_WorkSpace/nouiki-lab/free-site
npm run check
npm run lint
```

## ブラウザ/公開作業の禁止

Claude Codeがこの引き継ぎでやるのは文章監査と必要最小限のローカル編集。

- ユーザー承認なしにDeployしない
- KitのPublishを押さない
- KitのUpgrade/支払い/Cancel trialを押さない
- Cloudflare/DNSを触らない
- Sites本番反映をしない

公開反映は、文章レビューが終わってユーザー確認後に別作業として行う。
