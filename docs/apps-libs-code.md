# apps / libs の入口

Issue #281 の調査記録。削除判断の材料であり、この文書の作成時点ではコードを削除していない。

調査日: 2026-10-11

起点: `main` の `2324a8695bf261973b3192a592505a40bc04c0d1`（`2324a86 docs(workspace): record dev dependency and build config usage (#287)`）

対象は `apps/web`、`apps/web-e2e`、`libs/shared-types`、`libs/devices/*` である。import の有無だけでは未使用にしない。ルートの `loadComponent`、テンプレートのセレクタ、`imports`、`inject`、`InjectionToken`、テスト、barrel、E2E の support も呼び出し元として見る。依存パッケージの再調査はしない。前提は [依存関係・Nx 構成のベースライン](dependency-baseline.md)、[runtime dependencies](runtime-dependencies.md)、[devDependencies](dev-dependencies.md) である。

## 再現コマンド

```bash
git rev-parse HEAD
node -v
pnpm -v
pnpm nx show projects --json
```

実行時は Node.js `v24.16.0`、pnpm `12.11.2`。`pnpm nx show projects --json` は次の 10 件を返した。

```text
libs-platform-specific-examples
libs-device-detail
libs-feature-list
libs-data-access
libs-card-list
libs-state
shared-types
web-e2e
web
chirimen-device-dashboard
```

各プロジェクトの `root`、`sourceRoot`、`projectType`、target 名は `pnpm nx show project <name> --json` で読んだ。

## プロジェクト

| 名前 | 種別 | root | sourceRoot | target |
| --- | --- | --- | --- | --- |
| `web` | application | `apps/web` | `apps/web/src` | lint, build, test, serve, serve-static |
| `web-e2e` | application | `apps/web-e2e` | `apps/web-e2e/src` | lint, e2e |
| `shared-types` | library | `libs/shared-types` | `libs/shared-types/src` | lint, build |
| `libs-data-access` | library | `libs/devices/data-access` | `libs/devices/data-access/src` | lint, test, build |
| `libs-state` | library | `libs/devices/state` | `libs/devices/state/src` | lint, test, build |
| `libs-feature-list` | library | `libs/devices/feature-list` | `libs/devices/feature-list/src` | lint, test, build |
| `libs-card-list` | library | `libs/devices/card-list` | `libs/devices/card-list/src` | lint, test, build |
| `libs-device-detail` | library | `libs/devices/device-detail` | `libs/devices/device-detail/src` | lint, test, build |
| `libs-platform-specific-examples` | library | `libs/devices/platform-specific-examples` | `libs/devices/platform-specific-examples/src` | lint, test, build |

`web-e2e` の `implicitDependencies` は `web` だけである。ライブラリ側の `implicitDependencies` は空である。プロジェクト間の TypeScript 参照は [tsconfig.base.json](../tsconfig.base.json) の `paths` が barrel を指す。

| パッケージ名 | barrel |
| --- | --- |
| `@chirimen-device-dashboard/shared-types` | [libs/shared-types/src/index.ts](../libs/shared-types/src/index.ts) |
| `@chirimen-device-dashboard/libs-data-access` | [libs/devices/data-access/src/index.ts](../libs/devices/data-access/src/index.ts) |
| `@chirimen-device-dashboard/libs-state` | [libs/devices/state/src/index.ts](../libs/devices/state/src/index.ts) |
| `@chirimen-device-dashboard/libs-feature-list` | [libs/devices/feature-list/src/index.ts](../libs/devices/feature-list/src/index.ts) |
| `@chirimen-device-dashboard/libs-card-list` | [libs/devices/card-list/src/index.ts](../libs/devices/card-list/src/index.ts) |
| `@chirimen-device-dashboard/libs-device-detail` | [libs/devices/device-detail/src/index.ts](../libs/devices/device-detail/src/index.ts) |
| `@chirimen-device-dashboard/libs-platform-specific-examples` | [libs/devices/platform-specific-examples/src/index.ts](../libs/devices/platform-specific-examples/src/index.ts) |

`pnpm nx show projects` にはルートの `chirimen-device-dashboard` も出る。中身は [project.json](../project.json) の `echo` だけであり、`apps/` と `libs/` のソースではない。この文書の候補には入れない。

