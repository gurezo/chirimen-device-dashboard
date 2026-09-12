# chirimen-device-dashboard

CHIRIMEN デバイス一覧を検索・確認するためのダッシュボードです。Angular SPA と Nx モノレポで構成されています。

## ダッシュボード

- 公開 URL: https://chirimen-device-dashboard.web.app/
- データソース: [`chirimen-certified-devices/generated/devices.json`](https://github.com/gurezo/chirimen-certified-devices/blob/main/generated/devices.json)

Dashboard は実行時に Certified Devices JSON を取得して表示します。デバイスデータの生成はこのリポジトリの責務ではありません。

## デバイス情報を更新したい方へ

デバイス情報の追加・修正は [`chirimen-certified-devices`](https://github.com/gurezo/chirimen-certified-devices) で行ってください。Dashboard 側では同期・生成しません。

本リポジトリの Issue は Dashboard 固有の不具合・機能改善向けです。報告先の区別と反映確認は [デバイス情報の更新](docs/device-data-refresh.md) を参照してください。

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

## ドキュメント

| ドキュメント | 内容 |
| --- | --- |
| [デバイス情報の更新](docs/device-data-refresh.md) | データソース、修正先、報告先の区別、反映確認 |
| [開発環境とコマンド](docs/development.md) | セットアップ、build / test / lint |
| [アーキテクチャ](docs/architecture.md) | Nx workspace 構造、project 一覧、依存関係、データフロー |
| [AI エージェント向け設定](docs/ai-agent-setup.md) | Cursor Skills / Rules、Nx AI Agents、Conventional Commits |

## Learn More

- [Nx Documentation](https://nx.dev/getting-started/intro)
- [Nx Cloud](https://nx.app)
