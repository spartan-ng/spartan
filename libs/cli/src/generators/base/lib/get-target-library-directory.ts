import { type Tree, extractLayoutDirectory, getWorkspaceLayout } from '@nx/devkit';
import * as path from 'node:path';
import type { HlmBaseGeneratorSchema } from '../schema';

export function getTargetLibraryDirectory(options: HlmBaseGeneratorSchema, tree: Tree) {
	const { layoutDirectory, projectDirectory } = extractLayoutDirectory(options.directory);
	const workspaceLayout = getWorkspaceLayout(tree);
	const baseLibsDir = layoutDirectory ?? workspaceLayout.libsDir;
	const libsDir = options.rootProject ? '.' : baseLibsDir;
	return path.join(libsDir, projectDirectory, options.publicName);
}
