import type { DesignSystemConfig } from './preset-types';
import { DEFAULT_CONFIG } from './preset-types';

const BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

const STYLE_VALUES = ['nova', 'vega', 'lyra', 'maia', 'mira', 'luma'] as const;
const BASE_COLOR_VALUES = ['neutral', 'stone', 'zinc', 'gray', 'slate'] as const;
const THEME_VALUES = [
	'neutral',
	'stone',
	'zinc',
	'gray',
	'slate',
	'amber',
	'blue',
	'cyan',
	'emerald',
	'fuchsia',
	'green',
	'indigo',
	'lime',
	'orange',
	'pink',
	'purple',
	'red',
	'rose',
	'sky',
	'teal',
	'violet',
	'yellow',
] as const;
const ICON_VALUES = ['lucide', 'radix', 'phosphor', 'tabler', 'hugeicons'] as const;
const FONT_VALUES = [
	'inter',
	'geist',
	'figtree',
	'jetbrains-mono',
	'noto-sans',
	'playfair-display',
	'roboto',
	'space-grotesk',
] as const;
const RADIUS_VALUES = ['default', 'none', 'small', 'medium', 'large'] as const;

function toBase62(n: number): string {
	if (n === 0) return '0';
	let result = '';
	while (n > 0) {
		result = BASE62[n % 62] + result;
		n = Math.floor(n / 62);
	}
	return result;
}

function fromBase62(s: string): number {
	let n = 0;
	for (const c of s) {
		n = n * 62 + BASE62.indexOf(c);
	}
	return n;
}

const PRESET_SENTINEL = 'b';

export function encodePreset(config: Partial<DesignSystemConfig>): string {
	const merged = { ...DEFAULT_CONFIG, ...config };

	const styleIndex = Math.max(0, STYLE_VALUES.indexOf(merged.style as (typeof STYLE_VALUES)[number]));
	const baseColorIndex = Math.max(0, BASE_COLOR_VALUES.indexOf(merged.baseColor as (typeof BASE_COLOR_VALUES)[number]));
	const themeIndex = Math.max(0, THEME_VALUES.indexOf(merged.theme as (typeof THEME_VALUES)[number]));
	const chartColorIndex = Math.max(0, THEME_VALUES.indexOf(merged.chartColor as (typeof THEME_VALUES)[number]));
	const iconLibraryIndex = Math.max(0, ICON_VALUES.indexOf(merged.iconLibrary as (typeof ICON_VALUES)[number]));
	const fontIndex = Math.max(0, FONT_VALUES.indexOf(merged.font as (typeof FONT_VALUES)[number]));
	const fontHeadingIsInherit = merged.fontHeading === 'inherit';
	const fontHeadingIndex = fontHeadingIsInherit
		? 0
		: Math.max(0, FONT_VALUES.indexOf(merged.fontHeading as (typeof FONT_VALUES)[number]));
	const radiusIndex = Math.max(0, RADIUS_VALUES.indexOf(merged.radius as (typeof RADIUS_VALUES)[number]));
	const menuAccentIndex = merged.menuAccent === 'bold' ? 1 : 0;
	const menuColorIndex = merged.menuColor === 'inverted' ? 1 : 0;

	const packed =
		(styleIndex << 0) |
		(baseColorIndex << 3) |
		(themeIndex << 6) |
		(chartColorIndex << 11) |
		(iconLibraryIndex << 16) |
		(fontIndex << 19) |
		((fontHeadingIsInherit ? 0 : 1) << 22) |
		(fontHeadingIndex << 23) |
		(radiusIndex << 26) |
		(menuAccentIndex << 29) |
		(menuColorIndex << 30);

	return PRESET_SENTINEL + toBase62(packed);
}

export function isPresetCode(value: string): boolean {
	return value.startsWith(PRESET_SENTINEL) && value.length > 1;
}

export function decodePreset(code: string): Partial<DesignSystemConfig> | null {
	if (!isPresetCode(code)) return null;

	const packed = fromBase62(code.slice(1));

	const styleIndex = (packed >> 0) & 0b111;
	const baseColorIndex = (packed >> 3) & 0b111;
	const themeIndex = (packed >> 6) & 0b11111;
	const chartColorIndex = (packed >> 11) & 0b11111;
	const iconLibraryIndex = (packed >> 16) & 0b111;
	const fontIndex = (packed >> 19) & 0b111;
	const fontHeadingIsInherit = ((packed >> 22) & 0b1) === 0;
	const fontHeadingIndex = (packed >> 23) & 0b111;
	const radiusIndex = (packed >> 26) & 0b111;
	const menuAccentIndex = (packed >> 29) & 0b1;
	const menuColorIndex = (packed >> 30) & 0b1;

	return {
		style: STYLE_VALUES[styleIndex] ?? DEFAULT_CONFIG.style,
		baseColor: BASE_COLOR_VALUES[baseColorIndex] ?? DEFAULT_CONFIG.baseColor,
		theme: THEME_VALUES[themeIndex] ?? DEFAULT_CONFIG.theme,
		chartColor: THEME_VALUES[chartColorIndex] ?? DEFAULT_CONFIG.chartColor,
		iconLibrary: ICON_VALUES[iconLibraryIndex] ?? DEFAULT_CONFIG.iconLibrary,
		font: FONT_VALUES[fontIndex] ?? DEFAULT_CONFIG.font,
		fontHeading: fontHeadingIsInherit ? ('inherit' as const) : (FONT_VALUES[fontHeadingIndex] ?? DEFAULT_CONFIG.font),
		radius: RADIUS_VALUES[radiusIndex] ?? DEFAULT_CONFIG.radius,
		menuAccent: menuAccentIndex === 1 ? ('bold' as const) : ('subtle' as const),
		menuColor: menuColorIndex === 1 ? ('inverted' as const) : ('default' as const),
	};
}
