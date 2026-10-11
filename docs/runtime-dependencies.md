# runtime dependencies の使用箇所

Issue #279 の調査記録。削除判断の材料であり、この文書の作成時点では依存・コード・設定を削除していない。

調査日: 2026-10-11

起点: `main` の `d555e62863cb3313b709fb1ba3f33f1cd30d8240`（`d555e62 docs(workspace): データ同期と example 生成ツールの利用状況を記録する (#285)`）

前提は [依存関係・Nx 構成のベースライン](dependency-baseline.md) である。ベースラインは import の有無を一行で「維持」または「要追加確認」とした。この文書は、使用箇所に加え、直接依存と peer の違い、および削除可否の判定を残す。

## 再現コマンド

```bash
git rev-parse HEAD
git grep -n -e '@angular/animations' -e '@angular/cdk' -e '@angular/compiler' \
  -e '@angular/common' -e '@angular/core' -e '@angular/forms' -e '@angular/material' \
  -e '@angular/platform-browser' -e '@angular/router' -e '@ngrx/component-store' \
  -e "from 'rxjs" -e 'from "rxjs' -e axios -e provideAnimations -e provideNoopAnimations \
  -e 'import(' \
  -- ':!docs/dependency-baseline.md' ':!docs/data-sync-example-tools.md' ':!.cursor' \
  ':!pnpm-lock.yaml'
```

`git grep` からベースライン、#278 の記録、`.cursor`、lockfile を外したのは、調査記録と推移パッケージの文字列を、アプリの参照と分けて見るためである。`from 'rxjs` は `@angular/core/rxjs-interop` にマッチしない。`@angular/compiler` は devDependency の `@angular/compiler-cli` にもマッチする。

## 宣言

実行時依存はルート [package.json](../package.json) の `dependencies` に 11 件ある。ライブラリごとの `package.json` は無い。

| パッケージ | 宣言バージョン |
| --- | --- |
| `@angular/animations` | `22.2.2` |
| `@angular/cdk` | `22.2.2` |
| `@angular/common` | `22.2.2` |
| `@angular/compiler` | `22.2.2` |
| `@angular/core` | `22.2.2` |
| `@angular/forms` | `22.2.2` |
| `@angular/material` | `22.2.2` |
| `@angular/platform-browser` | `22.2.2` |
| `@angular/router` | `22.2.2` |
| `@ngrx/component-store` | `22.0.1` |
| `rxjs` | `~7.8.2` |

`axios` は `dependencies` にも `devDependencies` にも無い。[pnpm-workspace.yaml](../pnpm-workspace.yaml) の `minimumReleaseAgeExclude` に文字列 `axios` がある。これは公開直後のリリースを許可する除外であり、依存の宣言ではない。lockfile の importer `dependencies` に `axios` は無い。`gaxios` は別パッケージで、lockfile の推移依存に現れる。

## アプリとライブラリの import

`apps/` と `libs/` の TypeScript、HTML、SCSS を対象にした。動的 `import()` は [app.routes.ts](../apps/web/src/app/app.routes.ts) のページコンポーネント遅延読み込みだけで、npm パッケージは読んでいない。

広く使うパッケージは代表とファイル数を示す。使用が狭いパッケージはファイルを挙げる。