## 公開 barrel

ライブラリの外から使う型とクラスは、上の barrel だけが入口である。barrel が再 export しないファイルは、そのライブラリの内部である。

| ライブラリ | barrel が出すもの |
| --- | --- |
| `shared-types` | [device.ts](../libs/shared-types/src/lib/device.ts) の `export *`。`ExampleStatus`、`ExampleInfo`、`isPlatformSpecificExample`、`ProductInfo`、`DeviceInfo` |
| `libs-data-access` | `DeviceRepository`、`DEVICE_REPOSITORY`、`JsonDeviceRepository`、`provideDeviceRepository`、Certified Devices の URL / timeout / 型 / adapter / `resolveDeviceId` 一式。[index.ts](../libs/devices/data-access/src/index.ts) |
| `libs-state` | `DeviceListStore`、`ViewMode`、`provideDeviceListStore` |
| `libs-feature-list` | `DeviceListComponent` |
| `libs-card-list` | `DeviceCardListComponent` |
| `libs-device-detail` | `DeviceDetailComponent` |
| `libs-platform-specific-examples` | `PlatformSpecificExamplesComponent` |

`libs-feature-list` の barrel 先頭コメントは「implementation in #41」とある。コメントであり、別実装への参照ではない。

barrel に無い本番の型とクラスは次のとおりである。呼び出し元の有無は後の節で検索する。

| ファイル | 外に出していないもの |
| --- | --- |
| [device-list-header.ts](../libs/devices/feature-list/src/lib/device-list-header/device-list-header.ts) | `DeviceListHeaderComponent` |
| [device-list-item.ts](../libs/devices/feature-list/src/lib/device-list-item/device-list-item.ts) | `DeviceListItemComponent` |
| [truncate.pipe.ts](../libs/devices/card-list/src/lib/truncate.pipe.ts) | `TruncatePipe` |
| [product-info.component.ts](../libs/devices/device-detail/src/lib/product-info/product-info.component.ts) | `ProductInfoComponent` |
| [example-info.component.ts](../libs/devices/device-detail/src/lib/example-info/example-info.component.ts) | `ExampleInfoComponent` |
| [example-status.ts](../libs/devices/platform-specific-examples/src/lib/example-status.ts) | `compareExampleStatus`、`getExampleStatusLabel`、`getExampleStatusClasses` |
| [platform-specific-example-card.component.ts](../libs/devices/platform-specific-examples/src/lib/platform-specific-example-card/platform-specific-example-card.component.ts) | `PlatformSpecificExampleCardComponent`、`PlatformSpecificExample` |
| [device-list.store.ts](../libs/devices/state/src/lib/device-list.store.ts) | `DeviceListState`。`DeviceListStore` と `ViewMode` は barrel が出す |

## 起動とルート

[main.ts](../apps/web/src/main.ts) が `bootstrapApplication(App, appConfig)` する。[index.html](../apps/web/src/index.html) の `<choh-root>` が [App](../apps/web/src/app/app.ts) である。[app.html](../apps/web/src/app/app.html) は `choh-header` と一つの `router-outlet` だけを置く。名前付き outlet は無い。

[app.routes.ts](../apps/web/src/app/app.routes.ts) の経路は二つで、どちらも `loadComponent` である。

| path | 読み込むクラス | ガード |
| --- | --- | --- |
| `''` | `DeviceListPageComponent` | 無し |
| `devices/:id` | `DeviceDetailPageComponent` | `redirectLegacyDeviceIdGuard` |

ガードは [redirect-legacy-device-id.guard.ts](../apps/web/src/app/guards/redirect-legacy-device-id.guard.ts) である。`DEVICE_REPOSITORY.get` の結果で `device.id` が URL と違うときだけ `/devices/:id` へ `RedirectCommand` する。一致、未登録、取得失敗のときはルートを通す。

