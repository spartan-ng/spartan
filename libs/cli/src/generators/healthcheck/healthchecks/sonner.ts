import { visitNotIgnoredFiles } from '@nx/devkit';
import migrateSonnerGenerator from '../../migrate-sonner/generator';
import { HealthcheckSeverity, type Healthcheck } from '../healthchecks';

export const sonnerHealthcheck: Healthcheck = {
	name: 'Sonner',
	async detect(tree, failure, _) {
		visitNotIgnoredFiles(tree, '/', (file) => {
			// if the file is a .ts
			if (!file.endsWith('.ts')) {
				return;
			}

			// skip hlm-toaster itself
			if (file.endsWith('hlm-toaster.ts')) {
				return;
			}

			const contents = tree.read(file, 'utf-8');

			if (!contents) {
				return;
			}

			if (contents.includes('ngx-sonner')) {
				failure(
					`The Sonner package (ngx-sonner) is deprecated. Please use the @spartan-ng/brain/sonner package instead.`,
					HealthcheckSeverity.Error,
					true,
				);
			}
		});
	},
	fix: async (tree) => {
		await migrateSonnerGenerator(tree, { skipFormat: true });
		return true;
	},
	prompt: 'Would you like to migrate ngx-sonner imports? Regenerate the helm sonner package.',
};
