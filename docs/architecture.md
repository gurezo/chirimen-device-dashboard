# アーキテクチャ

CHIRIMEN デバイスダッシュボードは Nx モノレポで構成されています。Angular SPA の `web` を入口に、デバイス情報の取得、状態管理、一覧・詳細 UI、データ生成ツールをプロジェクト単位で分離しています。

## ディレクトリ構造

```mermaid
flowchart TB
    root["chirimen-device-dashboard root"]

    subgraph appsGroup["apps"]
        web["web Angular SPA"]
        webE2e["web-e2e Playwright E2E"]
    end

    subgraph libsGroup["libs"]
        sharedTypes["shared-types 共有型定義"]
        subgraph devicesGroup["devices"]
            dataAccess["data-access データアクセス層"]
            stateLib["state 状態管理"]
            featureList["feature-list デバイス一覧"]
            cardList["card-list カード一覧"]
            deviceDetail["device-detail デバイス詳細"]
            platformExamples["platform-specific-examples Platform 別 Example UI"]
        end
    end

    subgraph toolsGroup["tools/scripts"]
        syncDevices["sync-devices"]
        syncExampleUpstreams["sync-example-upstreams"]
        generatePlatformExamples["generate-platform-examples"]
        validatePlatformExamples["validate-platform-examples"]
    end

    root --> appsGroup
    root --> libsGroup
    root --> toolsGroup
```

## プロジェクト依存関係グラフ

```mermaid
flowchart LR
    subgraph applicationsGroup["Applications"]
        web["web"]
        webE2e["web-e2e"]
    end

    subgraph librariesGroup["Libraries"]
        sharedTypes["shared-types"]
        dataAccess["libs-data-access"]
        stateLib["libs-state"]
        featureList["libs-feature-list"]
        cardList["libs-card-list"]
        deviceDetail["libs-device-detail"]
        platformExamples["libs-platform-specific-examples"]
    end

    sharedTypes --> dataAccess
    sharedTypes --> stateLib
    sharedTypes --> deviceDetail
    sharedTypes --> platformExamples

    dataAccess --> stateLib
    stateLib --> featureList
    stateLib --> cardList
    dataAccess --> cardList
    dataAccess --> deviceDetail
    deviceDetail --> platformExamples

    web --> dataAccess
    web --> stateLib
    web --> featureList
    web --> cardList
    web --> deviceDetail

    webE2e -.->|"implicit"| web
```

## レイヤー別アーキテクチャ

```mermaid
flowchart TB
    subgraph presentationLayer["Presentation Layer"]
        web["web Angular"]
    end

    subgraph featureLayer["Feature Layer"]
        featureList["libs-feature-list"]
        cardList["libs-card-list"]
        deviceDetail["libs-device-detail"]
        platformExamples["libs-platform-specific-examples"]
    end

    subgraph stateLayer["State Layer"]
        stateLib["libs-state"]
    end

    subgraph dataLayer["Data Layer"]
        dataAccess["libs-data-access"]
    end

    subgraph sharedLayer["Shared Layer"]
        sharedTypes["shared-types"]
    end

    web --> featureList
    web --> cardList
    web --> deviceDetail

    featureList --> stateLib
    cardList --> stateLib
    deviceDetail --> dataAccess
    deviceDetail --> platformExamples

    stateLib --> dataAccess
    stateLib --> sharedTypes
    dataAccess --> sharedTypes
    deviceDetail --> sharedTypes
    platformExamples --> sharedTypes
```

## プロジェクト一覧

| プロジェクト | パス | 種別 | 説明 |
| --- | --- | --- | --- |
| `chirimen-device-dashboard` | `.` | Workspace | ルート workspace project |
| `web` | `apps/web` | Application | Angular フロントエンド |
| `web-e2e` | `apps/web-e2e` | Application | Playwright による E2E テスト |
| `shared-types` | `libs/shared-types` | Library | `DeviceInfo` / `ProductInfo` 等の共有型 |
| `libs-data-access` | `libs/devices/data-access` | Library | デバイスリポジトリ・データアクセス |
| `libs-state` | `libs/devices/state` | Library | `DeviceListStore` 等の状態管理 |
| `libs-feature-list` | `libs/devices/feature-list` | Library | デバイス一覧 UI コンポーネント |
| `libs-card-list` | `libs/devices/card-list` | Library | デバイスカード一覧 UI |
| `libs-device-detail` | `libs/devices/device-detail` | Library | デバイス詳細 UI |
| `libs-platform-specific-examples` | `libs/devices/platform-specific-examples` | Library | Platform 別 Example UI |
| `sync-devices` | `tools/scripts/sync-devices` | Application | `partslist.csv` と正本データから `devices.json` を生成 |
| `sync-example-upstreams` | `tools/scripts/sync-example-upstreams` | Application | upstream example repository を同期し、候補とレポートを生成 |
| `generate-platform-examples` | `tools/scripts/generate-platform-examples` | Application | upstream 同期結果から Platform 別 Example 候補 JSON を生成 |
| `validate-platform-examples` | `tools/scripts/validate-platform-examples` | Application | Platform 別 Example と `devices.json` の整合性を検証 |

## 主なデータ境界

- `apps/web/public/devices.json` はフロントエンドが読み込む公開データです。
- `data/platform-examples/platform-examples.json` は Platform 別 Example の正本データです。
- `generated/reports/**` は同期・生成・検証で出力されるレビュー用レポートです。
- `generated/upstreams/**` は upstream repository の mirror で、リポジトリにはコミットしません。
