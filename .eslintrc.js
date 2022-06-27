module.exports = {
    root: true,
    env: {
        es2021: true,
        node: true,
        browser: true
    },
    extends: [
        'standard'
    ],
    plugins: [
        'simple-import-sort', 'unused-imports'
    ],
    parserOptions: {
        ecmaVersion: 2020
    },
    ignorePatterns: [
        '**/node_modules',
        '**/dist',
        '**/lib',
        '**/.*/**/*'
    ],
    rules: {
        'no-void': ['error', { allowAsStatement: true }],
        'indent': ['error', 4],
        'quotes': ['error', 'single', { allowTemplateLiterals: true }],
        'quote-props': ['error', 'consistent'],
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'simple-import-sort/imports': [
            'error',
            {
                groups: [['^\\w'], ['^@\\w'], ['^', '^\\.'], ['^\\u0000']]
            }
        ],
        'simple-import-sort/exports': ['error'],
        'unused-imports/no-unused-imports': 'error',
        'import/newline-after-import': ['error', { count: 1 }]
    },
    overrides: [
        {
            files: ['*.ts'],
            env: {
                node: true
            },
            extends: [
                'standard-with-typescript'
            ],
            parser: '@typescript-eslint/parser',
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                },
                extraFileExtensions: ['.vue'],
                ecmaVersion: 2020,
                sourceType: 'module',
                tsconfigRootDir: __dirname,
                project: [
                    './tsconfig.json'
                ]
            },
            plugins: [
                '@typescript-eslint'
            ],
            rules: {
                '@typescript-eslint/indent': ['error', 4],
                'no-redeclare': 'off',
                'no-undef': 'off',
                'no-useless-constructor': 'off',
                'quote-props': ['error', 'consistent'],
                '@typescript-eslint/array-type': ['error', { default: 'generic', readonly: 'generic' }],
                'camelcase': ['off']
            }
        }
    ]
}
