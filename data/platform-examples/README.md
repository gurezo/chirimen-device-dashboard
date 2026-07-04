# Platform 別 Example 元データ

`platform-examples.json` は、`devices.json` 生成時に `product.example` を洗い替えるための正本データです。

`chirimen-example-catalog` には runtime dependency しません。完成後は本リポジトリ内のデータを正とします。

## ファイル

| ファイル | 説明 |
| --- | --- |
| `platform-examples.json` | Platform 別 Example の正本（コミット対象） |
| `platform-examples.generated.json` | upstream 同期後の review 用候補 JSON（CI 自動 PR で更新される場合あり） |

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
| `platform` | Platform 識別子（例: `pizero-esm`, `microbit-driver`） |
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

`chirimen-example-catalog` の `catalog/examples.json` / `metadata.md` と突合し、以下 3 platform を移行済みです。`chirimen-drivers` の旧 Node.js / Raspberry Pi examples は upstream 側で削除予定のため、生成元から除外しています。

| Platform | Status | Upstream Repository | Upstream Path |
| --- | --- | --- | --- |
| `pizero-esm` | primary | `chirimen-oh/chirimen.org` | `pizero/src/esm-examples/adt7410` |
| `microbit-driver` | legacy | `chirimen-oh/chirimen-drivers` | `microbit-examples/adt7410` |
| `legacy-gc-i2c` | archive | `chirimen-oh/chirimen` | `gc/i2c/i2c-ADT7410` |

### legacy `code` URL 対応

移行過渡期の旧 `devices.json` 互換のため、以下 3 platform は `code` にチュートリアル URL を設定しています。`upstreamPathUrl` は GitHub tree URL のままです。

| Platform | legacy `hardware` | `code`（チュートリアル URL） |
| --- | --- | --- |
| `pizero-esm` | `Pi Zero` | `https://tutorial.chirimen.org/pizero/esm-examples/#I2C_adt7410` |
| `microbit-driver` | `micro:bit` | `https://chirimen.org/chirimen-micro-bit/examples/#I2C1_ADT7410` |
| `legacy-gc-i2c` | `chirimen` | `https://r.chirimen.org/examples/#I2C-ADT7410` |

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
3. `pnpm nx run sync-devices:sync` で `devices.json` を再生成し、`product.example` が洗い替えされる

### 手動編集

1. `platform-examples.json` を直接編集する
2. JSON がパース可能であることを確認する
3. `pnpm nx run sync-devices:sync` で `devices.json` を再生成する
4. `pnpm validate:platform-examples` で validation レポートを確認する

`sync-devices` は `platform-examples.json` を読み込み、`dashboardDeviceId` が一致する device の `product.example` を洗い替えます。

## legacy `code` URL から platform / status を判定

