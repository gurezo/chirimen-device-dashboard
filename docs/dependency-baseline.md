# 依存関係・Nx 構成のベースライン

Issue #277 の調査記録。削除判断の材料であり、この文書の作成時点では依存・コード・設定を削除していない。

調査日: 2026-10-11

起点: `main` の `97d10324024d3bd0d560800fb71c642eb8fbffe5`（`97d1032 build(workspace): nx を 23.3.0 に更新する (#275)`）

## 再現コマンド

```bash
git rev-parse HEAD
node -v
pnpm -v
pnpm nx --version
pnpm install --frozen-lockfile
pnpm nx show projects
pnpm nx graph --print
```

`pnpm nx graph` は既定でブラウザを開く。依存の記録には `--print` を使い、グラフファイルはリポジトリに置かない。

## 環境

| 項目 | 記録 |
| --- | --- |
| Git SHA | `97d10324024d3bd0d560800fb71c642eb8fbffe5` |
| Node.js（実行時） | `v24.16.0` |
| Node.js（`.nvmrc` / GitHub Actions） | `24` |
| pnpm（実行時） | `12.11.2` |
| pnpm（`package.json` の `packageManager`） | `pnpm@12.11.2` |
| Nx（ローカル） | `23.3.0` |
| Nx（グローバル） | 未インストール |

`pnpm install --frozen-lockfile` は成功した。lockfile は最新で、supply-chain policy の検証（1704 entries）を通過し、1447 パッケージを追加して完了した（pnpm v12.11.2、約 5.1 秒）。

## Nx プロジェクト

`pnpm nx show projects` は 10 プロジェクトを返した。種別は `pnpm nx graph --print` の `graph.nodes.*.type` による。

| プロジェクト | 種別 | ルート |
| --- | --- | --- |
| `web` | app | `apps/web` |
| `web-e2e` | e2e | `apps/web-e2e` |
| `chirimen-device-dashboard` | app | `.` |
| `shared-types` | lib | `libs/shared-types` |
| `libs-data-access` | lib | `libs/devices/data-access` |
| `libs-state` | lib | `libs/devices/state` |
| `libs-feature-list` | lib | `libs/devices/feature-list` |
| `libs-card-list` | lib | `libs/devices/card-list` |
| `libs-device-detail` | lib | `libs/devices/device-detail` |
| `libs-platform-specific-examples` | lib | `libs/devices/platform-specific-examples` |

`apps/` と `libs/` のアプリケーション・ライブラリは 9 つ。10 件目の `chirimen-device-dashboard` はルート `package.json` に対応するワークスペースプロジェクトである。

## プロジェクト依存

`pnpm nx graph --print` の `graph.dependencies`。矢印は「依存元 → 依存先」（依存元が依存先を参照する）。

| 依存元 | 依存先 | 種別 |
| --- | --- | --- |
| `web` | `libs-data-access` | static |
| `web` | `libs-state` | static |
| `web` | `shared-types` | static |
| `web` | `libs-device-detail` | static |
| `web` | `libs-card-list` | static |
| `web` | `libs-feature-list` | static |
| `web-e2e` | `web` | implicit |
| `libs-data-access` | `shared-types` | static |
| `libs-state` | `libs-data-access` | static |
| `libs-state` | `shared-types` | static |
| `libs-feature-list` | `shared-types` | static |
| `libs-feature-list` | `libs-state` | static |
| `libs-card-list` | `libs-data-access` | static |
| `libs-card-list` | `libs-state` | static |
| `libs-card-list` | `shared-types` | static |
| `libs-device-detail` | `libs-data-access` | static |
| `libs-device-detail` | `shared-types` | static |
| `libs-device-detail` | `libs-platform-specific-examples` | static |
| `libs-platform-specific-examples` | `shared-types` | static |

依存先を持たないプロジェクトは `shared-types` と `chirimen-device-dashboard`。`web` から `libs-platform-specific-examples` への直接依存は無く、`libs-device-detail` 経由である。
