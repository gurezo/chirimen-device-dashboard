# コントリビューションガイド

## コミットメッセージガイドライン

本プロジェクトでは [Conventional Commits](https://www.conventionalcommits.org/) に準拠したコミットメッセージを採用しています。

### 形式

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

- **type**: 変更の種類（`feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `revert`）
- **scope**: 変更対象のスコープ（下記一覧）
- **description**: 簡潔な説明（imperative mood、先頭は小文字、末尾はピリオドなし）

### スコープ一覧

| スコープ             | 説明                                              |
| -------------------- | ------------------------------------------------- |
| `web`                | フロントエンドアプリ (apps/web)                   |
| `web-e2e`            | Web E2E テスト (apps/web-e2e)                     |
| `shared-types`       | 共有型定義 (libs/shared-types)                    |
| `workspace`          | ルート・ツール・設定など                          |
| `libs-data-access`   | devices データアクセス (libs/devices/data-access) |
| `libs-state`         | devices 状態管理 (libs/devices/state)             |
| `libs-feature-list`  | devices 一覧 feature (libs/devices/feature-list)  |
| `libs-device-detail` | devices 詳細 feature (libs/devices/device-detail) |
| `libs-card-list`     | デバイスカード一覧 UI (libs/devices/card-list) |
| `sync-devices`      | devices データ同期 (tools/scripts/sync-devices)   |
| `ci`                 | CI 設定変更 (GitHub Actions 等)                   |
| `mcp`                | MCP 設定変更 (.cursor/mcp.json 等)              |

### 例

```
feat(web): add device list component
fix(web): correct device list display
docs(workspace): update readme quick start
build(workspace): add commitlint and husky
refactor(libs-card-list): update device card list ui
build(sync-devices): update devices.json from partslist.csv
ci(ci): update github actions workflow
build(mcp): update mcp.json
```

### 破壊的変更の書き方
Breaking change は `!` を使わず、footer に `BREAKING CHANGE: <message>` として記載します。

```
feat(web): remove deprecated connection behavior

BREAKING CHANGE: Connection behavior has been changed
```

### Nx Release と Conventional Commits

このリポジトリでは `nx.json` に `release.version.conventionalCommits` が設定されていないため、Nx Release の自動バージョン決定ではコミット `type` は semver の bump に反映されません。

（将来 `release.version.conventionalCommits` を有効化する場合）
- `fix` -> patch
- `feat` -> minor

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
