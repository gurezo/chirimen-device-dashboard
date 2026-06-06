# sync-example-upstreams

upstream CHIRIMEN example repositories を同期し、Platform 別 Example 候補を生成するツールです。

## 実行

```bash
# Step 1: upstream mirror を同期
pnpm sync:example-upstreams

# Step 2: Platform 別 Example 元データを生成
pnpm generate:platform-examples
```

## 入力

- [`data/example-upstreams/sources.yaml`](../../../data/example-upstreams/sources.yaml)
- [`apps/web/public/devices.json`](../../../apps/web/public/devices.json)（dashboard device id 推定用）
- 任意: [`data/example-upstreams/device-id-overrides.yaml`](../../../data/example-upstreams/device-id-overrides.yaml)

## 出力

- `generated/upstreams/**` — upstream mirror
- `generated/reports/example-sync-summary.md` — 同期サマリー
- `generated/reports/example-candidates.md` — 候補一覧・要 review 項目

Platform 別 Example JSON の生成は [`generate-platform-examples`](../generate-platform-examples/README.md) が担当します。

## Review フロー（手動）

1. `pnpm sync:example-upstreams` を実行
2. `pnpm generate:platform-examples` を実行
3. `generated/reports/example-sync-summary.md` と `example-candidates.md` を確認
4. 問題なければ `platform-examples.generated.json` から必要部分を `platform-examples.json` へ手動マージ
5. `pnpm nx run sync-devices:sync` で `devices.json` を再生成

## 要件

- `git` CLI（upstream clone / fetch に使用）
