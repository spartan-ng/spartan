import { visitNotIgnoredFiles } from '@nx/devkit';
import migrateBrnToggleGroupGenerator from '../../migrate-brn-toggle-group/generator';
import { type Healthcheck, HealthcheckSeverity } from '../healthchecks';

export const brainToggleGroup2Healthcheck: Healthcheck = {
	name: 'Brain Toggle Group',
	async detect(tree, failure) {
		visitNotIgnoredFiles(tree, '/', (file) => {
			// if the file is a .ts or .htlm file
			if (!file.endsWith('.ts') && !file.endsWith('.html')) {
				return;
			}

			// skip HlmToggleGroup itself
			if (file.endsWith('hlm-toggle-group.ts') || file.endsWith('hlm-toggle-group-item.ts')) {
				return;
			}

			const contents = tree.read(file, 'utf-8');

			if (!contents) {
				return;
			}

			if (contents.includes("'@spartan-ng/brain/toggle-group'") || contents.includes('brn-toggle-group')) {
				failure(
					`The <brn-toggle-group> component is deprecated. Please use the <hlm-toggle-group> instead.`,
					HealthcheckSeverity.Error,
					true,
				);
			}
		});
	},
	fix: async (tree) => {
		await migrateBrnToggleGroupGenerator(tree, { skipFormat: true });
		return true;
	},
	prompt: 'Would you like to migrate brn-toggle-group to hlm-toggle-group?',
};
