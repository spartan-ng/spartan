import { DEFAULT_CONFIG, type DesignSystemConfig } from '@spartan-ng/registry';
import { describe, expect, it } from 'vitest';
import { getPresetCode } from './preset-code';

describe('getPresetCode', () => {
	it('returns a valid preset code for default config', () => {
		const code = getPresetCode(DEFAULT_CONFIG);
		expect(code).toMatch(/^b[0-9a-zA-Z]+$/);
	});

	it('returns different codes for different configs', () => {
		const config1: DesignSystemConfig = { ...DEFAULT_CONFIG, style: 'nova' };
		const config2: DesignSystemConfig = { ...DEFAULT_CONFIG, style: 'vega' };
		expect(getPresetCode(config1)).not.toBe(getPresetCode(config2));
	});
});
