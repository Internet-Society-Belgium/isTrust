module.exports = {
    trailingComma: 'es5',
    tabWidth: 4,
    semi: false,
    singleQuote: true,
    vueIndentScriptAndStyle: true,
    importOrder: [
        '^[^\\.](.*)$',
        '^[\\.\\/]*\\/types\\/(.*)$',
        '^[\\.\\/]*\\/utils\\/(.*)$',
        '^[\\.\\/]*\\/views\\/(.*)$',
        '^[\\.\\/]',
    ],
    importOrderSeparation: true,
}
