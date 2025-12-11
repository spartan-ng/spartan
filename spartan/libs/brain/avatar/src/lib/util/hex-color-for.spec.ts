import { faker } from '@faker-js/faker';
import { hexColorFor } from './hex-color-for';

describe('hexColorFor', () => {
	it('should return a text color of white and a pink-ish background for John Doe', () => {
		const generated = hexColorFor('John Doe');
		expect(generated).toBe('#a55c80');
	});

	it('should return a text color of white and a blue-ish background for Jane Doe', () => {
		const generated = hexColorFor('Jane Doe');
		expect(generated).toBe('#485fa7');
	});

	it('should return different colors for different names', () => {
		expect(hexColorFor(faker.person.fullName())).not.toBe(hexColorFor(faker.person.fullName()));
	});

	it('should return the same style when given the same name', () => {
		const name = faker.person.fullName();
		expect(hexColorFor(name)).toBe(hexColorFor(name));
	});
});
