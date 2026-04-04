import type { Style } from '@spartan-ng/registry';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { PrimitiveSnippets } from '../../core/models/primitives-snippets.model';
import type { ComponentApiData } from '../../core/models/ui-docs.model';

type ManualInstallSnippets = Record<string, Record<Style, string>>;

const JSON_ASSET_DIRECTORY = resolve(process.cwd(), 'apps/app/src/public/data');

function resolveJsonAssetPath(fileName: string): string | null {
	const assetPath = resolve(JSON_ASSET_DIRECTORY, fileName);
	return existsSync(assetPath) ? assetPath : null;
}

function readJsonAsset<T>(fileName: string, fallback: T): T {
	const assetPath = resolveJsonAssetPath(fileName);
	if (!assetPath) {
		console.warn(`[components.server] Missing JSON asset: ${fileName}`);
		return fallback;
	}

	return JSON.parse(readFileSync(assetPath, 'utf8')) as T;
}

export const load = async () => {
	const [docsData, primitivesData, manualInstallSnippets] = await Promise.all([
		Promise.resolve(readJsonAsset<ComponentApiData>('ui-api.json', {} as ComponentApiData)),
		Promise.resolve(readJsonAsset<PrimitiveSnippets>('primitives-snippets.json', {} as PrimitiveSnippets)),
		Promise.resolve(readJsonAsset<ManualInstallSnippets>('manual-install-snippets.json', {} as ManualInstallSnippets)),
	]);

	return { docsData, primitivesData, manualInstallSnippets };
};
