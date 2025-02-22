import { formatFiles, generateFiles, joinPathFragments, names, Tree } from '@nx/devkit';
import * as path from 'path';
import { HelmDocumentationGeneratorSchema } from './schema';

export async function helmDocumentationGenerator(tree: Tree, options: HelmDocumentationGeneratorSchema) {
	const documentationPath = joinPathFragments('apps', 'app', 'src', 'app', 'pages', '(components)', 'components');

	generateFiles(tree, path.join(__dirname, 'files'), documentationPath, {
		name: options.name,
		description: options.description,
		...names(options.name),
		previewComponentName: `${names(options.name).className}PreviewComponent`,
		pageComponentName: `${names(options.name).className}PageComponent`,
	});
	await formatFiles(tree);
}

export default helmDocumentationGenerator;
