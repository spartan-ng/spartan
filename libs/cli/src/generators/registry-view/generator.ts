import { readJson, type Tree } from '@nx/devkit';
import { resolveRegistryItemList } from '../../registry';
import { createFirstPartyRegistryItem } from '../ui/registry/first-party';
import type { SpartanRegistryViewSchema } from './schema';

export default async function registryViewGenerator(tree: Tree, options: SpartanRegistryViewSchema) {
	const config = tree.exists('components.json') ? readJson(tree, 'components.json') : {};
	const items = options.items
		.split(',')
		.map((item) => item.trim())
		.filter(Boolean);
	const payload = await resolveRegistryItemList(items, config, { builtinItemFactory: createFirstPartyRegistryItem });
	console.log(JSON.stringify(payload, null, 2));
}
