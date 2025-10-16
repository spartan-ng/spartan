import { signal } from '@angular/core';
import { computedPrevious } from './computed-previous';

describe(computedPrevious.name, () => {
	it('should work properly', () => {
		const value = signal(0);
		const previous = computedPrevious(value);

		expect(value()).toEqual(0);
		expect(previous()).toEqual(0);

		value.set(1);

		expect(value()).toEqual(1);
		expect(previous()).toEqual(0);

		value.set(2);

		expect(value()).toEqual(2);
		expect(previous()).toEqual(1);

		value.set(2);

		expect(value()).toEqual(2);
		expect(previous()).toEqual(1);

		value.set(3);

		expect(value()).toEqual(3);
		expect(previous()).toEqual(2);
	});
});
