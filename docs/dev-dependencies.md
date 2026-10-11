# devDependencies とビルド・テスト設定の利用経路

Issue #280 の調査記録。削除判断の材料であり、調査の記録時点では依存・コード・設定を削除していない。

Issue #282 で、下の変更単位 1 から 6 を実施した。要追加確認の項目は外していない。

調査日: 2026-10-11

起点: `main` の `fd71980b874d92742c33d0c587484a0d99d9a1bf`（`fd71980 docs(workspace): record runtime dependency usage (#286)`）

前提は [依存関係・Nx 構成のベースライン](dependency-baseline.md) である。ベースラインは一部の devDependency を「維持」または「要追加確認」で #280 に渡した。この文書は、executor、plugin、設定ファイル、CI、lockfile 上の peer を照合する。import の有無だけでは未使用にしない。

## 再現コマンド

```bash
git rev-parse HEAD
node -v
pnpm -v
git grep -n -e '@nx/node' -e '@nx/vite' -e '@nx/devkit' -e '@nx/workspace' \
  -e '@angular/cli' -e '@angular/language-service' \
  -e '@angular-devkit/core' -e '@angular-devkit/schematics' -e '@schematics/angular' \
  -e '@angular/build' -e '@angular/compiler-cli' \
  -e '@analogjs/vite-plugin-angular' -e '@analogjs/vitest-angular' \
  -e '@vitest/coverage-v8' -e '@vitest/ui' \
  -e '@swc/core' -e '@swc/helpers' -e '@swc-node/register' \
  -e 'autoprefixer' -e 'firebase-tools' \
  -e '@commitlint/config-conventional' -e '@commitlint/config-angular' \
  -e '@eslint/js' -e '@oxc-project/runtime' -e '@typescript-eslint/utils' \
  -e 'angular-eslint' -e 'typescript-eslint' \
  -- ':!docs' ':!.cursor' ':!.agents' ':!.github/skills' ':!.opencode' \
  ':!pnpm-lock.yaml' ':!tools/ai-migrations' ':!package.json'
pnpm why <package> --depth 1
```

実行時は Node.js `v24.16.0`、pnpm `12.11.2`。`git grep` から調査記録、エージェント用スキル、lockfile、マイグレーション手順、宣言そのものを外した。`.cursor/mcp.json` は外部 CLI の起動なので、除外した grep とは別に読んだ。peer の有無は、インストール済みパッケージの `package.json` を読んだ。

## ベースラインで決着しているもの

再調査はしない。根拠は [dependency-baseline.md](dependency-baseline.md) の判定表である。

| 対象 | ベースラインの判定 |
| --- | --- |
| `@nx/js`, `@nx/web`, `@nx/vitest`, `@nx/playwright`, `@nx/eslint`, `@nx/angular` | 維持 |
| `tailwindcss`, `jsdom`, `eslint-plugin-playwright` | 維持 |
| `tsx`, `yaml` | 既に存在しない |

`tailwindcss` の入口は [apps/web/src/styles.scss](../apps/web/src/styles.scss) の `@tailwind` と [apps/web/tailwind.config.js](../apps/web/tailwind.config.js) のままである。`jsdom` は Vitest 設定の `environment: 'jsdom'` にある。`eslint-plugin-playwright` は [apps/web-e2e/eslint.config.mjs](../apps/web-e2e/eslint.config.mjs) が import する。

## 宣言

開発依存はルート [package.json](../package.json) の `devDependencies` に 50 件ある。ライブラリごとの `package.json` は無い。[pnpm-workspace.yaml](../pnpm-workspace.yaml) の `minimumReleaseAgeExclude` にパッケージ名の文字列があっても、それは依存の宣言ではない。`allowBuilds` の `@swc/core: false` はインストール時のビルドスクリプトを止める設定であり、依存を外す設定ではない。

## Nx

### `@nx/node`

`@nx/node:*` の executor は `project.json` に無い。`nx.json` の plugin にも無い。`apps/` と `libs/` からの import は無い。`pnpm why @nx/node --depth 1` の依存元はワークスペースの devDependency だけである。

