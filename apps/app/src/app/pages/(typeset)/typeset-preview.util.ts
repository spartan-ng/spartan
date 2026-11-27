import { TYPESET_FIXTURES } from './typeset-fixtures';
import { findTypesetFont, typesetFontFamily } from './typeset-fonts';
import {
	TYPESET_CONTENT_OPTIONS,
	TYPESET_DEFAULT_STATE,
	TYPESET_FLOWS,
	TYPESET_LEADINGS,
	TYPESET_MEASURES,
	TYPESET_SIZES,
	type TypesetState,
} from './typeset.types';

type ParamReader = { get(name: string): string | null };

function isValidFont(value: string | null): boolean {
	return !!findTypesetFont(value);
}

/**
 * Reads a typeset preset from a query string. Invalid or missing values fall back
 * to the same defaults the builder uses, so the builder and the standalone
 * preview render identical output for the same URL.
 *
 * `itemOverride` comes from the preview's path (`/preview/typeset/chat`) and wins
 * over an `item` query param.
 */
export function parseTypesetState(params: ParamReader | null | undefined, itemOverride?: string): TypesetState {
	const get = (name: keyof TypesetState) => params?.get(name) ?? null;

	const body = isValidFont(get('body')) ? get('body')! : TYPESET_DEFAULT_STATE.body;
	const mono = isValidFont(get('mono')) ? get('mono')! : TYPESET_DEFAULT_STATE.mono;

	const headingParam = get('heading');
	const heading =
		headingParam === 'inherit' || isValidFont(headingParam) ? headingParam! : TYPESET_DEFAULT_STATE.heading;

	const scale = TYPESET_SIZES.some((option) => option.value === get('scale'))
		? get('scale')!
		: TYPESET_DEFAULT_STATE.scale;
	const measure = TYPESET_MEASURES.some((option) => option.value === get('measure'))
		? get('measure')!
		: TYPESET_DEFAULT_STATE.measure;
	const flow = TYPESET_FLOWS.some((option) => option.value === get('flow')) ? get('flow')! : TYPESET_DEFAULT_STATE.flow;
	const leading = TYPESET_LEADINGS.some((option) => option.value === get('leading'))
		? get('leading')!
		: TYPESET_DEFAULT_STATE.leading;

	const itemParam = itemOverride ?? get('item');
	const item = TYPESET_CONTENT_OPTIONS.some((option) => option.value === itemParam)
		? itemParam!
		: TYPESET_DEFAULT_STATE.item;

	return { body, heading, mono, scale, measure, flow, leading, item };
}

/** CSS variables that turn a `typeset` container into the picked preset. */
export function typesetPreviewStyles(state: TypesetState): Record<string, string> {
	const heading = state.heading === 'inherit' ? state.body : state.heading;
	return {
		'--typeset-font-body': typesetFontFamily(state.body),
		'--typeset-font-heading': typesetFontFamily(heading),
		'--typeset-font-mono': typesetFontFamily(state.mono),
		'--typeset-size': `${state.scale}px`,
		'--typeset-leading': state.leading,
		'--typeset-flow': state.flow,
		// Match the generated `max-w-[<measure>]` class: the width belongs to the
		// typeset container, so it tracks the selected font size.
		'max-width': typesetMeasureWidth(state),
	};
}

/** The measure's `em` width used as the content wrapper's max-width. */
export function typesetMeasureWidth(state: TypesetState): string {
	return TYPESET_MEASURES.find((option) => option.value === state.measure)?.width ?? TYPESET_MEASURES[2].width;
}

export function typesetFixtureHtml(item: string): string {
	return TYPESET_FIXTURES[item] ?? TYPESET_FIXTURES['docs'];
}
