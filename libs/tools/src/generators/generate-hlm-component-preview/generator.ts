import { joinPathFragments, logger, type Tree, visitNotIgnoredFiles } from '@nx/devkit';
import { createStyleMap, transformStyle } from '@spartan-ng/cli';

function shouldIgnoreImport(importLine: string) {
	const match = importLine.match(/from\s+['"](.*)['"]/);
	if (!match) return false;

	const source = match[1];

	// relative imports innerhalb des primitives ignorieren
	if (source.startsWith('./') || source.startsWith('../')) {
		return true;
	}

	return false;
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

function getComponentDirectories(tree: Tree, basePath: string): string[] {
	if (!tree.exists(basePath)) {
		logger.warn(`Base components directory not found: ${basePath}`);
		return [];
	}

	return tree.children(basePath).filter((name) => {
		const fullPath = joinPathFragments(basePath, name);
		return tree.isFile(fullPath) === false; // Only directories
	});
}

function extractImports(code: string) {
	const importRegex = /import[\s\S]*?from\s+['"][^'"]+['"];?/g;

	const imports = (code.match(importRegex) ?? []).filter((i) => !shouldIgnoreImport(i));

	const body = code.replace(importRegex, '').trim();

	return { imports, body };
}

export async function generateHlmComponentManualInstallation(tree: Tree): Promise<void> {
	logger.info('Extract Primitive Code generator running...');

	const componentsDir = 'apps/app/src/app/pages/(components)/components';
	const componentDirs = getComponentDirectories(tree, componentsDir);

	const styleContent = tree.read('libs/registry/src/styles/style-vega.css', 'utf-8');

	const styleMap = createStyleMap(styleContent);

	const allPrimitivesSnippets: Record<string, string> = {};

	if (componentDirs.length === 0) {
		logger.info('No component directories found. Writing empty snippets file.');
	} else {
		logger.info(`Found ${componentDirs.length} component directories.`);
	}

	for (const primitiveName of componentDirs) {
		const name = primitiveName.replace('(', '').replace(')', '');
		const templateDir = `libs/cli/src/generators/ui/libs/${name}/files/lib`;

		const files: string[] = [];
		visitNotIgnoredFiles(tree, templateDir, (filePath) => {
			files.push(filePath);
		});

		if (files.length === 0) {
			logger.warn(`Skipping empty primitive: ${name}`);
			continue;
		}

		const importSet = new Set<string>();
		const bodies: string[] = [];
		for (const filePath of files) {
			const content = tree.read(filePath, 'utf-8');
			if (!content) continue;

			const transformed = await transformStyle(content, { styleMap });

			const { imports, body } = extractImports(transformed);

			imports.forEach((i) => importSet.add(i.trim().replaceAll('<%- importAlias %>', '@spartan-ng/helm')));

			bodies.push(body);
		}

		allPrimitivesSnippets[name] = mergeImports([...importSet]).join('\n') + '\n\n' + bodies.join('\n\n');
		const outputPath = 'apps/app/src/public/data/manual-install-snippets.json';
		tree.write(outputPath, JSON.stringify(allPrimitivesSnippets, null, 2));
	}
}

export default generateHlmComponentManualInstallation;
