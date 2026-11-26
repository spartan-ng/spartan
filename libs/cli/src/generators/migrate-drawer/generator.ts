import { formatFiles, logger, type Tree } from '@nx/devkit';
import { loadOrInitConfig } from '../../utils/config';
import { migrateHelmLibrariesGenerator } from '../migrate-helm-libraries/generator';
import type { MigrateDrawerGeneratorSchema } from './schema';
import { scanDrawerMigration } from './utils';

/**
 * Migrates the vaul based drawer to the Base UI drawer: regenerates a helm drawer built on the removed brain
 * APIs, replaces `direction` with `swipeDirection` and removes `closeThreshold`. Returns false when the helm
 * drawer could not be regenerated, in which case the templates are left as they are.
 */
export async function migrateDrawer(
	tree: Tree,
	{ skipFormat, angularCli }: MigrateDrawerGeneratorSchema,
): Promise<boolean> {
	let files = scanDrawerMigration(tree);
	const hasLegacyHelm = () => [...files.values()].some((file) => file.legacyHelm);

	if (hasLegacyHelm()) {
		const config = await loadOrInitConfig(tree, { angularCli: angularCli ?? false });

		await migrateHelmLibrariesGenerator(tree, {
			libraries: ['drawer'],
			angularCli: angularCli ?? false,
			generateAs: config.generateAs ?? 'library',
			buildable: config.buildable ?? true,
			importAlias: config.importAlias,
			style: config.style,
		});

		files = scanDrawerMigration(tree);

		// `swipeDirection` would be ignored by the old helm drawer, so don't migrate the templates without it.
		if (hasLegacyHelm()) {
			logger.warn(
				'Could not regenerate the helm drawer. Add it again with `ng g @spartan-ng/cli:ui drawer`, then run the migration again.',
			);
			return false;
		}
	}

	for (const [path, { original, content, issues }] of files) {
		if (content !== original) {
			tree.write(path, content);
		}

		for (const { message } of issues.filter(({ fixable }) => !fixable)) {
			logger.warn(`${path}: ${message}`);
		}
	}

	if (!skipFormat) {
		await formatFiles(tree);
	}

	return true;
}

export async function migrateDrawerGenerator(tree: Tree, options: MigrateDrawerGeneratorSchema): Promise<void> {
	await migrateDrawer(tree, options);
}

export default migrateDrawerGenerator;
