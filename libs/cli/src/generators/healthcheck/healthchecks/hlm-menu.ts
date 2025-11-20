import { visitNotIgnoredFiles } from '@nx/devkit';
import migrateMenuGenerator from '../../migrate-menu/generator';
import { HealthcheckSeverity, type Healthcheck } from '../healthchecks';

export const helmMenuHealthcheck: Healthcheck = {
	name: 'Helm Menu',
	async detect(tree, failure, _, { importAlias }) {
		visitNotIgnoredFiles(tree, '/', (file) => {
			// if the file is a .ts or .htlm file, check for helm menu
			if (!file.endsWith('.ts') && !file.endsWith('.html')) {
				return;
			}

			const contents = tree.read(file, 'utf-8');

			if (!contents) {
				return;
			}

			// TODO also check importAlis for helm?
			if (contents.includes("'@spartan-ng/brain/menu'") || contents.includes("'@spartan-ng/helm/menu'")) {
				failure(
					`The <hlm-icon> component is deprecated. Please use the <ng-icon hlm> instead.`,
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
		"Would you like to migrate '@spartan-ng/helm/menu'? Generate the new helm components for dropdown-menu, context-menu or menubar.  ",
};
