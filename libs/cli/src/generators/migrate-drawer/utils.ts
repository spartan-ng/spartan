import type { Tree } from '@nx/devkit';
import { visitFiles } from '../../utils/visit-files';
import { attributeName, findTagEnd, parseAttributes, type ParsedAttribute } from '../migrate-input-otp/utils';

const SWIPE_DIRECTIONS: Record<string, string> = { top: 'up', bottom: 'down', left: 'left', right: 'right' };
const DRAWER_TAGS = new Set(['hlm-drawer', 'brn-drawer']);
const TRIGGER_ATTRIBUTES = new Set(['hlmDrawerTrigger', 'brnDrawerTrigger']);
const VOID_TAGS = new Set([
	'area',
	'base',
	'br',
	'col',
	'embed',
	'hr',
	'img',
	'input',
	'link',
	'meta',
	'source',
	'track',
	'wbr',
]);

/** APIs of the vaul based drawer that have no automatic replacement. */
const LEGACY_DRAWER_APIS =
	/\b(?:BrnDrawerHandle|brnDrawerHandle|BrnDrawerOverlay|brnDrawerOverlay|HlmDrawerHandle|hlmDrawerHandle)\b|brn-drawer-overlay|\*brnDrawerContent\b|vaul-drawer-direction/;
const LEGACY_HELM_DRAWER_IMPORTS = /\b(?:BrnDrawerHandle|BrnDrawerOverlay)\b/;

export const DIRECTION_MESSAGE =
	'`direction` on a drawer or its triggers is no longer an input: it is ignored and the drawer opens from the bottom. ' +
	'Use `swipeDirection` on the drawer instead (top becomes up, bottom becomes down).';
export const DIRECTION_MANUAL_MESSAGE = `${DIRECTION_MESSAGE} This drawer uses a bound or per-trigger direction, so it has to be migrated by hand.`;
export const CLOSE_THRESHOLD_MESSAGE =
	'`closeThreshold` on `hlm-drawer-content` was removed: swiping is built into the drawer.';
export const LEGACY_HELM_MESSAGE =
	'The helm drawer is built on the vaul based brain drawer (`BrnDrawerHandle`, `BrnDrawerOverlay`), which was removed. ' +
	'Regenerate the helm drawer.';
export const LEGACY_API_MESSAGE =
	'Uses a removed drawer API (`BrnDrawerHandle`, `BrnDrawerOverlay`, `*brnDrawerContent` or `data-vaul-drawer-direction`). ' +
	'See https://www.spartan.ng/components/drawer#migration';

export interface DrawerMigrationIssue {
	message: string;
	fixable: boolean;
}

interface Tag {
	name: string;
	start: number;
	end: number;
	attributes: ParsedAttribute[];
}

interface Edit {
	start: number;
	end: number;
	text: string;
}

export interface DrawerFileMigration {
	original: string;
	content: string;
	issues: DrawerMigrationIssue[];
	/** A helm drawer file built on the removed brain drawer, which the migration regenerates. */
	legacyHelm: boolean;
}

/** Scans the workspace for the vaul based drawer. Shared by the healthcheck and the generator. */
export function scanDrawerMigration(tree: Tree): Map<string, DrawerFileMigration> {
	const files = new Map<string, DrawerFileMigration>();

	visitFiles(tree, '.', (path) => {
		if (!path.endsWith('.ts') && !path.endsWith('.html')) {
			return;
		}

		const original = tree.read(path, 'utf-8');

		if (!original || !/drawer/i.test(original)) {
			return;
		}

		const { content, issues } = migrateDrawerTemplate(original);
		// The helm drawer imports the brain APIs it is built on, so check it for those apart from app code.
		const legacyHelm = isHelmDrawerFile(path) && LEGACY_HELM_DRAWER_IMPORTS.test(original);

		if (legacyHelm) {
			issues.push({ message: LEGACY_HELM_MESSAGE, fixable: true });
		} else if (!isHelmDrawerFile(path) && LEGACY_DRAWER_APIS.test(original)) {
			issues.push({ message: LEGACY_API_MESSAGE, fixable: false });
		}

		if (issues.length) {
			files.set(path, { original, content, issues, legacyHelm });
		}
	});

	return files;
}

