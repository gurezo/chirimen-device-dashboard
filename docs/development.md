# 開発環境とコマンド

このリポジトリは Nx モノレポとして構成されています。ローカル開発では、package manager として `pnpm` を使用します。

## 前提

- Node.js 24
- pnpm 11.8.0

`package.json` の `packageManager` は次の値です。

```text
pnpm@11.8.0
```

## セットアップ

```bash
pnpm install
```

## よく使うコマンド

| 目的 | コマンド |
| --- | --- |
| 開発サーバー起動 | `pnpm start` |
| `web` を serve | `pnpm serve` |
| `web` を build | `pnpm build` |
| 全 project を build | `pnpm build:all` |
| `web` の unit test | `pnpm test` |
| 全 project の test | `pnpm test:all` |
| `web` の lint | `pnpm lint` |
| 全 project の lint | `pnpm lint:all` |
| E2E test | `pnpm e2e` |
| Nx graph 表示 | `pnpm nx graph` |

Nx の task は、グローバル CLI ではなく workspace の package manager 経由で実行します。

```bash
pnpm nx build web
pnpm nx test libs-state
pnpm nx affected -t lint,build,test
```

## デバイスデータ関連コマンド

| 目的 | コマンド |
| --- | --- |
| upstream example repository を同期 | `pnpm sync:example-upstreams` |
| Platform 別 Example 候補を生成 | `pnpm generate:platform-examples` |
| Platform 別 Example を検証 | `pnpm validate:platform-examples` |
| `devices.json` を生成 | `pnpm generate:devices` |

デバイス情報の更新フロー全体は [デバイス情報の更新フロー](device-data-refresh.md) を参照してください。

## テスト

```bash
pnpm test
pnpm test:all
```

IDE でテストを実行する場合は、次の点に注意してください。

- このプロジェクトは Vitest を使用しています。Jest は使用していません。
- Cursor / VSCode では Vitest 拡張機能を使用してください。
- Jest 拡張機能が有効な場合、誤検出を避けるため無効化またはアンインストールしてください。

## CI と同等の確認

PR の CI では Nx affected task が実行されます。

```bash
pnpm nx affected -t lint,build,test
```

ドキュメントのみの変更では build / test の実行は必須ではありませんが、リンクや Mermaid 図が GitHub 上で読めることを確認してください。
