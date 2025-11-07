import { visitNotIgnoredFiles } from '@nx/devkit';
import migrateToggleGenerator from '../../migrate-toggle/generator';
import { type Healthcheck, HealthcheckSeverity } from '../healthchecks';

export const brainToggleHealthcheck: Healthcheck = {
	name: 'Brain Toggle',
	async detect(tree, failure) {
		visitNotIgnoredFiles(tree, '/', (file) => {
			// if the file is a .ts or .htlm file, check for brain toggle
			if (!file.endsWith('.ts') && !file.endsWith('.html')) {
				return;
			}

			// if it is the HlmToggle itself skip it.
			if (file.endsWith('hlm-toggle.ts')) {
				return;
			}

			const contents = tree.read(file, 'utf-8');

			if (!contents) {
				return;
			}

			if (
				contents.includes("import { BrnToggle } from '@spartan-ng/brain/toggle';") ||
				contents.includes('brnToggle')
			) {
				failure(`The brnToggle directive can be replace with hlmToggle instead.`, HealthcheckSeverity.Error, true);
			}
		});
	},
	fix: async (tree) => {
		await migrateToggleGenerator(tree, { skipFormat: true });
		return true;
	},
	prompt: 'Would you like to migrate brain toggle?',
};
