import { visitNotIgnoredFiles } from '@nx/devkit';
import migrateBrnInputOtpMaxLength from '../../migrate-brn-input-otp-max-length/generator';
import { type Healthcheck, HealthcheckSeverity } from '../healthchecks';

export const brnInputOtpMaxLengthRename: Healthcheck = {
	name: 'Input OTP maxLength rename',
	async detect(tree, failure) {
		visitNotIgnoredFiles(tree, '/', (file) => {
			if (!file.endsWith('.ts') && !file.endsWith('.html')) {
				return;
			}

			const contents = tree.read(file, 'utf-8');

			if (!contents) {
				return;
			}

			// matches the legacy maxLength input on a brn-input-otp element ([maxLength] or maxLength=)
			if (/<brn-input-otp\b[^>]*\bmaxLength\b/g.test(contents)) {
				failure('brn-input-otp is using the renamed maxLength input.', HealthcheckSeverity.Error, true);
			}
		});
	},
	fix: async (tree) => {
		await migrateBrnInputOtpMaxLength(tree, { skipFormat: true });
		return true;
	},
	prompt: 'Would you like to migrate brn-input-otp maxLength input rename?',
};
