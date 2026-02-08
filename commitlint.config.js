module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      [
        'web',
        'api',
        'api-e2e',
        'web-e2e',
        'shared-types',
        'functions',
        'workspace',
        'devices-data-access',
        'devices-ui',
        'devices-state',
        'devices-feature-list',
        'devices-feature-create',
        'devices-feature-edit',
      ],
    ],
  },
};
