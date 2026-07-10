import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

// Les regles react-hooks v7 (issues du compilateur React) sont tres strictes :
// on les garde visibles mais en avertissement, pas en erreur bloquante
const reglesHooksEnWarn = Object.fromEntries(
  Object.keys(reactHooks.configs.recommended.rules).map((regle) => [regle, 'warn']),
)

// Config ESLint (flat config) pour le front Lokaly : TypeScript + React
export default tseslint.config(
  // dossiers generes ou externes, pas la peine de les linter
  { ignores: ['build', 'dist', 'node_modules', 'docs'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reglesHooksEnWarn,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // le code existant utilise pas mal de "any" (retours API pas encore types)
      // on garde un avertissement plutot qu'une erreur bloquante
      '@typescript-eslint/no-explicit-any': 'warn',
      // autorise les variables volontairement inutilisees prefixees par _
      '@typescript-eslint/no-unused-vars': [
        'error',
        { varsIgnorePattern: '^_', argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
    },
  },
)
