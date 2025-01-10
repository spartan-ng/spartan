import { visitNotIgnoredFiles } from '@nx/devkit';
import { migrateScrollAreaGenerator } from '../../migrate-scroll-area/generator';
import { Healthcheck, HealthcheckSeverity } from '../healthchecks';

export const scrollAreaHealthcheck: Healthcheck = {
	name: 'Helm Scroll Area',
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

			if (contents.includes('<hlm-scroll-area')) {
				failure(
					`The <hlm-scroll-area> component is deprecated. Please use the <ng-scrollbar hlm> instead.`,
					HealthcheckSeverity.Error,
					true,
				);
			}
		});
	},
	fix: async (tree) => {
		await migrateScrollAreaGenerator(tree, { skipFormat: true });
		return true;
	},
	prompt: 'Would you like to migrate helm scroll areas?',
};