`web-e2e` はコンポーネントを import しない。[device-catalog.spec.ts](../apps/web-e2e/src/device-catalog.spec.ts)、[device-id-compat.spec.ts](../apps/web-e2e/src/device-id-compat.spec.ts)、[platform-examples.spec.ts](../apps/web-e2e/src/platform-examples.spec.ts) が、上の二つの path をブラウザから開く。[mock-certified-devices.ts](../apps/web-e2e/src/support/mock-certified-devices.ts) は E2E が JSON を差し替える support であり、Angular の DI トークンではない。

## DI

[app.config.ts](../apps/web/src/app/app.config.ts) がアプリ全体に渡すものは次である。

| provider | 実体 |
| --- | --- |
| `provideRouter(appRoutes, withInMemoryScrolling(...))` | 上のルート |
| `provideAnimations()` | Angular animations |
| `provideBrowserGlobalErrorListeners()` | Angular のエラーリスナ |
| `provideDeviceRepository()` | `CERTIFIED_DEVICES_JSON_URL` に既定 URL を入れ、`DEVICE_REPOSITORY` を `JsonDeviceRepository` にする |
| `provideDeviceListStore()` | `DeviceListStore` |

`provideDeviceRepository` は [providers.ts](../libs/devices/data-access/src/lib/providers.ts)、トークンの定義は [device.repository.ts](../libs/devices/data-access/src/lib/device.repository.ts) と [certified-devices.config.ts](../libs/devices/data-access/src/lib/certified-devices.config.ts) にある。`DeviceRepository` のメソッドは `list()` と `get(id)` だけである。

`DEVICE_REPOSITORY` を `inject` するのは、ガードと [device-detail.component.ts](../libs/devices/device-detail/src/lib/device-detail/device-detail.component.ts) である。一覧の table と card は `DeviceListStore` を `inject` し、リポジトリを直接は持たない。Store の中だけが `DEVICE_REPOSITORY` を取る。

## セレクタ

standalone の `imports` とテンプレートが、セレクタの本番のつながりである。`viewMode` が `'table'` のときだけ table、それ以外は card である。一覧ページが両方のコンポーネントを `imports` している。

| セレクタ | クラス | 誰が描画するか |
| --- | --- | --- |
| `choh-root` | `App` | [index.html](../apps/web/src/index.html) |
| `choh-header` | `HeaderComponent` | [app.html](../apps/web/src/app/app.html) |
| `choh-device-list-page` | `DeviceListPageComponent` | `''` の `loadComponent`。テンプレートからは呼ばれない |
| `choh-device-detail-page` | `DeviceDetailPageComponent` | `devices/:id` の `loadComponent`。テンプレートからは呼ばれない |
| `choh-device-list` | `DeviceListComponent` | [device-list-page.component.html](../apps/web/src/app/pages/device-list-page/device-list-page.component.html) の table |
| `choh-device-card-list` | `DeviceCardListComponent` | 同じテンプレートの table 以外 |
| `choh-device-list-header` | `DeviceListHeaderComponent` | [device-list.component.html](../libs/devices/feature-list/src/lib/device-list/device-list.component.html) |
| `choh-device-list-item` | `DeviceListItemComponent` | 同じテンプレートの各行 |
| `choh-device-detail` | `DeviceDetailComponent` | [device-detail-page.component.html](../apps/web/src/app/pages/device-detail-page/device-detail-page.component.html) |
| `choh-product-info` | `ProductInfoComponent` | [device-detail.component.html](../libs/devices/device-detail/src/lib/device-detail/device-detail.component.html) |
| `choh-platform-specific-examples` | `PlatformSpecificExamplesComponent` | [product-info.component.html](../libs/devices/device-detail/src/lib/product-info/product-info.component.html) |
| `choh-platform-specific-example-card` | `PlatformSpecificExampleCardComponent` | [platform-specific-examples.component.html](../libs/devices/platform-specific-examples/src/lib/platform-specific-examples/platform-specific-examples.component.html) の狭い幅。広い幅の表は同じファイルがインラインで描く |
| `choh-example-info` | `ExampleInfoComponent` | この節で読んだテンプレートには無い |

`TruncatePipe` にセレクタは無い。[device-card-list.component.html](../libs/devices/card-list/src/lib/device-card-list/device-card-list.component.html) が `truncate` パイプとして使う。カード一覧の `imports` に入っている。
