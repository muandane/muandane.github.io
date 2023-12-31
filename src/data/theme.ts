import type { TailwindColor } from "@/utils/types/tailwind";

type Theme = {
	colors: {
		primary: TailwindColor;
		blur: {
			top: TailwindColor;
			bottom: TailwindColor;
		};
	};
};

const theme: Theme = {
	colors: {
		primary: "emerald",
		blur: {
			top: "amber",
			bottom: "cyan",
		},
	},
};

export default theme;
