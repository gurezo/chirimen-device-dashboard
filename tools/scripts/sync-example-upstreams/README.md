# sync-example-upstreams

upstream CHIRIMEN example repositories を同期し、Platform 別 Example 候補を生成するツールです。

## 実行

```bash
pnpm sync:example-upstreams
```

## 入力

- [`data/example-upstreams/sources.yaml`](../../../data/example-upstreams/sources.yaml)
- [`apps/web/public/devices.json`](../../../apps/web/public/devices.json)（dashboard device id 推定用）
- 任意: [`data/example-upstreams/device-id-overrides.yaml`](../../../data/example-upstreams/device-id-overrides.yaml)

## 出力

- `generated/upstreams/**` — upstream mirror
- `generated/reports/example-sync-summary.md` — 同期サマリー
- `generated/reports/example-candidates.md` — 候補一覧・要 review 項目
- `data/platform-examples/platform-examples.generated.json` — review 用候補 JSON

正本 [`data/platform-examples/platform-examples.json`](../../../data/platform-examples/platform-examples.json) は**自動上書きしません**。

## Review フロー（手動）

1. `pnpm sync:example-upstreams` を実行
2. `generated/reports/example-sync-summary.md` と `example-candidates.md` を確認
3. 問題なければ `platform-examples.generated.json` から必要部分を `platform-examples.json` へ手動マージ
4. （#183 以降）`pnpm nx run sync-devices:sync` で `devices.json` を再生成

## 要件

- `git` CLI（upstream clone / fetch に使用）
