# ghostwr

ChatGPT が楽しかったので [OpenAI API](https://openai.com/api/) に代筆をお願いする記事作成スクリプト。

記事や書籍の名前を OpenAI の API に渡して「目次」を書いてもらい、さらに目次の各項目について記事を書いてもらう。

```sh
node index.mjs 記事:5,000兆円欲しい! short > 5000cho-en-hoshii.md
```

## 実行手順

1. API Key を発行する
  https://beta.openai.com/account/api-keys
2. API Key と Organization ID を確認して環境変数に設定する
  https://beta.openai.com/account/org-settings
  ```sh
  ORGANIZATION_ID=org-xxxxx
  OPENAI_API_KEY=sk-xxxxx
  ```
3. 代筆してもらいたいタイトルと長さ(short, medium, long)を指定して実行する
  ```sh
  npm ci
  node index.mjs 書籍:Web標準入門 short > web-standard.md
  node index.mjs React.js入門記事 short > react.md
  node index.mjs 記事:5,000兆円欲しい! short > 5000cho-en-hoshii.md
  ```
4. Markdown ファイルが生成されるのをのんびり待つ

## 代筆サンプル

- [書籍:Web標準入門 / web-standard.md](./web-standard.md) (md表示崩れのため一部エスケープ処理している)
- [React入門記事 / react.md](./react.md)
- [記事:5,000兆円欲しい! / 5000cho-en-hoshii.md](./5000cho-en-hoshii.md)
