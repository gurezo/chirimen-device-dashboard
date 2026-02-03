# Pull Request: feat(api): add NestJS backend (apps/api)

## タイトル

```
feat(api): add NestJS backend (apps/api)
```

## 概要

### Summary

Nx ワークスペースに NestJS バックエンド（api）を追加し、/api/health でヘルスチェックを返すようにする。

### Changes

- @nx/nest を追加し、`pnpm nx g @nx/nest:app api` で api アプリケーションを生成
- AppController に `GET api/health` を追加し `{ ok: true }` を返す
- main.ts でグローバルプレフィックス `api` を設定（Nx Nest テンプレートで設定済み）

### Acceptance Criteria

- [x] `pnpm nx serve api` で起動できる
- [x] http://localhost:3000/api/health が `{ ok: true }` を返す

Closes #3

---

**ブランチ:** `feat/api-add-nestjs-backend` → `main`

GitHub で PR を作成する際は、上記のタイトルと本文をコピーして使用してください。
