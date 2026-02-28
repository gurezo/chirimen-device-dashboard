# chirimen-device-dashboard

CHIRIMEN デバイス一覧のダッシュボード。Nx モノレポで構成されています。

## chirimen-device-dashboard Nx ワークスペース構造

### ディレクトリ構造

```mermaid
flowchart TB
    subgraph root["chirimen-device-dashboard (root)"]
        direction TB
    end

    subgraph apps["apps/"]
        web["web (Angular SPA)"]
        webE2e["web-e2e (Playwright E2E)"]
    end

    subgraph libs["libs/"]
        sharedTypes["shared-types (共有型定義)"]
        subgraph devices["devices/"]
            dataAccess["data-access (データアクセス層)"]
            stateLib["state (状態管理)"]
            featureList["feature-list (デバイス一覧)"]
            cardList["card-list (カード一覧)"]
            deviceDetail["device-detail (デバイス詳細)"]
        end
    end

    root --> apps
    root --> libs
```

### プロジェクト依存関係グラフ

```mermaid
flowchart LR
    subgraph apps["Applications"]
        web["web"]
        webE2e["web-e2e"]
    end

    subgraph libs["Libraries"]
        sharedTypes["shared-types"]
        dataAccess["libs-data-access"]
        stateLib["libs-state"]
        featureList["libs-feature-list"]
        cardList["libs-card-list"]
        deviceDetail["libs-device-detail"]
    end

    sharedTypes --> dataAccess
    sharedTypes --> stateLib
    sharedTypes --> deviceDetail

    dataAccess --> stateLib

    stateLib --> featureList
    stateLib --> cardList
    dataAccess --> cardList
    dataAccess --> deviceDetail

    web --> dataAccess
    web --> stateLib
    web --> featureList
    web --> cardList
    web --> deviceDetail

    webE2e -.->|implicit| web
```

### レイヤー別アーキテクチャ

```mermaid
flowchart TB
    subgraph presentation["Presentation Layer"]
        web["web (Angular)"]
    end

    subgraph feature["Feature Layer"]
        featureList["libs-feature-list"]
        cardList["libs-card-list"]
        deviceDetail["libs-device-detail"]
    end

    subgraph stateLayer["State Layer"]
        stateLib["libs-state"]
    end

    subgraph data["Data Layer"]
        dataAccess["libs-data-access"]
    end

    subgraph shared["Shared Layer"]
        sharedTypes["shared-types"]
    end

    web --> featureList
    web --> cardList
    web --> deviceDetail

    featureList --> stateLib
    cardList --> stateLib
    deviceDetail --> dataAccess

    stateLib --> dataAccess
    stateLib --> sharedTypes
    dataAccess --> sharedTypes
    deviceDetail --> sharedTypes
```

### プロジェクト一覧

| プロジェクト | パス | 種別 | 説明 |
| --- | --- | --- | --- |
| web | apps/web | Application | Angular フロントエンド (ポート 4200) |
| web-e2e | apps/web-e2e | E2E | Playwright による Web E2E テスト |
| shared-types | libs/shared-types | Library | DeviceInfo, ProductInfo 等の共有型 |
| libs-data-access | libs/devices/data-access | Library | デバイスリポジトリ・データアクセス |
| libs-state | libs/devices/state | Library | DeviceListStore 等の状態管理 |
| libs-feature-list | libs/devices/feature-list | Library | デバイス一覧 UI コンポーネント |
| libs-card-list | libs/devices/card-list | Library | デバイスカード一覧 UI |
| libs-device-detail | libs/devices/device-detail | Library | デバイス詳細 UI |

## Quick Start

```bash
pnpm install
pnpm nx graph
pnpm nx build
```

## Running Tests

```bash
pnpm test          # web のユニットテスト
pnpm test:all      # 全プロジェクトのテスト
```

**IDE (Cursor / VSCode) でテストを実行する場合:**

- このプロジェクトは **Vitest** を使用しています（Jest は使用していません）
- Vitest 拡張機能をインストールし、Jest 拡張機能は無効化またはアンインストールしてください
- ターミナルで `pnpm test` を実行するか、タスク「Run Tests (web)」を使用してください

## Learn More

- [Nx Documentation](https://nx.dev/getting-started/intro)
- [Nx Cloud](https://nx.app)
