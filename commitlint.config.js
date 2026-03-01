module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      [
        'web',
        'web-e2e',
        'shared-types',
        'workspace',
        'libs-data-access',
        'libs-state',
        'libs-feature-list',
        'libs-card-list',
        'libs-device-detail',
        'sync-devices',
        'ci',
        'mcp',
      ],
    ],
  },
};
