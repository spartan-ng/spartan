import { readJson, type Tree } from '@nx/devkit';

type Dependencies = Record<string, string | null | undefined>;
type PackageJsonDependencies = {
	dependencies?: Record<string, string>;
	devDependencies?: Record<string, string>;
	peerDependencies?: Record<string, string>;
	optionalDependencies?: Record<string, string>;
};

function isCatalogManagedDependency(packageJson: PackageJsonDependencies, packageName: string): boolean {
	const version = packageJson.dependencies?.[packageName] ?? packageJson.devDependencies?.[packageName];
	return typeof version === 'string' && version.startsWith('catalog:');
}

export function filterUnregisteredDependencies(tree: Tree, dependencies: Dependencies, devDependencies: Dependencies) {
	const packageJson = readJson<PackageJsonDependencies>(tree, 'package.json');
	const filter = (deps: Dependencies) =>
		Object.fromEntries(
			Object.entries(deps).filter(
				([packageName, version]) => typeof version === 'string' && !isCatalogManagedDependency(packageJson, packageName),
			),
		) as Record<string, string>;

	return {
		dependencies: filter(dependencies),
		devDependencies: filter(devDependencies),
	};
}
