module.exports = {
    purge: ['./src/**/*.{vue,js,ts,jsx,tsx}'],
    darkMode: 'class',
    theme: {
        colors: {
            primary: '#0072f2',
            secondary: '#000',
            'dark-secondary': '#f2f4f5',
            container: '#ffffff',
            'dark-container': '#252531',
            background: '#f2f4f5',
            'dark-background': '#151419',
            ok: '#7cb72e',
            neutral: '#89939b',
            warning: '#f463a4',
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
