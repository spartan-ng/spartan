import { decodePreset, DEFAULT_CONFIG, encodePreset, isPresetCode } from '@spartan-ng/registry';
import { describe, expect, it } from 'vitest';

describe('preset encoding/decoding', () => {
	it('encodes and decodes default config', () => {
		const code = encodePreset(DEFAULT_CONFIG);
		expect(code).toMatch(/^b[0-9a-zA-Z]+$/);
		expect(isPresetCode(code)).toBe(true);

		const decoded = decodePreset(code);
		expect(decoded).toBeDefined();
		expect(decoded!.style).toBe(DEFAULT_CONFIG.style);
		expect(decoded!.baseColor).toBe(DEFAULT_CONFIG.baseColor);
		expect(decoded!.theme).toBe(DEFAULT_CONFIG.theme);
		expect(decoded!.iconLibrary).toBe(DEFAULT_CONFIG.iconLibrary);
		expect(decoded!.font).toBe(DEFAULT_CONFIG.font);
		expect(decoded!.radius).toBe(DEFAULT_CONFIG.radius);
		expect(decoded!.menuAccent).toBe(DEFAULT_CONFIG.menuAccent);
		expect(decoded!.menuColor).toBe(DEFAULT_CONFIG.menuColor);
	});

	it('round-trips a custom config', () => {
		const config = {
			style: 'vega' as const,
			baseColor: 'zinc' as const,
			theme: 'blue' as const,
			chartColor: 'sky' as const,
			iconLibrary: 'phosphor' as const,
			font: 'figtree' as const,
			fontHeading: 'inherit' as const,
			radius: 'large' as const,
			menuAccent: 'bold' as const,
			menuColor: 'inverted' as const,
		};

		const code = encodePreset(config);
		const decoded = decodePreset(code);
		expect(decoded).toBeDefined();
		expect(decoded!.style).toBe('vega');
		expect(decoded!.baseColor).toBe('zinc');
		expect(decoded!.theme).toBe('blue');
		expect(decoded!.chartColor).toBe('sky');
		expect(decoded!.iconLibrary).toBe('phosphor');
		expect(decoded!.font).toBe('figtree');
		expect(decoded!.radius).toBe('large');
		expect(decoded!.menuAccent).toBe('bold');
		expect(decoded!.menuColor).toBe('inverted');
	});

	it('returns null for invalid preset codes', () => {
		expect(decodePreset('')).toBeNull();
		expect(decodePreset('x')).toBeNull();
		expect(decodePreset('b')).toBeNull();
		expect(decodePreset('not-a-preset')).toBeNull();
	});

	it('isPresetCode validates correctly', () => {
		expect(isPresetCode('b0')).toBe(true);
		expect(isPresetCode('b1a')).toBe(true);
		expect(isPresetCode('bAbCdEf')).toBe(true);
		expect(isPresetCode('')).toBe(false);
		expect(isPresetCode('x')).toBe(false);
		expect(isPresetCode('0b')).toBe(false);
	});

	it('partial config falls back to defaults', () => {
		const code = encodePreset({ style: 'lyra' });
		const decoded = decodePreset(code);
		expect(decoded!.style).toBe('lyra');
		expect(decoded!.baseColor).toBe('neutral');
		expect(decoded!.theme).toBe('neutral');
		expect(decoded!.font).toBe('inter');
	});

	it('different configs produce different codes', () => {
		const code1 = encodePreset({ style: 'nova' });
		const code2 = encodePreset({ style: 'vega' });
		expect(code1).not.toBe(code2);
	});
});
