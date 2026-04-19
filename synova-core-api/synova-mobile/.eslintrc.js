module.exports = function (api) {
  api.cache(true)
  return {
    extends: ['expo', '@react-native-community'],
    plugins: ['@typescript-eslint'],
  }
}
