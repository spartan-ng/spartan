import { type Tree, visitNotIgnoredFiles } from '@nx/devkit';
import { readTsConfigPathsFromTree } from '../../../utils/tsconfig';
import { primitiveDependencies } from '../../ui/primitive-deps';
import { type Healthcheck, HealthcheckSeverity } from '../healthchecks';

// Primitives imported via `<importAlias>/<name>` that have no matching tsconfig path - referenced by a
// scaffolded component but never generated themselves, so the import can't resolve (#1618).
function findMissingPrimitives(tree: Tree, importAlias: string): Set<string> {
	const paths = readTsConfigPathsFromTree(tree);
	const importRegex = new RegExp(`['"\`]${escapeRegExp(importAlias)}/([a-z-]+)['"\`]`, 'g');
	const missing = new Set<string>();

	visitNotIgnoredFiles(tree, '/', (file) => {
		if (!file.endsWith('.ts')) return;
		const contents = tree.read(file, 'utf-8');
		if (!contents) return;

		for (const [, name] of contents.matchAll(importRegex)) {
			if (name in primitiveDependencies && !(`${importAlias}/${name}` in paths)) {
				missing.add(name);
			}
		}
	});

	return missing;
}

function escapeRegExp(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const scaffoldIntegrityHealthcheck: Healthcheck = {
	name: 'Scaffold integrity',
	detect(tree, failure, _skip, { importAlias }) {
		for (const primitive of findMissingPrimitives(tree, importAlias)) {
			failure(
				`"${primitive}" is imported from ${importAlias}/${primitive} but was never generated. ` +
					`Run "nx g @spartan-ng/cli:ui ${primitive}" to add it.`,
				HealthcheckSeverity.Error,
				false,
			);
		}
	},
};
