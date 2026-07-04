# chirimen-device-dashboard

CHIRIMEN デバイス一覧を検索・確認するためのダッシュボードです。Angular SPA と Nx モノレポで構成されています。

## ダッシュボード

- 公開 URL: https://chirimen-device-dashboard.web.app/
- 公開データ: [`apps/web/public/devices.json`](apps/web/public/devices.json)

## デバイス情報を更新したい方へ

`partslist.csv` や各 example repository の変更をダッシュボードへ反映したい場合は、GitHub issue の `🔄 デバイス情報反映依頼` テンプレートを使って依頼してください。

更新依頼から CI、更新 PR、Firebase Hosting への deploy、ブラウザでの確認までの流れは [デバイス情報の更新フロー](docs/device-data-refresh.md) を参照してください。

## Quick Start

```bash
pnpm install
pnpm start
```

主な開発コマンドは [開発環境とコマンド](docs/development.md) を参照してください。

## よく使うコマンド

```bash
pnpm build
pnpm test
pnpm lint
pnpm nx graph
```

デバイスデータをローカルで再生成する場合は次のコマンドを使います。

```bash
pnpm sync:example-upstreams
pnpm generate:platform-examples
pnpm validate:platform-examples
pnpm generate:devices
```

## ドキュメント

| ドキュメント | 内容 |
| --- | --- |
| [デバイス情報の更新フロー](docs/device-data-refresh.md) | 反映依頼 issue、CI、更新 PR、deploy、キャッシュ確認 |
| [開発環境とコマンド](docs/development.md) | セットアップ、build / test / lint、データ生成コマンド |
| [アーキテクチャ](docs/architecture.md) | Nx workspace 構造、project 一覧、依存関係、レイヤー構成 |
| [AI エージェント向け設定](docs/ai-agent-setup.md) | Cursor Skills / Rules、Nx AI Agents、Conventional Commits |
| [Platform 別 Example 元データ](data/platform-examples/README.md) | `platform-examples.json` の編集方法、スキーマ、validation |
| [Upstream Example Sources](data/example-upstreams/README.md) | upstream repository 定義と device id override |

## ツール別 README

- [sync-devices](tools/scripts/sync-devices/README.md)
- [sync-example-upstreams](tools/scripts/sync-example-upstreams/README.md)
- [generate-platform-examples](tools/scripts/generate-platform-examples/README.md)
- [validate-platform-examples](tools/scripts/validate-platform-examples/README.md)

## Learn More

- [Nx Documentation](https://nx.dev/getting-started/intro)
- [Nx Cloud](https://nx.app)
