import { visitNotIgnoredFiles } from '@nx/devkit';
import migrateDatePickerGenerator from '../../migrate-date-picker/generator';
import { type Healthcheck, HealthcheckSeverity } from '../healthchecks';

export const datePickerHealthcheck: Healthcheck = {
	name: 'Helm DatePicker',
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

			// check if the legacy openedChange event is being used
			if (/<(hlm-date-picker)[^>]*\(\s*changed\s*\)=/g.test(contents)) {
				failure('DatePicker is using the renamed changed event.', HealthcheckSeverity.Error, true);
			}
		});
	},
	fix: async (tree) => {
		await migrateDatePickerGenerator(tree, { skipFormat: true });
		return true;
	},
	prompt: 'Would you like to migrate date picker?',
};
