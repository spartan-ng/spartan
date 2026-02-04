import { visitNotIgnoredFiles } from '@nx/devkit';
import migrateDialogPortalGenerator from '../../migrate-dialog-portal/generator';
import { HealthcheckSeverity, type Healthcheck } from '../healthchecks';

export const helmDialogPortalHealthcheck: Healthcheck = {
	name: 'Helm Dialog Portal',
	async detect(tree, failure) {
		visitNotIgnoredFiles(tree, '/', (file) => {
			// if the file is a .ts or .htlm file, check for helm menu
			if (!file.endsWith('.ts') && !file.endsWith('.html')) {
				return;
			}

			const contents = tree.read(file, 'utf-8');

			if (!contents) {
				return;
			}

			if (
				contents.includes('*brnDialogContent') ||
				contents.includes('*brnAlertDialogContent') ||
				contents.includes('*brnPopoverContent') ||
				contents.includes('*brnSheetContent') ||
				contents.includes('*brnNavigationMenuContent')
			) {
				failure(
					'Please use the new helm directives *hlm*Portal for alert-dialog, dialog, popover, sheet or navigation-menu.',
					HealthcheckSeverity.Error,
					true,
				);
			}
		});
	},
	fix: async (tree, { importAlias }) => {
		await migrateDialogPortalGenerator(tree, { skipFormat: true, importAlias });
		return true;
	},
	prompt:
		'Would you like to migrate *brn*Content selectors to *hlm*Portal? You need to regenerate helm components to have *hlm*Portal in your project.',
};
