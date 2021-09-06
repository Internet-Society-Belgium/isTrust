module.exports = {
    purge: ['./src/**/*.{vue,js,ts,jsx,tsx}'],
    darkMode: false,
    theme: {
        colors: {
            primary: '#0072f2',
            secondary: '#191b1f',
            'neutral-text': '#89939b',
            container: '#ffffff',
            background: '#f2f4f5',
            loading: '#89939b',
        },
        fontFamily: {
            sans: ['Rubik', 'sans-serif'],
        },
        extend: {
            minWidth: {
                40: '10rem',
            },
        },
    },
}
