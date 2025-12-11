import { visitNotIgnoredFiles } from '@nx/devkit';
import migrateMenuGenerator, { ignoreMenuFiles } from '../../migrate-menu/generator';
import { HealthcheckSeverity, type Healthcheck } from '../healthchecks';

export const helmMenuHealthcheck: Healthcheck = {
	name: 'Helm Menu',
	async detect(tree, failure, _, { importAlias }) {
		visitNotIgnoredFiles(tree, '/', (file) => {
			// if the file is a .ts or .htlm file, check for helm menu
			if (!file.endsWith('.ts') && !file.endsWith('.html')) {
				return;
			}

			// skip HlmMenu itself
			if (ignoreMenuFiles.some((menuFile) => file.endsWith(menuFile))) {
				return;
			}

			const contents = tree.read(file, 'utf-8');

			if (!contents) {
				return;
			}

			if (
				contents.includes("'@spartan-ng/brain/menu'") ||
				contents.includes("'@spartan-ng/helm/menu'") ||
				contents.includes(`"${importAlias}/menu"`)
			) {
				failure(
					`The menu package (${importAlias}/menu and @spartan-ng/brain/menu) is deprecated. Please use the new helm packages dropdown-menu, context-menu or menubar instead.`,
					HealthcheckSeverity.Error,
					true,
				);
			}
		});
	},
	fix: async (tree, { importAlias }) => {
		await migrateMenuGenerator(tree, { skipFormat: true, importAlias });
		return true;
	},
	prompt:
		'Would you like to migrate menu imports and selectors? You need to generate the new helm components for dropdown-menu, context-menu or menubar.',
};
