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
}

export const nativeHostElementMigrations: NativeHostElementMigration[] = [
	{ tag: 'hlm-combobox-trigger', element: 'button', attribute: 'hlmComboboxTrigger' },
	{ tag: 'hlm-select-trigger', element: 'button', attribute: 'hlmSelectTrigger' },
	{ tag: 'hlm-date-picker-trigger', element: 'button', attribute: 'hlmDatePickerTrigger' },
	{ tag: 'hlm-pagination-next', element: 'a', attribute: 'hlmPaginationNext' },
	{ tag: 'hlm-pagination-previous', element: 'a', attribute: 'hlmPaginationPrevious' },
];

/** Matches a single attribute, taking quoted values (which may contain `>` or `/`) into account. */
const attributePattern = `(?:\\s+[^\\s"'=/>]+(?:\\s*=\\s*(?:"[^"]*"|'[^']*'|[^\\s"'>]+))?)`;

export function createLegacyTagPattern(tag: string, flags = 'g') {
	return new RegExp(`<${tag}(?![\\w-])((?:${attributePattern})*)(\\s*)(\\/?)>`, flags);
}

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
	for (const { tag, element, attribute } of nativeHostElementMigrations) {
		content = content.replace(
			createLegacyTagPattern(tag),
			(_match, attributes: string, trailing: string, selfClosing: string) => {
				const opening = `<${element}${formatAttribute(attribute, attributes)}${attributes}${selfClosing ? '' : trailing}>`;
				return selfClosing ? `${opening}</${element}>` : opening;
			},
		);

		content = content.replace(new RegExp(`</${tag}\\s*>`, 'g'), `</${element}>`);

		// DOM queries / CSS selectors that targeted the native element inside the wrapper, e.g. `hlm-select-trigger > button`
		content = content.replace(
			new RegExp(`\\b${tag}\\s*>?\\s*${element}(?=\\s*['"\`\\[\\]:.,){>])`, 'g'),
			`[${attribute}]`,
		);
	}

	return content;
}

/** Keeps the attribute layout: multi-line tags get the new attribute on its own line. */
function formatAttribute(attribute: string, attributes: string): string {
	const multiline = /^[ \t]*\r?\n([ \t]*)/.exec(attributes);
	return multiline ? `\n${multiline[1]}${attribute}` : ` ${attribute}`;
}

export default migrateNativeHostElementsGenerator;
