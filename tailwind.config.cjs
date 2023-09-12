/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	plugins: [
        require('@tailwindcss/typography'),
    ],
    theme: {
        extend: {
            colors: {
                midnightBlue: "#1c2836",
                navyBlue: "#212f40",
                slateBlue: "#2f435b",
                lightBlue: "#9bacc4",
                lightOrange: "#f7961c",
                faintBlue: "#2a3c51"
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