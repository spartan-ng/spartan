import type { ExecutorContext } from '@nx/devkit';
import { createStyleMap, transformStyle } from '@spartan-ng/cli';
import fs from 'fs';
import path from 'path';

const STYLES = ['vega', 'lyra', 'maia', 'mira', 'nova', 'luma'] as const;
type Style = (typeof STYLES)[number];

function shouldIgnoreImport(importLine: string) {
	const match = importLine.match(/from\s+['"](.*)['"]/);
	if (!match) return false;

	const source = match[1];
	return source.startsWith('./') || source.startsWith('../');
}

function extractHlmImportsBlock(content: string): string | null {
	const match = content.match(/export\s+const\s+Hlm\w+Imports[\s\S]*?as const;/m);
	return match ? match[0].trim() : null;
}

function mergeImports(imports: string[]) {
	const importMap = new Map<
		string,
		{
			default?: string;
			namespace?: string;
			named: Set<string>;
			typeNamed: Set<string>;
		}
	>();

	for (const imp of imports) {
		const match = imp.match(/import\s+(.*)\s+from\s+['"](.*)['"]/s);
		if (!match) continue;

		const clause = match[1].trim();
		const source = match[2];

		if (!importMap.has(source)) {
			importMap.set(source, {
				named: new Set(),
				typeNamed: new Set(),
			});
		}

		const entry = importMap.get(source)!;

		const nsMatch = clause.match(/\*\s+as\s+(\w+)/);
		if (nsMatch) {
			entry.namespace = nsMatch[1];
			continue;
		}

		const namedMatch = clause.match(/\{([\s\S]*)\}/);
		if (namedMatch) {
			const beforeBrace = clause.slice(0, clause.indexOf('{')).replace(',', '').trim();
			if (beforeBrace && !beforeBrace.startsWith('*')) {
				entry.default = beforeBrace;
			}

			const names = namedMatch[1]
				.split(',')
				.map((s) => s.trim())
				.filter(Boolean);

			for (const n of names) {
				if (n.startsWith('type ')) {
					entry.typeNamed.add(n.replace('type ', '').trim());
				} else {
					entry.named.add(n);
				}
			}
			continue;
		}

		entry.default = clause;
	}

	const result: string[] = [];

	for (const [source, data] of importMap) {
		const parts: string[] = [];

		if (data.default) parts.push(data.default);
		if (data.namespace) parts.push(`* as ${data.namespace}`);

		const named = [...[...data.named].sort(), ...[...data.typeNamed].sort().map((t) => `type ${t}`)];

		if (named.length) {
			parts.push(`{ ${named.join(', ')} }`);
		}

		result.push(`import ${parts.join(', ')} from '${source}';`);
	}

	return result.sort();
}

function extractImports(code: string) {
	const importRegex = /import[\s\S]*?from\s+['"][^'"]+['"];?/g;

	const imports = (code.match(importRegex) ?? []).filter((i) => !shouldIgnoreImport(i));

	const body = code.replace(importRegex, '').trim();

	return { imports, body };
}

function getComponentDirectories(rootDir: string, basePath: string): string[] {
	const fullPath = path.join(rootDir, basePath);
	if (!fs.existsSync(fullPath)) {
		console.warn(`Base components directory not found: ${basePath}`);
		return [];
	}

	return fs.readdirSync(fullPath).filter((name) => {
		const childPath = path.join(fullPath, name);
		return fs.statSync(childPath).isDirectory();
	});
}

function walkFiles(dir: string): string[] {
	if (!fs.existsSync(dir)) return [];
	const results: string[] = [];
	const entries = fs.readdirSync(dir, { withFileTypes: true });
	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			results.push(...walkFiles(fullPath));
		} else {
			results.push(fullPath);
		}
	}
	return results;
}

export default async function runExecutor(_options: Record<string, never>, context: ExecutorContext) {
	console.log('[hlm-preview] Generating manual install snippets...');

	const componentsDir = 'apps/app/src/app/pages/(components)/components';
	const componentDirs = getComponentDirectories(context.root, componentsDir);
	componentDirs.push(...['utils', 'typography']);

	const styleMaps: Record<Style, ReturnType<typeof createStyleMap>> = {} as never;

	for (const theme of STYLES) {
		const cssPath = path.join(context.root, `libs/registry/src/styles/style-${theme}.css`);
		if (!fs.existsSync(cssPath)) {
			console.warn(`Missing style file for theme: ${theme}`);
			continue;
		}
		const css = fs.readFileSync(cssPath, 'utf-8');
		styleMaps[theme] = createStyleMap(css);
	}

	const result: Record<string, Record<Style, string>> = {};

	for (const primitiveName of componentDirs) {
		const name = primitiveName.replace('(', '').replace(')', '');
		const baseDir = path.join(context.root, `libs/cli/src/generators/ui/libs/${name}/files`);

		const files = walkFiles(baseDir);

		if (files.length === 0) {
			console.warn(`Skipping empty primitive: ${name}`);
			continue;
		}

		result[name] = {} as Record<Style, string>;

		for (const theme of STYLES) {
			const styleMap = styleMaps[theme];
			if (!styleMap) continue;

			const importSet = new Set<string>();
			const bodies: string[] = [];
			let hlmImportBlock: string | null = null;

			for (const filePath of files) {
				const content = fs.readFileSync(filePath, 'utf-8');
				if (!content?.trim()) continue;

				if (filePath.endsWith('index.ts.template')) {
					hlmImportBlock = extractHlmImportsBlock(content);
					continue;
				}

				const transformed = await transformStyle(content, { styleMap });

				const { imports, body } = extractImports(transformed);

				imports.forEach((i) => importSet.add(i.trim().replaceAll('<%- importAlias %>', '@spartan-ng/helm')));

				if (body.trim()) {
					bodies.push(body);
				}
			}

			if (bodies.length === 0) {
				console.warn(`Skipping empty primitive (${theme}): ${name}`);
				continue;
			}

			const mergedImports = mergeImports([...importSet]).join('\n');
			const mergedBody = bodies.join('\n\n');

			const finalParts = [mergedImports, mergedBody];

			if (hlmImportBlock) {
				finalParts.push(hlmImportBlock);
			}

			result[name][theme] = finalParts.join('\n\n');
		}
	}

	const outputPath = path.join(context.root, 'apps/app/src/public/data/manual-install-snippets.json');
	const outputDir = path.dirname(outputPath);
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true });
	}
	fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));

	console.log('[hlm-preview] Snippets generated at apps/app/src/public/data/manual-install-snippets.json');
	console.log('[hlm-preview] Done!');
	return { success: true };
}
