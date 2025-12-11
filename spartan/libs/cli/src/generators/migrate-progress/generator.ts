import { formatFiles, type Tree, visitNotIgnoredFiles } from '@nx/devkit';
import type { MigrateScrollAreaGeneratorSchema } from './schema';

export async function migrateProgressGenerator(tree: Tree, { skipFormat }: MigrateScrollAreaGeneratorSchema) {
	replaceSelector(tree);

	if (!skipFormat) {
		await formatFiles(tree);
	}
}

function replaceSelector(tree: Tree) {
	// if the element is `<brn-progress hlm>` then we need to replace it with `<hlm-progress>`
	// we also need to replace the closing tag `</brn-progress>` with `</hlm-progress>`
	visitNotIgnoredFiles(tree, '.', (path) => {
		// if this is not an html file or typescript file (inline templates) then skip
		if (!path.endsWith('.html') && !path.endsWith('.ts')) {
			return;
		}

		let content = tree.read(path, 'utf-8');

		if (!content) {
			return;
		}

		// Replace <brn-progress ... hlm ...> with <hlm-progress ...>
		const hlmProgressRegex = /<brn-progress([^>]*)hlm([^>]*)>/g;
		content = content.replace(hlmProgressRegex, '<hlm-progress$1$2>');

		// Replace <brn-progress-indicator ... hlm ...> with <hlm-progress-indicator ...>
		const hlmProgressIndicatorRegex = /<brn-progress-indicator([^>]*)hlm([^>]*)>/g;
		content = content.replace(hlmProgressIndicatorRegex, '<hlm-progress-indicator$1$2>');

		// Only rename closing tags if they follow a matching open tag with hlm attribute
		// Use a regex to match the full element including its content
		content = content.replace(
			/<hlm-progress([\s\S]*?)>([\s\S]*?)<\/brn-progress>/g,
			'<hlm-progress$1>$2</hlm-progress>',
		);

		content = content.replace(
			/<hlm-progress-indicator([\s\S]*?)>([\s\S]*?)<\/brn-progress-indicator>/g,
			'<hlm-progress-indicator$1>$2</hlm-progress-indicator>',
		);

		tree.write(path, content);
	});
}

export default migrateProgressGenerator;
