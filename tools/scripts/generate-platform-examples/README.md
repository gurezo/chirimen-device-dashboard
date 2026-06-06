# generate-platform-examples

`chirimen-example-catalog` の `generate-catalog` 相当ツールです。upstream mirror から Platform 別 Example 元データを生成します。

## 実行

```bash
# Step 1: upstream mirror を更新（先に実行）
pnpm sync:example-upstreams

# Step 2: Platform 別 Example 元データを生成
pnpm generate:platform-examples
```

## 入力

- [`data/example-upstreams/sources.yaml`](../../../data/example-upstreams/sources.yaml)
- `generated/upstreams/**` — `sync-example-upstreams` の同期結果
- [`apps/web/public/devices.json`](../../../apps/web/public/devices.json)（dashboard device id 推定用）
- 任意: [`data/example-upstreams/device-id-overrides.yaml`](../../../data/example-upstreams/device-id-overrides.yaml)
- [`data/platform-examples/platform-examples.json`](../../../data/platform-examples/platform-examples.json) — legacy `code` / `hardware` マージ用

## 出力

- `data/platform-examples/platform-examples.generated.json` — review 用候補 JSON（差分がある場合のみ更新）

正本 [`platform-examples.json`](../../../data/platform-examples/platform-examples.json) は**自動上書きしません**。

## Review フロー（手動）

1. `pnpm sync:example-upstreams` を実行
2. `pnpm generate:platform-examples` を実行
3. `platform-examples.generated.json` と正本を比較
4. 問題なければ必要部分を `platform-examples.json` へ手動マージ
5. （#183 以降）`pnpm nx run sync-devices:sync` で `devices.json` を再生成
