import { type Tree, updateJson } from '@nx/devkit';

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
