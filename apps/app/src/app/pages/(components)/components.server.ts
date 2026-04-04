import type { Style } from '@spartan-ng/registry';
import { useStorage } from 'nitropack/runtime';
import type { PrimitiveSnippets } from '../../core/models/primitives-snippets.model';
import type { ComponentApiData } from '../../core/models/ui-docs.model';

type ManualInstallSnippets = Record<string, Record<Style, string>>;

export const load = async () => {
	const storage = useStorage('assets:data');
	const [docsData, primitivesData, manualInstallSnippets] = await Promise.all([
		storage.getItem<ComponentApiData>('ui-api.json'),
		storage.getItem<PrimitiveSnippets>('primitives-snippets.json'),
		storage.getItem<ManualInstallSnippets>('manual-install-snippets.json'),
	]);
	if (!docsData || !primitivesData || !manualInstallSnippets) {
		throw new Error('Failed to load required data files');
	}
	return { docsData, primitivesData, manualInstallSnippets };
};
