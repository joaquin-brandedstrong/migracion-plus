module.exports = {
  root: true,
  extends: ['next/core-web-vitals', '../../packages/config/eslint.config.js'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};
