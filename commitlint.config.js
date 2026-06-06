module.exports = {
  extends: ['@commitlint/config-angular'],
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
        'sync-example-upstreams',
        'generate-platform-examples',
        'validate-platform-examples',
        'ci',
        'mcp',
      ],
    ],
  },
};
