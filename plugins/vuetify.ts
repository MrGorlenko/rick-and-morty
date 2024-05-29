import "vuetify/styles";
import { createVuetify } from "vuetify";

export default defineNuxtPlugin((app) => {
	const vuetify = createVuetify({
		theme: {
			themes: {
				light: {
					dark: false,
					colors: {
						grey: "rgb(32, 35, 41)",
						"light-grey": "rgb(60, 62, 68)",
						"lighten-grey": "rgb(158, 158, 158)",
					},
				},
			},
		},
	});
	app.vueApp.use(vuetify);
});
