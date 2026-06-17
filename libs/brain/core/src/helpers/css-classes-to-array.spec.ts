import { cssClassesToArray } from './css-classes-to-array';

describe(cssClassesToArray.name, () => {
	it('splits string class lists into tokens', () => {
		expect(cssClassesToArray('foo  bar\tbaz')).toEqual(['foo', 'bar', 'baz']);
	});

	it('splits and filters array class entries', () => {
		expect(cssClassesToArray(['foo bar', '', 'baz'])).toEqual(['foo', 'bar', 'baz']);
	});

	it('uses the default class when no classes are provided', () => {
		expect(cssClassesToArray(undefined, 'default class')).toEqual(['default', 'class']);
	});
});
