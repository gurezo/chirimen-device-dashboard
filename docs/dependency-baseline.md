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

## 実行経路

ターゲットの有無は `pnpm nx show projects --withTarget=<target>`、plugin 由来の executor は `pnpm nx show project <project> --json` で確認した。

### nx.json

[nx.json](../nx.json) の plugin は `@nx/eslint/plugin` のみで、`targetName` は `lint`。`targetDefaults` は次の executor にキャッシュを付ける。

| executor | 追加設定 |
| --- | --- |
| `@angular/build:application` | `dependsOn: ["^build"]`、入力は `production` |
| `@nx/eslint:lint` | ワークスペースの ESLint 設定を入力に含める |
| `@angular/build:unit-test` | `watch: false` |
| `@nx/vitest:test` | 入力は `default` と `^production` |

`defaultProject` は `chirimen-device-dashboard`。`generators` は新規生成時の既定（Playwright、ESLint、SCSS、Vitest）であり、既存プロジェクトの実行経路ではない。

### ターゲットと executor

`project.json` に書いた executor と、ESLint plugin が推論した executor を分けて示す。推論された lint は `nx:run-commands` で、各プロジェクト直下の `eslint .` を実行する。

| プロジェクト | ターゲット | executor | 定義 |
| --- | --- | --- | --- |
| `web` | `build` | `@angular/build:application` | `apps/web/project.json` |
| `web` | `serve` | `@angular/build:dev-server` | 同上。ポート 4200 |
| `web` | `serve-static` | `@nx/web:file-server` | 同上。`dist/apps/web/browser` |
| `web` | `test` | `@angular/build:unit-test` | 同上 |
| `web` | `lint` | `@nx/eslint:lint` | 同上 |
| `web-e2e` | `e2e` | `@nx/playwright:playwright` | `apps/web-e2e/project.json`。設定は `apps/web-e2e/playwright.config.ts`。暗黙依存は `web` |
| `web-e2e` | `lint` | `nx:run-commands` | ESLint plugin |
| `shared-types` | `build` | `@nx/js:tsc` | `libs/shared-types/project.json` |
| `shared-types` | `lint` | `nx:run-commands` | ESLint plugin |
| `libs-data-access` | `build` | `@nx/js:tsc` | `libs/devices/data-access/project.json` |
| `libs-data-access` | `test` | `@nx/vitest:test` | 同上 |
| `libs-data-access` | `lint` | `nx:run-commands` | ESLint plugin |
| `libs-state` | `build` | `@nx/js:tsc` | `libs/devices/state/project.json` |
| `libs-state` | `test` | `@angular/build:unit-test` | 同上 |
| `libs-state` | `lint` | `nx:run-commands` | ESLint plugin |
| `libs-feature-list` | `build` | `@nx/js:tsc` | `libs/devices/feature-list/project.json` |
| `libs-feature-list` | `test` | `@nx/vitest:test` | 同上 |
| `libs-feature-list` | `lint` | `nx:run-commands` | ESLint plugin |
| `libs-card-list` | `build` | `@nx/js:tsc` | `libs/devices/card-list/project.json` |
| `libs-card-list` | `test` | `@angular/build:unit-test` | 同上 |
| `libs-card-list` | `lint` | `nx:run-commands` | ESLint plugin |
| `libs-device-detail` | `build` | `@nx/js:tsc` | `libs/devices/device-detail/project.json` |
| `libs-device-detail` | `test` | `@nx/vitest:test` | 同上 |
| `libs-device-detail` | `lint` | `@nx/eslint:lint` | 同上 |
| `libs-platform-specific-examples` | `build` | `@nx/js:tsc` | `libs/devices/platform-specific-examples/project.json` |
| `libs-platform-specific-examples` | `test` | `@nx/vitest:test` | 同上 |
| `libs-platform-specific-examples` | `lint` | `@nx/eslint:lint` | 同上 |
| `chirimen-device-dashboard` | `build` | `nx:run-commands` | ルート [project.json](../project.json)。コマンドは `echo 'Build complete'` |

`test` が無いのは `shared-types`、`web-e2e`、`chirimen-device-dashboard`。`serve` と `serve-static` は `web` のみ。`e2e` は `web-e2e` のみ。`build` は `web-e2e` 以外の 9 プロジェクトにある。

ライブラリの build は `generatePackageJson: false`（`shared-types` は当該オプション自体が無い）。

### Vitest

| ファイル | 役割 |
| --- | --- |
| [vitest.config.ts](../vitest.config.ts) | ルート設定。`**/vite.config.*` と `**/vitest.config.*` を Vitest の project として読む |
| [apps/web/vitest.config.ts](../apps/web/vitest.config.ts) | `@analogjs/vite-plugin-angular` と `jsdom`。`src/**/*.spec.ts` と `src/**/*.test.ts` を対象にする |

`vite.config.*` はリポジトリ内に無い。`@nx/vitest:test` を使うのは `libs-data-access`、`libs-feature-list`、`libs-device-detail`、`libs-platform-specific-examples`。`web`、`libs-card-list`、`libs-state` の test は `@angular/build:unit-test` である。

### スタイル

[apps/web/src/styles.scss](../apps/web/src/styles.scss) は `@tailwind` ディレクティブを持つ。[apps/web/tailwind.config.js](../apps/web/tailwind.config.js) は `tailwindcss` と `@nx/angular/tailwind` を参照する。`postcss.config.*` はリポジトリ内に無い。

### Firebase

| ファイル | 実行経路 |
| --- | --- |
| [firebase.json](../firebase.json) | Hosting の公開ディレクトリは `dist/apps/web/browser`。SPA rewrite あり。Storage rules は `storage.rules`。Emulator は auth `9099`、hosting `5002`、storage `9199`、UI `4100` |
| [.firebaserc](../.firebaserc) | default project は `chirimen-device-dashboard` |

`package.json` に Firebase を起動する script は無い。Emulator を呼ぶ workflow も無い。

### GitHub Actions と Git フック

| 経路 | 起動条件 | 実行コマンド |
| --- | --- | --- |
| [.github/workflows/ci.yml](../.github/workflows/ci.yml) | `main` への pull_request | `pnpm install --frozen-lockfile`、`pnpm nx affected -t lint,build,test`。Node.js 24。E2E は走らない |
| [.github/workflows/deploy.yml](../.github/workflows/deploy.yml) | `main` への push、または `workflow_dispatch` | `pnpm install --frozen-lockfile`、`pnpm nx run-many -t lint`、`pnpm nx run-many -t test`、`pnpm nx build web --configuration=production`、`npm install -g firebase-tools`、`firebase deploy --only hosting` |
| [.github/workflows/commitlint.yml](../.github/workflows/commitlint.yml) | `main` への pull_request | `pnpm install --frozen-lockfile`、`pnpm exec commitlint --from <base> --to <head>` |
| [.husky/commit-msg](../.husky/commit-msg) | `git commit` | `pnpm exec commitlint --edit` |

Deploy はワークスペースの `firebase-tools` ではなく、`npm install -g firebase-tools` で入れた CLI を使う。Hosting 以外（Storage rules、Emulator）はこの workflow の deploy 対象に含まれない。

`pnpm build:all`（`nx run-many --target=build --all`）と、ルートが affected になったときの `pnpm nx affected -t build` は、`chirimen-device-dashboard:build` の `echo 'Build complete'` も含む。
