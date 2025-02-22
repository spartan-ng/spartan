import { visitNotIgnoredFiles } from '@nx/devkit';
import { migrateRadioGenerator } from '../../migrate-radio/generator';
import { Healthcheck, HealthcheckSeverity } from '../healthchecks';

export const brainRadioHealthcheck: Healthcheck = {
	name: 'Brain Radio',
	async detect(tree, failure) {
		visitNotIgnoredFiles(tree, '/', (file) => {
			// if the file is a .ts or .htlm file, check for brain radio
			if (!file.endsWith('.ts') && !file.endsWith('.html')) {
				return;
			}

			const contents = tree.read(file, 'utf-8');

			if (!contents) {
				return;
			}

			if (contents.includes('<brn-radio')) {
				failure(
					`The <brn-radio> component is deprecated. Please use the <hlm-radio> instead.`,
					HealthcheckSeverity.Error,
					true,
				);
			}
		});
	},
	fix: async (tree) => {
		await migrateRadioGenerator(tree, { skipFormat: true });
		return true;
	},
	prompt: 'Would you like to migrate brain radio?',
};
