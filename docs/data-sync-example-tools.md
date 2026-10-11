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
