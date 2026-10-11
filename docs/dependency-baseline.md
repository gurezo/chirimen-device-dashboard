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

## Knip の試行

候補検出として次を実行した。パッケージは追加していない。終了コード 1 は、Knip が候補を見つけたときの終了コードである。

```bash
pnpm dlx knip --workspace .
```

| 項目 | 結果 |
| --- | --- |
| Knip | `6.39.0`（`pnpm dlx`） |
| 終了コード | `1` |
| `package.json` / lockfile | 変更なし |
| Unused files | 20 |
| Unused devDependencies | 14 |
| Unused dependencies（runtime） | 報告なし |
| Unused exports | 15 |
| Unused exported types | 30 |

実行中に `@nx/vite` プラグインの非推奨警告が出た。リポジトリに `vite.config.*` は無い。

Knip が未使用ファイルとしたものには、Angular の入口と Nx の公開 API が含まれる。例: `apps/web/src/main.ts`、`apps/web/src/app/app.routes.ts`、`apps/web/src/app/app.config.ts`、各ページコンポーネント、`apps/web-e2e/playwright.config.ts`、各 `eslint.config.mjs`、`apps/web/tailwind.config.js`、ライブラリの `src/index.ts`。未使用 export には `libs/devices/data-access` の公開 API 再エクスポートが含まれる。これらは削除根拠にしない。

Knip が未使用 devDependency とした 14 件:

`@angular/cli`, `@angular/language-service`, `@commitlint/config-conventional`, `@eslint/js`, `@nx/devkit`, `@nx/node`, `@nx/workspace`, `@oxc-project/runtime`, `@typescript-eslint/utils`, `angular-eslint`, `autoprefixer`, `eslint-plugin-playwright`, `prettier`, `typescript-eslint`

このうち `eslint-plugin-playwright` は [apps/web-e2e/eslint.config.mjs](../apps/web-e2e/eslint.config.mjs) が import している。Knip の未使用判定は、このファイルを未使用ファイル側にも挙げているため、設定からの参照を落としている。

## 既存の削除との突き合わせ

| 対象 | git 上の状態 | 根拠 |
| --- | --- | --- |
| `tools/scripts/sync-devices` | ソースなし | `git ls-files` に無い。`commitlint` の scope コメントと [scopes.md](../.cursor/skills/conventional-commits/scopes.md) は削除済みと書く |
| `tools/scripts/sync-example-upstreams` | ソースなし | 同上 |
| `tools/scripts/generate-platform-examples` | ソースなし | 同上 |
| `tools/scripts/validate-platform-examples` | ソースなし | 同上 |
| `generate:devices` | なし | `package.json` の scripts に無い |
| `.github/workflows/refresh-devices.yml` | なし | ファイルが無い。`4991af1 ci(ci): remove refresh-devices workflow (#269)` |
| デバイス生成スクリプト一式 | なし | `5b49437 chore(workspace): remove local device data generation (#268)` |
| `axios` / `tsx` / `yaml` | なし | `package.json` に無い |

作業ツリーの `tools/scripts/<tool>/` には、git に追跡されない `node_modules` だけが残っているディレクトリがある。ソースファイルは無く、コミット対象ではない。

`commitlint.config.js` の `scope-enum` には、削除済みツール名が「過去コミットを HEAD で検証するため」として残っている。

## 判定

判定は「削除可能 / 維持 / 要追加確認 / 既に存在しない」のいずれか。このベースラインで「削除可能」とした対象は無い。Knip の指摘は、利用経路を別に確認できるものだけ「維持」または「既に存在しない」にし、それ以外は「要追加確認」にした。

