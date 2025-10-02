import type { Tree } from '@nx/devkit';
import hlmBaseGenerator from '../../../base/generator';
import type { HlmBaseGeneratorSchema } from '../../../base/schema';

export async function generator(tree: Tree, options: HlmBaseGeneratorSchema) {
	return await hlmBaseGenerator(tree, {
		...options,
		primitiveName: 'aspect-ratio',
		internalName: 'ui-aspect-ratio-helm',
		publicName: 'ui-aspect-ratio-helm',
	});
}
