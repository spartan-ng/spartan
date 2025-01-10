import { visitNotIgnoredFiles } from '@nx/devkit';
import { migrateIconGenerator } from '../../migrate-icon/generator';
import { Healthcheck, HealthcheckSeverity } from '../healthchecks';

export const helmIconHealthcheck: Healthcheck = {
	name: 'Helm Icons',
	async detect(tree, failure) {
		visitNotIgnoredFiles(tree, '/', (file) => {
			// if the file is a .ts or .htlm file, check for helm icons
			if (!file.endsWith('.ts') && !file.endsWith('.html')) {
				return;
			}

			const contents = tree.read(file, 'utf-8');

			if (!contents) {
				return;
			}

			if (contents.includes('<hlm-icon')) {
				failure(
					`The <hlm-icon> component is deprecated. Please use the <ng-icon hlm> instead.`,
					HealthcheckSeverity.Error,
					true,
				);
			}
		});
	},
	fix: async (tree) => {
		await migrateIconGenerator(tree, { skipFormat: true });
		return true;
	},
	prompt: 'Would you like to migrate helm icons?',
};
