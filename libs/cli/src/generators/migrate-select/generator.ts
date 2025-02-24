import { formatFiles, Tree } from '@nx/devkit';
import { updateHelmClasses } from '../../utils/hlm-class';
import { visitFiles } from '../../utils/visit-files';
import { MigrateSelectGeneratorSchema } from './schema';

export async function migrateSelectGenerator(tree: Tree, { skipFormat }: MigrateSelectGeneratorSchema) {
	replaceOpenChangeEvent(tree);
	replaceFocusClasses(tree);

	if (!skipFormat) {
		await formatFiles(tree);
	}
}

function replaceOpenChangeEvent(tree: Tree) {
	// if the element is `<brn-select`, '<hlm-select' and it has an `(openedChange)` event, we need to replace it with `(openChange)`
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
		content = content.replace(/<(brn-select|hlm-select)[^>]*\(\s*openedChange\s*\)=/g, (match) =>
			match.replace(/\(\s*openedChange\s*\)/, '(openChange)'),
		);

		tree.write(path, content);
	});
}

function replaceFocusClasses(tree: Tree) {
	// update the hlm classes
	visitFiles(tree, '.', (path) => {
		// if this is not a typescript file then skip
		if (!path.endsWith('.ts')) {
			return;
		}

		updateHelmClasses(tree, path, {
			component: 'HlmSelectOptionComponent',
			classesToRemove: ['focus:bg-accent', 'focus:text-accent-foreground'],
			classesToAdd: ['data-[active]:bg-accent', 'data-[active]:text-accent-foreground'],
		});
	});
}

export default migrateSelectGenerator;
