import { visitFiles } from '../../../utils/visit-files';
import migrateCnGenerator from '../../migrate-cn/generator';
import { LEGACY_IMPORT_REGEX, SOURCE_FILE_REGEX } from '../../migrate-cn/lib/legacy-imports';
import { type Healthcheck, HealthcheckSeverity } from '../healthchecks';

export const cnHealthcheck: Healthcheck = {
	name: 'cn class merging',
	async detect(tree, failure) {
		const files: string[] = [];

		// same scope as migrate-cn, so the offered fix addresses every reported file
		visitFiles(tree, '.', (file) => {
			if (!SOURCE_FILE_REGEX.test(file)) {
				return;
			}

			const contents = tree.read(file, 'utf-8');
			if (!contents) {
				return;
			}

			if (LEGACY_IMPORT_REGEX.test(contents)) {
				files.push(file);
			}
		});

		if (files.length > 0) {
			failure(
				`${files.length} file(s) use 'clsx' or 'tailwind-merge'; spartan now uses 'cn' for class merging.`,
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
