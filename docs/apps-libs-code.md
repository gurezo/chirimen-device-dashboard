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
git grep -n -w -e 'ExampleInfoComponent' -e 'choh-example-info' \
  -e 'setFilterTag' -e 'setFilterCategory' -e 'loadDevices' \
  -e 'loadDevicesIfNeeded' -e 'adaptCertifiedDevice' \
  -e 'JsonDeviceRepository' -e 'provideDeviceRepository' \
  -e 'DEVICE_REPOSITORY' \
  -- ':!docs' ':!.cursor' ':!.agents' ':!.github/skills' ':!.opencode' \
  ':!pnpm-lock.yaml'
```

`git grep` から調査記録、エージェント用スキル、lockfile を外した。`-w` は `loadDevices` を `loadDevicesIfNeeded` と分け、`adaptCertifiedDevice` を `adaptCertifiedDevicesJson` と分ける。`CERTIFIED_DEVICES_JSON_URL` は E2E の同名の文字列定数にも当たるので、トークンかどうかは import を見て分けた。

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

## 未参照の検索

この節は、入口に載ったシンボルのうち、本番のテンプレート、`loadComponent`、DI、他ライブラリの import に出ないものを記録する。テストだけの参照は、本番の呼び出し元には数えない。動的 import は [app.routes.ts](../apps/web/src/app/app.routes.ts) の二つの `loadComponent` だけである。`example-info` を `import()` する箇所は無い。

### `ExampleInfoComponent`

| 確認 | 結果 |
| --- | --- |
| 呼び出し元 | クラス名は [example-info.component.ts](../libs/devices/device-detail/src/lib/example-info/example-info.component.ts) と [example-info.component.spec.ts](../libs/devices/device-detail/src/lib/example-info/example-info.component.spec.ts) だけ。スペックは `TestBed` でこのコンポーネントだけを作る |
| セレクタ | `choh-example-info` は宣言側だけにある。他のテンプレートには無い |
| 動的参照 | `templateUrl` は同じディレクトリの html を指す静的な文字列。ルートの `loadComponent` には入らない |
| 公開 API | [libs-device-detail の barrel](../libs/devices/device-detail/src/index.ts) は `DeviceDetailComponent` だけを出す。このコンポーネントは公開していない |

詳細の本番経路は [product-info.component.ts](../libs/devices/device-detail/src/lib/product-info/product-info.component.ts) が `PlatformSpecificExamplesComponent` を描く。[example-info.component.html](../libs/devices/device-detail/src/lib/example-info/example-info.component.html) は `example().hardware` と `example().code` を表示する。`hardware` は検索インデックスも読む。[device-list.store.ts](../libs/devices/state/src/lib/device-list.store.ts) の `buildSearchIndex` が `example.hardware` を語に含める。`code` を表示している本番テンプレートは、このコンポーネントだけである。adapter は `ExampleInfo.code` に `upstreamPathUrl` を入れている。型と adapter の代入は、このコンポーネントが無くても残る。

同じディレクトリのファイルは ts、html、spec の三つである。スタイルファイルは無い。

### Store のメソッド

[device-list.store.ts](../libs/devices/state/src/lib/device-list.store.ts) のクラスは公開 API である。メソッドごとに外からの呼び出しを分けた。[device-list.store.spec.ts](../libs/devices/state/src/lib/device-list.store.spec.ts) が呼ぶのは検索の `filteredDevices$` だけである。`setFilterTag`、`setFilterCategory`、`loadDevices` のテストは無い。

| シンボル | 定義の外 | 動的参照 | 公開 API |
| --- | --- | --- | --- |
| `setQuery` | [device-list-page.component.ts](../apps/web/src/app/pages/device-list-page/device-list-page.component.ts) と store のスペック | 無し | `DeviceListStore` のメソッド |
| `setViewMode` | 一覧ページの ts と html | 無し | 同上 |
| `loadDevicesIfNeeded` | 一覧ページの `ngOnInit` | 無し | 同上 |
| `viewMode$`、`query$` | 一覧ページが `toSignal` する | 無し | 同上 |
| `filteredDevices$`、`loading$`、`error$` | table と card が読む。feature-list のスペックは同名のモックを持つ | 無し | 同上 |
| `devices$` | `filteredDevices$` の入力だけ | 無し | 同上。外は `filteredDevices$` を読む |
| `setFilterTag`、`setFilterCategory` | 定義だけ | 無し | 同上 |
| `filterTag$`、`filterCategory$` | `filteredDevices$` の入力だけ | 無し | 同上 |
| `loadDevices` | 定義だけ。`loadDevicesIfNeeded` とは別の effect | 無し | 同上 |

`filterTag` と `filterCategory` の初期値は `undefined` である。setter が無いので、`filteredDevices$` の tag / category 分岐は、今の起動経路では常に通過する。state のフィールド自体は `filteredDevices$` が読んでいる。setter が未使用でも、フィールドをまとめて消す根拠にはしない。

`loadDevices` と `loadDevicesIfNeeded` は、どちらも `repository.list()` の成功で `loaded: true` にし、失敗で `error` を入れる。違いは、後者が `loaded` のとき `EMPTY` で抜けることだけである。一覧が呼ぶのは後者だけである。二つの effect のどちらを残すかは、未使用の判定とは別に次の節で扱う。

`DeviceListState` は barrel に無い。store ファイルの中だけが使う。未使用ではない。

### `libs-data-access` の公開 export

ライブラリの外が barrel から import しているのは、次だけである。

| export | 外の import |
| --- | --- |
| `provideDeviceRepository` | [app.config.ts](../apps/web/src/app/app.config.ts) |
| `DEVICE_REPOSITORY` | ガード、詳細コンポーネント、store。スペックも同じトークンを差し替える |
| `DeviceRepository` | ガード、詳細、カード一覧、store のスペックがモックの型に使う |

それ以外の barrel export は、`libs-data-access` の中と、その barrel の再 export に閉じる。E2E の `CERTIFIED_DEVICES_JSON_URL` は [mock-certified-devices.ts](../apps/web-e2e/src/support/mock-certified-devices.ts) の文字列であり、[certified-devices.config.ts](../libs/devices/data-access/src/lib/certified-devices.config.ts) の `InjectionToken` ではない。

クラスと関数で、ライブラリの中では使われているものは次である。公開 export を外しても、中の参照は残る。

| シンボル | ライブラリ内の本番 | 公開 export の外からの import |
| --- | --- | --- |
| `JsonDeviceRepository` | [providers.ts](../libs/devices/data-access/src/lib/providers.ts) が `new` する | 無し |
| `adaptCertifiedDevicesJson` | [json-device.repository.ts](../libs/devices/data-access/src/lib/json-device.repository.ts) | 無し |
| `isSupportedCertifiedDevicesVersion` | 同じ repository。定数 `SUPPORTED_CERTIFIED_DEVICES_VERSION` と比較する | 無し。定数は型ファイルとスペックと barrel |
| `CERTIFIED_DEVICES_FETCH_TIMEOUT_MS`、`DEFAULT_CERTIFIED_DEVICES_JSON_URL` | repository と provider | 無し。トークン `CERTIFIED_DEVICES_JSON_URL` も provider の中だけ |
| `buildDeviceIdIndex`、`parseCertifiedAliases`、`resolveDeviceId`、`DeviceIdIndex` | repository | 無し |
| `CertifiedDevice` | adapter の引数。スペックも使う | 無し |
| `CertifiedDevicesJson` | スペックのフィクスチャ型。repository は `unknown` を adapter に渡す | 無し |
| `CertifiedAliases` | [resolve-device-id.ts](../libs/devices/data-access/src/lib/resolve-device-id.ts) | 無し |

`adaptCertifiedDevice` は [certified-device.adapter.ts](../libs/devices/data-access/src/lib/certified-device.adapter.ts) と、そのスペックと barrel だけである。JSON 全体を変換する本番は `adaptCertifiedDevicesJson` であり、こちらは非公開の `adaptCertifiedDeviceRecord` を map する。`adaptCertifiedDevice` はその関数を一件分だけ包む。

`DeviceIdMatchKind` と `DeviceIdResolution` は `resolveDeviceId` の戻り値である。定義と barrel 以外には、名前としては出ない。戻り値の形としては repository が `device` を読む。

Certified の入れ子の型（`CertifiedExample`、`CertifiedDeviceMeta`、`CertifiedPlatform` など）は、[certified-devices.types.ts](../libs/devices/data-access/src/lib/certified-devices.types.ts) の型グラフの中で互いに参照される。ファイル先頭のコメントは、UI はこの型を import せず adapter を通す、と書いてある。`apps/` と他の lib からの import は無い。型グラフのメンバーであることと、barrel が公開していることは別である。公開をやめるかどうかは、参照が無いことだけでは決めない。

### ルートの `title`

[app.ts](../apps/web/src/app/app.ts) の `protected title = 'web'` は、テンプレートにもスペックにも出ない。[app.html](../apps/web/src/app/app.html) はヘッダと `router-outlet` だけである。[index.html](../apps/web/src/index.html) の `<title>` は別の文字列である。公開 export ではなく、コンポーネントのフィールドである。

### 中で使っているもの

次は、barrel の外であっても本番の `imports` かテンプレートか store から届く。未使用ではない。

| シンボル | 本番の呼び出し元 |
| --- | --- |
| `ProductInfoComponent` | 詳細コンポーネントの `imports` |
| `DeviceListHeaderComponent`、`DeviceListItemComponent` | table の `imports` とテンプレート |
| `TruncatePipe` | card の `imports` と `truncate` パイプ |
| `PlatformSpecificExampleCardComponent` | 狭い幅のテンプレート。広い幅は同じ親が表をインラインで描く |
| `compareExampleStatus`、`getExampleStatusLabel`、`getExampleStatusClasses` | Example 一覧とカード |
| `isPlatformSpecificExample` | Example 一覧の `computed`。adapter のスペックも使う |
| `DeviceInfo`、`ProductInfo`、`ExampleInfo`、`ExampleStatus` | adapter、store、詳細、Example UI |

[index.spec.ts](../libs/devices/feature-list/src/index.spec.ts)、[libs-card-list の index.spec.ts](../libs/devices/card-list/src/index.spec.ts)、[libs-state の index.spec.ts](../libs/devices/state/src/index.spec.ts) は `expect(true).toBe(true)` だけである。barrel もコンポーネントも import しない。テストターゲットのファイルではある。本番コードの参照根拠にはしない。