| パッケージ | アプリ側の参照 | 主なファイル |
| --- | --- | --- |
| `@angular/core` | コンポーネント、DI、`TestBed`。`apps/` と `libs/` で 35 ファイル | [app.config.ts](../apps/web/src/app/app.config.ts)、[device-list.store.ts](../libs/devices/state/src/lib/device-list.store.ts) |
| `@angular/common` | `AsyncPipe` の 3 ファイル | [device-list.component.ts](../libs/devices/feature-list/src/lib/device-list/device-list.component.ts)、[device-card-list.component.ts](../libs/devices/card-list/src/lib/device-card-list/device-card-list.component.ts)、[device-detail.component.ts](../libs/devices/device-detail/src/lib/device-detail/device-detail.component.ts) |
| `@angular/platform-browser` | 起動と `DomSanitizer`。animations / testing のサブパスは下の節 | [main.ts](../apps/web/src/main.ts) の `bootstrapApplication`。`DomSanitizer` は [example-info.component.ts](../libs/devices/device-detail/src/lib/example-info/example-info.component.ts)、[platform-specific-example-card.component.ts](../libs/devices/platform-specific-examples/src/lib/platform-specific-example-card/platform-specific-example-card.component.ts)、[platform-specific-examples.component.ts](../libs/devices/platform-specific-examples/src/lib/platform-specific-examples/platform-specific-examples.component.ts) |
| `@angular/router` | ルート、ガード、`RouterModule`、`provideRouter`。15 ファイル | [app.routes.ts](../apps/web/src/app/app.routes.ts)、[redirect-legacy-device-id.guard.ts](../apps/web/src/app/guards/redirect-legacy-device-id.guard.ts) |
| `@angular/forms` | `FormsModule` とテンプレートの `ngModel` | [device-list-page.component.ts](../apps/web/src/app/pages/device-list-page/device-list-page.component.ts)、[device-list-page.component.html](../apps/web/src/app/pages/device-list-page/device-list-page.component.html) |
| `@angular/material` | コンポーネントモジュールとテーマ | 下表。スタイルは [styles.scss](../apps/web/src/styles.scss) の `@use '@angular/material'` |
| `rxjs` | `from 'rxjs'` が 12 ファイル。`rxjs-interop` は `@angular/core` | [json-device.repository.ts](../libs/devices/data-access/src/lib/json-device.repository.ts)、[device-list.store.ts](../libs/devices/state/src/lib/device-list.store.ts) |
| `@ngrx/component-store` | `ComponentStore` | [device-list.store.ts](../libs/devices/state/src/lib/device-list.store.ts)。[providers.ts](../libs/devices/state/src/lib/providers.ts) はそのクラスを DI する |

Material の import は次のとおり。テンプレートは対応する `*.html` で `mat-form-field`、`mat-button-toggle`、`mat-card`、`mat-icon`、`mat-spinner`、`mat-stroked-button` を使う。

| モジュール | ファイル |
| --- | --- |
| `MatButtonModule` | [app.ts](../apps/web/src/app/app.ts)、[device-detail.component.ts](../libs/devices/device-detail/src/lib/device-detail/device-detail.component.ts) |
| `MatIconModule` | [device-detail.component.ts](../libs/devices/device-detail/src/lib/device-detail/device-detail.component.ts) |
| `MatProgressSpinnerModule` | [device-detail.component.ts](../libs/devices/device-detail/src/lib/device-detail/device-detail.component.ts)、[device-card-list.component.ts](../libs/devices/card-list/src/lib/device-card-list/device-card-list.component.ts)、[device-list.component.ts](../libs/devices/feature-list/src/lib/device-list/device-list.component.ts) |
| `MatCardModule` | [device-card-list.component.ts](../libs/devices/card-list/src/lib/device-card-list/device-card-list.component.ts) |
| `MatButtonToggleModule`, `MatFormFieldModule`, `MatInputModule` | [device-list-page.component.ts](../apps/web/src/app/pages/device-list-page/device-list-page.component.ts) |

`@angular/animations` と `@angular/cdk` を、`apps/` と `libs/` の TypeScript / HTML / SCSS がパッケージ名で import している箇所は無い。

## `@angular/animations` の呼び出し

アプリは `@angular/platform-browser/animations` を使う。

| 呼び出し | ファイル |
| --- | --- |
| `provideAnimations()` | [app.config.ts](../apps/web/src/app/app.config.ts)。`appConfig.providers` に入る |
| `provideNoopAnimations()` | [app.spec.ts](../apps/web/src/app/app.spec.ts)、[device-card-list.component.spec.ts](../libs/devices/card-list/src/lib/device-card-list/device-card-list.component.spec.ts) |

インストール済みの `@angular/platform-browser@22.2.2` の `fesm2022/animations.mjs` は、`@angular/animations/browser` を import する。`provideAnimations()` はこの入口を通る。

`animate.enter` と `animate.leave` をアプリのテンプレートやスタイルが使っている箇所は無い。

## `@angular/compiler` の呼び出し

ソースが `@angular/compiler` を import するのは、次の 4 ファイルの side-effect import だけである。いずれもテストの初期化で、公開 API の `index.ts` からは export しない。

| ファイル | テストの読み込み |
| --- | --- |
| [apps/web/src/test-setup.ts](../apps/web/src/test-setup.ts) | [apps/web/vitest.config.ts](../apps/web/vitest.config.ts) の `setupFiles`。`web` の test は `@angular/build:unit-test` |
| [libs/devices/feature-list/src/test-setup.ts](../libs/devices/feature-list/src/test-setup.ts) | [vitest.config.mts](../libs/devices/feature-list/vitest.config.mts) の `setupFiles` |
| [libs/devices/device-detail/src/test-setup.ts](../libs/devices/device-detail/src/test-setup.ts) | [vite.config.mts](../libs/devices/device-detail/vite.config.mts) の `setupFiles`。`tsconfig.spec.json` の `files` にも入る |
| [libs/devices/platform-specific-examples/src/test-setup.ts](../libs/devices/platform-specific-examples/src/test-setup.ts) | [vite.config.mts](../libs/devices/platform-specific-examples/vite.config.mts) の `setupFiles`。`tsconfig.spec.json` の `files` にも入る |

