import { formatFiles, type Tree } from '@nx/devkit';
import { visitFiles } from '../../utils/visit-files';
import type { MigrateSonnerGeneratorSchema } from './schema';

export async function migrateSonnerGenerator(tree: Tree, { skipFormat }: MigrateSonnerGeneratorSchema) {
	updateImports(tree);

	if (!skipFormat) {
		await formatFiles(tree);
	}
}

/**
 * Migrate ngx-sonner imports to @spartan-ng/brain/sonner
 */
function updateImports(tree: Tree) {
	visitFiles(tree, '/', (path) => {
		// if this is not a typescript file then skip
		if (!path.endsWith('.ts')) {
			return;
		}

		// skip hlm-toaster itself
		if (path.endsWith('hlm-toaster.ts')) {
			return;
		}

		let content = tree.read(path, 'utf-8');

		if (!content) {
			return;
		}

		if (content.includes('ngx-sonner')) {
			content = content.replaceAll('ngx-sonner', '@spartan-ng/brain/sonner');
		}

		tree.write(path, content);
	});
}

export default migrateSonnerGenerator;
