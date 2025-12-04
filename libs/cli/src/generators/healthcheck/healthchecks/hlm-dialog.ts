import { visitNotIgnoredFiles } from '@nx/devkit';
import migrateMenuGenerator, { ignoreFiles } from '../../migrate-dialog/generator';
import { HealthcheckSeverity, type Healthcheck } from '../healthchecks';

export const helmDialogHealthcheck: Healthcheck = {
	name: 'Helm Menu',
	async detect(tree, failure, _) {
		visitNotIgnoredFiles(tree, '/', (file) => {
			// if the file is a .ts or .htlm file, check for helm menu
			if (!file.endsWith('.ts') && !file.endsWith('.html')) {
				return;
			}

			// skip itself
			if (ignoreFiles.some((menuFile) => file.endsWith(menuFile))) {
				return;
			}

			const contents = tree.read(file, 'utf-8');

			if (!contents) {
				return;
			}

			if (
				contents.includes('brnAlertDialogTrigger') ||
				contents.includes('brnDialogTrigger') ||
				contents.includes('brnPopoverTrigger') ||
				contents.includes('brn-popover') ||
				contents.includes('brnSheetTrigger')
			) {
				failure(
					`Please use the new helm directives for alert-dialog, dialog, popover or sheet.`,
					HealthcheckSeverity.Error,
					true,
				);
			}
		});
	},
	fix: async (tree, { importAlias }) => {
		await migrateMenuGenerator(tree, { skipFormat: true, importAlias });
		return true;
	},
	prompt:
		'Would you like to migrate alert-dialog/dialog/popover/sheet selectors? You need to generate the new helm components for alert-dialog, dialog, popover or sheet.',
};
