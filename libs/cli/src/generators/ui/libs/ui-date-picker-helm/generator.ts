import { Tree } from '@nx/devkit';
import hlmBaseGenerator from '../../../base/generator';
import type { HlmBaseGeneratorSchema } from '../../../base/schema';

export async function generator(tree: Tree, options: HlmBaseGeneratorSchema) {
	return await hlmBaseGenerator(tree, {
		...options,
		primitiveName: 'datepicker',
		internalName: 'ui-date-picker-helm',
		publicName: 'ui-datepicker-helm',
	});
}
