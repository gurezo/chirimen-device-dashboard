# sync-devices

`partslist.csv` から `apps/web/public/devices.json` を生成するツールです。

## 実行

```bash
pnpm nx run sync-devices:sync
```

## 入力

- [`partslist.csv`](https://github.com/chirimen-oh/chirimen.org/blob/master/_data/partslist.csv) — CHIRIMEN 公式パーツリスト（リモート取得）
- [`data/platform-examples/platform-examples.json`](../../../data/platform-examples/platform-examples.json) — Platform 別 Example 正本（`product.example` 洗い替え用）

## 出力

- [`apps/web/public/devices.json`](../../../apps/web/public/devices.json)

## 処理フロー

1. `partslist.csv` を取得・パースして `DeviceInfo[]` を生成
2. `platform-examples.json` を読み込む
3. `dashboardDeviceId` が一致する device の `product.example` を Platform 別 Example で洗い替え
4. 洗い替え対象外 device の既存 `product.example` は維持
5. `devices.json` を出力

`platform-specific-examples.json` のような別 JSON は生成しません。

## テスト

```bash
pnpm nx run sync-devices:test
```

## legacy Platform 別 Example の bootstrap

partslist.csv 由来の legacy Example を Platform 別形式に変換して `platform-examples.json` へ追記する場合:

```bash
pnpm exec tsx tools/scripts/sync-devices/src/bootstrap-legacy-platform-examples-main.ts --write
pnpm nx run sync-devices:sync
```

判定ルールは [data/platform-examples/README.md](../../../data/platform-examples/README.md) を参照してください。
