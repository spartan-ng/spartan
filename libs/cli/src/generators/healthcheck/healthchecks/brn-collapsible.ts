import { visitNotIgnoredFiles } from '@nx/devkit';
import { migrateCollapsibleGenerator } from '../../migrate-collapsible/generator';
import { HELM_COLLAPSIBLE_FILES } from '../../migrate-collapsible/helm-collapsible-files';
import { type Healthcheck, HealthcheckSeverity } from '../healthchecks';

export const brainCollapsibleHealthcheck: Healthcheck = {
	name: 'Brain Collapsible',
	async detect(tree, failure) {
		visitNotIgnoredFiles(tree, '/', (file) => {
			// if the file is a .ts or .htlm file, check for helm icons
			if (!file.endsWith('.ts') && !file.endsWith('.html')) {
				return;
			}

			// skip the Helm Collapsible and Trace implementations
			if (HELM_COLLAPSIBLE_FILES.some((name) => file.endsWith(name))) {
				return;
			}

			const contents = tree.read(file, 'utf-8');

			if (!contents) {
				return;
			}

			if (contents.includes("'@spartan-ng/brain/collapsible'") || contents.includes('brn-collapsible')) {
				failure(
					`The <brn-collapsible> component is deprecated. Please use the <hlm-collapsible> instead.`,
					HealthcheckSeverity.Error,
					true,
				);
			}
		});
	},
	fix: async (tree) => {
		await migrateCollapsibleGenerator(tree, { skipFormat: true });
		return true;
	},
	prompt: 'Would you like to migrate brn-collapsible to hlm-collapsible?',
};
