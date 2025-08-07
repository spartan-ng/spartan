import { visitNotIgnoredFiles } from '@nx/devkit';
import { migrateSeparatorGenerator } from '../../migrate-separator/generator';
import { Healthcheck, HealthcheckSeverity } from '../healthchecks';

export const brainSeparatorHealthcheck: Healthcheck = {
	name: 'Brain Separator',
	async detect(tree, failure) {
		visitNotIgnoredFiles(tree, '/', (file) => {
			// if the file is a .ts or .htlm file, check for brain separator
			if (!file.endsWith('.ts') && !file.endsWith('.html')) {
				return;
			}

			const contents = tree.read(file, 'utf-8');

			if (!contents) {
				return;
			}

			if (contents.includes('<brn-separator')) {
				failure(
					`The <brn-separator> component is deprecated. Please use the <hlm-separator> instead.`,
					HealthcheckSeverity.Error,
					true,
				);
			}
		});
	},
	fix: async (tree) => {
		await migrateSeparatorGenerator(tree, { skipFormat: true });
		return true;
	},
	prompt: 'Would you like to migrate brain separator?',
};
