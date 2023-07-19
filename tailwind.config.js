export default {
    plugins: [
        require('flowbite/plugin'),
        require('@tailwindcss/typography'),
    ],
    content: [
        "./node_modules/flowbite/**/*.{js,ts}"
    ],
    theme: {
        extend: {
            typography: {
                DEFAULT: {
                  css: {
                    maxWidth: '75%',
                  }
                }
            },
            colors: {
                midnightBlue: "#1c2836",
                navyBlue: "#212f40",
                slateBlue: "#2f435b",
                lightBlue: "#9bacc4",
                lightOrange: "#f7961c"
            },
            container: {
                center: true,
                screens: {
                    sm: '576px',
                    md: '768px',
                    lg: '992px',
                    xl: '1140px',
                },
            },
            fontSize: {
                base: '1.1rem',
            }
        }
    }
}
