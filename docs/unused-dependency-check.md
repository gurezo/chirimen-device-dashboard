# 未使用依存の検出手順

Issue #283 の手順。#277 から #282 の調査で有効だった確認を、同じ順でやり直せるようにまとめた。候補ごとの判定表は各調査記録に残し、この文書は複製しない。

依存の追加と削除は、この手順の範囲外である。削除は根拠が揃ったものだけ、関心事ごとに別の変更にする。

## 判断

Knip はワークスペースの依存にも CI にも入れない。

#277 は次を試した。パッケージは追加していない。記録は [依存関係・Nx 構成のベースライン](dependency-baseline.md) の「Knip の試行」である。

```bash
pnpm dlx knip --workspace .
```

| 項目 | 結果 |
| --- | --- |
| Knip | `6.39.0`（`pnpm dlx`） |
| 終了コード | `1` |
| Unused files | 20 |
| Unused devDependencies | 14 |
| Unused dependencies（runtime） | 報告なし |

終了コード 1 は、Knip が候補を見つけたときの終了コードである。インストールや実行の失敗ではない。

未使用ファイルには、Angular の入口と Nx の公開 API が含まれる。例: `apps/web/src/main.ts`、ルート、ページ、`apps/web-e2e/playwright.config.ts`、各 `eslint.config.mjs`、`apps/web/tailwind.config.js`、ライブラリの `src/index.ts`。未使用 devDependency とした `eslint-plugin-playwright` は [apps/web-e2e/eslint.config.mjs](../apps/web-e2e/eslint.config.mjs) が import している。Knip はその設定ファイルを未使用ファイル側にも挙げたため、設定からの参照を落としている。

入口と公開 API を ignore すれば指摘は減る。その一覧の保守が残り、検査としては入口を最初から外すことになる。CI は [.github/workflows/ci.yml](../.github/workflows/ci.yml) の `pnpm nx affected -t lint,build,test` だけである。終了コード 1 の候補検出を足すと、通常の PR が候補の有無で失敗する。

候補を目で見るときは、依存を足さない `pnpm dlx` のままにする。Knip の指摘は削除根拠にしない。

## 起点

検査のたびに次を記録する。`package.json` の `packageManager` は `pnpm@12.11.2`、Node.js は [.nvmrc](../.nvmrc) と GitHub Actions の `24` である。

```bash
git rev-parse HEAD
node -v
pnpm -v
pnpm nx --version
```

`pnpm nx graph` は既定でブラウザを開く。依存の記録には `--print` を使い、グラフファイルはリポジトリに置かない。

## 確認の順

import の有無だけでは未使用にしない。実在、実行経路、peer、呼び出し元の順で見る。

### 1. 実在

候補が追跡されているかを先に確認する。無いものは「既に存在しない」とし、削除対象にしない。

```bash
git ls-files -- <path>
```

`package.json` の `dependencies`、`devDependencies`、`scripts` に名前が無ければ、依存としても script としても無い。過去の削除は [データ同期・Example 生成ツールの利用状況](data-sync-example-tools.md) と、ベースラインの「既存の削除」を先に読む。

### 2. プロジェクトと実行経路

```bash
pnpm nx show projects
pnpm nx graph --print
```

`project.json` の executor、`nx.json` の plugin、GitHub Actions、[.husky/commit-msg](../.husky/commit-msg) を、import とは別に読む。詳細は [devDependencies とビルド・テスト設定の利用経路](dev-dependencies.md)。

`git grep` から調査記録、エージェント用スキル、lockfile、宣言そのものを外す。

```bash
git grep -n -e '<package-or-symbol>' \
  -- ':!docs' ':!.cursor' ':!.agents' ':!.github/skills' ':!.opencode' \
  ':!pnpm-lock.yaml' ':!tools/ai-migrations' ':!package.json'
```

runtime の使用箇所は [runtime dependencies の使用箇所](runtime-dependencies.md)。直接依存と peer は分ける。

```bash
pnpm why <package> --depth 1
```

peer は、ソースが import しなくても外すと解決が欠ける。optional かどうかは、インストール済みパッケージの `package.json` の `peerDependenciesMeta` を読む。

### 3. apps / libs の呼び出し元

ファイルと export は、次も呼び出し元として見る。詳細は [apps / libs の入口](apps-libs-code.md)。

- ルートの `loadComponent`
- テンプレートのセレクタと `imports`
- `inject` と `InjectionToken`
- テスト
- barrel（`src/index.ts`）
- E2E の support

公開 API や互換のためのコードは、参照が少ないことだけでは削除しない。

## 判定

判定は「削除可能／維持／要追加確認／既に存在しない」のいずれか。

- 削除可能: 実在し、実行経路も peer も呼び出し元も無い。根拠を残し、別の変更で外す。
- 維持: 利用経路がある。または、外すと peer、CI、公開 API が欠ける。
- 要追加確認: import 検索だけでは足りない。IDE の読み込みや、パッケージを外した実行をまだしていない。
- 既に存在しない: `git ls-files` または `package.json` に無い。作業ツリーの未追跡ファイルは削除対象にしない。

## 例外と誤検知

次は未使用の根拠にしない。

| 見え方 | 実際 |
| --- | --- |
| Knip の未使用ファイルに `main.ts`、ルート、ページ、`playwright.config.ts`、`eslint.config.mjs`、`tailwind.config.js`、`src/index.ts` がある | Angular / Nx の入口と公開 API。ビルド、ルーティング、設定が読む |
| Knip が `eslint-plugin-playwright` を未使用 devDependency とする | [apps/web-e2e/eslint.config.mjs](../apps/web-e2e/eslint.config.mjs) が import する。設定ファイルを未使用ファイルにすると、その参照が落ちる |
| ソースに import が無い | executor、plugin、CI、Husky、テンプレート、DI、peer があり得る |
| `pnpm why` の依存元がワークスペースだけ | 直接宣言である。peer ではない。外す前に実行経路を別に見る |
| `commitlint` の `sync-devices` ほか削除済みツールの scope | 過去コミットを HEAD で検証するため残している。ソースは無い |
| Knip の終了コード 1 | 候補を見つけた終了コード。インストールや実行の失敗ではない |
