export type TypesetFontType = 'sans' | 'serif' | 'mono';

export interface TypesetFont {
	/** Stable id used in the URL and the CSS variable name (`--font-<id>`). */
	id: string;
	label: string;
	type: TypesetFontType;
	/** Family used by the live preview. Google Fonts are injected on demand. */
	previewFamily: string;
	/** Family registered by the fontsource package in the generated setup. */
	cssFamily: string;
	/** Google Fonts family name, or null when the font is already bundled with the docs. */
	googleFamily: string | null;
	/** Package recommended in the generated font setup. */
	dependency: string;
}

export interface TypesetOption<T extends string = string> {
	value: T;
	label: string;
}

export const TYPESET_SIZES: readonly TypesetOption[] = [
	{ value: '14', label: '14px' },
	{ value: '15', label: '15px' },
	{ value: '16', label: '16px' },
	{ value: '18', label: '18px' },
];

export const TYPESET_LEADINGS: readonly TypesetOption[] = [
	{ value: '1.6', label: 'Tight (1.6)' },
	{ value: '1.75', label: 'Regular (1.75)' },
	{ value: '1.9', label: 'Loose (1.9)' },
];

export const TYPESET_FLOWS: readonly TypesetOption[] = [
	{ value: '1em', label: 'Compact (1em)' },
	{ value: '1.25em', label: 'Regular (1.25em)' },
	{ value: '2em', label: 'Airy (2em)' },
];

export const TYPESET_MEASURES: readonly (TypesetOption & { width: string })[] = [
	{ value: '60', label: '60ch', width: '28em' },
	{ value: '70', label: '70ch', width: '33em' },
	{ value: '80', label: '80ch', width: '37em' },
	{ value: '90', label: '90ch', width: '42em' },
];

export const TYPESET_CONTENT_OPTIONS: readonly TypesetOption[] = [
	{ value: 'docs', label: 'Docs' },
	{ value: 'chat', label: 'Chat' },
	{ value: 'article', label: 'Article' },
	{ value: 'changelog', label: 'Changelog' },
	{ value: 'notes', label: 'Notes' },
];

/** Preset controls that can be locked against shuffle. The specimen (`item`) is not lockable. */
export type TypesetLockableParam = Exclude<keyof TypesetState, 'item'>;

export interface TypesetState {
	body: string;
	heading: string;
	mono: string;
	scale: string;
	measure: string;
	flow: string;
	leading: string;
	item: string;
}

export const TYPESET_DEFAULT_STATE: TypesetState = {
	body: 'geist',
	heading: 'inherit',
	mono: 'geist-mono',
	scale: '15',
	measure: '80',
	flow: '1.25em',
	leading: '1.75',
	item: 'docs',
};
