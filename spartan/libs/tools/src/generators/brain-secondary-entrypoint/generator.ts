import { librarySecondaryEntryPointGenerator } from '@nx/angular/generators';
import { formatFiles, type Tree } from '@nx/devkit';
import type { BrainSecondaryEntrypointGeneratorSchema } from './schema';

export async function brainSecondaryEntrypointGenerator(tree: Tree, options: BrainSecondaryEntrypointGeneratorSchema) {
	await librarySecondaryEntryPointGenerator(tree, {
		name: options.name,
		library: 'brain',
		skipFormat: true,
		skipModule: true,
	});

	await formatFiles(tree);
}

export default brainSecondaryEntrypointGenerator;
