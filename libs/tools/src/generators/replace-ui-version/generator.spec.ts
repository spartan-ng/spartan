import { type Tree, readProjectConfiguration } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import replaceUiVersionGenerator, { replaceSpartanVersions } from './generator';

describe('replace-cli-version generator', () => {
	let tree: Tree;

	beforeEach(() => {
		tree = createTreeWithEmptyWorkspace();
	});

	it.skip('should run successfully', async () => {
		await replaceUiVersionGenerator(tree);
		const config = readProjectConfiguration(tree, 'test');
		expect(config).toBeDefined();
	});
});

describe('replaceSpartanVersions', () => {
	it('should replace only SPARTAN-prefixed versions that match oldVersion', () => {
		const input = `
      export const FALLBACK_ANGULAR_VERSION = '^18.0.0';
      export const SPARTAN_ACCORDION_BRAIN_VERSION = '3.0.2';
      export const SPARTAN_ALERT_DIALOG_BRAIN_VERSION = '3.0.2';
      export const TAILWINDCSS_VERSION = '3.0.2';
    `;

		const oldVersion = '3.0.2';
		const newVersion = '3.0.3';

		const expectedOutput = `
      export const FALLBACK_ANGULAR_VERSION = '^18.0.0';
      export const SPARTAN_ACCORDION_BRAIN_VERSION = '3.0.3';
      export const SPARTAN_ALERT_DIALOG_BRAIN_VERSION = '3.0.3';
      export const TAILWINDCSS_VERSION = '3.0.2';
    `;

		const result = replaceSpartanVersions(input, oldVersion, newVersion);
		expect(result).toBe(expectedOutput);
	});

	it('should not replace versions without the SPARTAN_ prefix', () => {
		const input = `
      export const FALLBACK_ANGULAR_VERSION = '3.0.2';
      export const TAILWINDCSS_VERSION = '3.0.2';
    `;

		const oldVersion = '3.0.2';
		const newVersion = '3.0.3';

		const result = replaceSpartanVersions(input, oldVersion, newVersion);
		expect(result).toBe(input); // No changes expected
	});
});
