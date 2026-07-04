# AI エージェント向け設定

このプロジェクトは、Cursor などの AI コーディングエージェントが Angular / Nx Workspace の構造とベストプラクティスを理解できるよう、Skills と Cursor Rules を導入しています。

## Angular Skills

Angular 公式 Skills を `.agents/skills/` 配下に導入しています。

| Skill | 役割 |
| --- | --- |
| `angular-developer` | Angular の一般的な開発知識。Standalone Components、Signals、DI、ルーティング、フォーム、テストなど |
| `angular-new-app` | Angular 新規アプリ作成のガイダンス |

再導入する場合は以下を実行します。

```bash
npx skills add https://github.com/angular/skills
```

## Nx AI Agent 設定

Nx AI Agents により、Nx Workspace 構造を AI に理解させるための Skills、Nx Console MCP 連携、ルート `AGENTS.md`、`.cursor/agents/` 配下のサブエージェント定義を導入しています。

主な Nx 関連 Skills は次の通りです。

| Skill | 役割 |
| --- | --- |
| `nx-workspace` | Nx workspace の構成、project、target、依存関係を調査する |
| `nx-generate` | Nx generator による app / lib / component などの生成を支援する |
| `nx-run-tasks` | build / test / lint / serve など Nx task の実行を支援する |
| `nx-plugins` | Nx plugin の追加・調査を支援する |
| `nx-import` | 他 repository の Nx workspace への import を支援する |

再設定する場合は以下を実行します。

```bash
pnpm nx configure-ai-agents --agents cursor --no-interactive
```

## Cursor Rules

`.cursor/rules/` 配下に責務別の Rules を配置しています。

```text
.cursor/rules/
├── angular/
│   ├── 00-angular-core.mdc
│   ├── 10-angular-signals.mdc
│   ├── 20-angular-components.mdc
│   └── 30-angular-testing.mdc
├── nx/
│   ├── 00-nx-workspace.mdc
│   ├── 10-nx-generators.mdc
│   └── 20-nx-tasks.mdc
├── commits/
│   ├── 40-conventional-commits.mdc
│   ├── 41-pull-request-title.mdc
│   └── 42-chirimen-device-dashboard-scope.mdc
└── workflow/
    └── 90-ai-workflow.mdc
```

各 `.mdc` は `globs` で対象ファイルを限定しています。対象ファイルを Cursor で開くと、関連するルールが自動で参照されます。

## 役割分離

| 種類 | 役割 | 配置 |
| --- | --- | --- |
| Angular Skills | Angular の一般知識 | `.agents/skills/` |
| Nx AI Agent | Nx Workspace 理解 | `.agents/skills/` ほか |
| Cursor Rules | Workspace の設計ルール | `.cursor/rules/` |
| Conventional Commits Rules | commit message / PR title の規約 | `.cursor/rules/commits/` |
| Conventional Commits Skill | AI 向け Conventional Commits 知識 | `.cursor/skills/conventional-commits/` |
| AI Workflow | AI 編集時の共通ルール | `.cursor/rules/workflow/` |

## Conventional Commits

commit message と PR title は [Conventional Commits](https://www.conventionalcommits.org/) に統一しています。

詳細は次のファイルを参照してください。

- [CONTRIBUTING.md](../CONTRIBUTING.md)
- [.cursor/skills/conventional-commits/SKILL.md](../.cursor/skills/conventional-commits/SKILL.md)
- [.cursor/rules/commits/40-conventional-commits.mdc](../.cursor/rules/commits/40-conventional-commits.mdc)
- [.cursor/rules/commits/41-pull-request-title.mdc](../.cursor/rules/commits/41-pull-request-title.mdc)
- [.cursor/rules/commits/42-chirimen-device-dashboard-scope.mdc](../.cursor/rules/commits/42-chirimen-device-dashboard-scope.mdc)

## 将来的な拡張候補

以下は今後、必要に応じて別 issue / PR で導入を検討します。

- NgRx 用 mdc
- Storybook 用 mdc
- CI/CD 用 mdc
- ADR / Architecture 用 mdc
