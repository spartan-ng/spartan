import { readJson, type Tree } from '@nx/devkit';

type Dependencies = Record<string, string | null | undefined>;
type InstalledDependencies = {
	dependencies?: Record<string, string>;
	devDependencies?: Record<string, string>;
};

// A pnpm/yarn catalog reference ("catalog:" / "catalog:name") is resolved from the workspace catalog,
// not a semver range. Re-declaring one makes nx try to resolve the existing reference and throw (#1597).
// We drop only these, so ordinary concrete deps are still handed to nx and bumped to our supported minimum.
function isCatalogManaged(installed: InstalledDependencies, packageName: string): boolean {
	const existing = installed.dependencies?.[packageName] ?? installed.devDependencies?.[packageName];
	return typeof existing === 'string' && existing.startsWith('catalog:');
}

export function removeCatalogManagedDependencies(
	tree: Tree,
	dependencies: Dependencies,
	devDependencies: Dependencies,
) {
	const installed = readJson<InstalledDependencies>(tree, 'package.json');
	const filter = (deps: Dependencies) =>
		Object.fromEntries(
			Object.entries(deps).filter(
				([packageName, version]) => typeof version === 'string' && !isCatalogManaged(installed, packageName),
			),
		) as Record<string, string>;

	return {
		dependencies: filter(dependencies),
		devDependencies: filter(devDependencies),
	};
}
