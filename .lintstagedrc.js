module.exports = {
    'src/**/*.{ts,vue}': [
        'git stash -k',
        'eslint --fix',
        'prettier -w',
        'git stash pop',
    ],
}
