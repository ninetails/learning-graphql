module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true
  },
  extends: 'standard-with-typescript',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2020,
    project: './tsconfig.json'
  },
  rules: {
    "@typescript-eslint/no-floating-promises": "off",
    "import/no-duplicates": "off"
  },
  overrides: [
    {
      files: ["src/generated/**/*.ts"],
      rules: {
        "@typescript-eslint/no-namespace": "off"
      }
    }
  ]
}
