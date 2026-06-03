import type { Style } from '@spartan-ng/registry';
import type { PrimitiveSnippets } from '../../core/models/primitives-snippets.model';
import type { ComponentApiData } from '../../core/models/ui-docs.model';
import type { StackBlitzMeta } from '../../core/services/stackblitz-meta.service';

export const load = async () => {
	const [docsData, primitivesData, manualInstallSnippets, stackblitzMeta] = await Promise.all([
		$fetch<ComponentApiData>('/data/ui-api.json'),
		$fetch<PrimitiveSnippets>('/data/primitives-snippets.json'),
		$fetch<Record<string, Record<Style, string>>>('/data/manual-install-snippets.json'),
		$fetch<StackBlitzMeta>('/data/stackblitz-meta.json'),
	]);
	return { docsData, primitivesData, manualInstallSnippets, stackblitzMeta };
};
