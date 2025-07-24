import { visitNotIgnoredFiles } from '@nx/devkit';
import { tsquery } from '@phenomnomnominal/tsquery';
import ts from 'typescript';
import migrateNamingConventionGenerator from '../../migrate-naming-convention/generator';
import { Healthcheck, HealthcheckSeverity } from '../healthchecks';

export const namingConventionHealthcheck: Healthcheck = {
	name: 'Naming Conventions',
	async detect(tree, failure) {
		visitNotIgnoredFiles(tree, '/', (file) => {
			// if the file is a .ts or .htlm file, check for brain radio
			if (!file.endsWith('.ts') && !file.endsWith('.html')) {
				return;
			}

			// check if there is an import statement from '@spartan-ng/brain/*' that ends with Directive or Component
			const contents = tree.read(file, 'utf-8');
			if (!contents) {
				return;
			}

			const importDeclarations = tsquery.query<ts.ImportDeclaration>(contents, 'ImportDeclaration');

			if (importDeclarations.length === 0) {
				return;
			}

			for (const importDeclaration of importDeclarations) {
				const moduleSpecifier = importDeclaration.moduleSpecifier.getText();

				if (moduleSpecifier.includes('@spartan-ng/brain/')) {
					const identifiers = tsquery.query(importDeclaration, 'Identifier');

					// we only care about identifiers that end in 'Directive', 'Component'
					for (const identifier of identifiers) {
						const identifierText = identifier.getText();

						if (identifierText.endsWith('Directive') || identifierText.endsWith('Component')) {
							failure(
								`Found deprecated naming convention: ${identifierText} in file ${file}. Please migrate to the new naming conventions.`,
								HealthcheckSeverity.Error,
								true,
							);
						}
					}
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
