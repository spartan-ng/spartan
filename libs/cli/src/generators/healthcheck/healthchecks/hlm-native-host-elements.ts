import { visitNotIgnoredFiles } from '@nx/devkit';
import migrateNativeHostElementsGenerator, {
	hasLegacyNativeHostElements,
} from '../../migrate-native-host-elements/generator';
import { type Healthcheck, HealthcheckSeverity } from '../healthchecks';

export const hlmNativeHostElementsHealthcheck: Healthcheck = {
	name: 'Helm native host elements',
	async detect(tree, failure) {
		visitNotIgnoredFiles(tree, '/', (file) => {
			if (!file.endsWith('.ts') && !file.endsWith('.html')) {
				return;
			}

			const contents = tree.read(file, 'utf-8');

			if (contents && hasLegacyNativeHostElements(contents)) {
				failure(
					`${file} uses a Helm wrapper element (e.g. <hlm-select-trigger>) that is now applied to the native element (e.g. <button hlmSelectTrigger>).`,
					HealthcheckSeverity.Error,
					true,
				);
			}
		});
	},
	fix: async (tree) => {
		await migrateNativeHostElementsGenerator(tree, { skipFormat: true });
		return true;
	},
	prompt: 'Would you like to migrate Helm wrapper elements to their native host elements?',
};
