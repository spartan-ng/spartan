import { formatFiles, type Tree } from '@nx/devkit';
import { visitFiles } from '../../utils/visit-files';
import type { MigrateRadioGeneratorSchema } from './schema';

export async function migrateRadioGenerator(tree: Tree, { skipFormat }: MigrateRadioGeneratorSchema) {
	updateImports(tree);
	replaceSelector(tree);

	if (!skipFormat) {
		await formatFiles(tree);
	}
}

function replaceSelector(tree: Tree) {
	// if the element is `<brn-radio hlm` then we need to replace it with `<hlm-radio`
	// we also need to replace the closing tag `</brn-radio>` with `</hlm-radio>`
	visitFiles(tree, '.', (path) => {
		// if this is not an html file or typescript file (inline templates) then skip
		if (!path.endsWith('.html') && !path.endsWith('.ts')) {
			return;
		}

		let content = tree.read(path, 'utf-8');

		if (!content) {
			return;
		}

		// <brn-radio hlm but between
		content = replaceBrnRadioHlm(content);
		content = content.replace(/<\/brn-radio>/g, '</hlm-radio>');

		tree.write(path, content);
	});
}

function replaceBrnRadioHlm(input) {
	// Split input to handle multiple tags separately
	return input
		.split(/(?=<)/)
		.map((tag) => {
			// Skip if not a brn-radio tag
			if (!tag.startsWith('<brn-radio')) {
				return tag;
			}

			// Remove line breaks, tabs, and other whitespace within the tag
			// Replace with a single space
			tag = tag.replace(/\s+/g, ' ');

			// Check if standalone hlm attribute exists
			const hasHlm = / hlm(?=[\s>])/.test(tag);

			if (hasHlm) {
				// Remove the hlm attribute and convert to hlm-radio
				return tag
					.replace(/<brn-radio/, '<hlm-radio')
					.replace(/ hlm(?=[\s>])/, '')
					.replace(/\s+>/g, '>')
					.replace(/\s+/g, ' ');
			}

			return tag;
		})
		.join('');
}
/**
 * Update imports remove BrnRadioComponent import and replace HlmRadioDirective with HlmRadioComponent
 */
function updateImports(tree: Tree) {
	visitFiles(tree, '/', (path) => {
		const content = tree.read(path).toString('utf-8');

		if (content.includes('@spartan-ng/brain/radio-group') || content.includes('@spartan-ng/ui-radiogroup-helm')) {
			const updatedContent = content
				// Handle `import { BrnRadioComponent } from '@spartan-ng/brain/radio-group';`
				.replace("import { BrnRadioComponent } from '@spartan-ng/brain/radio-group';", '')
				// Remove `BrnRadioComponent` with optional comma and whitespace
				.replace(/BrnRadioComponent,?\s?/, '')
				// Replace all `HlmRadioDirective` with `HlmRadioComponent`
				.replaceAll('HlmRadioDirective', 'HlmRadioComponent');

			tree.write(path, updatedContent);
		}
	});
}

export default migrateRadioGenerator;
