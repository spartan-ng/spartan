import type { Tree } from '@nx/devkit';
import { updateJson } from 'nx/src/generators/utils/json';

export const addPrimitiveToSupportedUILibraries = (
	tree: Tree,
	supportedJsonPath: string,
	generatorName: string,
	name: string,
	peerDependencies: Record<string, string>,
) => {
	updateJson(tree, supportedJsonPath, (old) => ({
		...old,
		[generatorName]: {
			name,
			peerDependencies,
		},
	}));
};
