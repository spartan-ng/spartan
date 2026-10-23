import { visitNotIgnoredFiles } from '@nx/devkit';
import migrateInputOtp from '../../migrate-input-otp/generator';
import {
	findInputOtpElements,
	findOpeningTags,
	hasContainerStyles,
	hasHelmAttribute,
	hasInputOtpInputDirective,
	parseAttributes,
	splitInputAttributes,
} from '../../migrate-input-otp/utils';
import { type Healthcheck, HealthcheckSeverity } from '../healthchecks';

export const inputOtpHealthcheck: Healthcheck = {
	name: 'Input OTP directives',
	async detect(tree, failure) {
		visitNotIgnoredFiles(tree, '/', (file) => {
			if (!file.endsWith('.ts') && !file.endsWith('.html')) {
				return;
			}

			const contents = tree.read(file, 'utf-8');

			if (!contents) {
				return;
			}

			for (const element of findInputOtpElements(contents)) {
				const attrs = parseAttributes(element.attrs);

				if (hasContainerStyles(attrs)) {
					failure(
						'The containerStyles input was removed. Move custom container styles to the host or input before migrating input-otp.',
						HealthcheckSeverity.Error,
						false,
					);
					continue;
				}

				if (hasHelmAttribute(attrs)) {
					failure(
						'Legacy <brn-input-otp hlmInputOtp> usage found. Use <hlm-input-otp> instead.',
						HealthcheckSeverity.Error,
						true,
					);
					continue;
				}

				const { inputAttrs } = splitInputAttributes(attrs);

				if (inputAttrs.length > 0 || !hasInputOtpInputDirective(element.inner)) {
					failure(
						'Brain <brn-input-otp> usage is missing <input brnInputOtpInput /> or still has input-specific attributes on the root.',
						HealthcheckSeverity.Error,
						true,
					);
				}
			}

			for (const tag of findOpeningTags(contents, 'hlm-input-otp')) {
				if (hasContainerStyles(parseAttributes(tag.attrs))) {
					failure(
						'The containerStyles input was removed. Move custom container styles to the host or input before migrating input-otp.',
						HealthcheckSeverity.Error,
						false,
					);
				}
			}
		});
	},
	fix: async (tree) => {
		await migrateInputOtp(tree, { skipFormat: true });
		return true;
	},
	prompt: 'Would you like to migrate input-otp to the directive-based API?',
};
