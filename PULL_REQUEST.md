# プルリクエスト（Issue #6）

## タイトル

```
feat(functions): connect NestJS to Firebase Functions (closes #6)
```

## 概要

- **変更内容**: Firebase Functions の HTTP 関数 `api` で NestJS アプリ（`apps/api`）を利用するようにしました。`functions/src/main.ts` で Nest を bootstrap し、得た Express インスタンスを `onRequest` に渡して `/api/**` を Nest で処理しています。
- **受け入れ条件**: エミュレータで `http://localhost:5001/<project>/us-central1/api/api/health`（Hosting 経由の場合は `http://localhost:5002/api/health`）にアクセスすると、`{ "ok": true }` が返ります。
- **関連 Issue**: #6
