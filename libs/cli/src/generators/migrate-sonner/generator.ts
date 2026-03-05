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
 * Update imports, removes '@spartan-ng/brain/menu' and '@spartan-ng/helm/menu'
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
			content = content.replace('ngx-sonner', '@spartan-ng/brain/sonner');
		}

		tree.write(path, content);
	});
}

export default migrateSonnerGenerator;
