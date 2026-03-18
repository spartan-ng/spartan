import { visitNotIgnoredFiles } from '@nx/devkit';
import migrateBrnSelectGenerator from '../../migrate-brn-select/generator';
import { HealthcheckSeverity, type Healthcheck } from '../healthchecks';

export const brnSelectHealthcheck: Healthcheck = {
	name: 'Brain Select',
	async detect(tree, failure, _, { importAlias }) {
		visitNotIgnoredFiles(tree, '/', (file) => {
			// if the file is a .ts or .htlm file, check for helm menu
			if (!file.endsWith('.ts') && !file.endsWith('.html')) {
				return;
			}

			// skip hlm select files itself
			if (file.match(/hlm-select(-.*)?\.ts$/)) {
				return;
			}

			const contents = tree.read(file, 'utf-8');

			if (!contents) {
				return;
			}

			if (contents.includes("'@spartan-ng/brain/select'")) {
				failure(
					`The select package (@spartan-ng/brain/select) is deprecated. Please use ${importAlias}/select instead.`,
					HealthcheckSeverity.Error,
					true,
				);
			}
		});
	},
	fix: async (tree) => {
		await migrateBrnSelectGenerator(tree, { skipFormat: true });
		return true;
	},
	prompt:
		'Would you like to migrate @spartan-ng/brain/select imports and selectors? Regenerate the helm select package.',
};
