import { formatFiles, Tree } from '@nx/devkit';
import { visitFiles } from '../../utils/visit-files';
import { MigrateRadioGeneratorSchema } from './schema';

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

		content = content.replace(/<brn-radio hlm/g, '<hlm-radio');
		content = content.replace(/<\/brn-radio>/g, '</hlm-radio>');

		tree.write(path, content);
	});
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
