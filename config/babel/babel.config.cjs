module.exports = {
  presets: [
    '@babel/preset-typescript',
    ['@babel/preset-env', { modules: false }],
    '@babel/preset-react',
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    ["transform-object-rest-spread", { "useBuiltIns": true }],
    '@babel/plugin-proposal-class-properties',
  ],
}
