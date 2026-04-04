import type { Style } from '@spartan-ng/registry';
import { useStorage } from 'nitropack/runtime';
import type { PrimitiveSnippets } from '../../core/models/primitives-snippets.model';
import type { ComponentApiData } from '../../core/models/ui-docs.model';

type ManualInstallSnippets = Record<string, Record<Style, string>>;

export const load = async () => {
	const storage = useStorage('assets:data');
	const [docsData, primitivesData, manualInstallSnippets] = await Promise.all([
		storage.getItem('ui-api.json').then((data) => JSON.parse(data as string) as ComponentApiData),
		storage.getItem('primitives-snippets.json').then((data) => JSON.parse(data as string) as PrimitiveSnippets),
		storage.getItem('manual-install-snippets.json').then((data) => JSON.parse(data as string) as ManualInstallSnippets),
	]);
	return { docsData, primitivesData, manualInstallSnippets };
};
