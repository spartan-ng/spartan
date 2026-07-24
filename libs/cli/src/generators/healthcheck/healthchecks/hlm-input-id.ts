import { visitNotIgnoredFiles } from '@nx/devkit';
import migrateInputIdGenerator from '../../migrate-input-id/generator';
import { type Healthcheck, HealthcheckSeverity } from '../healthchecks';

const inputIdSelectors = ['hlm-checkbox', 'hlm-switch', 'hlm-radio', 'hlm-command-input'];
const legacyInputIdPattern = new RegExp(
	`<(${inputIdSelectors.join('|')})\\b[^>]*(\\sid\\s*=|\\s\\[id\\]\\s*=|\\sbind-id\\s*=)`,
);

export const hlmInputIdHealthcheck: Healthcheck = {
	name: 'Helm input id rename',
	async detect(tree, failure) {
		visitNotIgnoredFiles(tree, '/', (file) => {
			if (!file.endsWith('.ts') && !file.endsWith('.html')) {
				return;
			}

			const contents = tree.read(file, 'utf-8');

			if (!contents) {
				return;
			}

			if (legacyInputIdPattern.test(contents)) {
				failure('Helm components are using the renamed id input.', HealthcheckSeverity.Error, true);
			}
		});
	},
	fix: async (tree) => {
		await migrateInputIdGenerator(tree, { skipFormat: true });
		return true;
	},
	prompt: 'Would you like to migrate renamed Helm id inputs?',
};
