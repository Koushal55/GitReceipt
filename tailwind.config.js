/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                mono: ['"Space Mono"', 'monospace'],
                receipt: ['"VT323"', 'monospace'],
            },
            colors: {
                paper: '#f0f0f0',
                ink: '#1a1a1a',
            },
            animation: {
                'print': 'print 2s ease-out forwards',
            },
            keyframes: {
                print: {
                    '0%': { transform: 'translateY(-100%)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                }
            }
        },
    },
    plugins: [],
}