インストール済み `@nx/node@23.3.0` の peer は `express`、`koa`、`fastify` で、いずれも optional。このリポジトリの `package.json` にその三つは無い。

### `@nx/vite`

ベースラインは `vite.config.*` が無いと書いた。起点のツリーには次の設定があり、いずれも `@nx/vite/plugins/nx-tsconfig-paths.plugin` と `nx-copy-assets.plugin` を import する。

| ファイル | テスト executor |
| --- | --- |
| [libs/devices/data-access/vitest.config.mts](../libs/devices/data-access/vitest.config.mts) | `@nx/vitest:test` |
| [libs/devices/feature-list/vitest.config.mts](../libs/devices/feature-list/vitest.config.mts) | `@nx/vitest:test` |
| [libs/devices/device-detail/vite.config.mts](../libs/devices/device-detail/vite.config.mts) | `@nx/vitest:test` |
| [libs/devices/platform-specific-examples/vite.config.mts](../libs/devices/platform-specific-examples/vite.config.mts) | `@nx/vitest:test` |

`pnpm why @nx/vite --depth 1` では、ワークスペースに加え `@nx/web@23.3.0` が依存元に出る。`@nx/web@23.3.0` の `peerDependencies` では `@nx/vite` は optional である。`web` の `serve-static` は `@nx/web:file-server` である。設定ファイルの import は、この optional peer とは別の経路である。

### `@nx/devkit`

[apps/web-e2e/playwright.config.ts](../apps/web-e2e/playwright.config.ts) が `workspaceRoot` を `@nx/devkit` から import する。`pnpm why` では `@nx/angular`、`@nx/eslint`、`@nx/eslint-plugin`、`@nx/js`、`@nx/playwright`、`@nx/vite`、`@nx/vitest`、`@nx/web`、`@nx/workspace` も依存元である。

### `@nx/workspace`

`apps/` と `libs/` の設定は `@nx/workspace` を import しない。`nx.json` の plugin 一覧にも無い。インストール済み `@nx/workspace@23.3.0` に `nx` プラグイン欄は無い。`pnpm why` の依存元はワークスペースと `@nx/js@23.3.0` である。`@nx/js@23.3.0` の `dependencies` に `@nx/workspace` がある。

## Angular CLI / DevKit / Schematics

| パッケージ | ワークスペースからの参照 | 他パッケージとの関係 |
| --- | --- | --- |
| `@angular/build` | `web` の `build` / `serve` / `test`、`libs-card-list` と `libs-state` の `test`。executor は `@angular/build:application`、`dev-server`、`unit-test` | `@nx/angular` の optional peer |
| `@angular/compiler-cli` | アプリのソースは import しない | `@angular/build@22.2.2` の必須 peer |
| `@angular/cli` | [.cursor/mcp.json](../.cursor/mcp.json) と [.vscode/mcp.json](../.vscode/mcp.json) が `npx -y @angular/cli mcp` を起動する。`package.json` の scripts に `ng` は無い | `pnpm why` の依存元はワークスペースだけ。bin は `ng` |
| `@angular/language-service` | `package.json` 以外に無い。`tsconfig` はプラグインとして書いていない。[.vscode/extensions.json](../.vscode/extensions.json) の推奨は Playwright、Prettier、Vitest である | `pnpm why` の依存元はワークスペースだけ |
| `@angular-devkit/core` | ソースからの import は無い | `@nx/angular@23.3.0` の必須 peer。`@angular/cli` の dependency |
| `@angular-devkit/schematics` | ソースからの import は無い | `@nx/angular` の必須 peer。`@analogjs/vitest-angular` の必須 peer。`@angular/cli` の dependency |
| `@schematics/angular` | ソースからの import は無い | `@nx/angular` の必須 peer。`@angular/cli` の dependency |

`@nx/angular` の必須 peer に `peerDependenciesMeta` は無い。`@angular-devkit/build-angular` は optional peer で、`package.json` には無い。

## Vite / Analog / Vitest

