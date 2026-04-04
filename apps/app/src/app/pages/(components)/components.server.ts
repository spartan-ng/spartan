import type { Style } from '@spartan-ng/registry';
import { useStorage } from 'nitropack/runtime';
import type { PrimitiveSnippets } from '../../core/models/primitives-snippets.model';
import type { ComponentApiData } from '../../core/models/ui-docs.model';

type ManualInstallSnippets = Record<string, Record<Style, string>>;

async function readJsonAsset<T>(storage: ReturnType<typeof useStorage>, fileName: string, fallback: T): Promise<T> {
	const data = await storage.getItem<T>(fileName);

	if (data == null) {
		console.warn(`[components.server] Missing JSON asset: ${fileName}`);
		return fallback;
	}

	return data;
}

export const load = async () => {
	const storage = useStorage('assets:data');
	const [docsData, primitivesData, manualInstallSnippets] = await Promise.all([
		readJsonAsset<ComponentApiData>(storage, 'ui-api.json', {} as ComponentApiData),
		readJsonAsset<PrimitiveSnippets>(storage, 'primitives-snippets.json', {} as PrimitiveSnippets),
		readJsonAsset<ManualInstallSnippets>(storage, 'manual-install-snippets.json', {} as ManualInstallSnippets),
	]);
	return { docsData, primitivesData, manualInstallSnippets };
};
