import { formatFiles, type Tree } from '@nx/devkit';
import { visitFiles } from '../../utils/visit-files';
import type { MigrateInputIdGeneratorSchema } from './schema';

const inputIdSelectors = ['hlm-checkbox', 'hlm-switch', 'hlm-radio', 'hlm-command-input'];
const inputIdTagPattern = new RegExp(`<(${inputIdSelectors.join('|')})\\b[^>]*>`, 'g');

export async function migrateInputIdGenerator(tree: Tree, { skipFormat }: MigrateInputIdGeneratorSchema) {
	replaceLegacyInputIds(tree);

	if (!skipFormat) {
		await formatFiles(tree);
	}
}

function replaceLegacyInputIds(tree: Tree) {
	visitFiles(tree, '.', (path) => {
		if (!path.endsWith('.html') && !path.endsWith('.ts')) {
			return;
		}

		let content = tree.read(path, 'utf-8');

		if (!content) {
			return;
		}

		inputIdTagPattern.lastIndex = 0;
		content = content.replace(inputIdTagPattern, (tag) => renameLegacyIdInputs(tag));

		tree.write(path, content);
	});
}

function renameLegacyIdInputs(tag: string) {
	return tag
		.replace(/(\s)\[id\](\s*=)/g, '$1[inputId]$2')
		.replace(/(\s)bind-id(\s*=)/g, '$1bind-inputId$2')
		.replace(/(\s)id(\s*=)/g, '$1inputId$2');
}

export default migrateInputIdGenerator;