| 対象 | 利用経路 | 根拠 | 判定 | 後続 Issue |
| --- | --- | --- | --- | --- |
| Nx プロジェクト 10 件（`web` から `chirimen-device-dashboard`） | `pnpm nx show projects` とプロジェクト依存の節 | グラフ上の依存と各 `project.json` | 維持 | なし |
| `sync-devices` ほか 3 ツールのソース、`generate:devices`、`refresh-devices` workflow | 呼び出し元なし | 上記「既存の削除」。呼び出し元と Example 表示との違いは [データ同期・Example 生成ツールの利用状況](data-sync-example-tools.md) | 既に存在しない | #278 |
| `commitlint` の削除済みツール scope | `commitlint.config.js` の `scope-enum` | 過去コミット検証用のコメント | 維持 | なし |
| `chirimen-device-dashboard:build`（`echo 'Build complete'`） | `pnpm build:all` と、ルートが affected のときの `nx affected -t build` | ルート [project.json](../project.json)。他プロジェクトの成果物は作らない。更新後の判定は [apps / libs の入口](apps-libs-code.md) | 要追加確認 | #281 |
| `start` と `serve` | どちらも `nx serve web` | [package.json](../package.json) の scripts。更新後の判定は [devDependencies とビルド・テスト設定の利用経路](dev-dependencies.md) | 要追加確認 | #280 |
| [docs/development.md](development.md) の pnpm バージョン | 開発手順の説明 | 文書は `11.24.0`、`package.json` の `packageManager` と実行時は `12.11.2` | 要追加確認 | #283 |
| `axios` | なし | `package.json` に無い。#279 の調査候補。更新後の判定は [runtime dependencies の使用箇所](runtime-dependencies.md) | 既に存在しない | #279 |
| `tsx`, `yaml` | なし | `package.json` に無い。#280 の調査候補。更新後の判定は [devDependencies とビルド・テスト設定の利用経路](dev-dependencies.md) | 既に存在しない | #280 |
| `@ngrx/component-store` | `DeviceListStore` | [libs/devices/state/src/lib/device-list.store.ts](../libs/devices/state/src/lib/device-list.store.ts)。更新後の判定は [runtime dependencies の使用箇所](runtime-dependencies.md) | 維持 | #279 |
| `@angular/animations` | 直接 import は未確認。アプリは `provideAnimations` を `@angular/platform-browser/animations` から使う | [apps/web/src/app/app.config.ts](../apps/web/src/app/app.config.ts) と `package.json`。更新後の判定は [runtime dependencies の使用箇所](runtime-dependencies.md) | 要追加確認 | #279 |
| `@angular/compiler` | テストの `test-setup.ts` が import | `apps/web` と一部 lib の `src/test-setup.ts`。更新後の判定は [runtime dependencies の使用箇所](runtime-dependencies.md) | 要追加確認 | #279 |
| `@angular/cdk` | この調査の import 検索では `package.json` 以外に無し | `apps/` と `libs/` の `*.ts` / `*.html`。Material の推移的依存の可能性は未確認。更新後の判定は [runtime dependencies の使用箇所](runtime-dependencies.md) | 要追加確認 | #279 |
| `@angular/forms`, `@angular/material` | 画面コンポーネントの import | 例: [device-list-page.component.ts](../apps/web/src/app/pages/device-list-page/device-list-page.component.ts)、[device-detail.component.ts](../libs/devices/device-detail/src/lib/device-detail/device-detail.component.ts)。更新後の判定は [runtime dependencies の使用箇所](runtime-dependencies.md) | 維持 | #279 |
| `@angular/common`, `@angular/core`, `@angular/platform-browser`, `@angular/router`, `rxjs` | アプリとライブラリの import | `apps/` と `libs/` の TypeScript。Knip は unused dependencies を報告していない。更新後の判定は [runtime dependencies の使用箇所](runtime-dependencies.md) | 維持 | #279 |
| `@nx/js`, `@nx/web`, `@nx/vitest`, `@nx/playwright`, `@nx/eslint`, `@nx/angular` | executor、ESLint plugin、Tailwind 設定 | 実行経路の節と [apps/web/tailwind.config.js](../apps/web/tailwind.config.js)。更新後の判定は [devDependencies とビルド・テスト設定の利用経路](dev-dependencies.md) | 維持 | #280 |
| `@nx/node` | node アプリケーションは無い | devDependency。Knip が未使用と報告。更新後の判定は [devDependencies とビルド・テスト設定の利用経路](dev-dependencies.md) | 要追加確認 | #280 |
| `@nx/vite` | `vite.config.*` は無い。テストの一部は `@nx/vitest:test` | devDependency。Vitest パッケージとは別。更新後の判定は [devDependencies とビルド・テスト設定の利用経路](dev-dependencies.md) | 要追加確認 | #280 |
| `tailwindcss` | `@tailwind` と `tailwind.config.js` | [apps/web/src/styles.scss](../apps/web/src/styles.scss)。更新後の判定は [devDependencies とビルド・テスト設定の利用経路](dev-dependencies.md) | 維持 | #280 |
| `postcss`, `autoprefixer` | `postcss.config.*` は無い | devDependency。Tailwind 経由かは未確認。更新後の判定は [devDependencies とビルド・テスト設定の利用経路](dev-dependencies.md) | 要追加確認 | #280 |
| `jsdom` | `apps/web/vitest.config.ts` の `environment` | Vitest 設定。更新後の判定は [devDependencies とビルド・テスト設定の利用経路](dev-dependencies.md) | 維持 | #280 |
| `eslint-plugin-playwright` | `apps/web-e2e/eslint.config.mjs` | Knip は未使用と報告したが import がある。更新後の判定は [devDependencies とビルド・テスト設定の利用経路](dev-dependencies.md) | 維持 | #280 |
| `firebase-tools` | Deploy workflow は `npm install -g firebase-tools` | ワークスペース依存をそのコマンドは使わない。ローカル利用は script に無い。更新後の判定は [devDependencies とビルド・テスト設定の利用経路](dev-dependencies.md) | 要追加確認 | #280 |
| `@commitlint/config-conventional` | `commitlint.config.js` は `@commitlint/config-angular` だけを extend | devDependency。Knip が未使用と報告。更新後の判定は [devDependencies とビルド・テスト設定の利用経路](dev-dependencies.md) | 要追加確認 | #280 |
| Knip が未使用とした残りの devDependencies（`@angular/cli`, `@angular/language-service`, `@eslint/js`, `@nx/devkit`, `@nx/workspace`, `@oxc-project/runtime`, `@typescript-eslint/utils`, `angular-eslint`, `prettier`, `typescript-eslint`） | ESLint、IDE、Nx、Analog からの参照があり得る | Knip のみ。設定ファイルの直接参照は未完了。更新後の判定は [devDependencies とビルド・テスト設定の利用経路](dev-dependencies.md) | 要追加確認 | #280 |
| SWC 3 パッケージ（`@swc/core`, `@swc/helpers`, `@swc-node/register`） | Nx の実行時に使われ得る | `package.json`。Knip は未使用と報告していない。更新後の判定は [devDependencies とビルド・テスト設定の利用経路](dev-dependencies.md) | 要追加確認 | #280 |
| Knip の未使用ファイルと未使用 export | Angular の入口、E2E、公開 API | 上記 Knip の節。入口ファイルはビルドとルーティングで使われる。更新後の判定は [apps / libs の入口](apps-libs-code.md) | 要追加確認 | #281 |
| `tools/ai-migrations/` | Nx マイグレーション用の手順書。アプリの実行経路には無い | `git ls-files` に 5 ファイル。更新後の判定は [apps / libs の入口](apps-libs-code.md) | 要追加確認 | #281 |
| Knip のワークスペース依存としての導入 | 未導入。`pnpm dlx` のみ | 入口ファイルと Playwright 設定を未使用と誤検知した | 要追加確認 | #283 |
