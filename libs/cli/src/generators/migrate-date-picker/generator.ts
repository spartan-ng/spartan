import { formatFiles, Tree } from '@nx/devkit';
import { visitFiles } from '../../utils/visit-files';
import { MigrateDatePickerGeneratorSchema } from './schema';

export async function migrateDatePickerGenerator(tree: Tree, { skipFormat }: MigrateDatePickerGeneratorSchema) {
	replaceOpenChangeEvent(tree);

	if (!skipFormat) {
		await formatFiles(tree);
	}
}

function replaceOpenChangeEvent(tree: Tree) {
	// if the element is `'<hlm-select' and it has an `(openedChange)` event, we need to replace it with `(openChange)`
	visitFiles(tree, '.', (path) => {
		// if this is not an html file or typescript file (inline templates) then skip
		if (!path.endsWith('.html') && !path.endsWith('.ts')) {
			return;
		}

		let content = tree.read(path, 'utf-8');

		if (!content) {
			return;
		}

		// find all the brn-select or hlm-select elements that have an `(openedChange)` event
		content = content.replace(/<(hlm-date-picker)[^>]*\(\s*changed\s*\)=/g, (match) =>
			match.replace(/\(\s*changed\s*\)/, '(dateChange)'),
		);

		tree.write(path, content);
	});
}

export default migrateDatePickerGenerator;
