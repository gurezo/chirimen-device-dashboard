# Assertions

commit message / PR title を Conventional Commits に準拠させるための検証項目。AI が生成または検証するときに使うチェックリスト。

## 検証項目

1. **形式**: `<type>(<scope>): <summary>` の形式になっているか。
2. **type**: 許可された値 (`feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`) のいずれかで、小文字か。
3. **scope**: `commitlint.config.js` の `scope-enum` に含まれる値か。`scopes.md` と一致するか。小文字でハイフン区切りか。
4. **summary**: 簡潔で命令形 (imperative mood) か。
5. **summary 先頭**: 小文字か。
6. **summary 末尾**: ピリオドが付いていないか。
7. **整合性**: type と変更対象が一致しているか (例: ドキュメントのみ変更で `feat` を使っていないか)。
8. **scope と変更対象の一致**: 変更ファイルが scope に対応するディレクトリと一致しているか。
9. **breaking change**: 破壊的変更がある場合、footer に `BREAKING CHANGE: <message>` が記載されているか (`!` 表記を使っていないか)。
10. **混在**: 関連性のない変更を 1 つのコミットにまとめていないか。

## Valid 例

```
feat(libs-card-list): add device card list component
fix(libs-data-access): correct device repository fetch error
refactor(libs-feature-list): simplify device list rendering
docs(workspace): update readme quick start
test(web): add device list smoke test
ci(workspace): update commitlint workflow
build(workspace): bump nx to 22.7.1
build(sync-devices): update devices.json from partslist.csv
```

破壊的変更を含む Valid 例:

```
feat(libs-state): change device list store api

BREAKING CHANGE: DeviceListStore.load() の戻り値が Observable から Signal に変更されました
```

## Invalid 例と修正案

| Invalid | 違反項目 | 修正案 |
| --- | --- | --- |
| `fix stuff` | 1, 3, 4 | `fix(libs-data-access): correct device fetch error` |
| `update console` | 1, 2, 3 | `refactor(web): update console output` |
| `Added new component` | 1, 5 | `feat(libs-card-list): add new component` |
| `WIP` | 1, 2, 3, 4 | コミットを分割し具体的なメッセージにする |
| `feat: Added New Feature.` | 3, 5, 6 | `feat(web): add new feature` |
| `feat(WEB): add component` | 3 | `feat(web): add component` |
| `feat(web)!: change api` | 9 | `feat(web): change api` + footer に `BREAKING CHANGE: ...` |

## 自動検証

ローカル: `.husky/commit-msg` が `pnpm exec commitlint --edit "$1"` を実行する。
CI: `.github/workflows/commitlint.yml` が PR の全コミットを検証する。

## 参照

- [`SKILL.md`](SKILL.md)
- [`examples.md`](examples.md)
- [`scopes.md`](scopes.md)
