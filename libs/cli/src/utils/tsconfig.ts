import { readJson, Tree } from '@nx/devkit';
import { getRootTsConfigPathInTree } from '@nx/js';
import type { CompilerOptions } from 'typescript';

interface TsConfig {
	compilerOptions?: CompilerOptions;
	include?: string[];
	exclude?: string[];
	references?: { path: string }[];
}

export function readTsConfigPathsFromTree(tree: Tree, tsConfig?: string) {
	tsConfig ??= getRootTsConfigPathInTree(tree);

	try {
		const { compilerOptions } = readJson(tree, tsConfig) as TsConfig;
		return compilerOptions?.paths ?? {};
	} catch {
		return {};
	}
}
