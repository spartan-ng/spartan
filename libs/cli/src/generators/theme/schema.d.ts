import type { ThemeName } from './libs/colors';

export interface HlmThemeGeneratorSchema {
	/** The application to add the theme to. Prompted for when omitted (interactive mode). */
	project?: string;
	/** The theme to apply. Passing this opts the generator into non-interactive mode. */
	theme?: ThemeName;
	/** Path to the styles entry point relative to the workspace root. Auto-detected when omitted. */
	stylesEntryPoint?: string;
	/** Prefix class name applied to the theme's styles, e.g. theme-zinc. Empty means a global theme. */
	prefix?: string;
	/** Skip the Tailwind v3 compatibility warning. Defaults to true when a theme is supplied. */
	acceptTailwindV3?: boolean;
	/**
	 * Whether to also wire up the Tailwind CSS imports. Defaults to true. Internal only: set by the `init`
	 * generator, so it is intentionally not exposed as a flag in schema.json.
	 */
	setupTailwindCss?: boolean;
}
