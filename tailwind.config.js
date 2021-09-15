module.exports = {
    purge: ['./src/**/*.{vue,js,ts,jsx,tsx}'],
    darkMode: 'class',
    theme: {
        colors: {
            primary: '#0077FF', // HSB(210, 100, 100)
            secondary: '#19191A', // HSB(210, 2, 10)
            'dark-secondary': '#EDF0F2', // HSB(210, 2, 95)
            container: '#FAFCFF', // HSB(210, 2, 100)
            'dark-container': '#292E33', // HSB(210, 20, 20)
            'secondary-container': '#E1E3E6', // HSB(210, 2, 90)
            'secondary-dark-container': '#3D454D', // HSB(210, 20, 30)
            background: '#EDF0F2', // HSB(210, 2, 95)
            'dark-background': '#14171A', // HSB(210, 20, 10)
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