| パッケージ | 参照 | peer |
| --- | --- | --- |
| `vite` | `vitest.config.*` と `vite.config.mts` が `vite` の `defineConfig` を import する | `@nx/vite` の必須 peer。`vitest@5.0.3` の必須 peer |
| `vitest` | ルート [vitest.config.ts](../vitest.config.ts) と [apps/web/vitest.config.ts](../apps/web/vitest.config.ts) が `vitest/config` を import する | `@analogjs/vitest-angular` の必須 peer。`@nx/vitest` と `@angular/build` の optional peer |
| `@analogjs/vite-plugin-angular` | `apps/web/vitest.config.ts`、`feature-list` の `vitest.config.mts`、`device-detail` と `platform-specific-examples` の `vite.config.mts` | `vite` は optional peer |
| `@analogjs/vitest-angular` | `feature-list`、`device-detail`、`platform-specific-examples` の `src/test-setup.ts` が `setup-snapshots` と `setup-testbed` を import する | 上記の必須 peer |
| `@vitest/coverage-v8` | 4 つの lib 設定が `coverage.provider: 'v8'` を書く。`package.json` の scripts と GitHub Actions は `--coverage` を付けない | `vitest@5.0.3` の optional peer |
| `@vitest/ui` | scripts、workflow、Vitest 設定に `ui` も `--ui` も無い。reporter は `default` | `vitest@5.0.3` の optional peer |
| `@oxc-project/runtime` | リポジトリのソースに import は無い。Analog、Vite、`@angular/build`、`@nx/*`、`vitest` の配布ファイルにもパッケージ名の文字列は無い | `pnpm why` の依存元はワークスペースだけ |

`data-access` の Vitest 設定は Analog を import しない。`@nx/vitest:test` を使うのは `libs-data-access`、`libs-feature-list`、`libs-device-detail`、`libs-platform-specific-examples` である。

インストール済み `@analogjs/vite-plugin-angular@2.8.0` の `angular-vitest-plugin.js` は、`vite.rolldownVersion` があるとき fesm の es2016 下げをスキップする。同じファイルの `angularVitestEsbuildPlugin` は、そのとき `oxc` を `false` にする。`angularVitestSourcemapPlugin` は、一部の `.ts` に `vite.transformWithOxc` を呼ぶ。呼び出しに `target` は無い。

## SWC

| パッケージ | `pnpm why` の依存元 | インストール済みパッケージの関係 |
| --- | --- | --- |
| `@swc/core` | ワークスペース、`nx`、`@swc-node/register`、`@swc-node/core` | `nx@23.3.0` の optional peer `^1.15.8` |
| `@swc-node/register` | ワークスペース、`nx` | `nx@23.3.0` の optional peer `^1.11.1` |
| `@swc/helpers` | ワークスペース、`@swc/core` | `@swc/core@1.16.13` の optional peer `>=0.5.17` |

`apps/` と `libs/` は三つのパッケージを import しない。ライブラリの build は `@nx/js:tsc`、`web` の build は `@angular/build:application` である。Knip は #277 でこの三つを未使用 devDependency にしていない。

## CSS

`postcss.config.*` と `.postcssrc.json` は無い。

`@angular/build@22.2.2` の `postcss-configuration.js` は、`tailwind.config.js` があると `tailwindcss` を解決する。`stylesheet-plugin-factory.js` は、Tailwind の設定があるとき `require('postcss')` し、PostCSS のプラグインとして Tailwind だけを足す。`autoprefixer` の文字列はこの経路に無い。

| パッケージ | 関係 |
| --- | --- |
| `postcss` | `@angular/build@22.2.2` の optional peer。`tailwindcss@3.4.19` の dependency。`autoprefixer` の必須 peer |
| `autoprefixer` | `pnpm why` の依存元はワークスペースだけ。`tailwindcss` の dependency には無い |

[apps/web/src/styles.scss](../apps/web/src/styles.scss) は `@tailwind` を持つので、`web` の build は上の Tailwind 経路に入る。

## ツールと Lint

### `firebase-tools`

[.github/workflows/deploy.yml](../.github/workflows/deploy.yml) は `pnpm install --frozen-lockfile` のあと、`npm install -g firebase-tools` を実行し、その `firebase deploy` を使う。`package.json` に `firebase` を呼ぶ script は無い。`pnpm why firebase-tools` の依存元はワークスペースだけである。bin は `firebase`。

