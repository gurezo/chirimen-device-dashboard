---
name: conventional-commits
description: Generates Conventional Commits messages and pull request titles for chirimen-device-dashboard (Angular + Nx monorepo). Trigger when authoring commit messages, PR titles, or release notes, or when reviewing existing commit history for compliance.
---

# Conventional Commits for chirimen-device-dashboard

このリポジトリ (Angular + Nx モノレポ) 向けに、Conventional Commits 準拠の commit message / PR title を生成・検証するための Skill。

## 目的

- commit message と PR title を [Conventional Commits](https://www.conventionalcommits.org/) に統一する。
- Angular / Nx ワークスペースの構成 (`apps/`, `libs/devices/*`, `libs/shared-types`, `tools/scripts/*`) に整合する scope を選ぶ。
- 将来的な changelog 自動生成 / semantic-release への接続を容易にする。
- AI が生成するメッセージの品質を安定化させる。

## 形式

```
<type>(<scope>): <summary>

[optional body]

[optional footer(s)]
```

## 適用ルール

1. **type は小文字** で、許可された値のみを使う (`feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`)。
2. **scope は小文字、ハイフン区切り**。`commitlint.config.js` の `scope-enum` または `scopes.md` から選ぶ。
3. **summary は英語、命令形 (imperative mood)**。先頭は小文字、末尾にピリオドを付けない。
4. **type と変更内容を一致させる**。フォーマット変更のみは `style`、依存更新は `build`、CI 設定は `ci`。
5. **関連性のない変更を 1 つのコミットに混在させない**。
6. **breaking change** は footer に `BREAKING CHANGE: <message>` を記載する (`type!` 表記は使わない)。

## Angular / Nx を踏まえた scope 選択

- Angular コンポーネント / テンプレート / スタイル変更 → 該当 lib (`libs-card-list`, `libs-feature-list`, `libs-device-detail` 等) または `web`。
- 状態管理 (DeviceListStore 等) の変更 → `libs-state`。
- リポジトリ層 / API 呼び出し変更 → `libs-data-access`。
- 共有型定義 → `shared-types`。
- ルート設定・ツール (`package.json`, `nx.json`, `.husky/`, `commitlint.config.js`) → `workspace`。
- GitHub Actions ワークフロー → `ci`。
- MCP 設定 (`.cursor/mcp.json`) → `mcp`。
- E2E テスト → `web-e2e`。
- デバイス JSON 同期スクリプト → `sync-devices`。

詳細は `scopes.md` を参照。

## docs / ci / build / chore の使い分け

| 種別 | type | 例 |
| --- | --- | --- |
| README / CONTRIBUTING 等のドキュメント | `docs` | `docs(workspace): update readme quick start` |
| GitHub Actions ワークフロー追加・変更 | `ci` | `ci(workspace): add commitlint workflow` |
| 依存追加・更新、ビルド設定 | `build` | `build(workspace): bump nx to 22.7.1` |
| 上記に当てはまらない雑務 | `chore` | `chore(workspace): remove unused script` |

## 参照ファイル

- [`examples.md`](examples.md): 良い例と悪い例
- [`assertions.md`](assertions.md): 検証項目と Valid / Invalid サンプル
- [`scopes.md`](scopes.md): scope 一覧と用途
- リポジトリ側: `commitlint.config.js`, `CONTRIBUTING.md`, `.cursor/rules/commits/`
