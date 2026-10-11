# データ同期・Example 生成ツールの利用状況

Issue #278 の調査記録。削除判断の材料であり、この文書の作成時点では依存・コード・設定を削除していない。

調査日: 2026-10-11

起点: `main` の `d9c34dd479a9046232353ddb7e93e35b1a9a34f7`（`d9c34dd docs(workspace): record dependency and nx baseline (#284)`）

前提は [依存関係・Nx 構成のベースライン](dependency-baseline.md) と同じ `main` である。ベースラインは候補の不在を一行で「既に存在しない」とした。この文書は、呼び出し元・生成物・Example 表示との違いまで確認する。

## 再現コマンド

```bash
git rev-parse HEAD
git ls-files tools/scripts data generated apps/web/public/devices.json .github/workflows
git grep -n -e 'generate:devices' -e 'sync-devices' -e 'sync-example-upstreams' \
  -e 'generate-platform-examples' -e 'validate-platform-examples' -e 'refresh-devices' \
  -- ':!docs/dependency-baseline.md' ':!.cursor'
find tools/scripts -maxdepth 3 \( -type d -o -type f \)
git check-ignore -v generated tools/scripts/sync-devices/node_modules
```

`git grep` から `docs/dependency-baseline.md` と `.cursor` を外したのは、調査記録と commitlint 用 scope 説明を、実行経路の参照と分けて見るためである。scope の残りは後の節で別に確認する。

## 対象の現存

Issue の調査候補と、それらが書いていた生成物・workflow を、`git ls-files` と `package.json` の `scripts` で確認した。いずれも git 上のソースは無い。

| 対象 | git 上の状態 | 根拠 |
| --- | --- | --- |
| `tools/scripts/sync-devices` | ソースなし | `git ls-files` に無い。削除は `5b49437 chore(workspace): remove local device data generation (#268)` |
| `tools/scripts/sync-example-upstreams` | ソースなし | 同上 |
| `tools/scripts/generate-platform-examples` | ソースなし | 同上 |
| `tools/scripts/validate-platform-examples` | ソースなし | 同上 |
| `package.json` の `generate:devices` | なし | `scripts` に無い。`start` / `serve` / `build` / `test` / `lint` / `e2e` とその `:all` のみ |
| Nx target（上記 4 ツール） | なし | 各ツールの `project.json` は #268 で削除済み。残る `project.json` の `name` は `web`、`web-e2e`、6 つの lib、`shared-types`、ルートの `chirimen-device-dashboard` |
| `.github/workflows/sync-devices.yml` | なし | #268 で削除 |
| `.github/workflows/sync-example-upstreams.yml` | なし | #268 で削除 |
| `.github/workflows/generate-devices.yml` | なし | #268 で削除 |
| `.github/workflows/generate-platform-examples.yml` | なし | #268 で削除 |
| `.github/workflows/validate-platform-examples.yml` | なし | #268 で削除 |
| `.github/workflows/refresh-devices.yml` | なし | `4991af1 ci(ci): remove refresh-devices workflow (#269)` |
| `apps/web/public/devices.json` | なし | #268 で削除。`git ls-files` に無い |
| `data/example-upstreams/` | なし | #268 で削除（`README.md`、`sources.yaml`、`device-id-overrides.yaml`） |
| `data/platform-examples/` | なし | #268 で削除（`platform-examples.json`、`platform-examples.generated.json`、`README.md`） |
| `generated/reports/` | なし | #268 で削除。検証レポートの markdown と `refresh-sources.json` |

残っている workflow は [ci.yml](../.github/workflows/ci.yml)、[commitlint.yml](../.github/workflows/commitlint.yml)、[deploy.yml](../.github/workflows/deploy.yml) の 3 つである。これらのファイルに、上表のツール名、`generate:devices`、`refresh-devices`、`devices.json` の文字列は無い。

## 作業ツリーに残る無視ファイル

ソースは無いが、この作業ツリーには git が追跡しないディレクトリが残っている。コミット対象ではなく、アプリのビルド入力でもない。

| パス | 内容 | ignore |
| --- | --- | --- |
| `tools/scripts/sync-devices/node_modules/` | `.vite` のキャッシュのみ。ソースファイルは無い | [.gitignore](../.gitignore) の `node_modules` |
| `tools/scripts/sync-example-upstreams/node_modules/` | 同上 | 同上 |
| `tools/scripts/generate-platform-examples/node_modules/` | 同上 | 同上 |
| `tools/scripts/validate-platform-examples/node_modules/` | 同上 | 同上 |
| `generated/upstreams/` | 旧 Example 同期のチェックアウト残骸（upstream リポジトリのディレクトリ） | [.gitignore](../.gitignore) の `generated/` |

