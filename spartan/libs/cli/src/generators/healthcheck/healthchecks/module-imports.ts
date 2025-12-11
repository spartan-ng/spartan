import { visitNotIgnoredFiles } from '@nx/devkit';
import migrateModuleImportsGenerator from '../../migrate-module-imports/generator';
import importMap from '../../migrate-module-imports/import-map';
import { type Healthcheck, HealthcheckSeverity } from '../healthchecks';

export const moduleImportsHealthcheck: Healthcheck = {
	name: 'Module imports',
	async detect(tree, failure) {
		visitNotIgnoredFiles(tree, '/', (file) => {
			// if the file is a .ts or .json file, check for helm imports/packages
			if (!file.endsWith('.ts')) {
				return;
			}

			const contents = tree.read(file, 'utf-8');

			if (!contents) {
				return;
			}

			for (const [importPath, helmPackage] of Object.entries(importMap)) {
				const regex = new RegExp(`(?<!export\\s+class\\s+)\\b${importPath}\\b`, 'g');

				if (regex.test(contents)) {
					failure(
						`The import ${importPath} is deprecated. Please use the ${helmPackage} package instead.`,
						HealthcheckSeverity.Error,
						true,
					);
				}
			}
		});
	},
	fix: async (tree) => {
		await migrateModuleImportsGenerator(tree, { skipFormat: true });
		return true;
	},
	prompt: 'Would you like to migrate helm imports?',
};
