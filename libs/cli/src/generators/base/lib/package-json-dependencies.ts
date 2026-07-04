import { readJson, type Tree } from '@nx/devkit';

type Dependencies = Record<string, string | null | undefined>;
type PackageJsonDependencies = {
	dependencies?: Record<string, string>;
	devDependencies?: Record<string, string>;
	peerDependencies?: Record<string, string>;
	optionalDependencies?: Record<string, string>;
};

function hasDeclaredDependency(packageJson: PackageJsonDependencies, packageName: string): boolean {
	return (
		packageName in (packageJson.dependencies ?? {}) ||
		packageName in (packageJson.devDependencies ?? {}) ||
		packageName in (packageJson.peerDependencies ?? {}) ||
		packageName in (packageJson.optionalDependencies ?? {})
	);
}

export function filterUnregisteredDependencies(tree: Tree, dependencies: Dependencies, devDependencies: Dependencies) {
	const packageJson = readJson<PackageJsonDependencies>(tree, 'package.json');
	const filter = (deps: Dependencies) =>
		Object.fromEntries(
			Object.entries(deps).filter(
				([packageName, version]) => typeof version === 'string' && !hasDeclaredDependency(packageJson, packageName),
			),
		) as Record<string, string>;

	return {
		dependencies: filter(dependencies),
		devDependencies: filter(devDependencies),
	};
}
