import migrateCnGenerator, {
	canMigrateAutomatically,
	needsManualMigration,
	visitSpartanSources,
} from '../../migrate-cn/generator';
import { type Healthcheck, HealthcheckSeverity } from '../healthchecks';

export const cnHealthcheck: Healthcheck = {
	name: 'cn class merging',
	async detect(tree, failure) {
		const fixable: string[] = [];
		const manual: string[] = [];

		// same scope as migrate-cn: the generated helm libraries, other code may use clsx / tailwind-merge on purpose
		visitSpartanSources(tree, (file, contents) => {
			if (canMigrateAutomatically(contents)) fixable.push(file);
			// a file can be both, e.g. a rewritable import next to a `require('clsx')`
			if (needsManualMigration(contents)) manual.push(file);
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
