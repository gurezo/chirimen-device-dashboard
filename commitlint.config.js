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
        'libs-data-access',
        'libs-ui',
        'libs-state',
        'libs-feature-list',
        'libs-feature-create',
        'libs-feature-edit',
      ],
    ],
  },
};
