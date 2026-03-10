import { visitNotIgnoredFiles } from '@nx/devkit';
import migrateFormFieldGenerator from '../../migrate-form-field/generator';
import { HealthcheckSeverity, type Healthcheck } from '../healthchecks';

export const helmFormFieldHealthcheck: Healthcheck = {
	name: 'Helm Form Field',
	async detect(tree, failure, _, { importAlias }) {
		visitNotIgnoredFiles(tree, '/', (file) => {
			// if the file is a .ts or .htlm file, check for helm form field
			if (!file.endsWith('.ts') && !file.endsWith('.html')) {
				return;
			}

			const contents = tree.read(file, 'utf-8');

			if (!contents) {
				return;
			}

			if (
				contents.includes("'@spartan-ng/helm/form-field'") ||
				contents.includes(`"${importAlias}/form-field"`) ||
				contents.includes(`hlm-form-field`) ||
				contents.includes(`hlm-hint`) ||
				contents.includes(`hlm-error`)
			) {
				failure(
					`The form field package (${importAlias}/form-field) is deprecated. Please use the @spartan-ng/helm/field component instead.`,
					HealthcheckSeverity.Error,
					true,
				);
			}
		});
	},
	fix: async (tree, { importAlias }) => {
		await migrateFormFieldGenerator(tree, { skipFormat: true, importAlias });
		return true;
	},
	prompt:
		'Would you like to migrate form field imports and selectors? You need to generate the helm components for fields.',
};
