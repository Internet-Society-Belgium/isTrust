module.exports = {
    purge: ['./src/**/*.{vue,js,ts,jsx,tsx}'],
    darkMode: 'class',
    theme: {
        colors: {
            primary: '#0077FF', // HSB(210, 100, 100)
            secondary: '#000',
            'dark-secondary': '#f2f4f5',
            container: '#ffffff',
            'dark-container': '#252531',
            'secondary-container': '#E3E4E6', // HSB(210, 1, 90)
            'secondary-dark-container': '#252531',
            background: '#F0F1F2', // HSB(210, 1, 95)
            'dark-background': '#151419',
            ok: '#7ACC29', // HSB(90, 80, 80)
            neutral: '#8A9199', // HSB(210, 10, 60)
            warning: '#FF66B3', // HSB(330, 60, 100)
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
