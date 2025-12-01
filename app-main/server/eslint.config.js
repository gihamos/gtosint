import pluginJs from '@eslint/js';
import importPlugin from 'eslint-plugin-import';

/** @type {import('eslint').Linter.Config[]} */
export default [
  pluginJs.configs.recommended,
  {
    plugins: {
      import: importPlugin
    },
    languageOptions: {
      ecmaVersion: 'latest', // Utiliser la dernière version ECMAScript
      sourceType: 'module', // Support des modules ES
      globals: {
        process: 'readonly' // Déclare `process` comme une variable globale en lecture seule
      }
    },
    rules: {
      'quotes': ['error', 'single'], // Imposer des guillemets simples
      'semi': ['error', 'always'], // Imposer un point-virgule en fin de ligne
      'indent': ['error', 2], // Imposer une indentation de 2 espaces
      'no-unused-vars': 'warn', // Avertir si une variable n'est pas utilisée
      'eqeqeq': ['error', 'always'], // Obliger l'utilisation de === et !== au lieu de == et !=
      'curly': ['error', 'all'], // Exiger des accolades autour des blocs if/else/loops
      'no-trailing-spaces': ['error'], // Interdit les espaces en fin de ligne
      'no-multiple-empty-lines': ['error', { max: 2, maxBOF: 0, maxEOF: 0 }],
      'eol-last': ['error', 'never'], // Pas de saut de ligne final
      'padding-line-between-statements': [
        'error',
        { blankLine: 'never', prev: 'import', next: 'import' }, // Pas de ligne vide entre les imports
        { blankLine: 'always', prev: 'import', next: 'expression' }, // Une ligne vide après imports avant le code exécuté
        { blankLine: 'always', prev: 'import', next: 'function' }, // Une ligne vide après imports avant une fonction
        { blankLine: 'always', prev: 'import', next: 'class' } // Une ligne vide après imports avant une classe
      ],
      'import/first': 'error',
      'arrow-spacing': ['error', { before: true, after: true }]
    }
  }
];