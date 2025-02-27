import { visitNotIgnoredFiles } from '@nx/devkit';
import { hasHelmClasses } from '../../../utils/hlm-class';
import migrateSelectGenerator from '../../migrate-select/generator';
import { Healthcheck, HealthcheckSeverity } from '../healthchecks';

export const selectHealthcheck: Healthcheck = {
	name: 'Helm Select',
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
			if (/<(brn-select|hlm-select)[^>]*\(\s*openedChange\s*\)=/g.test(contents)) {
				failure('Select is using the renamed openedChange event.', HealthcheckSeverity.Error, true);
			}

			// check if the legacy focus classes are being used
			if (
				hasHelmClasses(tree, file, {
					component: 'HlmSelectOptionComponent',
					classes: ['focus:bg-accent', 'focus:text-accent-foreground'],
				})
			) {
				failure('Select option is using the legacy focus classes.', HealthcheckSeverity.Error, true);
			}
		});
	},
	fix: async (tree) => {
		await migrateSelectGenerator(tree, { skipFormat: true });
		return true;
	},
	prompt: 'Would you like to migrate selects?',
};
