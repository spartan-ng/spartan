import { isBright } from './is-bright';

describe('isBright', () => {
	it('should return true for white hex code', () => {
		expect(isBright('#ffffff')).toBe(true);
	});

	it('should return false for black hex code', () => {
		expect(isBright('#000000')).toBe(false);
	});

	it('should return true for a light hex code', () => {
		expect(isBright('#e394bb')).toBe(true);
	});

	it('should return false for a dark hex code', () => {
		expect(isBright('#485fa7')).toBe(false);
	});

	it('should support hex color shorthand, with our without hash & ignore capitalization', () => {
		expect(isBright('ffffff')).toBe(true);
		expect(isBright('#fff')).toBe(true);
		expect(isBright('fff')).toBe(true);
		expect(isBright('#FFF')).toBe(true);
	});
});
