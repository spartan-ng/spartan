import { visitFiles } from '../../../utils/visit-files';
import migrateCnGenerator, { canMigrateAutomatically } from '../../migrate-cn/generator';
import { LEGACY_IMPORT_REGEX, SOURCE_FILE_REGEX } from '../../migrate-cn/lib/legacy-imports';
import { type Healthcheck, HealthcheckSeverity } from '../healthchecks';

export const cnHealthcheck: Healthcheck = {
	name: 'cn class merging',
	async detect(tree, failure) {
		const fixable: string[] = [];
		const manual: string[] = [];

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
				(canMigrateAutomatically(contents) ? fixable : manual).push(file);
			}
		});

		if (fixable.length > 0) {
			failure(
				`${fixable.length} file(s) use 'clsx' or 'tailwind-merge'; spartan now uses 'cn' for class merging.`,
				HealthcheckSeverity.Warning,
				true,
			);
		}

		if (manual.length > 0) {
			failure(
				`${manual.join(', ')} use 'clsx' or 'tailwind-merge' in a way that can't be migrated automatically; ` +
					`please migrate them to 'cn' manually.`,
				HealthcheckSeverity.Warning,
				false,
			);
		}
	},
	fix: async (tree) => {
		await migrateCnGenerator(tree, { skipFormat: true });
		return true;
	},
	prompt: 'Would you like to migrate clsx and tailwind-merge to cn?',
};
