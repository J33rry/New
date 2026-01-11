// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all files that contain Nativewind classes.
    content: [
        "./app/index.jsx",
        "./app/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
        "./screens/**/*.{js,jsx,ts,tsx}",
    ],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                dark: {
                    primary: "#0F172A",
                    surface: "#1E293B",
                    text_main: "#F1F5F9",
                    text_sub: "#94A3B8",
                    brand_primary: "#818CF8",
                    border_color: "#334155",
                },
                light: {
                    primary: "#F8FAFC",
                    surface: "#FFFFFF",
                    text_main: "#0F172A",
                    text_sub: "#64748B",
                    brand_primary: "#4F46E5",
                    border_color: "#E2E8F0",
                },
            },
        },
    },
    plugins: [],
};
