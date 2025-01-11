import { visitNotIgnoredFiles } from '@nx/devkit';
import { migrateBrainImportsGenerator } from '../../migrate-brain-imports/generator';
import importMap from '../../migrate-brain-imports/import-map';
import { Healthcheck, HealthcheckSeverity } from '../healthchecks';

export const brainImportsHealthcheck: Healthcheck = {
	name: 'Brain imports',
	async detect(tree, failure) {
		visitNotIgnoredFiles(tree, '/', (file) => {
			// if the file is a .ts or .json file, check for brain imports/packages
			if (!file.endsWith('.ts') || file.endsWith('.json')) {
				return;
			}

			const contents = tree.read(file, 'utf-8');

			if (!contents) {
				return;
			}

			for (const [importPath, brainPackage] of Object.entries(importMap)) {
				if (contents.includes(importPath)) {
					failure(
						`The import ${importPath} is deprecated. Please use the ${brainPackage} package instead.`,
						HealthcheckSeverity.Error,
						true,
					);
				}
			}
		});
	},
	fix: async (tree) => {
		await migrateBrainImportsGenerator(tree, { skipFormat: true });
		return true;
	},
	prompt: 'Would you like to migrate brain imports?',
};
