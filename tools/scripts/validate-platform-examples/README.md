# validate-platform-examples

Platform 別 Example 元データと `devices.json` の `product.example` を検証し、Markdown レポートを生成します。

## 実行

```bash
pnpm validate:platform-examples
```

## 入力

- [`data/platform-examples/platform-examples.json`](../../../data/platform-examples/platform-examples.json)
- [`apps/web/public/devices.json`](../../../apps/web/public/devices.json)

## 出力

`generated/reports/` に以下を生成します。

- `missing-example-fields.md`
- `duplicated-platform-examples.md`
- `missing-circuit-url.md`
- `platform-example-validation-summary.md`

validation issue が 1 件でもある場合、終了コードは `1` になります（CI 連携用）。

## 関連 issue

- 親: [#177](https://github.com/gurezo/chirimen-device-dashboard/issues/177)
- [#189](https://github.com/gurezo/chirimen-device-dashboard/issues/189) — validation / reports ツール本体
