import { faker } from '@faker-js/faker';
import { InitialsPipe } from './initials.pipe';

describe('InitialsPipe', () => {
	const pipe = new InitialsPipe();

	it('should compile', () => {
		expect(pipe).toBeTruthy();
	});

	it('should return an empty string, when an empty string is provided', () => {
		expect(pipe.transform('')).toBe('');
		expect(pipe.transform(' ')).toBe('');
	});

	it.skip('should return the uppercased initials of a provided name', () => {
		const name = 'John Doe';
		const otherName = 'Mary Ann Smith';
		const randomName = faker.person.fullName();

		expect(pipe.transform(name)).toBe('JD');
		expect(pipe.transform(otherName)).toBe('MS');
		expect(pipe.transform(randomName)).toBe(
			`${randomName.charAt(0).toLocaleUpperCase()}${randomName.charAt(randomName.indexOf(' ') + 1).toLocaleUpperCase()}`,
		);
	});

	it('should not capitalize the initials, when the capitalize flag is set to false', () => {
		const name = 'john Doe';
		const otherName = 'mary ann smith';
		const randomName = `${faker.person.firstName()} ${faker.person.lastName()}`;

		expect(pipe.transform(name, false)).toBe('jD');
		expect(pipe.transform(otherName, false)).toBe('ms');
		expect(pipe.transform(randomName, false)).toBe(
			`${randomName.charAt(0)}${randomName.charAt(randomName.lastIndexOf(' ') + 1)}`,
		);
	});

	it('should return all initials when the firstAndLastOnly flag is set to false', () => {
		const name = 'Mary Ann       Smith';

		expect(pipe.transform(name, true, false)).toBe('MAS');
	});

	it('should split the name by the provided delimiter', () => {
		const name = 'Mary:Ann:Smith: ';

		expect(pipe.transform(name, true, true, ':')).toBe('MS');
	});
});