function isHelmDrawerFile(path: string): boolean {
	return /(^|\/)hlm-drawer[\w-]*\.ts$/.test(path);
}

/**
 * Replaces the legacy `direction` with `swipeDirection` on the drawer and removes `closeThreshold`. A drawer
 * whose direction is bound or set per trigger is reported as not fixable and left untouched.
 */
export function migrateDrawerTemplate(content: string): { content: string; issues: DrawerMigrationIssue[] } {
	const { drawers, orphanTriggers, drawerContents } = scanDrawers(content);
	const issues: DrawerMigrationIssue[] = [];
	const edits: Edit[] = [];

	for (const { drawer, triggers } of drawers) {
		const drawerDirection = findAttribute(drawer, 'direction');
		const triggerDirections = triggers.filter((trigger) => findAttribute(trigger, 'direction'));

		if (!drawerDirection && triggerDirections.length === 0) {
			continue;
		}

		const direction = resolveDirection(drawer, drawerDirection, triggers, triggerDirections);

		if (!direction) {
			issues.push({ message: DIRECTION_MANUAL_MESSAGE, fixable: false });
			continue;
		}

		issues.push({ message: DIRECTION_MESSAGE, fixable: true });

		const quote = quoteOf(drawerDirection ?? findAttribute(triggerDirections[0], 'direction')!);
		const swipeDirection = `swipeDirection=${quote}${SWIPE_DIRECTIONS[direction]}${quote}`;
		edits.push(
			drawerDirection
				? replaceAttribute(content, drawer, drawerDirection, swipeDirection)
				: insertAttribute(content, drawer, swipeDirection),
		);
		for (const trigger of triggerDirections) {
			edits.push(removeAttribute(content, trigger, findAttribute(trigger, 'direction')!));
		}
	}

	if (orphanTriggers.some((trigger) => findAttribute(trigger, 'direction'))) {
		issues.push({ message: DIRECTION_MANUAL_MESSAGE, fixable: false });
	}

	for (const drawerContent of drawerContents) {
		const closeThreshold = findAttribute(drawerContent, 'closeThreshold');

		if (closeThreshold) {
			issues.push({ message: CLOSE_THRESHOLD_MESSAGE, fixable: true });
			edits.push(removeAttribute(content, drawerContent, closeThreshold));
		}
	}

	return { content: applyEdits(content, edits), issues };
}

/**
 * The direction the drawer ends up with, or null when it can't be derived statically. A trigger's direction
 * overrides the drawer's, so a drawer can only be migrated when every trigger sets the same literal one.
 */
function resolveDirection(
	drawer: Tag,
	drawerDirection: ParsedAttribute | undefined,
	triggers: Tag[],
	triggerDirections: Tag[],
): string | null {
	if (findAttribute(drawer, 'swipeDirection')) {
		return null;
	}

	if (triggerDirections.length === 0) {
		return literalDirection(drawerDirection!);
	}

	if (triggerDirections.length < triggers.length) {
		return null;
	}

	const directions = new Set(
		triggerDirections.map((trigger) => literalDirection(findAttribute(trigger, 'direction')!)),
	);
	const [direction] = directions;

	return directions.size === 1 ? direction : null;
}

