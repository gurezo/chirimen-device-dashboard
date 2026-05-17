# Examples

chirimen-device-dashboard における Conventional Commits の良い例と悪い例。

## 良い例

### feat

```
feat(libs-card-list): add device card list component
feat(libs-feature-list): add device filter ui
feat(web): add device detail route
feat(libs-state): add device list store
```

### fix

```
fix(libs-data-access): correct device repository fetch error
fix(libs-card-list): correct empty state rendering
fix(web): correct device list display
```

### refactor

```
refactor(libs-feature-list): simplify device list rendering
refactor(libs-state): extract device selectors
refactor(libs-card-list): update device card list ui
```

### docs

```
docs(workspace): update readme quick start
docs(workspace): document cursor skills and rules
docs(libs-device-detail): add component readme
```

### test

```
test(web): add device list smoke test
test(libs-data-access): add device repository unit tests
```

### ci

```
ci(workspace): add commitlint workflow
ci(workspace): update github actions workflow
```

### build

```
build(workspace): add commitlint and husky
build(workspace): bump nx to 22.7.1
build(sync-devices): update devices.json from partslist.csv
```

### chore

```
chore(workspace): remove unused script
```

### breaking change

```
feat(libs-state): change device list store api

BREAKING CHANGE: DeviceListStore.load() の戻り値が Observable から Signal に変更されました
```

## 悪い例

| メッセージ | 理由 |
| --- | --- |
| `update files` | type / scope が無く、内容も曖昧 |
| `fix issue` | scope が無く、内容も曖昧 |
| `WIP` | 完成していない作業を表す不適切なメッセージ |
| `Added new component` | type が無く、命令形でなく、大文字始まり |
| `feat: Added New Feature.` | summary が大文字始まりで末尾にピリオド |
| `feat(WEB): add component` | scope が大文字 |
| `Refactor(web): simplify` | type が大文字 |
| `fix(libs-web): handle error` | 存在しない scope を使用 |
| `feat(web)!: change api` | `!` 表記は使わず footer に `BREAKING CHANGE:` を書く |

## 参照

- [`SKILL.md`](SKILL.md)
- [`assertions.md`](assertions.md)
- [`scopes.md`](scopes.md)
