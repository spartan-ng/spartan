import { visitNotIgnoredFiles } from '@nx/devkit';
import { migrateCoreGenerator } from '../../migrate-core/generator';
import { Healthcheck, HealthcheckSeverity } from '../healthchecks';

export const coreImportsHealthcheck: Healthcheck = {
	name: 'Core imports',
	async detect(tree, failure) {
		visitNotIgnoredFiles(tree, '/', (file) => {
			// if the file is a .ts file, check for core imports
			if (!file.endsWith('.ts')) {
				return;
			}

			const contents = tree.read(file, 'utf-8');

			if (!contents) {
				return;
			}

			if (contents.includes('@spartan-ng/ui-core')) {
				failure(
					`The import @spartan-ng/ui-core is deprecated. Please use the @spartan-ng/brain/core package instead.`,
					HealthcheckSeverity.Error,
					true,
				);
			}
		});
	},
	fix: async (tree) => {
		await migrateCoreGenerator(tree, { skipFormat: true });
		return true;
	},
	prompt: 'Would you like to migrate core imports?',
};