### `@commitlint/config-conventional`

[commitlint.config.js](../commitlint.config.js) の `extends` は `@commitlint/config-angular` だけである。インストール済み `@commitlint/config-angular@21.2.3` の dependency に `@commitlint/config-conventional` は無い。`@commitlint/cli@21.2.3` の dependency にはある。Husky と [commitlint.yml](../.github/workflows/commitlint.yml) が起動するのは `commitlint` CLI である。

### ESLint 関連

ルート [eslint.config.mjs](../eslint.config.mjs) は `@nx/eslint-plugin` の `flat/base`、`flat/typescript`、`flat/javascript` を広げる。Angular 用の三つの設定（[apps/web/eslint.config.mjs](../apps/web/eslint.config.mjs)、[libs/devices/device-detail/eslint.config.mjs](../libs/devices/device-detail/eslint.config.mjs)、[libs/devices/platform-specific-examples/eslint.config.mjs](../libs/devices/platform-specific-examples/eslint.config.mjs)）は、それに加えて `flat/angular` と `flat/angular-template` を広げる。

| パッケージ | 経路 |
| --- | --- |
| `@eslint/js` | `@nx/eslint-plugin` の `flat-configs/javascript.js` と `typescript.js` が `require("@eslint/js")` する。プラグインの `package.json` はこのパッケージを dependency に書いていない。`pnpm why` の依存元はワークスペースだけである |
| `angular-eslint` | 同じプラグインの `flat-configs/angular.js` が `require("angular-eslint")` する。上記三つの ESLint 設定が `@angular-eslint/*` ルールを書く |
| `typescript-eslint` | `flat-configs/angular.js` が `require("typescript-eslint")` する。`angular-eslint@22.5.0` の必須 peer |
| `@typescript-eslint/utils` | `@nx/eslint-plugin`、`angular-eslint`、`typescript-eslint` の dependency |
| `prettier` | プラグインの `javascript.js` と `typescript.js` は、`prettier` と `eslint-config-prettier` の両方が解決できるとき `eslint-config-prettier` を設定へ足す。[.prettierrc](../.prettierrc) と [.prettierignore](../.prettierignore) がある。推奨拡張は [.vscode/extensions.json](../.vscode/extensions.json)。`package.json` に format script は無い |
| `eslint-config-prettier` | 上の分岐で `require` される。`@nx/eslint-plugin` の optional peer |

## `start` と `serve`

[package.json](../package.json) の `start` と `serve` はどちらも `nx serve web` である。[README.md](../README.md) は `pnpm start` を書く。[docs/development.md](development.md) は両方をコマンド表に載せる。`web` の `serve` ターゲットは `@angular/build:dev-server` で、ポートは 4200 である。

## 設定の重複と、実在しない入力

削除はしていない。ここでの「実在しない」は、設定が指すファイルが git 上に無いことである。

### `nx.json` の入力

[nx.json](../nx.json) の `namedInputs.production` は、各プロジェクトの `.eslintrc.json` を build の入力から外す。`.eslintrc.json` はリポジトリに無い。同じ配列の `eslint.config.mjs` 除外は、そのファイルを持つプロジェクトに効く。

`targetDefaults` の `@nx/eslint:lint` は、次のパスをキャッシュ入力にする。

| 入力 | git 上 |
| --- | --- |
| `{workspaceRoot}/.eslintrc.json` | 無い |
| `{workspaceRoot}/.eslintignore` | 無い |
| `{workspaceRoot}/eslint.config.mjs` | ある |
| `{workspaceRoot}/tools/eslint-rules/**/*` | ディレクトリが無い |

この executor を `project.json` に書くのは `web`、`libs-device-detail`、`libs-platform-specific-examples` である。他プロジェクトの lint は、ベースラインのとおり `@nx/eslint/plugin` が推論した `nx:run-commands` であり、上の `targetDefaults` の入力一覧とは executor 名が違う。

`angular.json` は無い。Angular のターゲットは各 `project.json` と `nx.json` にある。

### `generators`

[nx.json](../nx.json) の `generators` は、新規生成時の既定である。既存プロジェクトの build / test / lint はここを読まない。

