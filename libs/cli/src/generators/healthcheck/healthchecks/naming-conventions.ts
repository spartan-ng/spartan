import { visitNotIgnoredFiles } from '@nx/devkit';
import { tsquery } from '@phenomnomnominal/tsquery';
import type ts from 'typescript';
import migrateNamingConventionGenerator from '../../migrate-naming-convention/generator';
import { type Healthcheck, HealthcheckSeverity } from '../healthchecks';

export const namingConventionHealthcheck: Healthcheck = {
	name: 'Naming Conventions',
	async detect(tree, failure) {
		visitNotIgnoredFiles(tree, '/', (file) => {
			// if the file is a .ts file check for old naming conventions
			if (!file.endsWith('.ts')) {
				return;
			}

			// check if there are any brain or helm identifiers that ends with Directive or Component
			const contents = tree.read(file, 'utf-8');
			if (!contents) {
				return;
			}

			const identifiers = tsquery.query<ts.Identifier>(contents, 'Identifier');

			for (const identifier of identifiers) {
				const name = identifier.getText();

				const startsWithPrefix = name.startsWith('Hlm') || name.startsWith('Brn');
				const endsWithSuffix = name.endsWith('Directive') || name.endsWith('Component');

				if (startsWithPrefix && endsWithSuffix) {
					failure(
						`Found legacy naming pattern: ${name} in file ${file}. Consider renaming it to match the new conventions.`,
						HealthcheckSeverity.Warning,
						true,
					);
				}
			}
		});
	},
	fix: async (tree) => {
		await migrateNamingConventionGenerator(tree, { skipFormat: true });
		return true;
	},
	prompt: 'Would you like to migrate to the updated naming conventions?',
};
