# Issue #128: Firebase Hosting 用 CI 作成 - 実装プラン

## 概要

手動で実行している `firebase deploy --only hosting` を、main ブランチへのマージ時に自動実行する CI に置き換える。

## 課題・背景

- 現在は手動で `firebase deploy --only hosting` を実行している
- デプロイの自動化により、運用負荷の軽減とデプロイ漏れの防止が期待できる

## 実装プラン

### 1. GitHub Secrets の設定（事前準備）

リポジトリの Settings > Secrets and variables > Actions で以下を設定する必要があります：

| Secret 名 | 説明 | 取得方法 |
|-----------|------|----------|
| `FIREBASE_TOKEN` | Firebase CI 用トークン | `firebase login:ci` で取得 |
| `FIREBASE_PROJECT_ID` | Firebase プロジェクト ID | Firebase Console または `.firebaserc` から確認 |

### 2. デプロイワークフローの作成

**ファイル**: `.github/workflows/deploy.yml`

**トリガー条件**:
- `main` ブランチへの push（マージ含む）
- 手動実行（`workflow_dispatch`）

**ジョブ構成**:
1. **Checkout**: リポジトリのチェックアウト
2. **Setup pnpm**: pnpm のセットアップ（既存 CI と同様）
3. **Setup Node.js**: Node.js 22 のセットアップ
4. **Install dependencies**: `pnpm install --frozen-lockfile`
5. **Build web**: `pnpm nx build web --configuration=production`
6. **Install Firebase CLI**: `npm install -g firebase-tools`
7. **Deploy to Firebase Hosting**: `firebase deploy --only hosting --project $FIREBASE_PROJECT_ID --token $FIREBASE_TOKEN`

**プロジェクト固有の設定**:
- ビルド出力: `dist/apps/web/browser`（firebase.json で既に設定済み）
- アプリ名: `web`（package.json の scripts より）

### 3. 参考リソース

- [completely-understood-vol61 の deploy.yml](https://github.com/gurezo/completely-understood-vol61/blob/main/.github/workflows/deploy.yml) の Firebase Hosting 部分を参考
- 本プロジェクトはバックエンド（Cloud Run）がないため、Firebase Hosting のみのシンプルな構成

## 作業チェックリスト

- [ ] `.github/workflows/deploy.yml` を作成
- [ ] GitHub Secrets（FIREBASE_TOKEN, FIREBASE_PROJECT_ID）の設定を README 等に記載（任意）
- [ ] main へのマージ後にデプロイが実行されることを確認

## 注意事項

- Secrets が未設定の場合、ワークフローは失敗します。マージ前にリポジトリ管理者が Secrets を設定する必要があります。
- `firebase login:ci` で取得したトークンは有効期限があるため、定期的な更新が必要です。
