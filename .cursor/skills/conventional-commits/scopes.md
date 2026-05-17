# Scopes

chirimen-device-dashboard で使用可能な scope の一覧と用途。`commitlint.config.js` の `scope-enum` と完全に一致させる。

## 一覧

| scope | 対象パス | プロジェクト名 (`project.json`) | 用途 |
| --- | --- | --- | --- |
| `web` | `apps/web` | `web` | Angular フロントエンド (SPA, ポート 4200) |
| `web-e2e` | `apps/web-e2e` | `web-e2e` | Playwright による Web E2E テスト |
| `shared-types` | `libs/shared-types` | `shared-types` | `DeviceInfo`, `ProductInfo` 等の共有型定義 |
| `libs-data-access` | `libs/devices/data-access` | `libs-data-access` | デバイスリポジトリ・データアクセス層 |
| `libs-state` | `libs/devices/state` | `libs-state` | `DeviceListStore` 等の状態管理層 |
| `libs-feature-list` | `libs/devices/feature-list` | `libs-feature-list` | デバイス一覧 feature コンポーネント |
| `libs-card-list` | `libs/devices/card-list` | `libs-card-list` | デバイスカード一覧 UI |
| `libs-device-detail` | `libs/devices/device-detail` | `libs-device-detail` | デバイス詳細 UI |
| `sync-devices` | `tools/scripts/sync-devices` | `sync-devices` | `devices.json` の同期スクリプト |
| `workspace` | リポジトリルート | (該当なし) | `package.json` / `nx.json` / `.husky/` / `commitlint.config.js` / `.cursor/` / `.agents/` / README / CONTRIBUTING 等 |
| `ci` | `.github/workflows/` | (該当なし) | GitHub Actions ワークフロー |
| `mcp` | `.cursor/mcp.json` 等 | (該当なし) | MCP 設定 |

## scope 選択の考え方

1. **単一プロジェクトに収まる変更**: そのプロジェクトの `name` を scope に使う。
   - 例: `libs/devices/card-list/` 配下の変更 → `libs-card-list`
2. **複数プロジェクトに跨る変更**: 最も影響範囲の広いプロジェクトを優先する。判断がつかない場合は `workspace`。
3. **ルート設定・ツール変更**: `workspace`。
4. **GitHub Actions ワークフロー**: `ci`。
5. **MCP 設定**: `mcp`。

## 新規プロジェクト追加時の手順

新しい app / lib / tool を追加した場合、以下を **同時に** 更新する。

1. `commitlint.config.js` の `scope-enum` に新しい scope を追加。
2. このファイル (`scopes.md`) に新しい行を追加。
3. `.cursor/rules/commits/42-chirimen-device-dashboard-scope.mdc` の推奨 scope 表を更新。
4. `CONTRIBUTING.md` のスコープ一覧を更新。

これらは同一 PR 内で行い、scope 一覧の単一情報源 (`commitlint.config.js`) と一致させる。

## 参照

- [`SKILL.md`](SKILL.md)
- [`examples.md`](examples.md)
- [`assertions.md`](assertions.md)
- リポジトリ側: `commitlint.config.js`, `CONTRIBUTING.md`
