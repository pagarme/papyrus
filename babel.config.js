module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: '8'
        }
      }
    ],
    '@babel/preset-typescript'
  ],
  plugins: [
    ['module-resolver', {
      alias: {
        '@escriba/integrations': './src/integrations',
        '@escriba/utils': './src/utils'
      }
    }]
  ],
  ignore: [
    'test/**/*.spec.ts'
  ]
}
