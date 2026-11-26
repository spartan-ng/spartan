import { formatFiles, type Tree } from '@nx/devkit';
import { visitFiles } from '../../utils/visit-files';
import type { MigrateNativeHostElementsGeneratorSchema } from './schema';

interface NativeHostElementMigration {
	/** The legacy element selector, e.g. `hlm-select-trigger` */
	tag: string;
	/** The native element the component is now attached to */
	element: 'button' | 'a';
	/** The new attribute selector */
	attribute: string;
	/** Element used when the legacy usage has no `link`, i.e. it is an action rather than a navigation */
	actionElement?: 'button';
}

export const nativeHostElementMigrations: NativeHostElementMigration[] = [
	{ tag: 'hlm-combobox-trigger', element: 'button', attribute: 'hlmComboboxTrigger' },
	{ tag: 'hlm-select-trigger', element: 'button', attribute: 'hlmSelectTrigger' },
	{ tag: 'hlm-date-picker-trigger', element: 'button', attribute: 'hlmDatePickerTrigger' },
	{ tag: 'hlm-pagination-next', element: 'a', attribute: 'hlmPaginationNext', actionElement: 'button' },
	{ tag: 'hlm-pagination-previous', element: 'a', attribute: 'hlmPaginationPrevious', actionElement: 'button' },
];

/**
 * Matches a single attribute, taking quoted values (which may contain `>` or `/`) into account.
 * Also supports escaped quotes of TypeScript string literals and keeps a self-closing `/` out of unquoted values.
 */
const attributePattern = `(?:\\s+[^\\s"'=/>\\\\]+(?:\\s*=\\s*(?:\\\\"[^"]*?\\\\"|\\\\'[^']*?\\\\'|"[^"]*"|'[^']*'|(?:[^\\s"'>/]|\\/(?!>))+))?)`;

export function createLegacyTagPattern(tag: string, flags = 'g') {
	return new RegExp(`<${tag}(?![\\w-])((?:${attributePattern})*)(\\s*)(\\/?)>`, flags);
}

/** Matches migratable opening tags, closing tags and opening tags that cannot be migrated (in that order of precedence). */
function createLegacyTokenPattern(tag: string) {
	return new RegExp(`${createLegacyTagPattern(tag).source}|<\\/${tag}\\s*>|<${tag}(?![\\w-])`, 'g');
}

const linkAttributePattern = /\s\[?link\]?(?=\s*=)/;

export function hasLegacyNativeHostElements(content: string): boolean {
	return nativeHostElementMigrations.some(({ tag }) => createLegacyTagPattern(tag, '').test(content));
}

export async function migrateNativeHostElementsGenerator(
	tree: Tree,
	{ skipFormat }: MigrateNativeHostElementsGeneratorSchema,
) {
	visitFiles(tree, '.', (path) => {
		if (!path.endsWith('.html') && !path.endsWith('.ts')) {
			return;
		}

		const content = tree.read(path, 'utf-8');

		if (!content || !nativeHostElementMigrations.some(({ tag }) => content.includes(tag))) {
			return;
		}

		const updated = migrateNativeHostElements(content);

		if (updated !== content) {
			tree.write(path, updated);
		}
	});

	if (!skipFormat) {
		await formatFiles(tree);
	}
}

export function migrateNativeHostElements(content: string): string {
	for (const { tag, element, attribute, actionElement } of nativeHostElementMigrations) {
		// element of each open legacy tag, `null` if the opening tag could not be migrated and its closing tag must stay as is
		const openElements: (string | null)[] = [];

		content = content.replace(
			createLegacyTokenPattern(tag),
			(
				match: string,
				attributes: string | undefined,
				trailing: string | undefined,
				selfClosing: string | undefined,
				offset: number,
				source: string,
			) => {
				if (match.startsWith('</')) {
					const target = openElements.pop();
					return target ? `</${target}>` : match;
				}

				if (attributes === undefined) {
					openElements.push(null);
					return match;
				}

				const isAction = !!actionElement && !linkAttributePattern.test(attributes);
				const target = isAction ? actionElement : element;
				const type = isAction ? ' type="button"' : '';
				const opening = `${classValueTodo(attributes, source, offset)}<${target}${type}${formatAttribute(attribute, attributes)}${attributes}${selfClosing ? '' : trailing}>`;

				if (selfClosing) {
					return `${opening}</${target}>`;
				}

				openElements.push(target);
				return opening;
			},
		);

		// DOM queries / CSS selectors that targeted the native element inside the wrapper, e.g. `hlm-select-trigger > button`
		const innerElements = actionElement ? `(?:${element}|${actionElement})` : element;
		content = content.replace(
			new RegExp(`\\b${tag}\\s*>?\\s*${innerElements}(?=\\s*['"\`\\[\\]:.,){>])`, 'g'),
			`[${attribute}]`,
		);

		// DOM queries / CSS selectors that targeted the wrapper itself, e.g. `cy.get('hlm-select-trigger')`
		content = content.replace(
			new RegExp(`(?<=['"\`>+~,(\\s])${tag}(?![\\w-])(?=\\s*[)'"\`\\]>+~,\\[:{])`, 'g'),
			`[${attribute}]`,
		);
	}

	return content;
}

/**
 * The legacy components passed `[class]` through `hlm()`, native elements only support strings, arrays of strings
 * and class maps. Arrays containing class maps need to be converted manually.
 */
function classValueTodo(attributes: string, source: string, offset: number): string {
	const classBinding = /\s\[class\]\s*=\s*(?:"([^"]*)"|'([^']*)')/.exec(attributes);
	const value = (classBinding?.[1] ?? classBinding?.[2] ?? '').trim();

	if (!value.startsWith('[') || !value.includes('{')) {
		return '';
	}

	const todo =
		'<!-- TODO(spartan): [class] no longer supports class maps inside arrays, use a string, an array of strings or a single class map -->';
	const indentation = /(?:^|\n)([ \t]*)$/.exec(source.slice(0, offset));

	return indentation ? `${todo}\n${indentation[1]}` : todo;
}

/** Keeps the attribute layout: multi-line tags get the new attribute on its own line. */
function formatAttribute(attribute: string, attributes: string): string {
	const multiline = /^[ \t]*\r?\n([ \t]*)/.exec(attributes);
	return multiline ? `\n${multiline[1]}${attribute}` : ` ${attribute}`;
}

export default migrateNativeHostElementsGenerator;