| 生成対象 | 既定 | 既存プロジェクト |
| --- | --- | --- |
| `@nx/angular:application` の `unitTestRunner` | `vitest-angular` | `web` の test は `@angular/build:unit-test` |
| `@nx/angular:library` の `unitTestRunner` | `vitest-analog` | `libs-card-list` と `libs-state` の test は `@angular/build:unit-test`。`libs-data-access` は `@nx/vitest:test` で、Analog を import しない |

### lint の二つの定義

| 定義 | プロジェクト | 設定ファイル |
| --- | --- | --- |
| `project.json` の `@nx/eslint:lint` | `web`、`libs-device-detail`、`libs-platform-specific-examples` | 各ディレクトリの `eslint.config.mjs` がルート設定を広げ、`flat/angular` を足す |
| plugin 推論の `nx:run-commands` | ベースラインが記録した残り（`web-e2e`、`shared-types`、`libs-data-access`、`libs-state`、`libs-feature-list`、`libs-card-list`） | `web-e2e` だけが自分の `eslint.config.mjs` を持つ。他の五つのディレクトリに `eslint.config.mjs` は無い |

`web-e2e` は plugin の lint と、自分の ESLint 設定の両方を持つ。明示した `@nx/eslint:lint` と、plugin の `targetName: lint` は同じターゲット名である。一つのプロジェクトに lint が二つ定義されている、という `nx show` の再実行はこの文書ではしていない。executor の分かれ方はベースラインの表と、現在の `project.json` の明示 executor で一致する。

### Vitest と Vite の設定

| ファイル | 誰が読むか |
| --- | --- |
| [vitest.config.ts](../vitest.config.ts) | `test.projects` が `**/vite.config.{mjs,js,ts,mts}` と `**/vitest.config.{mjs,js,ts,mts}` を読む。`package.json` の `test` は `nx test web` であり、このファイルを引数にしない |
| [apps/web/vitest.config.ts](../apps/web/vitest.config.ts) | [.vscode/settings.json](../.vscode/settings.json) の `vitest.rootConfig`。ルートの `test.projects` にもマッチする。`web` の test executor は `@angular/build:unit-test` で、`project.json` にこのファイルを指定していない |
| `libs-data-access` と `libs-feature-list` の `vitest.config.mts` | `@nx/vitest:test` |
| `libs-device-detail` と `libs-platform-specific-examples` の `vite.config.mts` | `@nx/vitest:test` |
| `libs-card-list`、`libs-state` | ローカルの Vitest / Vite 設定は無い。test は `@angular/build:unit-test` |

`@angular/build@22.2.2` の unit-test schema に、`vitest.config.ts` を指定する項目は無い。runner は Vitest 設定をメモリ上で組み立てる。`apps/web/vitest.config.ts` の Analog プラグインは、IDE の Vitest 拡張と、ルートの `test.projects` から起動したときの設定である。

同じ `@nx/vitest:test` でも、ファイル名は `vitest.config.mts` と `vite.config.mts` に分かれる。どちらもルートの `test.projects` にマッチする。

coverage の `provider: 'v8'` は、上記 4 lib の設定と、`device-detail` / `feature-list` / `platform-specific-examples` の `project.json` にある `reportsDirectory` に対応する。`reportsDirectory` は coverage を常時オンにするフラグではない。CI の test は `--coverage` を付けない。

### Tailwind と PostCSS

PostCSS の設定ファイルは無い。`web` の build が Tailwind を処理するとき、`@angular/build` は PostCSS に Tailwind だけを載せる。`autoprefixer` をそのチェーンへ足す設定は、リポジトリ側にも builder のこの分岐にも無い。

### script の対

`start` と `serve` は同じ Nx ターゲットを指す。文書上の入口は両方にある。詳細は前の節。

## 判定

判定は「維持／削除候補／要追加確認／既に存在しない」のいずれか。調査の記録時点では依存も設定も削除していない。#282 で削除した単位だけ、判定を「既に存在しない」に更新した。

ベースラインで「維持」または「既に存在しない」としたものは、判定を変えない。

