import { formatFiles, Tree } from '@nx/devkit';
import { visitFiles } from '../../utils/visit-files';
import { MigrateCoreGeneratorSchema } from './schema';

export async function migrateCoreGenerator(tree: Tree, options: MigrateCoreGeneratorSchema) {
	updateImports(tree);
	updateTailwindConfig(tree);

	if (!options.skipFormat) {
		await formatFiles(tree);
	}
}

/**
 * Update imports from @spartan-ng/ui-core to @spartan-ng/brain/core
 */
function updateImports(tree: Tree) {
	visitFiles(tree, '/', (path) => {
		const content = tree.read(path).toString('utf-8');

		if (/@spartan-ng\/ui-core/.test(content)) {
			const updatedCode = content.replace(/import\s+\{[^}]*\}\s+from\s+['"]@spartan-ng\/ui-core['"];/g, (match) =>
				match.replace('@spartan-ng/ui-core', '@spartan-ng/brain/core'),
			);

			tree.write(path, updatedCode);
		}
	});
}

/**
 * Update the tailwind config file
 */
function updateTailwindConfig(tree: Tree) {
	visitFiles(tree, '/', (path) => {
		// technically the tailwind config file could be anywhere and named anything
		// but all we need to do is a simple string replace '@spartan-ng/ui-core/hlm-tailwind-preset' with '@spartan-ng/brain/hlm-tailwind-preset'
		const content = tree.read(path).toString('utf-8');

		if (content.includes('@spartan-ng/ui-core/hlm-tailwind-preset')) {
			const updatedCode = content.replace(
				/@spartan-ng\/ui-core\/hlm-tailwind-preset/g,
				'@spartan-ng/brain/hlm-tailwind-preset',
			);

			tree.write(path, updatedCode);
		}
	});
}

export default migrateCoreGenerator;
