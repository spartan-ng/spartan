import { existsSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { primitiveDependencies } from './primitive-deps';

/**
 * Drift guard: every installable helm component must be registered as a CLI primitive (and have a
 * generator template). Without this, a new component can ship + be documented while remaining
 * uninstallable via `nx g @spartan-ng/cli:ui <name>` - which is exactly how `drawer` slipped through.
 * The `Record<Primitive, Primitive[]>` type already keeps the union and the deps map in sync; this
 * checks the filesystem the type system can't see.
 */
function findWorkspaceRoot(start: string): string {
	let dir = start;
	while (dir !== dirname(dir)) {
		if (existsSync(join(dir, 'nx.json'))) return dir;
		dir = dirname(dir);
	}
	throw new Error('workspace root (nx.json) not found');
}

describe('CLI primitive registry', () => {
	const root = findWorkspaceRoot(__dirname);
	const cliPrimitives = Object.keys(primitiveDependencies).sort();

	// every helm library entry point that ships an ng-package.json is an installable UI primitive
	const helmPrimitives = readdirSync(join(root, 'libs/helm'))
		.filter((name) => existsSync(join(root, 'libs/helm', name, 'ng-package.json')))
		.sort();

	it('registers exactly the set of installable helm components (no drift)', () => {
		expect(cliPrimitives).toEqual(helmPrimitives);
	});

	it('has a generator template for every registered primitive', () => {
		const libsDir = join(root, 'libs/cli/src/generators/ui/libs');
		const missingTemplate = cliPrimitives.filter((p) => !existsSync(join(libsDir, p, 'generator.ts')));
		expect(missingTemplate).toEqual([]);
	});
});
