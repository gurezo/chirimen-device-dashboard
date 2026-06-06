# Upstream Example Sources

`sync-example-upstreams` が参照する upstream repository 定義です。

`chirimen-example-catalog` には runtime dependency しません。

## ファイル

| ファイル | 説明 |
| --- | --- |
| `sources.yaml` | upstream repository 一覧（コミット対象） |
| `device-id-overrides.yaml` | example device id → dashboard device id の手動 override |

## sources.yaml スキーマ

各 `sources` エントリは以下のフィールドを持ちます。

| フィールド | 必須 | 説明 |
| --- | --- | --- |
| `id` | はい | ソース識別子（`generated/upstreams/{id}` に mirror） |
| `repo` | はい | GitHub リポジトリ（例: `chirimen-oh/chirimen.org`） |
| `branch` | はい | clone / fetch 対象ブランチ |
| `path` | はい | リポジトリ内の examples ルートパス |
| `platform` | はい | Platform 識別子（`ExampleInfo.platform` に対応） |
| `priority` | はい | 状態（`primary` / `legacy` / `archive` / `special` / `incubator`） |
| `description` | はい | 人間向け説明 |

## 対象 upstream

- `chirimen-oh/chirimen.org`
- `chirimen-oh/chirimen-drivers`
- `chirimen-oh/chirimen`
- `chirimen-oh/chirimen-micro-bit`
- `chirimen-oh/remote-connection`
- `chirimen-oh/pre-arrangement-contributions`

## 関連 issue

- 親: [#177](https://github.com/gurezo/chirimen-device-dashboard/issues/177)
- [#181](https://github.com/gurezo/chirimen-device-dashboard/issues/181) — sync-upstreams 移植
