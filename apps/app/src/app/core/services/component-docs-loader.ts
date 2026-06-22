import type { Style } from '@spartan-ng/registry';
import type { PrimitiveSnippets } from '../models/primitives-snippets.model';
import type { ComponentApiData } from '../models/ui-docs.model';
import type { ComponentDocsData } from './component-docs';
import type { StackBlitzMeta } from './stackblitz-meta.service';

// A per-slug file only exists for components that have that kind of data (e.g. data-table has no
// ui-api), so a 404 is treated as empty; any other error is a real failure and propagates.
const sliceOrEmpty = <T extends object>(url: string): Promise<T> =>
	$fetch<T>(url).catch((error) => {
		if (error?.statusCode === 404) return {} as T;
		throw error;
	});

// Loads one component's docs slice from the per-slug data files. The manual install always needs the
// shared `utils` snippet alongside the component's, and StackBlitz meta is global - both fetched too.
export const loadComponentDocs = async (slug: string): Promise<ComponentDocsData> => {
	const [docsData, primitivesData, manualInstall, utilsInstall, stackblitzMeta] = await Promise.all([
		sliceOrEmpty<ComponentApiData>(`/data/ui-api/${slug}.json`),
		sliceOrEmpty<PrimitiveSnippets>(`/data/primitives-snippets/${slug}.json`),
		sliceOrEmpty<Record<string, Record<Style, string>>>(`/data/manual-install-snippets/${slug}.json`),
		$fetch<Record<string, Record<Style, string>>>('/data/manual-install-snippets/utils.json'),
		$fetch<StackBlitzMeta>('/data/stackblitz-meta.json'),
	]);
	return {
		docsData,
		primitivesData,
		manualInstallSnippets: { ...manualInstall, ...utilsInstall },
		stackblitzMeta,
	};
};
