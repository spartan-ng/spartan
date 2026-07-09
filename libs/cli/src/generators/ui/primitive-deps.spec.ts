import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getDependentPrimitives, primitiveDependencies } from './primitive-deps';
import type { Primitive } from './primitives';

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

	// Drift guard: every `<importAlias>/<primitive>` a template imports must be reachable from that
	// primitive's declared deps, else scaffolding it alone generates imports to a helm library that was
	// never created - which is how `command` shipped importing undeclared `input-group` (#1618).
	it('declares every primitive its templates import', () => {
		const libsDir = join(root, 'libs/cli/src/generators/ui/libs');
		const importedPrimitiveRegex = /importAlias %>\/([a-z-]+)/g;
		const missingDeps: string[] = [];

		for (const primitive of cliPrimitives) {
			const filesDir = join(libsDir, primitive, 'files');
			if (!existsSync(filesDir)) continue;

			const imported = new Set<string>();
			for (const entry of readdirSync(filesDir, { recursive: true, withFileTypes: true })) {
				if (!entry.isFile()) continue;
				const contents = readFileSync(join(entry.parentPath, entry.name), 'utf-8');
				for (const [, name] of contents.matchAll(importedPrimitiveRegex)) {
					if (name !== primitive) imported.add(name);
				}
			}

			const declared = new Set(getDependentPrimitives([primitive as Primitive]));
			for (const name of imported) {
				if (!declared.has(name as Primitive)) {
					missingDeps.push(`${primitive} imports ${name} but does not declare it as a dependency`);
				}
			}
		}

		expect(missingDeps).toEqual([]);
	});
});