| 対象 | 利用経路 | 根拠 | 判定 | 後続 |
| --- | --- | --- | --- | --- |
| `@nx/js`, `@nx/web`, `@nx/vitest`, `@nx/playwright`, `@nx/eslint`, `@nx/angular` | executor、ESLint plugin、Tailwind 設定 | ベースライン | 維持 | なし |
| `tailwindcss`, `jsdom`, `eslint-plugin-playwright` | スタイル、Vitest の `environment`、E2E の ESLint | ベースライン。この起点でも参照は残っている | 維持 | なし |
| `tsx`, `yaml` | なし | `package.json` に無い | 既に存在しない | なし |
| `@nx/vite` | 4 つの lib 設定が plugin を import する | 上記「`@nx/vite`」。`@nx/web` の optional peer でもある | 維持 | なし |
| `@nx/devkit` | `playwright.config.ts` の `workspaceRoot`。各 Nx パッケージの dependency | 上記「`@nx/devkit`」 | 維持 | なし |
| `@nx/workspace` | `@nx/js` の dependency | 設定ファイルは import しない。直接宣言を外してもパッケージは `@nx/js` 経由で残る | 維持 | なし。直接宣言の整理は #282 に渡さない |
| `@nx/node` | 現行の executor、plugin、import に無い | `pnpm why` の依存元はワークスペースだけ。peer の `express` / `koa` / `fastify` も無い | 既に存在しない | なし。#282 単位 1 で直接宣言を外した |
| `@angular/build` | `web` の build / serve / test。`libs-card-list` と `libs-state` の test | `project.json` | 維持 | なし |
| `@angular/compiler-cli` | `@angular/build` の必須 peer | アプリのソースは import しない | 維持 | なし |
| `@angular/cli` | `.cursor/mcp.json` と `.vscode/mcp.json` の `npx @angular/cli mcp` | scripts の `ng` は無い。build executor は `@angular/build` | 維持 | なし |
| `@angular/language-service` | `package.json` 以外に無い | tsconfig のプラグインでも、推奨拡張でもない。エディタが `node_modules` から読む可能性は、この調査では IDE を起動して確認していない | 要追加確認 | なし。#282 には渡さない |
| `@angular-devkit/core`, `@angular-devkit/schematics`, `@schematics/angular` | `@nx/angular` の必須 peer。CLI の dependency。schematics は `@analogjs/vitest-angular` の必須 peer でもある | ソースからの import は無い | 維持 | なし |
| `vite`, `vitest` | 設定の `defineConfig` と、Nx / Analog の peer | 上記「Vite / Analog / Vitest」 | 維持 | なし |
| `@analogjs/vite-plugin-angular`, `@analogjs/vitest-angular` | Vitest / Vite 設定と、三つの `test-setup.ts` | `data-access` の設定は Analog を import しない | 維持 | なし |
| `@vitest/coverage-v8` | 4 lib の `coverage.provider: 'v8'`。vitest の optional peer | CI と scripts は `--coverage` を付けない。provider の行が残るあいだは外さない | 維持 | なし |
| `@vitest/ui` | 起動する script、workflow、設定が無い | vitest の optional peer。直接宣言を外すと、optional peer は自動では入らない | 既に存在しない | なし。#282 単位 3 で直接宣言を外した |
| `@oxc-project/runtime` | 静的な import は無い。Analog の sourcemap plugin が `vite.transformWithOxc` を呼ぶ | 配布ファイルにパッケージ名は無い。変換結果が helper を import するかは、パッケージを外したテストを回していない | 要追加確認 | なし。#282 には渡さない |
| `@swc/core`, `@swc-node/register`, `@swc/helpers` | `nx` と `@swc/core` の optional peer | ソースも executor 名も参照しない。Knip は未使用にしていない。外した状態の Nx 実行はしていない | 維持 | なし |
| `postcss` | `web` の build が Tailwind 処理で `require('postcss')` する | `@angular/build` の optional peer。`tailwindcss` の dependency | 維持 | なし |
| `autoprefixer` | PostCSS 設定は無い。Tailwind 経路は autoprefixer を足さない | `pnpm why` の依存元はワークスペースだけ | 既に存在しない | なし。#282 単位 2 で直接宣言を外した。`postcss` と `tailwindcss` は残した |
| `@eslint/js` | `@nx/eslint-plugin` の flat config が `require` する | プラグイン自身の dependency には無い。ワークスペースの直接宣言が解決に必要 | 維持 | なし。影響は lint |
| `angular-eslint`, `typescript-eslint` | Angular の三つの ESLint 設定と、プラグインの `flat/angular` | `typescript-eslint` は `angular-eslint` の必須 peer | 維持 | なし。影響は lint |
| `@typescript-eslint/utils` | プラグイン、`angular-eslint`、`typescript-eslint` の dependency | ソースは import しない。直接宣言を外してもパッケージは残る | 維持 | なし |
| `prettier`, `eslint-config-prettier` | 両方が解決できるとき、プラグインが `eslint-config-prettier` を lint 設定へ足す | `.prettierrc` がある。format script は無い | 維持 | なし。影響は lint |
| `@commitlint/config-conventional` | `commitlint.config.js` は extend しない | CLI の dependency ではある。直接宣言を外してもパッケージは推移で残り得る | 既に存在しない | なし。#282 単位 4 で直接宣言だけを外した。CLI と angular 設定は残した |
| `firebase-tools` | Deploy workflow は `npm install -g firebase-tools` のあとに `firebase deploy` する | ワークスペースの bin をそのステップは使わない。script も無い | 既に存在しない | なし。#282 単位 5 で直接宣言を外した。workflow は変えていない |
| `start`, `serve` | どちらも `nx serve web` | README は `pnpm start`。開発文書は両方 | 維持 | なし。未使用ではない |
| ルート `vitest.config.ts` | `test.projects` が lib の設定を集める | `nx test` は引数にしない | 維持 | なし。Nx の test とは別の入口 |
| `apps/web/vitest.config.ts` | IDE の `vitest.rootConfig` と、ルートの `test.projects` | `nx test web` の executor はこのファイルを指定しない | 維持 | なし |
| `nx.json` の実在しない ESLint 入力 | `@nx/eslint:lint` のキャッシュ入力と、`production` の `.eslintrc.json` 除外 | `.eslintrc.json`、`.eslintignore`、`tools/eslint-rules/` は無い | 既に存在しない | なし。#282 単位 6 で入力と除外だけを外した。lint のルールは変えていない |
| `nx.json` の `generators` | 新規生成の既定 | 既存ターゲットの実行経路ではない。既存の test executor とは一致しないプロジェクトがある | 維持 | なし |
| lint の `@nx/eslint:lint` と plugin 推論 | どちらも ESLint を実行する | プロジェクトごとに executor が分かれる。片方を消す根拠は無い | 維持 | なし |

