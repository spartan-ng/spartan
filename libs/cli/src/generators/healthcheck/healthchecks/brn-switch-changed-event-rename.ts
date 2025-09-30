import { visitNotIgnoredFiles } from '@nx/devkit';
import migrateBrnSwitchChangedEvent from '../../migrate-brn-switch-changed-event/generator';
import { type Healthcheck, HealthcheckSeverity } from '../healthchecks';

export const brnSwitchChangedEventRename: Healthcheck = {
	name: 'Switch changed event rename',
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
			if (/<(brn-switch)[^>]*\(\s*changed\s*\)=/g.test(contents)) {
				failure('Switch is using the renamed changed event.', HealthcheckSeverity.Error, true);
			}
		});
	},
	fix: async (tree) => {
		await migrateBrnSwitchChangedEvent(tree, { skipFormat: true });
		return true;
	},
	prompt: 'Would you like to migrate brn-switch changed event rename?',
};
