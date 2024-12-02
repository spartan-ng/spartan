import { type Tree } from '@nx/devkit';
import type { ReplaceCliVersionGeneratorSchema } from './schema';

export default async function replaceCliVersionGenerator(tree: Tree, options: ReplaceCliVersionGeneratorSchema) {
	console.log('replacing the cli version');
}
