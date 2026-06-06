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

## ADT7410 移行記録（#180）

`chirimen-example-catalog` の `catalog/examples.json` / `metadata.md` と突合し、以下 5 platform を移行済みです。

| Platform | Status | Upstream Repository | Upstream Path |
| --- | --- | --- | --- |
| `pizero-esm` | primary | `chirimen-oh/chirimen.org` | `pizero/src/esm-examples/adt7410` |
| `node` | legacy | `chirimen-oh/chirimen-drivers` | `node-examples/adt7410` |
| `raspi-node` | legacy | `chirimen-oh/chirimen-drivers` | `raspi-examples/adt7410` |
| `microbit-driver` | legacy | `chirimen-oh/chirimen-drivers` | `microbit-examples/adt7410` |
| `legacy-gc-i2c` | archive | `chirimen-oh/chirimen` | `gc/i2c/i2c-ADT7410` |

### legacy `code` URL 対応

移行過渡期の旧 `devices.json` 互換のため、以下 3 platform は `code` にチュートリアル URL を設定しています。`upstreamPathUrl` は GitHub tree URL のままです。

| Platform | legacy `hardware` | `code`（チュートリアル URL） |
| --- | --- | --- |
| `pizero-esm` | `Pi Zero` | `https://tutorial.chirimen.org/pizero/esm-examples/#I2C_adt7410` |
| `microbit-driver` | `micro:bit` | `https://chirimen.org/chirimen-micro-bit/examples/#I2C1_ADT7410` |
| `legacy-gc-i2c` | `chirimen` | `https://r.chirimen.org/examples/#I2C-ADT7410` |

`node` / `raspi-node` は legacy `devices.json` に対応エントリがないため、`code` = `upstreamPathUrl` です。

## 編集フロー

### 自動生成（二段パイプライン）

`chirimen-example-catalog` と同様、同期と生成を分離しています。

```bash
# Step 1: upstream mirror を同期
pnpm sync:example-upstreams

# Step 2: Platform 別 Example 元データを生成
pnpm generate:platform-examples
```

1. `platform-examples.generated.json` を正本と比較する
2. 問題なければ必要部分を `platform-examples.json` へ手動マージする
3. （#183 以降）`pnpm nx run sync-devices:sync` で `devices.json` を再生成し、`product.example` が洗い替えされる

### 手動編集

1. `platform-examples.json` を直接編集する
2. JSON がパース可能であることを確認する

現時点（#183 未完了）では `devices.json` / `sync-devices` は `platform-examples.json` を参照していません。

## 関連 issue

- 親: [#177](https://github.com/gurezo/chirimen-device-dashboard/issues/177) — Example 管理機能の移植
- [#179](https://github.com/gurezo/chirimen-device-dashboard/issues/179) — 元データ置き場の追加
- [#180](https://github.com/gurezo/chirimen-device-dashboard/issues/180) — ADT7410 データの catalog 突合・移行
- [#182](https://github.com/gurezo/chirimen-device-dashboard/issues/182) — `generate-platform-examples` ツール（`generate-catalog` 相当）
- [#183](https://github.com/gurezo/chirimen-device-dashboard/issues/183) — `devices.json` 生成時の洗い替え
