# コントリビューションガイド

## コミットメッセージガイドライン

本プロジェクトでは [Conventional Commits](https://www.conventionalcommits.org/) に準拠したコミットメッセージを採用しています。

### 形式

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

- **type**: 変更の種類（`feat`, `fix`, `docs`, `style`, `refactor`, `test`, `build`, `ci`, `chore` など）
- **scope**: 変更対象のスコープ（下記一覧）
- **description**: 簡潔な説明（ imperative mood、例: "add" not "added"）

### スコープ一覧

| スコープ | 説明 |
|----------|------|
| `web` | フロントエンドアプリ (apps/web) |
| `api` | API サーバー (apps/api) |
| `api-e2e` | API E2E テスト (apps/api-e2e) |
| `web-e2e` | Web E2E テスト (apps/web-e2e) |
| `shared-types` | 共有型定義 (libs/shared-types) |
| `functions` | Firebase Functions (functions/) |
| `workspace` | ルート・ツール・設定など |
| `devices-data-access` | devices データアクセス (libs/devices/data-access) |
| `devices-ui` | devices UI コンポーネント (libs/devices/ui) |
| `devices-state` | devices 状態管理 (libs/devices/state) |
| `devices-feature-list` | devices 一覧 feature (libs/devices/feature-list) |
| `devices-feature-create` | devices 新規 feature (libs/devices/feature-create) |
| `devices-feature-edit` | devices 編集 feature (libs/devices/feature-edit) |

### 例

```
feat(web): add device list component
fix(api): correct CORS for serial port requests
docs(workspace): update README quick start
build(workspace): add commitlint and husky
```

## Git フックのセットアップ（commitlint）

コミット時にメッセージ形式を自動検証するため、[Husky](https://typicode.github.io/husky/) と [commitlint](https://commitlint.js.org/) を利用しています。

### セットアップ手順

1. リポジトリをクローンしたあと、`pnpm install` を実行してください。
2. `package.json` の `prepare` スクリプトにより、Husky の Git フックが自動で有効になります。
3. 以降、`git commit` 時に commitlint が実行され、Conventional Commits に合致しないメッセージは拒否されます。

### ローカルでの検証

- **コミット時**: `commit-msg` フックでメッセージが検証されます。形式が不正な場合はコミットが中止されます。
- **PR 時**: GitHub Actions の `commitlint` ワークフローで、PR に含まれる全コミットが検証されます。

問題がある場合は、エラーメッセージに従ってメッセージを修正してください。
