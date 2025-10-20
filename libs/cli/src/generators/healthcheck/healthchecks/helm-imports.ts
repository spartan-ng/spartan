import { visitNotIgnoredFiles } from '@nx/devkit';
import migrateHelmImportsGenerator from '../../migrate-helm-imports/generator';
import importMap from '../../migrate-helm-imports/import-map';
import { type Healthcheck, HealthcheckSeverity } from '../healthchecks';

export const helmImportsHealthcheck: Healthcheck = {
	name: 'Helm imports',
	async detect(tree, failure) {
		visitNotIgnoredFiles(tree, '/', (file) => {
			// if the file is a .ts or .json file, check for helm imports/packages
			if (!file.endsWith('.ts') || file.endsWith('.json')) {
				return;
			}

			const contents = tree.read(file, 'utf-8');

			if (!contents) {
				return;
			}

			for (const [importPath, helmPackage] of Object.entries(importMap)) {
				if (contents.includes(importPath)) {
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
		await migrateHelmImportsGenerator(tree, { skipFormat: true });
		return true;
	},
	prompt: 'Would you like to migrate helm imports?',
};
