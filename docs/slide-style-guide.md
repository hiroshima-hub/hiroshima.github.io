# 授業スライドのスタイルガイド

## 教材の入口

トップの `index.html` から年度・科目の `index.html` に進みます。科目一覧の `slides.html?lesson=01` は同じ科目の `lesson/01.md` を読み込みます。科目ページと課題ページのデザインは `assets/style.css`、`assets/subject.css` が担当します。化学基礎の `task.html?task=01` は `assets/marked.esm.js` で `tasks/01.md` を表示します。

## CSSと表示処理の置き場所

| ファイル（assets/reveal/ 内） | 担当 |
| --- | --- |
| reveal.css、simple.css | reveal.js 本体とテーマ |
| slide-nav.css | 一覧に戻るリンク、キーボードフォーカス、印刷時の非表示 |
| lesson.css | 全科目共通の入口。以下の3ファイルを順に読み込む |
| styles/base.css | section の既定の左揃えとページ番号 |
| styles/components.css | 図、埋め込み教材、強調枠 |
| styles/utilities.css | 色、文字サイズ、配置を個別に指定 |
| lesson.js | 授業番号の確認、Markdownの選択、Reveal.initialize |

## クラス早見表

新しい名前は小文字の英単語をハイフンでつなぎます。単一の指定は `u-`、教材の部品は `c-` で始めます。部品の種類や寸法は `--` の後ろに書き、基本クラスと併用します。すべてスライド内で使います。

| 新しいクラス | 従来の書き方 | 用途 |
| --- | --- | --- |
| u-text-red / u-text-blue | red / blue | 赤字／青字 |
| u-text-large / u-text-small | large / small | 文字サイズ1.6em／0.65em |
| u-text-left | left、text-left | ブロック内を左揃え |
| u-text-center / u-text-right | text-center / text-right | 中央／右揃え |
| c-callout | important | 赤い強調枠 |
| c-timer-frame | timer-frame | タイマー用。幅は最大600px、高さ350px |
| c-experiment-frame | experiment-frame | 演示教材用。幅100%、高さ540px |
| c-figure | lesson-visual | 補助図。最大高さ210px |
| c-figure c-figure--inset | concept-image | 小さめの余白付き図。最大幅96%、上余白12px |
| c-figure c-figure--short | lesson-visual lesson-visual--short | 文章の多いページ。最大高さ160px |
| c-figure c-figure--tall | lesson-visual lesson-visual--elements | 元素一覧など。最大高さ445px |
| c-figure c-figure--full | lesson-visual lesson-visual--chart | 図が主役のページ。最大高さ585px |

```html
<h2 class="u-text-center">今日の問い</h2>
<div class="c-callout">純物質は<span class="u-text-red">一種類の物質</span>からなる。</div>
```

## 画像とiframe

パスの起点はブラウザーが表示している科目の `slides.html` です。画像は `images/` に置き、授業番号を先頭に付けます。reveal.js が表示時に読み込めるよう図は `data-src` を使い、内容を示す代替テキストを付けます。埋め込みHTMLは `file/` に置き、用途が分かるタイトルを付けます。以下は化学基礎で動く例です。

```html
<img data-src="images/01_first_20_elements.svg" class="c-figure c-figure--tall" alt="原子番号1から20の元素記号と元素名">

<iframe src="file/timer-3min.html" class="c-timer-frame" title="3分タイマー"></iframe>

<iframe data-src="file/change_state.html" class="c-experiment-frame" title="状態変化の演示"></iframe>
```

## ページ番号と直接リンク

共通の `lesson.js` の `slideNumber: 'c/t'` が現在のページと総数を表示します。位置・大きさは `base.css` の `.reveal .slide-number` で調整します。標準は右92px・下14pxで、送り矢印の操作領域を空けます。Markdownでは空行を挟んだ単独行の `---` が改ページです。`slides.html?lesson=01#/1` で2枚目を直接開けます。公開後のページ挿入や並べ替えは、この番号付きリンクの行き先に影響します。

## 授業・科目を追加する

1. 同じ科目の `lesson/` に原稿を作ります。例として第70回は `lesson/70.md`、第100回は `lesson/100.md` です。番号は2〜3桁で、ファイル名とリンクの数字を一致させます。原稿の構成はルートの「授業スライドひな形.md」を利用できます。
2. 科目の `index.html` に `<a href="./slides.html?lesson=70">第70回　授業名</a>` を記入します。対応する項目があればそれを更新します。
3. 課題も用意する場合、化学基礎の例では `tasks/70.md` を作り、一覧から `./task.html?task=70` にリンクします。問題・解答の区切りは同科目の既存原稿に合わせます。
4. 新科目は同じ年度の下に既存科目と同じ深さで置きます。科目一覧を用意し、化学基礎の `slides.html` を複製してタイトルを更新します。戻るリンク、トップの科目リンク、最初の原稿までを通して確認します。
5. リポジトリのルートをローカルHTTPサーバーで開き、科目一覧から起動します。先頭・最終ページ、番号、矢印、画像、タイマーの開始、一覧へ戻る操作を確認します。Markdownの取得にHTTPを使うため、確認はHTTP経由で行います。

## 保守と移行

- 新規教材は表の新しい名前を使います。既存の原稿は授業単位で移行できます。特に `concept-image` は基本と修飾子の2クラスに置き換えます。
- 共通部品は複数科目で同じ役割を持つものに限ります。授業番号や元素名を共通クラス名に含めず、コメントには余白の理由や適用範囲を書きます。
- 新しい宣言には `.reveal` の範囲を付けます。旧名を維持するときは新旧セレクターを同じ宣言にまとめ、色・寸法の二重管理を避けます。
- 配布時は `lesson.css` と同時に `styles/`、`lesson.js`、科目のHTMLを反映します。既存の画像名・HTML名・クエリ・ハッシュを保ちます。教材内で参照されなくなった画像も、配布済みの直リンクがあり得るため残します。
