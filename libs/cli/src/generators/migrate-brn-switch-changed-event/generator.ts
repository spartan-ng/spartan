import { formatFiles, type Tree } from '@nx/devkit';
import { visitFiles } from '../../utils/visit-files';
import type { MigrateBrnSwitchChangedEvent } from './schema';

export async function migrateBrnSwitchChangedEvent(tree: Tree, { skipFormat }: MigrateBrnSwitchChangedEvent) {
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
		content = content.replace(/<(brn-switch)[^>]*\(\s*changed\s*\)=/g, (match) =>
			match.replace(/\(\s*changed\s*\)/, '(checkedChange)'),
		);

		tree.write(path, content);
	});
}

export default migrateBrnSwitchChangedEvent;
