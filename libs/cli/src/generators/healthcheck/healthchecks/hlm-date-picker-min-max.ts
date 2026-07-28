import { visitNotIgnoredFiles } from '@nx/devkit';
import migrateDatePickerMinMaxGenerator from '../../migrate-date-picker-min-max/generator';
import { type Healthcheck, HealthcheckSeverity } from '../healthchecks';

const datePickerSelectors = [
	'hlm-date-picker-multi',
	'hlm-date-range-picker',
	'hlm-month-year-picker',
	'hlm-date-picker',
];

const legacyMinMaxPattern = new RegExp(
	`<(?:${datePickerSelectors.join('|')})(?=[\\s/>])[^>]*(\\s\\[min\\]\\s*=|\\s\\[max\\]\\s*=|\\smin\\s*=|\\smax\\s*=)`,
);

export const datePickerMinMaxHealthcheck: Healthcheck = {
	name: 'Helm DatePicker min/max rename',
	async detect(tree, failure) {
		visitNotIgnoredFiles(tree, '/', (file) => {
			if (!file.endsWith('.ts') && !file.endsWith('.html')) {
				return;
			}

			const contents = tree.read(file, 'utf-8');

			if (!contents) {
				return;
			}

			if (legacyMinMaxPattern.test(contents)) {
				failure(
					'DatePicker is using renamed min/max inputs. They have been renamed to minDate/maxDate.',
					HealthcheckSeverity.Error,
					true,
				);
			}
		});
	},
	fix: async (tree, { angularCli }) => {
		await migrateDatePickerMinMaxGenerator(tree, { skipFormat: true, angularCli });
		return true;
	},
	prompt: 'Would you like to migrate renamed date picker min/max inputs?',
};