`libs-card-list` と `libs-state` に `test-setup.ts` は無い。test は `@angular/build:unit-test` である。この executor は、テスト用の仮想モジュール `angular:compiler-init` に `import '@angular/compiler'` を置く（`@angular/build@22.2.2` の `builders/unit-test/runners/vitest/build-options.js`）。

本番の入口 [main.ts](../apps/web/src/main.ts) は `bootstrapApplication` を呼び、`test-setup.ts` は import しない。[apps/web/project.json](../apps/web/project.json) の `build` は `aot` を上書きしていない。`@angular/build:application` の schema では `aot` の既定は `true` である。同じパッケージの `application-code-bundle.js` は、JIT（`jit` が真）のときだけ polyfill の先頭に `@angular/compiler` を足す。

`tsconfig.lib.json` が `src/test-setup.ts` を exclude しているのは `libs-device-detail` だけである。`libs-feature-list` と `libs-platform-specific-examples` の lib 用 tsconfig は spec と test だけを exclude する。`apps/web/tsconfig.app.json` も `src/test-setup.ts` を exclude しない。ビルド入口が import しないことと、tsconfig の include に残っていることは別である。

`@angular/compiler-cli` は `devDependencies` の `22.2.2` である。アプリのソースは import しない。

## `@angular/cdk` の呼び出し

`apps/` と `libs/` に `@angular/cdk` の import は無い。画面が import する Material の配布ファイルは、CDK を import する。確認した `@angular/material@22.2.2` の `fesm2022` は次のとおり。

| Material のファイル | CDK の import |
| --- | --- |
| `button.mjs`, `card.mjs`, `icon.mjs`, `progress-spinner.mjs` | `@angular/cdk/bidi` |
| `button-toggle.mjs` | `@angular/cdk/a11y`, `bidi`, `collections`, `keycodes`, `private` |
| `form-field.mjs` | `@angular/cdk/bidi`, `@angular/cdk/observers` |
| `input.mjs` | `@angular/cdk/coercion`, `platform`, `text-field`, `a11y`, `bidi`。あわせて `@angular/forms` も import する |

[tools/ai-migrations/@nx/vite/23.0.0/ai-instructions-for-vite-8.md](../tools/ai-migrations/@nx/vite/23.0.0/ai-instructions-for-vite-8.md) は、Analog の変換が `@angular/cdk` のファイルに触れる、と書く。アプリやテストがその文書を実行する経路は無い。

## 実行経路に無いもの

| 対象 | 結果 |
| --- | --- |
| SSR（`server.ts`、`@angular/ssr` の直接依存） | 無い。`@angular/build` の optional peer に `@angular/ssr` があるだけで、`package.json` には無い |
| `tools/scripts/` | ソースは無い（#278）。runtime dependency の import は無い |
| `axios` | `package.json` の依存に無い。上記の除外リストの文字列だけが残る |

## 直接依存と peer

根拠は [pnpm-lock.yaml](../pnpm-lock.yaml) のパッケージメタデータである。`settings.autoInstallPeers` は `true` なので、peer は宣言を外してもインストールされ得る。宣言が無いことと、パッケージが不要であることは別である。

| パッケージ | 誰の peer か | optional | このリポジトリでの意味 |
| --- | --- | --- | --- |
| `@angular/animations` | `@angular/platform-browser@22.2.2` | はい | `provideAnimations()` が `animations.mjs` を通して `@angular/animations/browser` を読む。使わないアプリなら外せる peer だが、このアプリは呼んでいる |
| `@angular/cdk` | `@angular/material@22.2.2` | いいえ（`peerDependenciesMeta` が無い） | 画面の Material が `fesm2022` から CDK を import する。直接 import が無いことは未使用の根拠にしない |
| `@angular/compiler` | `@angular/core@22.2.2` | はい | AOT の実行時には必須ではない |
| `@angular/compiler` | `@angular/compiler-cli@22.2.2` | いいえ | compiler-cli は devDependency。peer は必須 |
| `@angular/compiler` | `@angular/build@22.2.2` | いいえ（optional の一覧に無い） | build は devDependency。ユニットテストは仮想モジュールで `import '@angular/compiler'` する |
| `@angular/forms` | `@angular/material@22.2.2` と `@angular/cdk@22.2.2` | いいえ | アプリも `FormsModule` を import する。Material の `input.mjs` も `@angular/forms` を import する |

