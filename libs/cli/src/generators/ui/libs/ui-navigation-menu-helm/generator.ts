import type { Tree } from '@nx/devkit';
import hlmBaseGenerator from '../../../base/generator';
import type { HlmBaseGeneratorSchema } from '../../../base/schema';

export async function generator(tree: Tree, options: HlmBaseGeneratorSchema) {
	return await hlmBaseGenerator(tree, {
		...options,
		primitiveName: 'navigation-menu',
		internalName: 'ui-navigation-menu-helm',
		publicName: 'ui-navigation-menu-helm',
	});
}
