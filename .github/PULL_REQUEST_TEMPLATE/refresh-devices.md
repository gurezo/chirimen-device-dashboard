> PR タイトルは Conventional Commits に準拠してください。
> 例: `chore(sync-devices): refresh devices data`

## Summary

最新の `partslist.csv` と upstream example 同期結果に基づき、デバイス情報の更新候補を作成しました。

## Type of change

- [ ] Bug fix
- [ ] New feature
- [ ] Refactor
- [ ] Documentation
- [x] Chore (build/test/ci)
- [ ] Breaking change

## Related issues

- Part of #

## What changed?

- `apps/web/public/devices.json`
- `data/platform-examples/**`
- `generated/reports/**`

## Review points

- [ ] `platform-examples.generated.json` と正本 `platform-examples.json` の差分を確認した
- [ ] 正本 `platform-examples.json` への手動マージ要否を確認した
- [ ] `devices.json` の追加・削除・`product.example` 洗い替え結果を確認した
- [ ] validation レポートに issue / warning がないか確認した

## API / Compatibility

- [ ] Public API changes (export / function signature / behavior)
  - Details:
- [x] This change is backward compatible
- [ ] This change introduces a breaking change
  - Migration notes:

## How to test

1. `generated/reports/**` の内容が妥当であることを確認
2. `apps/web/public/devices.json` の差分が期待どおりであることを確認
3. デバイス一覧が正しく表示されることを確認

## Environment (if relevant)

- Browser:
- OS:
- Node version:
- pnpm version:

## Checklist

- [ ] I ran tests locally (if available)
- [ ] I updated docs/README if needed
- [ ] I considered error handling where relevant
