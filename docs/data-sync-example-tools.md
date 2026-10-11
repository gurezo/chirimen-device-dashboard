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
