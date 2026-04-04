import type { Style } from '@spartan-ng/registry';
import type { PrimitiveSnippets } from '../../core/models/primitives-snippets.model';
import type { ComponentApiData } from '../../core/models/ui-docs.model';

export const load = async () => {
	const [docsData, primitivesData, manualInstallSnippets] = await Promise.all([
		$fetch<ComponentApiData>('/data/ui-api.json'),
		$fetch<PrimitiveSnippets>('/data/primitives-snippets.json'),
		$fetch<Record<string, Record<Style, string>>>('/data/manual-install-snippets.json'),
	]);
	return { docsData, primitivesData, manualInstallSnippets };
};