## #282 に渡す変更単位

単位は混ぜない。Issue #282 で 6 単位とも実施した。

1. `@nx/node` を `devDependencies` から外した。設定ファイルは変えていない。`pnpm nx show projects` は 10 プロジェクトを返し、`pnpm nx build web` は成功した。
2. `autoprefixer` を `devDependencies` から外した。`postcss` と `tailwindcss` は残した。`pnpm nx build web` は成功し、styles の成果物サイズは外す前と同じだった。
3. `@vitest/ui` を `devDependencies` から外した。`@vitest/coverage-v8` と `coverage.provider` は残した。既定の `pnpm test`（`--ui` も `--coverage` も付けない）は成功した。
4. `@commitlint/config-conventional` の直接宣言だけを外した。`@commitlint/cli` と `@commitlint/config-angular` は残した。`pnpm exec commitlint` は成功した。パッケージは CLI の依存として lockfile に残っている。
5. `firebase-tools` を `devDependencies` から外した。[deploy.yml](../.github/workflows/deploy.yml) は変えていない。Deploy が使うのはグローバルインストールの CLI である。
6. [nx.json](../nx.json) から、実在しない `.eslintrc.json`、`.eslintignore`、`tools/eslint-rules/**/*` の入力と、`production` にある `.eslintrc.json` の除外だけを外した。`eslint.config.mjs` の入力と除外は残した。`pnpm nx lint web` は成功した。依存パッケージはこの単位では変えていない。