lockfile の `@angular/animations@22.2.2` には `deprecated` がある。文言は、`animate.enter` と `animate.leave` を使うよう案内し、https://v22.angular.dev/guide/animations を指す。非推奨は、このアプリが `provideAnimations()` を呼んでいないことではない。テンプレートに `animate.enter` / `animate.leave` は無い。`provideAnimations` をやめる置き換えは、未使用依存の削除とは別の作業である。

`@angular/compiler` を本番のブラウザ束に足すのは、`@angular/build` が JIT のときだけである。`web` の build は `aot` を `false` にしていない。schema の既定は `true` なので、この設定では polyfill に `@angular/compiler` は入らない。削除はできない。テスト、compiler-cli、`@angular/build` がパッケージを必要とする。これらは開発時のインストールで足りる。`dependencies` から `devDependencies` へ移すことは、ブラウザ実行時の import が無いことと矛盾しない。移す作業と、移したあとの build / test は、この文書では行っていない。

重複として外せる組は無い。

| 見比べたもの | 違い |
| --- | --- |
| `@angular/animations` と `@angular/platform-browser/animations` | 後者は入口である。実装は前者のパッケージを import する |
| `@angular/compiler` と `@angular/compiler-cli` | 前者はテストと JIT 用のパッケージ。後者は AOT の CLI で、すでに devDependency。compiler-cli は前者を必須 peer に持つ |
| `@angular/cdk` と `@angular/material` | Material が CDK を必須 peer に持つ。同じ役割の二つではない |

Knip は #277 で runtime の unused dependencies を報告していない。ここでの判定には使っていない。

## 判定

判定は「維持／削除候補／devDependency 移動候補／既に存在しない」のいずれか。削除候補は無い。依存の削除と、compiler の devDependency への移動は、この文書では行っていない。移動候補だけを Issue #282 に渡す。

| 対象 | 利用経路 | 根拠 | 判定 | 後続 |
| --- | --- | --- | --- | --- |
| `axios` | なし | `package.json` の依存に無い。`minimumReleaseAgeExclude` の文字列は依存ではない | 既に存在しない | なし |
| `@angular/animations` | `provideAnimations()` とテストの `provideNoopAnimations()` | platform-browser の optional peer を、アプリが実際に呼んでいる。lockfile の `deprecated` は未使用を意味しない | 維持 | なし。`animate.enter` への置き換えはこの調査の削除対象にしない |
| `@angular/cdk` | Material の `fesm2022` が import | Material の必須 peer。`apps/` と `libs/` に直接 import は無い | 維持 | なし |
| `@angular/compiler` | 4 つの `test-setup.ts` と、`@angular/build:unit-test` の仮想 import | 削除するとテストと、compiler-cli / `@angular/build` の必須 peer が欠ける。本番入口は import せず、AOT 既定ではブラウザ polyfill にも入らない | devDependency 移動候補 | #282。移動のあと build と test で確認する。削除はしない |
| `@angular/forms` | `FormsModule` と Material の `input.mjs` | アプリの import と Material の必須 peer | 維持 | なし |
| `@angular/material` | 画面コンポーネントと [styles.scss](../apps/web/src/styles.scss) | 上記 Material の表 | 維持 | なし |
| `@angular/common` | `AsyncPipe` | 3 コンポーネント | 維持 | なし |
| `@angular/core` | コンポーネント、DI、`TestBed` | `apps/` と `libs/` の 35 ファイル | 維持 | なし |
| `@angular/platform-browser` | `bootstrapApplication`、`DomSanitizer`、animations / testing の入口 | [main.ts](../apps/web/src/main.ts) ほか | 維持 | なし |
| `@angular/router` | ルート、ガード、`RouterModule` | 15 ファイル | 維持 | なし |
| `rxjs` | リポジトリ、ストア、ガード、詳細ページ | `from 'rxjs'` が 12 ファイル | 維持 | なし |
| `@ngrx/component-store` | `DeviceListStore` | [device-list.store.ts](../libs/devices/state/src/lib/device-list.store.ts) | 維持 | なし |