partslist.csv 由来の legacy Example（`hardware` + `code` のみ）を Platform 別 Example に移行する際、`code` URL パターンから platform / status を判定します（[#188](https://github.com/gurezo/chirimen-device-dashboard/issues/188)）。

判定順序は具体パス優先です（`pizero/esm-examples` を `pizero/` より先に評価）。

| `code` URL パターン | platform | status |
| --- | --- | --- |
| `tutorial.chirimen.org/pizero/esm-examples` | `pizero-esm` | `primary` |
| `tutorial.chirimen.org/pizero/`（esm-examples 以外） | `pizero-esm` | `primary` |
| `r.chirimen.org/examples` | `chirimen` | `legacy` |
| `chirimen.org/chirimen/gc/top/examples` | `chirimen` | `legacy` |
| `tutorial.chirimen.org/raspi` | `chirimen` | `legacy` |
| `chirimen.org/examples`（上記以外） | `chirimen` | `legacy` |
| `chirimen.org/chirimen-micro-bit/examples` | `microbit-driver` | `legacy` |
| `tutorial.chirimen.org/microbit` | `microbit-driver` | `legacy` |
| 外部 GitHub 等 | `chirimen` | `legacy` |

### 適用例: `i2c-grove-gesture-paj7620u2`

| legacy `code` | 判定結果 |
| --- | --- |
| `https://r.chirimen.org/examples/#I2C-Grove-Gesture` | platform: `chirimen`, status: `legacy` |
| `https://tutorial.chirimen.org/pizero/esm-examples/#I2C_paj7620` | platform: `pizero-esm`, status: `primary` |

legacy 39 件の bootstrap は以下で実行できます。

```bash
pnpm exec tsx tools/scripts/sync-devices/src/bootstrap-legacy-platform-examples-main.ts --write
pnpm generate:devices
pnpm validate:platform-examples
```

実装: [`tools/scripts/sync-devices/src/classify-legacy-example-url.ts`](../../tools/scripts/sync-devices/src/classify-legacy-example-url.ts)

## Validation

Platform 別 Example 元データと `devices.json` の `product.example` を検証する場合:

```bash
pnpm validate:platform-examples
```

レポートは `generated/reports/` に出力されます。詳細は [`tools/scripts/validate-platform-examples/README.md`](../../tools/scripts/validate-platform-examples/README.md) を参照してください。

## CI / 生成差分の扱い

GitHub Actions から sync / generate / validate / `devices.json` 生成を実行できます。`chirimen-example-catalog` には依存しません。

### Workflow 一覧

| Workflow | ファイル | トリガー | 役割 |
| --- | --- | --- | --- |
| Sync example upstreams | [`.github/workflows/sync-example-upstreams.yml`](../../.github/workflows/sync-example-upstreams.yml) | 毎週日曜 0:00 UTC / 手動 | upstream 同期 → 生成 → validation → `devices.json` 生成 → 差分があれば自動 PR |
| Generate platform examples | [`.github/workflows/generate-platform-examples.yml`](../../.github/workflows/generate-platform-examples.yml) | PR / main push / 手動 | `data/platform-examples/` の生成ドリフトを検出 |
| Validate platform examples | [`.github/workflows/validate-platform-examples.yml`](../../.github/workflows/validate-platform-examples.yml) | PR / main push / 手動 | 正本と `devices.json` の validation |
| Generate devices | [`.github/workflows/generate-devices.yml`](../../.github/workflows/generate-devices.yml) | PR / main push / 手動 | `devices.json` の生成ドリフトを検出 |

`sync-devices.yml`（partslist.csv 由来の `devices.json` 更新）は別 workflow です。両方が `devices.json` を更新する場合は merge 時に conflict 解消が必要になることがあります。

### 自動 PR に含まれるファイル

`sync-example-upstreams` workflow が作成する PR には、おおむね以下が含まれます。

- `generated/reports/**` — 同期・validation レポート
- `data/platform-examples/**` — `platform-examples.generated.json` 等
- `apps/web/public/devices.json` — `product.example` 洗い替え結果（`partslist.csv` 更新分を含む場合あり）

正本 `platform-examples.json` は**自動上書きしません**。`platform-examples.generated.json` を確認し、必要なら手動で正本へマージしてください。

### `generated/upstreams` について

upstream repository の mirror（`generated/upstreams/**`）はリポジトリにコミットしません。CI では `actions/cache` で run 間再利用します。

### ローカル再現

```bash
pnpm sync:example-upstreams
pnpm generate:platform-examples
pnpm validate:platform-examples
pnpm generate:devices
```

## 関連 issue

- 親: [#177](https://github.com/gurezo/chirimen-device-dashboard/issues/177) — Example 管理機能の移植
- [#179](https://github.com/gurezo/chirimen-device-dashboard/issues/179) — 元データ置き場の追加
- [#180](https://github.com/gurezo/chirimen-device-dashboard/issues/180) — ADT7410 データの catalog 突合・移行
- [#182](https://github.com/gurezo/chirimen-device-dashboard/issues/182) — `generate-platform-examples` ツール（`generate-catalog` 相当）
- [#183](https://github.com/gurezo/chirimen-device-dashboard/issues/183) — `devices.json` 生成時の洗い替え
- [#189](https://github.com/gurezo/chirimen-device-dashboard/issues/189) — validation / reports ツール
- [#187](https://github.com/gurezo/chirimen-device-dashboard/issues/187) — Example 同期・生成・検証用 GitHub Actions
- [#188](https://github.com/gurezo/chirimen-device-dashboard/issues/188) — catalog archive 前の移行確認（legacy URL 判定による 39 件移行）
