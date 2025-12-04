import { formatFiles, type Tree } from '@nx/devkit';
import { visitFiles } from '../../utils/visit-files';
import type { MigrateDialogGeneratorSchema } from './schema';

export const ignoreFiles = ['hlm-alert-dialog-trigger.ts', 'hlm-dialog-trigger.ts', 'hlm-popover-trigger.ts'];

export async function migrateDialogGenerator(tree: Tree, { skipFormat }: MigrateDialogGeneratorSchema) {
	replaceSelector(tree);

	if (!skipFormat) {
		await formatFiles(tree);
	}
}

function replaceSelector(tree: Tree) {
	visitFiles(tree, '.', (path) => {
		// if this is not an html file or typescript file (inline templates) then skip
		if (!path.endsWith('.html') && !path.endsWith('.ts')) {
			return;
		}

		if (ignoreFiles.some((menuFile) => path.endsWith(menuFile))) {
			return;
		}

		let content = tree.read(path, 'utf-8');

		if (!content) {
			return;
		}

		// alert-dialog trigger
		if (content.includes('brnAlertDialogTrigger')) {
			content = content
				.replace(/brnAlertDialogTrigger/g, 'hlmAlertDialogTrigger')
				.replace(/brnAlertDialogTriggerFor/g, 'hlmAlertDialogTriggerFor');
		}

		// dialog trigger
		if (content.includes('brnDialogTrigger')) {
			content = content
				.replace(/brnDialogTrigger/g, 'hlmDialogTrigger')
				.replace(/brnDialogTriggerFor/g, 'hlmDialogTriggerFor');
		}

		// popover trigger
		if (content.includes('brnPopoverTrigger')) {
			content = content
				.replace(/brnPopoverTrigger/g, 'hlmPopoverTrigger')
				.replace(/brnPopoverTriggerFor/g, 'hlmPopoverTriggerFor');
		}

		// popover
		if (content.includes('brn-popover')) {
			content = content.replace(/brn-popover/g, 'hlm-popover');
		}

		// sheet trigger
		if (content.includes('brnSheetTrigger')) {
			content = content.replace(/brnSheetTrigger/g, 'hlmSheetTrigger');
		}

		tree.write(path, content);
	});
}

export default migrateDialogGenerator;