`git ls-files generated` は空である。`generated/upstreams/` をアプリやテストが読む参照は、`apps/` と `libs/` に無い。

## デバイス取得の経路

デバイス情報の生成は、このリポジトリには残っていない。実行時の取得先は [`chirimen-certified-devices` の `generated/devices.json`](https://github.com/gurezo/chirimen-certified-devices/blob/main/generated/devices.json) である。

| 段階 | 場所 | 役割 |
| --- | --- | --- |
| URL | [certified-devices.config.ts](../libs/devices/data-access/src/lib/certified-devices.config.ts) の `DEFAULT_CERTIFIED_DEVICES_JSON_URL` | GitHub raw の `generated/devices.json` |
| 起動 | [app.config.ts](../apps/web/src/app/app.config.ts) の `provideDeviceRepository()` | `JsonDeviceRepository` をその URL で作る |
| 取得 | [json-device.repository.ts](../libs/devices/data-access/src/lib/json-device.repository.ts) | `fetch` で JSON を読み、version を確認してから adapter に渡す。結果は `shareReplay` で再利用する |
| 変換 | [certified-device.adapter.ts](../libs/devices/data-access/src/lib/certified-device.adapter.ts) の `adaptExample` | `meta.examples` を `ExampleInfo` にする。`platform`、`upstreamRepository`、`upstreamPath`、`upstreamPathUrl`、`status`、`circuitUrl`、`verified` を写す |
| 説明 | [README.md](../README.md)、[device-data-refresh.md](device-data-refresh.md)、[architecture.md](architecture.md)、[development.md](development.md) | Dashboard 側では同期・生成しない、と既に書いてある |

`adaptExample` は `localPath` を設定しない。`localPath` が残っているのは `ExampleInfo` の任意プロパティと、テスト用フィクスチャだけである。表示は upstream の URL を使う。

[`chirimen-certified-devices` の README](https://github.com/gurezo/chirimen-certified-devices) では、生成は次のコマンドとしてそのリポジトリに残っている。

```text
pnpm sync:devices
pnpm validate:devices
pnpm generate:devices
```

入力は `chirimen.org` の partslist と、そのリポジトリの `data/supplemental-devices.yml`、`devices/**/meta.yml` である。出力は `generated/devices.json` で、Dashboard はこれを実行時に取得する。このリポジトリに同じコマンドや同じ生成物は無い。

## Example 表示の経路

Example の生成・upstream 同期と、画面上の Example 表示は別である。表示に必要なのは `libs-platform-specific-examples` であり、削除済みの 4 ツールではない。

| 段階 | 場所 | 役割 |
| --- | --- | --- |
| 入力 | adapter が作った `ProductInfo.example` | Certified Devices JSON の `examples` 配列 |
| 詳細画面 | [product-info.component.html](../libs/devices/device-detail/src/lib/product-info/product-info.component.html) | `example` が 1 件以上なら `choh-platform-specific-examples` を出す |
| 絞り込み | [platform-specific-examples.component.ts](../libs/devices/platform-specific-examples/src/lib/platform-specific-examples/platform-specific-examples.component.ts) | `isPlatformSpecificExample` を通し、`platform`、`upstreamRepository`、`upstreamPath`、`upstreamPathUrl`、`status` が揃ったものだけを status 順に並べる |
| 型 | [device.ts](../libs/shared-types/src/lib/device.ts) の `isPlatformSpecificExample` | 上記 5 項目が truthy であることを見る。ローカルファイルの存在は見ない |

カードが開くリンクは `upstreamPathUrl` と `circuitUrl` であり、`generated/upstreams/` や `data/platform-examples/` ではない。

## 呼び出し元

GitHub Actions、テスト、ローカル開発、公開アプリのどれも、削除済みツールを起動しない。

| 経路 | ツールを呼ぶか | 実際に使うもの |
| --- | --- | --- |
| [ci.yml](../.github/workflows/ci.yml) | 呼ばない | `pnpm nx affected -t lint,build,test` |
| [deploy.yml](../.github/workflows/deploy.yml) | 呼ばない | lint、test、`pnpm nx build web --configuration=production`、Firebase Hosting |
| [commitlint.yml](../.github/workflows/commitlint.yml) | 呼ばない | PR のコミットメッセージ検証 |
| `package.json` の `start` / `serve` / `build` / `test` / `e2e` | 呼ばない | `web` と `web-e2e` の Nx ターゲット |
| ユニットテスト | 呼ばない | adapter と Example UI はフィクスチャの `ExampleInfo` を使う |
| E2E | 呼ばない | [mock-certified-devices.ts](../apps/web-e2e/src/support/mock-certified-devices.ts) が上記 JSON の URL をフィクスチャで返す |
| 公開アプリ | 呼ばない | ビルド済みの `web` が、起動時に Certified Devices JSON を `fetch` する |

## commitlint の scope

`commitlint.config.js` の `scope-enum` には、削除済みツール名が残っている。

| scope | 設定 | 説明 |
| --- | --- | --- |
| `sync-devices` | [commitlint.config.js](../commitlint.config.js)、[scopes.md](../.cursor/skills/conventional-commits/scopes.md)、[CONTRIBUTING.md](../CONTRIBUTING.md) | 削除済みツール向けの互換 scope |
| `sync-example-upstreams` | `commitlint.config.js` と `scopes.md` | 同上 |
| `generate-platform-examples` | `commitlint.config.js` と `scopes.md` | 同上 |
| `validate-platform-examples` | `commitlint.config.js` と `scopes.md` | 同上 |

`main` には、これらの scope を使ったコミットが残っている。例: `1d8dbdc chore(sync-example-upstreams): update platform example sync artifacts (#252)`、`18a8a4b chore(sync-devices): refresh devices data`。

[commitlint.yml](../.github/workflows/commitlint.yml) は、PR の base から head までだけを検証する。通常の PR では、すでに `main` にある過去コミットは再検証されない。scope を外すと、その scope のコミットが PR の範囲に入ったときに commitlint が失敗する。[commitlint.config.js](../commitlint.config.js) のコメントは、その scope を戻した PR の先行コミットが HEAD の検証を通るよう残した、と書いている。

[CONTRIBUTING.md](../CONTRIBUTING.md) のスコープ表と [.cursor/rules/commits/42-chirimen-device-dashboard-scope.mdc](../.cursor/rules/commits/42-chirimen-device-dashboard-scope.mdc) は `sync-devices` だけを載せ、他の 3 scope は載せていない。`commitlint.config.js` と `scopes.md` は 4 つとも載せている。表の抜けであり、scope 自体の削除理由にはしない。

## 判定

判定は「維持／削除候補／既に存在しない／要確認」のいずれか。この調査で「削除候補」とした対象は無い。Issue #282（S6）へ渡す削除対象も無い。

Example 表示とデバイス取得を維持するために必要なのは、次の現存する経路である。

- `libs-data-access` が Certified Devices JSON を `fetch` し、`adaptExample` で `ExampleInfo` にする
- `libs-device-detail` が `ProductInfo.example` を `libs-platform-specific-examples` に渡す
- 生成コマンド（`sync:devices`、`validate:devices`、`generate:devices`）と `generated/devices.json` の更新は `chirimen-certified-devices` に残す

| 対象 | 利用経路 | 根拠 | 判定 | 後続 |
| --- | --- | --- | --- | --- |
| `sync-devices` のソース、Nx target、workflow、`apps/web/public/devices.json` | なし | 上記「対象の現存」。削除は #268 | 既に存在しない | なし |
| `generate:devices` | なし | `package.json` の `scripts` に無い。同名コマンドは `chirimen-certified-devices` にある | 既に存在しない | なし |
| `sync-example-upstreams` のソース、workflow、`data/example-upstreams/` | なし | #268。ローカルの `generated/upstreams/` は `generated/` で ignore され、表示は読まない | 既に存在しない | なし |
| `generate-platform-examples` のソース、workflow、`data/platform-examples/` | なし | #268 | 既に存在しない | なし |
| `validate-platform-examples` のソース、workflow、`generated/reports/` | なし | #268 | 既に存在しない | なし |
| `refresh-devices` workflow | なし | #269 | 既に存在しない | なし |
| 作業ツリーの `tools/scripts/*/node_modules` と `generated/upstreams/` | アプリ・CI・テストは未使用 | git 未追跡。ignore 済み | 既に存在しない | なし。未追跡のため S6 の削除対象にしない |
| commitlint の 4 scope | 過去コミットの検証 | `scope-enum` と `main` 上の該当コミット | 維持 | なし |
| CONTRIBUTING と cursor scope ルールの表が `sync-devices` のみ | 文書の一覧 | 他 3 scope は `commitlint.config.js` と `scopes.md` にある | 要確認 | 削除ではない。表を揃えるなら別の文書修正 |
| `libs-data-access` の Certified Devices JSON 取得 | `web` の起動時 `fetch` | デバイス取得の節 | 維持 | なし |
| `libs-platform-specific-examples` | デバイス詳細の Example 表示 | Example 表示の節。生成ツールは使わない | 維持 | なし |
| `chirimen-certified-devices` の `sync:devices` / `validate:devices` / `generate:devices` | そのリポジトリの README に記載された生成 | Dashboard の外。このリポジトリから呼ぶ workflow は無い | 維持 | なし。このリポジトリの S6 では削除しない |
