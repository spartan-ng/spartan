import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { RegistryItem, RegistryItemFile } from '../../../registry';
import { STYLES } from '../../../utils/supported-styles';
import { createStyleMap } from '../../base/lib/styles/create-style-map';
import { primitiveDependencies } from '../primitive-deps';
import type { Primitive } from '../primitives';
import supportedUiLibraries from '../supported-ui-libraries.json';

const removeHelmKeys = (obj: Record<string, string>) =>
	Object.fromEntries(Object.entries(obj).filter(([key]) => !key.toLowerCase().includes('helm')));

function dependencyToString([pkg, version]: [string, string]) {
	return `${pkg}@${version}`;
}

let firstPartyStyleMaps: RegistryItem['styleMaps'];

async function readFirstPartyStyleCss(style: string) {
	const candidates = [
		path.join(__dirname, '..', `style-${style}.css`),
		path.join(__dirname, '..', '..', '..', '..', '..', 'registry', 'src', 'styles', `style-${style}.css`),
	];

	for (const candidate of candidates) {
		try {
			return await fs.readFile(candidate, 'utf-8');
		} catch {
			// Try the next source/built asset location.
		}
	}

	throw new Error(`Unable to locate Spartan style CSS for "${style}".`);
}

async function createFirstPartyStyleMaps(): Promise<NonNullable<RegistryItem['styleMaps']>> {
	if (firstPartyStyleMaps) {
		return firstPartyStyleMaps;
	}

	firstPartyStyleMaps = Object.fromEntries(
		await Promise.all(
			STYLES.map(async (style) => {
				const css = await readFirstPartyStyleCss(style);
				return [style, createStyleMap(css)] as const;
			}),
		),
	);

	return firstPartyStyleMaps;
}

async function collectTemplateFiles(dir: string, root = dir): Promise<RegistryItemFile[]> {
	const entries = await fs.readdir(dir, { withFileTypes: true });
	const files: RegistryItemFile[] = [];

	for (const entry of entries) {
		const absolutePath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			files.push(...(await collectTemplateFiles(absolutePath, root)));
			continue;
		}

		const relativePath = path.relative(root, absolutePath).replace(/\\/g, '/');
		files.push({
			path: relativePath,
			target: relativePath.endsWith('.template') ? relativePath.slice(0, -'.template'.length) : relativePath,
			type: 'registry:ui',
			content: await fs.readFile(absolutePath, 'utf-8'),
		});
	}

	return files;
}

export async function createFirstPartyRegistryItem(name: string): Promise<RegistryItem | null> {
	const primitive = name as Primitive;
	if (!(primitive in supportedUiLibraries)) {
		return null;
	}

	const component = supportedUiLibraries[primitive];
	const filesDir = path.join(__dirname, '..', 'libs', component.name, 'files');
	const dependencies = Object.entries(removeHelmKeys(component.peerDependencies ?? {})).map(dependencyToString);
	const registryDependencies = (primitiveDependencies[primitive] ?? []).map((dependency) => `@spartan/${dependency}`);

	return {
		$schema: 'https://www.spartan.ng/schema/registry-item.json',
		name: component.name,
		type: 'registry:ui',
		dependencies,
		devDependencies: [],
		registryDependencies,
		styleMaps: await createFirstPartyStyleMaps(),
		files: await collectTemplateFiles(filesDir),
	};
}

export async function createFirstPartyRegistryItems(names?: string[]): Promise<RegistryItem[]> {
	const allNames = Object.keys(supportedUiLibraries).sort();
	const selectedNames = names?.length ? names : allNames;
	const items = await Promise.all(selectedNames.map((name) => createFirstPartyRegistryItem(name)));
	return items.filter((item): item is RegistryItem => !!item);
}