function literalDirection(attribute: ParsedAttribute): string | null {
	const value = attribute.value?.trim() ?? '';
	const direction = attribute.name.startsWith('[') ? value.match(/^(['"])(\w+)\1$/)?.[2] : value;

	return direction && direction in SWIPE_DIRECTIONS ? direction : null;
}

function scanDrawers(content: string) {
	const drawers: { drawer: Tag; triggers: Tag[] }[] = [];
	const orphanTriggers: Tag[] = [];
	const drawerContents: Tag[] = [];
	const open: { name: string; drawer: (typeof drawers)[number] | null }[] = [];
	// A tag name is followed by whitespace, `/` or `>`, which rules out comparisons such as `i<items.length`.
	const tagPattern = /<(\/?)([a-zA-Z][\w-]*)(?=[\s/>])/g;
	let match: RegExpExecArray | null;

	while ((match = tagPattern.exec(content))) {
		const [prefix, closing, name] = match;

		if (closing) {
			const index = open.map((element) => element.name).lastIndexOf(name);
			if (index !== -1) open.length = index;
			continue;
		}

		const attrsStart = match.index + prefix.length;
		const end = findTagEnd(content, attrsStart);

		// Not a tag, e.g. a comparison in TypeScript: keep scanning after it.
		if (end === -1) {
			continue;
		}

		tagPattern.lastIndex = end;
		const rawAttrs = content.slice(attrsStart, end - 1);
		const selfClosing = /\/\s*$/.test(rawAttrs);
		const tag: Tag = { name, start: match.index, end, attributes: parseAttributes(rawAttrs.replace(/\/\s*$/, '')) };
		const names = tag.attributes.map(attributeName);
		const drawer = DRAWER_TAGS.has(name) || names.includes('brnDrawer') ? { drawer: tag, triggers: [] } : null;

		if (drawer) {
			drawers.push(drawer);
		}

		if (names.some((attribute) => TRIGGER_ATTRIBUTES.has(attribute))) {
			const owner = [...open].reverse().find((element) => element.drawer)?.drawer;
			if (owner) owner.triggers.push(tag);
			else orphanTriggers.push(tag);
		}

		if (name === 'hlm-drawer-content') {
			drawerContents.push(tag);
		}

		if (!selfClosing && !VOID_TAGS.has(name.toLowerCase())) {
			open.push({ name, drawer });
		}
	}

	return { drawers, orphanTriggers, drawerContents };
}

function findAttribute(tag: Tag, name: string): ParsedAttribute | undefined {
	return tag.attributes.find((attribute) => attributeName(attribute) === name);
}

/** The quote of the attribute value, so a template inside a double-quoted string stays valid. */
function quoteOf(attribute: ParsedAttribute): string {
	return attribute.raw.match(/=\s*(['"])/)?.[1] ?? '"';
}

/** The offset of the attribute in its tag, matched as a whole attribute rather than inside another one. */
function attributeIndex(tagText: string, attribute: ParsedAttribute): number {
	const raw = attribute.raw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	return tagText.search(new RegExp(`(?<=\\s)${raw}(?=[\\s/>]|$)`));
}

function replaceAttribute(content: string, tag: Tag, attribute: ParsedAttribute, text: string): Edit {
	const tagText = content.slice(tag.start, tag.end);
	const index = attributeIndex(tagText, attribute);

	return {
		start: tag.start,
		end: tag.end,
		text: tagText.slice(0, index) + text + tagText.slice(index + attribute.raw.length),
	};
}

function removeAttribute(content: string, tag: Tag, attribute: ParsedAttribute): Edit {
	const tagText = content.slice(tag.start, tag.end);
	const index = attributeIndex(tagText, attribute);
	const before = tagText.slice(0, index).replace(/\s+$/, '');

	return { start: tag.start, end: tag.end, text: before + tagText.slice(index + attribute.raw.length) };
}

function insertAttribute(content: string, tag: Tag, text: string): Edit {
	const nameEnd = tag.start + 1 + tag.name.length;

	return {
		start: tag.start,
		end: tag.end,
		text: `${content.slice(tag.start, nameEnd)} ${text}${content.slice(nameEnd, tag.end)}`,
	};
}

/** Applies edits from the end, so earlier offsets stay valid. Each edit replaces a whole opening tag. */
function applyEdits(content: string, edits: Edit[]): string {
	return [...edits]
		.sort((a, b) => b.start - a.start)
		.reduce((result, edit) => result.slice(0, edit.start) + edit.text + result.slice(edit.end), content);
}
