import { joinPathFragments, readJson, type Tree } from '@nx/devkit';
import { registryItemSchema, registrySchema, stripTemplateExtension, type RegistryItem } from '../../registry';
import { createFirstPartyRegistryItems } from '../ui/registry/first-party';
import type { SpartanRegistryBuildSchema } from './schema';

function withFileContents(tree: Tree, item: RegistryItem): RegistryItem {
	return registryItemSchema.parse({
		...item,
		files: item.files?.map((file) => {
			if (file.content) {
				return file;
			}
			const path = stripTemplateExtension(file.path);
			const content = tree.exists(file.path)
				? tree.read(file.path, 'utf-8')
				: tree.exists(path)
					? tree.read(path, 'utf-8')
					: undefined;
			return { ...file, content };
		}),
	});
}

function deleteRegistryJsonFiles(tree: Tree, path: string) {
	if (tree.isFile(path)) {
		if (path.endsWith('.json')) {
			tree.delete(path);
		}
		return;
	}

	for (const child of tree.children(path)) {
		deleteRegistryJsonFiles(tree, joinPathFragments(path, child));
	}
}

export default async function registryBuildGenerator(tree: Tree, options: SpartanRegistryBuildSchema) {
	const output = options.output ?? 'public/r';
	const items = options.registry
		? registrySchema.parse(readJson(tree, options.registry)).items.map((item) => withFileContents(tree, item))
		: await createFirstPartyRegistryItems();

	deleteRegistryJsonFiles(tree, output);

	for (const item of items) {
		tree.write(joinPathFragments(output, `${item.name}.json`), JSON.stringify(registryItemSchema.parse(item), null, 2));
	}

	tree.write(
		joinPathFragments(output, 'registry.json'),
		JSON.stringify(
			registrySchema.parse({
				name: 'spartan',
				homepage: 'https://www.spartan.ng',
				items: items.map(({ files: _files, ...item }) => item),
			}),
			null,
			2,
		),
	);
}
