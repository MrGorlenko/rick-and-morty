/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./components/**/*.{js,vue,ts}",
		"./views/**/*.{js,vue,ts}",
		"./layouts/**/*.vue",
		"./pages/**/*.vue",
	],

	theme: {
		extend: {
			colors: {
				gray: "rgb(32, 35, 41)",
				"light-gray": "rgb(60, 62, 68)",
				"lighten-gray": "rgb(158, 158, 158)",
			},
		},
	},
	plugins: [],
};
