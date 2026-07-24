// All credit goes to the incredible folks at Nx who use this code to update the app styles when adding tailwind
// Check out the code here: https://github.com/nrwl/nx/blob/master/packages/angular/src/generators/setup-tailwind/lib/update-application-styles.ts

import { joinPathFragments, type ProjectConfiguration, stripIndents, type Tree } from '@nx/devkit';
import { type ThemeName, themes } from './colors';

export interface AddThemeToApplicationStylesOptions {
	project: string;
	theme: ThemeName;
	stylesEntryPoint?: string;
	prefix?: string;
	setupTailwindCss?: boolean;
}

export async function addThemeToApplicationStyles(
	tree: Tree,
	options: AddThemeToApplicationStylesOptions,
	project: ProjectConfiguration,
): Promise<void> {
	const spartantTailwindPresetImport = '@import "@spartan-ng/brain/hlm-tailwind-preset.css";';

	const prefix = options.prefix ? ` .${options.prefix}` : '';
	let stylesEntryPoint = options.stylesEntryPoint;

	if (stylesEntryPoint && !tree.exists(stylesEntryPoint)) {
		throw new Error(`The provided styles entry point "${stylesEntryPoint}" could not be found.`);
	}

	if (!stylesEntryPoint) {
		stylesEntryPoint = findStylesEntryPoint(tree, project);

		if (!stylesEntryPoint) {
			throw new Error(
				stripIndents`Could not find a styles entry point for project "${options.project}".
        Please specify a styles entry point using the "stylesEntryPoint" option.`,
			);
		}
	}

	const stylesEntryPointContent = tree.read(stylesEntryPoint, 'utf-8') ?? '';

	const twSetup = options.setupTailwindCss
		? `@layer theme, base, components, utilities;
@import 'tailwindcss/theme.css' layer(theme);
@import 'tailwindcss/preflight.css' layer(base);
@import 'tailwindcss/utilities.css';
		`
		: '';

	const fontSans = stylesEntryPointContent.includes('--font-sans')
		? ''
		: `--font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";`;

	const colorScheme = themes[options.theme];

	// The preset is added through an `@import`, which is only valid before any non-`@import` rule.
	// Slot it in right after the stylesheet's existing leading imports (such as the app's own
	// `@import "tailwindcss"`) so it stays valid CSS and Tailwind is still imported first.
	const { leadingImports, body: stylesBody } = splitLeadingImports(stylesEntryPointContent);
	const styleHeader = [twSetup, leadingImports, spartantTailwindPresetImport, stylesBody]
		.filter((part) => part.trim() !== '')
		.join('\n');

	let stylesCssContentWithPotentialTailwindCssImport = stripIndents`
		${styleHeader}

		:root${prefix} {
			color-scheme: light;

			${fontSans}

			${Object.entries(colorScheme.light)
				.map(([key, value]) => `--${key}: ${value};`)
				.join('\n')}
		}

		:root.dark${prefix} {
			color-scheme: dark;

			${Object.entries(colorScheme.dark)
				.map(([key, value]) => `--${key}: ${value};`)
				.join('\n')}
		}

    @layer base {
      * {
    		@apply border-border outline-ring/50;
 			}
  		body {
  		  @apply bg-background text-foreground;
  		}
    }`;

	if (options.setupTailwindCss) {
		stylesCssContentWithPotentialTailwindCssImport = stylesCssContentWithPotentialTailwindCssImport.replace(
			/^\s*@import\s+['"]tailwindcss['"]\s*;\s*$/gm,
			'',
		);
	}

	tree.write(stylesEntryPoint, stylesCssContentWithPotentialTailwindCssImport);
}

/**
 * Split a stylesheet into its leading import block and the remaining rules. `@charset`, `@import`
 * and `@layer ...;` statements (plus blank lines) may legally appear at the top of a stylesheet, so
 * the spartan preset `@import` can be inserted right after them: still valid CSS (an `@import` after
 * a normal rule is ignored) while leaving any existing `@import "tailwindcss"` first.
 */
function splitLeadingImports(content: string): { leadingImports: string; body: string } {
	const lines = content.split('\n');
	let boundary = 0;
	for (const line of lines) {
		const trimmed = line.trim();
		const isLeading =
			trimmed === '' ||
			trimmed.startsWith('@charset') ||
			trimmed.startsWith('@import') ||
			/^@layer\b[^{]*;$/.test(trimmed);
		if (!isLeading) break;
		boundary++;
	}
	return {
		leadingImports: lines.slice(0, boundary).join('\n'),
		body: lines.slice(boundary).join('\n'),
	};
}

function findStylesEntryPoint(tree: Tree, project: ProjectConfiguration): string | undefined {
	// first check for common names
	const possibleStylesEntryPoints = [
		joinPathFragments(project.sourceRoot ?? project.root, 'styles.css'),
		joinPathFragments(project.sourceRoot ?? project.root, 'styles.scss'),
		joinPathFragments(project.sourceRoot ?? project.root, 'styles.sass'),
		joinPathFragments(project.sourceRoot ?? project.root, 'styles.less'),
	];

	const stylesEntryPoint = possibleStylesEntryPoints.find((s) => tree.exists(s));
	if (stylesEntryPoint) {
		return stylesEntryPoint;
	}

	// then check for the specified styles in the build configuration if it exists
	const styles: Array<string | { input: string; inject: boolean }> = project.targets?.build.options?.styles;

	if (!styles) {
		return undefined;
	}

	// find the first style that belongs to the project source
	const style = styles.find((s) =>
		typeof s === 'string'
			? s.startsWith(project.root) && tree.exists(s)
			: s.input.startsWith(project.root) && s.inject !== false && tree.exists(s.input),
	);

	if (!style) {
		return undefined;
	}

	return typeof style === 'string' ? style : style.input;
}
