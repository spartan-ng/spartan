import { inject, Injectable } from '@angular/core';
import { StackBlitzMetaService } from '../../core/services/stackblitz-meta.service';
import {
	ANGULAR_JSON,
	appComponent,
	INDEX_HTML,
	MAIN_TS,
	NPMRC,
	packageJson,
	POSTCSS,
	stylesCss,
	TSCONFIG_APP,
	tsconfigJson,
} from './templates';

/** Live docs origin that serves example assets (images live under /assets there). */
const ASSET_BASE_URL = 'https://www.spartan.ng';

export interface StackBlitzProject {
	title: string;
	description: string;
	files: Record<string, string>;
	openFile: string;
}

/**
 * The exact output of running `@spartan-ng/cli:ui` for every component, captured at build time
 * (see the generate-hlm-component-preview generator). Fetched lazily on click - it is ~400KB.
 */
export interface GeneratedProject {
	files: Record<string, string>;
	dependencies: Record<string, string>;
	tsconfigPaths: Record<string, string[]>;
	/**
	 * Sibling files multi-file examples import relatively (e.g. data-table's helper components),
	 * keyed by basename. Written to `src/app/<basename>.ts` when an example imports them.
	 */
	exampleFiles?: Record<string, string>;
}

/**
 * A code snippet is runnable on StackBlitz when it is an Angular component example
 * (declares `@Component`) that pulls in spartan. Install commands, CSS and bare import
 * snippets are not runnable, so the button is hidden for them.
 */
