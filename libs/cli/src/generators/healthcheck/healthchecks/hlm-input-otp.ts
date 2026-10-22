import { visitNotIgnoredFiles } from '@nx/devkit';
import migrateInputOtp from '../../migrate-input-otp/generator';
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

			if (/<brn-input-otp(?![\w-])/g.test(contents)) {
				failure(
					'The <brn-input-otp> element API has changed. Use <hlm-input-otp> or add <input brnInputOtpInput /> for brain usage.',
					HealthcheckSeverity.Error,
					true,
				);
			}
		});
	},
	fix: async (tree) => {
		await migrateInputOtp(tree, { skipFormat: true });
		return true;
	},
	prompt: 'Would you like to migrate input-otp to the directive-based API?',
};
