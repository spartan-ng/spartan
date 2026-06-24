import { DEFAULT_CONFIG, decodePreset, isPresetCode, type DesignSystemConfig } from '@spartan-ng/registry';
import { defineEventHandler, getQuery } from 'h3';

export default defineEventHandler((event) => {
	const query = getQuery(event);
	const presetCode = query.preset as string | undefined;

	let config: DesignSystemConfig = DEFAULT_CONFIG;
	if (presetCode) {
		const decoded = decodePreset(presetCode);
		if (decoded) {
			config = { ...DEFAULT_CONFIG, ...decoded };
		}
	}

	const validPresetCode = presetCode && isPresetCode(presetCode) ? presetCode : null;

	return {
		name: `${config.style}-${config.baseColor}`,
		type: 'registry:base',
		config: {
			style: config.style,
			baseColor: config.baseColor,
			theme: config.theme,
			chartColor: config.chartColor,
			font: config.font,
			fontHeading: config.fontHeading,
			radius: config.radius,
			iconLibrary: config.iconLibrary,
			menuAccent: config.menuAccent,
			menuColor: config.menuColor,
			tailwind: {
				baseColor: config.baseColor,
			},
		},
		cssVars: {
			light: {
				background: 'oklch(1 0 0)',
				foreground: 'oklch(0.145 0 0)',
				primary: 'oklch(0.205 0 0)',
				'primary-foreground': 'oklch(0.985 0 0)',
				secondary: 'oklch(0.97 0 0)',
				'secondary-foreground': 'oklch(0.205 0 0)',
				muted: 'oklch(0.97 0 0)',
				'muted-foreground': 'oklch(0.556 0 0)',
				accent: 'oklch(0.97 0 0)',
				'accent-foreground': 'oklch(0.205 0 0)',
				border: 'oklch(0.922 0 0)',
				input: 'oklch(0.922 0 0)',
				ring: 'oklch(0.708 0 0)',
				radius: '0.625rem',
			},
			dark: {
				background: 'oklch(0.145 0 0)',
				foreground: 'oklch(0.985 0 0)',
				primary: 'oklch(0.87 0 0)',
				'primary-foreground': 'oklch(0.205 0 0)',
				secondary: 'oklch(0.269 0 0)',
				'secondary-foreground': 'oklch(0.985 0 0)',
				muted: 'oklch(0.269 0 0)',
				'muted-foreground': 'oklch(0.708 0 0)',
				accent: 'oklch(0.371 0 0)',
				'accent-foreground': 'oklch(0.985 0 0)',
				border: 'oklch(1 0 0 / 10%)',
				input: 'oklch(1 0 0 / 15%)',
				ring: 'oklch(0.556 0 0)',
			},
		},
		dependencies: ['class-variance-authority', 'clsx', 'tailwind-merge', 'tw-animate-css'],
		docs: `To use this preset, run:\n\nnpx spartan init --preset ${validPresetCode ?? 'b0'}\n\nOr apply to an existing project:\n\nnpx spartan apply --preset ${validPresetCode ?? 'b0'}`,
	};
});
