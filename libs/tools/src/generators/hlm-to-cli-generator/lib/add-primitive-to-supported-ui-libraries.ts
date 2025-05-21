import type { Tree } from '@nx/devkit';
import { updateJson } from 'nx/src/generators/utils/json';

export const addPrimitiveToSupportedUILibraries = (
	tree: Tree,
	supportedJsonPath: string,
	generatorName: string,
	internalName: string,
	peerDependencies: Record<string, string>,
) => {
	updateJson(tree, supportedJsonPath, (old) => ({
		...old,
		[generatorName.replaceAll('-', '')]: {
			internalName,
			peerDependencies,
		},
	}));
};