export function isRunnableExample(code: string | null | undefined): boolean {
	if (!code) return false;
	// Examples that import from the docs app itself are not self-contained and cannot run on
	// StackBlitz - e.g. the RTL examples pull in the docs' own `@spartan-ng/app/.../translate.service`.
	if (/@spartan-ng\/app\//.test(code)) return false;
	return code.includes('@Component(') && /@spartan-ng\/(helm|brain)\//.test(code);
}

/**
 * Root-relative asset paths (e.g. "/assets/avatar.png") resolve against the docs site but 404 on
 * StackBlitz, which has no /assets. Point them at the live docs origin so images load. Absolute
 * URLs (https://...) are left untouched.
 */
function rewriteAssetUrls(source: string): string {
	return source.replace(/(["'`(])\/assets\//g, `$1${ASSET_BASE_URL}/assets/`);
}

/** Relative import specifiers in a source string (e.g. `./selection-column`). */
function relativeImportsOf(source: string): string[] {
	return [...source.matchAll(/from\s*['"](\.\/[^'"]+)['"]/g)].map((m) => m[1]);
}

/**
 * Walk the entry's relative imports transitively and gather the bundled sibling files, keyed by
 * their StackBlitz path (`src/app/<basename>.ts`). Siblings come from the generated example-files
 * map (keyed by basename); back-references to the entry were already rewritten to `./example` at
 * generation time. Asset URLs in each sibling are rewritten too.
 */
function resolveSiblingFiles(
	entrySource: string,
	exampleFiles: Record<string, string>,
): { files: Record<string, string>; unresolved: string[] } {
	const files: Record<string, string> = {};
	const unresolved: string[] = [];
	const queue = relativeImportsOf(entrySource);
	const visited = new Set<string>();

	while (queue.length) {
		const spec = queue.shift() as string;
		const base = spec.replace(/^\.\//, '').replace(/\.ts$/, '');
		if (base === 'example' || visited.has(base)) continue;
		visited.add(base);

		const content = exampleFiles[base];
		if (content === undefined) {
			// A relative import with no bundled sibling means the example references a file the
			// project won't contain - opening it would produce a broken "Cannot find module" project.
			unresolved.push(spec);
			continue;
		}

		const rewritten = rewriteAssetUrls(content);
		files[`src/app/${base}.ts`] = rewritten;
		queue.push(...relativeImportsOf(rewritten));
	}

	return { files, unresolved };
}

@Injectable({ providedIn: 'root' })
export class StackBlitzProjectBuilderService {
	private readonly _meta = inject(StackBlitzMetaService);

	/**
	 * Assemble a runnable Angular CLI project for one example on top of the generated project
	 * (the real CLI output for every component). The result mirrors a real spartan app: the
	 * `libs/ui/<component>` folder structure, the exact tsconfig path aliases and dependencies.
	 * Returns `null` if metadata is missing or the snippet is not runnable.
	 */
	buildProject(
		exampleSource: string | null | undefined,
		project: GeneratedProject,
		title = 'spartan/ui example',
	): StackBlitzProject | null {
		const meta = this._meta.meta();
		if (!meta || !isRunnableExample(exampleSource)) {
			return null;
		}
		const source = exampleSource as string;

		// Dependencies: the component deps the generator computed, plus the Angular toolchain.
		// Every `@angular/*` package MUST come from meta's single, mutually-consistent pinned set -
		// the captured project.dependencies carry the generator's loose peer ranges (e.g.
		// "@angular/router": ">=20 <22"). If even one of those leaked through it could resolve to a
		// different Angular major than @angular/build and the build dies with a cryptic
		// "Unsupported change detection strategy" while compiling that package. So drop all
		// `@angular/*` from the component deps and let meta be the sole source of Angular versions.
		const componentDeps = Object.fromEntries(
			Object.entries(project.dependencies).filter(([key]) => !key.startsWith('@angular/')),
		);
		const dependencies: Record<string, string> = {
			...componentDeps,
			...meta.baseDependencies,
			...meta.devDependencies,
		};
		for (const key of Object.keys(dependencies)) {
			if (key.startsWith('@spartan-ng/helm')) delete dependencies[key];
		}

		// Prefer the class attached to the @Component decorator rather than merely the first exported
		// class, which could be a helper or model declared before the component itself.
		const exampleClass =
			source.match(/@Component\([\s\S]*?\)\s*export class (\w+)/)?.[1] ??
			source.match(/export class (\w+)/)?.[1] ??
			'Example';
		const exampleSelector =
			source.match(/selector:\s*['"]([^'"]+)['"]/)?.[1] ??
			exampleClass.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

		const stackblitzSource = rewriteAssetUrls(source);

		// Multi-file examples import sibling files relatively (e.g. data-table's helpers). Walk the
		// entry's relative imports transitively and write each bundled sibling to src/app/<basename>.ts.
		const { files: siblingFiles, unresolved } = resolveSiblingFiles(stackblitzSource, project.exampleFiles ?? {});
		if (unresolved.length) {
			// Bail rather than open a project missing its siblings (single-file examples have no
			// relative imports, so they are never affected by this).
			console.error(`Cannot open this example on StackBlitz - missing bundled file(s): ${unresolved.join(', ')}`);
			return null;
		}

		const files: Record<string, string> = {
			// The real generated component libraries (libs/ui/**) + components.json, verbatim.
			...project.files,
			'package.json': packageJson(dependencies),
			'.npmrc': NPMRC,
			'angular.json': ANGULAR_JSON,
			'.postcssrc.json': POSTCSS,
			'tsconfig.json': tsconfigJson(project.tsconfigPaths),
			'tsconfig.app.json': TSCONFIG_APP,
			'src/index.html': INDEX_HTML,
			'src/main.ts': MAIN_TS,
			'src/styles.css': stylesCss(meta.presetCss),
			...siblingFiles,
			'src/app/example.ts': stackblitzSource,
			'src/app/app.ts': appComponent(exampleClass, exampleSelector),
		};

		return {
			title,
			// The CLI base generator emits vega source only, so every project is the vega theme
			// regardless of the docs' selected style. Label it accurately rather than implying otherwise.
			description: `${title} (vega theme)`,
			files,
			openFile: 'src/app/example.ts',
		};
	}
}
