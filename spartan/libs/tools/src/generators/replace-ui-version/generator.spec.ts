import { replaceSpartanVersion } from './generator';

describe('replaceSpartanVersions', () => {
	it('should replace only SPARTAN-prefixed versions that match oldVersion', () => {
		const input = `
      export const FALLBACK_ANGULAR_VERSION = '^18.0.0';
      export const SPARTAN_VERSION = '3.0.2';
      export const SPARTAN_ALERT_DIALOG_BRAIN_VERSION = '3.0.2';
      export const TAILWINDCSS_VERSION = '3.0.2';
    `;

		const oldVersion = '3.0.2';
		const newVersion = '3.0.3';

		const expectedOutput = `
      export const FALLBACK_ANGULAR_VERSION = '^18.0.0';
      export const SPARTAN_VERSION = '3.0.3';
      export const SPARTAN_ALERT_DIALOG_BRAIN_VERSION = '3.0.2';
      export const TAILWINDCSS_VERSION = '3.0.2';
    `;

		const result = replaceSpartanVersion(input, oldVersion, newVersion);
		expect(result).toBe(expectedOutput);
	});

	it('should not replace versions without the SPARTAN_ prefix', () => {
		const input = `
      export const FALLBACK_ANGULAR_VERSION = '3.0.2';
      export const TAILWINDCSS_VERSION = '3.0.2';
    `;

		const oldVersion = '3.0.2';
		const newVersion = '3.0.3';

		const result = replaceSpartanVersion(input, oldVersion, newVersion);
		expect(result).toBe(input); // No changes expected
	});
});
