// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = tseslint.config(
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],

      '@typescript-eslint/no-explicit-any': 'off',

      quotes: ['error', 'single'], // Imposer les guillemets simples
      semi: ['error', 'always'], // Imposer le point-virgule
      indent: ['error', 2], // Indentation de 2 espaces
      'no-trailing-spaces': ['error'], // Interdire les espaces en fin de ligne
      'eol-last': ['error', 'never'], // Interdire les sauts de ligne en fin de fichier

      'padding-line-between-statements': [
        'error',
        { blankLine: 'never', prev: 'import', next: 'import' }, // Pas de ligne vide entre les imports
        { blankLine: 'always', prev: 'import', next: 'expression' }, // Une ligne vide après imports avant le code exécuté
        { blankLine: 'always', prev: 'import', next: 'function' }, // Une ligne vide après imports avant une fonction
        { blankLine: 'always', prev: 'import', next: 'class' }, // Une ligne vide après imports avant une classe
      ],

      'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 0 }], // Max 2 lignes vides, 0 en fin de fichier
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {},
  },
);
