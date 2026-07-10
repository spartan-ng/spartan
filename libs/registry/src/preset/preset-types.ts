import { type BaseColor } from '../styles/base-colors';
import { type Style } from '../styles/style';

export const THEMES = [
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
export type ThemeName = (typeof THEMES)[number];

export const BASE_THEMES = ['neutral', 'stone', 'zinc', 'gray', 'slate'] as const;
export type BaseThemeName = (typeof BASE_THEMES)[number];

export const COLOR_THEMES = [
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
export type ColorThemeName = (typeof COLOR_THEMES)[number];

export function getThemesForBaseColor(_baseColor: string): ThemeName[] {
	return [...BASE_THEMES, ...COLOR_THEMES] as ThemeName[];
}

export const ICON_LIBRARIES = ['lucide', 'radix', 'phosphor', 'tabler', 'hugeicons'] as const;
export type IconLibrary = (typeof ICON_LIBRARIES)[number];

export const FONTS = [
	'inter',
	'geist',
	'figtree',
	'jetbrains-mono',
	'noto-sans',
	'playfair-display',
	'roboto',
	'space-grotesk',
] as const;
export type FontValue = (typeof FONTS)[number];

export const FONT_DEFINITIONS: {
	value: FontValue;
	label: string;
	type: 'sans' | 'serif' | 'mono';
	fontFamily: string;
}[] = [
	{ value: 'inter', label: 'Inter', type: 'sans', fontFamily: '"Inter", sans-serif' },
	{ value: 'geist', label: 'Geist', type: 'sans', fontFamily: '"Geist", sans-serif' },
	{ value: 'figtree', label: 'Figtree', type: 'sans', fontFamily: '"Figtree", sans-serif' },
	{ value: 'jetbrains-mono', label: 'JetBrains Mono', type: 'mono', fontFamily: '"JetBrains Mono", monospace' },
	{ value: 'noto-sans', label: 'Noto Sans', type: 'sans', fontFamily: '"Noto Sans", sans-serif' },
	{ value: 'playfair-display', label: 'Playfair Display', type: 'serif', fontFamily: '"Playfair Display", serif' },
	{ value: 'roboto', label: 'Roboto', type: 'sans', fontFamily: '"Roboto", sans-serif' },
	{ value: 'space-grotesk', label: 'Space Grotesk', type: 'sans', fontFamily: '"Space Grotesk", sans-serif' },
];

export const MENU_ACCENTS = ['subtle', 'bold'] as const;
export type MenuAccent = (typeof MENU_ACCENTS)[number];

export const MENU_COLORS = ['default', 'inverted'] as const;
export type MenuColor = (typeof MENU_COLORS)[number];

export const RADII = [
	{ name: 'default', label: 'Default', value: '0.625rem' },
	{ name: 'none', label: 'None', value: '0' },
	{ name: 'small', label: 'Small', value: '0.45rem' },
	{ name: 'medium', label: 'Medium', value: '0.625rem' },
	{ name: 'large', label: 'Large', value: '0.875rem' },
] as const;
export type RadiusName = (typeof RADII)[number]['name'];

export const CHAR_THEMES = THEMES;

export interface DesignSystemConfig {
	style: Style;
	baseColor: BaseColor;
	theme: ThemeName;
	chartColor: ThemeName;
	iconLibrary: IconLibrary;
	font: FontValue;
	fontHeading: FontValue | 'inherit';
	radius: RadiusName;
	menuAccent: MenuAccent;
	menuColor: MenuColor;
}

export const DEFAULT_CONFIG: DesignSystemConfig = {
	style: 'nova',
	baseColor: 'neutral',
	theme: 'neutral',
	chartColor: 'neutral',
	iconLibrary: 'lucide',
	font: 'inter',
	fontHeading: 'inherit',
	radius: 'default',
	menuAccent: 'subtle',
	menuColor: 'default',
};
