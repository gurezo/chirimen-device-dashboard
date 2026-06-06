# Platform 別 Example 元データ

`platform-examples.json` は、`devices.json` 生成時に `product.example` を洗い替えるための正本データです。

`chirimen-example-catalog` には runtime dependency しません。完成後は本リポジトリ内のデータを正とします。

## ファイル

| ファイル | 説明 |
| --- | --- |
| `platform-examples.json` | Platform 別 Example の正本（コミット対象） |

生成物として `apps/web/public/platform-specific-examples.json` のような別 JSON は作成しません。最終的には `apps/web/public/devices.json` の `product.example` に統合されます。

## JSON スキーマ

トップレベルはデバイス単位の配列です。

```json
[
  {
    "dashboardDeviceId": "i2c-adt7410",
    "exampleDeviceId": "adt7410",
    "examples": [ /* ExampleInfo 互換オブジェクト */ ]
  }
]
```

### デバイスエントリ

| フィールド | 必須 | 説明 |
| --- | --- | --- |
| `dashboardDeviceId` | はい | `devices.json` の device `id`（例: `i2c-adt7410`） |
| `exampleDeviceId` | はい | Example catalog 側の device id（例: `adt7410`） |
| `examples` | はい | Platform 別 Example の配列 |

### Example エントリ（`examples` 配列の各要素）

移行過渡期のため、既存互換フィールドと Platform 別フィールドの両方を含めます。型定義は [`libs/shared-types/src/lib/device.ts`](../../libs/shared-types/src/lib/device.ts) の `ExampleInfo` を参照してください。

**既存互換（必須）**

| フィールド | 説明 |
| --- | --- |
| `hardware` | ハードウェア表示名（例: `Pi Zero`, `micro:bit`） |
| `code` | サンプルコード URL（移行過渡期では `upstreamPathUrl` と同一でも可） |

**Platform 別（必須）**

| フィールド | 説明 |
| --- | --- |
| `deviceId` | Example catalog 側の device id |
| `platform` | Platform 識別子（例: `pizero-esm`, `node`） |
| `localPath` | catalog 互換のローカルパス |
| `upstreamRepository` | GitHub リポジトリ（例: `chirimen-oh/chirimen.org`） |
| `upstreamRepositoryUrl` | リポジトリ URL |
| `upstreamPath` | リポジトリ内パス |
| `upstreamPathUrl` | パスへの tree URL |
| `status` | `primary` / `legacy` / `archive` / `special` / `incubator` |
| `circuitUrl` | 回路図 URL |
| `verified` | 実機確認済みか（boolean） |

### URL 生成ルール

- `upstreamRepositoryUrl`: `https://github.com/{upstreamRepository}`
- `upstreamPathUrl`: `https://github.com/{upstreamRepository}/tree/master/{upstreamPath}`
- `circuitUrl`: `https://github.com/{upstreamRepository}/blob/master/{upstreamPath}/{filename}`

## ID 対応の例

| dashboardDeviceId | exampleDeviceId | デバイス名 |
| --- | --- | --- |
| `i2c-adt7410` | `adt7410` | ADT7410 |

## 編集フロー

1. `platform-examples.json` を編集する
2. JSON がパース可能であることを確認する
3. （#183 以降）`pnpm nx run sync-devices:sync` で `devices.json` を再生成し、`product.example` が洗い替えされる

現時点（#179）では `devices.json` / `sync-devices` は変更していません。元データの追加のみです。

## 関連 issue

- 親: [#177](https://github.com/gurezo/chirimen-device-dashboard/issues/177) — Example 管理機能の移植
- 本 issue: [#179](https://github.com/gurezo/chirimen-device-dashboard/issues/179) — 元データ置き場の追加
- [#180](https://github.com/gurezo/chirimen-device-dashboard/issues/180) — ADT7410 データの catalog 突合
- [#183](https://github.com/gurezo/chirimen-device-dashboard/issues/183) — `devices.json` 生成時の洗い替え
