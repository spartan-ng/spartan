import { formatFiles, joinPathFragments, logger, type Tree, visitNotIgnoredFiles } from '@nx/devkit';
import { createStyleMap, transformStyle } from '@spartan-ng/cli';

const THEMES = ['lyra', 'maia', 'mira', 'nova', 'vega'] as const;
type Theme = (typeof THEMES)[number];

function shouldIgnoreImport(importLine: string) {
	const match = importLine.match(/from\s+['"](.*)['"]/);
	if (!match) return false;

	const source = match[1];
	return source.startsWith('./') || source.startsWith('../');
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

function getComponentDirectories(tree: Tree, basePath: string): string[] {
	if (!tree.exists(basePath)) {
		logger.warn(`Base components directory not found: ${basePath}`);
		return [];
	}

	return tree.children(basePath).filter((name) => {
		const fullPath = joinPathFragments(basePath, name);
		return !tree.isFile(fullPath);
	});
}

export async function generateHlmComponentManualInstallation(tree: Tree): Promise<void> {
	logger.info('Generating manual install snippets...');

	const componentsDir = 'apps/app/src/app/pages/(components)/components';
	const componentDirs = getComponentDirectories(tree, componentsDir);
	componentDirs.push(...['utils', 'typography']);
	const styleMaps: Record<Theme, ReturnType<typeof createStyleMap>> = {} as never;

	for (const theme of THEMES) {
		const css = tree.read(`libs/registry/src/styles/style-${theme}.css`, 'utf-8');
		if (!css) {
			logger.warn(`Missing style file for theme: ${theme}`);
			continue;
		}
		styleMaps[theme] = createStyleMap(css);
	}

	const result: Record<string, Record<Theme, string>> = {};

	for (const primitiveName of componentDirs) {
		const name = primitiveName.replace('(', '').replace(')', '');
		const templateDir = `libs/cli/src/generators/ui/libs/${name}/files/lib`;

		const files: string[] = [];
		visitNotIgnoredFiles(tree, templateDir, (filePath) => files.push(filePath));

		if (files.length === 0) {
			logger.warn(`Skipping empty primitive: ${name}`);
			continue;
		}

		result[name] = {} as Record<Theme, string>;

		for (const theme of THEMES) {
			const styleMap = styleMaps[theme];
			if (!styleMap) continue;

			const importSet = new Set<string>();
			const bodies: string[] = [];

			for (const filePath of files) {
				const content = tree.read(filePath, 'utf-8');
				if (!content?.trim()) continue;

				const transformed = await transformStyle(content, { styleMap });

				const { imports, body } = extractImports(transformed);

				imports.forEach((i) => importSet.add(i.trim().replaceAll('<%- importAlias %>', '@spartan-ng/helm')));

				if (body.trim()) {
					bodies.push(body);
				}
			}

			if (bodies.length === 0) {
				logger.warn(`Skipping empty primitive (${theme}): ${name}`);
				continue;
			}

			result[name][theme] = mergeImports([...importSet]).join('\n') + '\n\n' + bodies.join('\n\n');
		}
	}

	const outputPath = 'apps/app/src/public/data/manual-install-snippets.json';
	tree.write(outputPath, JSON.stringify(result, null, 2));

	await formatFiles(tree);
	logger.info(`Snippets generated at ${outputPath}`);
}

export default generateHlmComponentManualInstallation;
