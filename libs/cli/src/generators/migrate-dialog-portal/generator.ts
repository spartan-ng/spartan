import { formatFiles, type Tree } from '@nx/devkit';
import { visitFiles } from '../../utils/visit-files';
import type { MigrateDialogPortalGeneratorSchema } from './schema';

export async function migrateDialogPortalGenerator(
	tree: Tree,
	{ skipFormat, importAlias }: MigrateDialogPortalGeneratorSchema,
) {
	updateImports(tree, importAlias);
	replaceSelector(tree);

	if (!skipFormat) {
		await formatFiles(tree);
	}
}

/**
 * Update imports
 */
function updateImports(tree: Tree, importAlias: string) {
	visitFiles(tree, '/', (path) => {
		// if this is not a typescript file then skip
		if (!path.endsWith('.ts')) {
			return;
		}

		let content = tree.read(path, 'utf-8');

		if (!content) {
			return;
		}

		if (content.includes('*brnDialogContent')) {
			content = content
				.replace("import { BrnDialogImports } from '@spartan-ng/brain/dialog';", '')
				.replace(/BrnDialogImports,?\s?/, '');
		}

		if (content.includes('*brnAlertDialogContent')) {
			content = content
				.replace("import { BrnAlertDialogImports } from '@spartan-ng/brain/alert-dialog';", '')
				.replace(/BrnAlertDialogImports,?\s?/, '');
		}

		if (content.includes('*brnPopoverContent')) {
			content = content
				.replace("import { BrnPopoverImports } from '@spartan-ng/brain/popover';", '')
				.replace(/BrnPopoverImports,?\s?/, '')
				// handle BrnPopoverContent import
				.replace(
					"import { BrnPopoverContent } from '@spartan-ng/brain/popover';",
					"import { HlmPopoverImports } from '@spartan-ng/helm/popover';",
				)
				.replace(/BrnPopoverContent?\s?/, 'HlmPopoverImports');
		}

		if (content.includes('*brnSheetContent')) {
			content = content
				.replace("import { BrnSheetImports } from '@spartan-ng/brain/sheet';", '')
				.replace(/BrnSheetImports,?\s?/, '');
		}

		if (content.includes('*brnNavigationMenuContent')) {
			content = content
				.replace("import { BrnNavigationMenuImports } from '@spartan-ng/brain/navigation-menu';", '')
				.replace(/BrnNavigationMenuImports,?\s?/, '');
		}

		tree.write(path, content);
	});
}

function replaceSelector(tree: Tree) {
	visitFiles(tree, '.', (path) => {
		// if this is not an html file or typescript file (inline templates) then skip
		if (!path.endsWith('.html') && !path.endsWith('.ts')) {
			return;
		}

		let content = tree.read(path, 'utf-8');

		if (!content) {
			return;
		}

		// dialog content
		if (content.includes('*brnDialogContent')) {
			content = content.replace(/\*brnDialogContent/g, '*hlmDialogPortal');
		}

		// alert dialog content
		if (content.includes('*brnAlertDialogContent')) {
			content = content.replace(/\*brnAlertDialogContent/g, '*hlmAlertDialogPortal');
		}

		// popover content
		if (content.includes('*brnPopoverContent')) {
			content = content.replace(/\*brnPopoverContent/g, '*hlmPopoverPortal');
		}

		// sheet content
		if (content.includes('*brnSheetContent')) {
			content = content.replace(/\*brnSheetContent/g, '*hlmSheetPortal');
		}

		// navigation-menu content
		if (content.includes('*brnNavigationMenuContent')) {
			content = content.replace(/\*brnNavigationMenuContent/g, '*hlmNavigationMenuPortal');
		}

		tree.write(path, content);
	});
}

export default migrateDialogPortalGenerator;
