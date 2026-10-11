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

## package.json の分類

依存はすべてルート [package.json](../package.json) にあり、ライブラリごとの `package.json` は無い。[pnpm-workspace.yaml](../pnpm-workspace.yaml) の `packages` は空配列で、pnpm ワークスペースのパッケージはルートのみである。ここでの分類は宣言上の用途であり、未使用の断定はしない。

`package.json` の `nx.includedScripts` は `[]` なので、npm scripts は Nx ターゲットとして自動登録されない。

### scripts

| script | コマンド | 用途 |
| --- | --- | --- |
| `prepare` | `husky` | Git フックのインストール |
| `start` | `nx serve web` | `web` の開発サーバー |
| `serve` | `nx serve web` | `start` と同じ Nx ターゲット |
| `serve:all` | `nx run-many --target=serve --all` | `serve` ターゲットを持つ全プロジェクト |
| `build` | `nx build web` | `web` のビルド |
| `build:all` | `nx run-many --target=build --all` | `build` ターゲットを持つ全プロジェクト |
| `test` | `nx test web` | `web` のユニットテスト |
| `test:all` | `nx run-many --target=test --all` | `test` ターゲットを持つ全プロジェクト |
| `lint` | `nx lint web` | `web` の lint |
| `lint:all` | `nx run-many --target=lint --all` | `lint` ターゲットを持つ全プロジェクト |
| `e2e` | `nx e2e web-e2e` | Playwright E2E |

### dependencies

実行時依存は 11 件。いずれも Angular アプリケーションの実行時パッケージである。

| 分類 | パッケージ |
| --- | --- |
| Angular フレームワーク | `@angular/animations`, `@angular/common`, `@angular/compiler`, `@angular/core`, `@angular/forms`, `@angular/platform-browser`, `@angular/router` |
| Angular UI | `@angular/cdk`, `@angular/material` |
| 状態管理 | `@ngrx/component-store` |
| 非同期 | `rxjs` |

宣言バージョンは Angular 関連が `22.2.2`、`@ngrx/component-store` が `22.0.1`、`rxjs` が `~7.8.2`。

### devDependencies

開発依存は 50 件。用途で分けると次のとおり。

| 分類 | パッケージ |
| --- | --- |
| Angular CLI / ビルド | `@angular/build`, `@angular/cli`, `@angular/compiler-cli`, `@angular/language-service`, `@angular-devkit/core`, `@angular-devkit/schematics`, `@schematics/angular` |
| Nx | `nx`, `@nx/angular`, `@nx/devkit`, `@nx/eslint`, `@nx/eslint-plugin`, `@nx/js`, `@nx/node`, `@nx/playwright`, `@nx/vite`, `@nx/vitest`, `@nx/web`, `@nx/workspace` |
| Vite / Vitest / Analog | `vite`, `vitest`, `@vitest/coverage-v8`, `@vitest/ui`, `@analogjs/vite-plugin-angular`, `@analogjs/vitest-angular`, `jsdom` |
| E2E | `@playwright/test`, `eslint-plugin-playwright` |
| Lint | `eslint`, `@eslint/js`, `angular-eslint`, `typescript-eslint`, `@typescript-eslint/utils`, `eslint-config-prettier` |
| 型とトランスパイル | `typescript`, `tslib`, `@types/node`, `@swc/core`, `@swc/helpers`, `@swc-node/register`, `@oxc-project/runtime` |
| スタイル | `tailwindcss`, `postcss`, `autoprefixer` |
| フォーマット | `prettier` |
| コミット規約 | `husky`, `@commitlint/cli`, `@commitlint/config-angular`, `@commitlint/config-conventional` |
| デプロイ CLI | `firebase-tools` |

Nx 関連は `23.3.0`、Angular ツールチェーンは `22.2.2`（`@schematics/angular` は `~22.2.2`、`angular-eslint` は `22.5.0`）。`typescript` は `~6.0.3`。
