import { visitNotIgnoredFiles } from '@nx/devkit';
import migrateCnGenerator from '../../migrate-cn/generator';
import { type Healthcheck, HealthcheckSeverity } from '../healthchecks';

export const cnHealthcheck: Healthcheck = {
	name: 'cn class merging',
	async detect(tree, failure) {
		const files: string[] = [];

		visitNotIgnoredFiles(tree, '/', (file) => {
			if (!file.endsWith('.ts')) {
				return;
			}

			const contents = tree.read(file, 'utf-8');
			if (!contents) {
				return;
			}

			if (/from\s*['"](clsx|clsx\/lite|tailwind-merge)['"]/.test(contents)) {
				files.push(file);
			}
		});

		if (files.length > 0) {
			failure(
				`${files.length} file(s) import from 'clsx' or 'tailwind-merge'; spartan now uses 'cn' for class merging.`,
				HealthcheckSeverity.Warning,
				true,
			);
		}
	},
	fix: async (tree) => {
		await migrateCnGenerator(tree, { skipFormat: true });
		return true;
	},
	prompt: 'Would you like to migrate clsx and tailwind-merge to cn?',
};
