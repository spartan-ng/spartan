import { visitNotIgnoredFiles } from '@nx/devkit';
import migrateProgressGenerator from '../../migrate-progress/generator';
import { type Healthcheck, HealthcheckSeverity } from '../healthchecks';

export const progressHealthcheck: Healthcheck = {
	name: 'Helm Progress',
	async detect(tree, failure) {
		visitNotIgnoredFiles(tree, '/', (file) => {
			// if the file is a .ts or .html file, check for helm progress components
			if (!file.endsWith('.ts') && !file.endsWith('.html')) {
				return;
			}

			const contents = tree.read(file, 'utf-8');

			if (!contents) {
				return;
			}

			// find any brn-progress html elements that also have a hlm attribute using regex
			const regex = /<brn-progress[^>]*hlm[^>]*>/g;
			const matches = contents.match(regex);

			if (matches) {
				failure(
					`The <brn-progress hlm> component is deprecated. Please use the <hlm-progress> instead.`,
					HealthcheckSeverity.Error,
					true,
				);
			}
		});
	},
	fix: async (tree) => {
		await migrateProgressGenerator(tree, { skipFormat: true });
		return true;
	},
	prompt: 'Would you like to migrate helm progress components?',
};
