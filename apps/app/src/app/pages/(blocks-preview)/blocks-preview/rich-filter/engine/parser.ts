import type { FilterModelRef, RFilterField } from './builders';

/**
 * Describes the shape of the object that will be returned from the parser function.
 * It matches the shape of the value that the builder produces, but with all private properties (those starting with __) stripped away and any properties whose value is null or undefined excluded.
 */
export type ParsedField = {
	[K in keyof RFilterField as K extends `__${string}` ? never : K]: K extends 'value'
		? Exclude<RFilterField['value'], null | undefined>
		: RFilterField[K];
};

/**
 * Parses the value from the builder into an object that will strip away any private properties (those starting with __) and exclude any
 * properties whose value is null or undefined.
 *
 * @param input
 */
export function filterParser(input: ReturnType<FilterModelRef['value']>): Record<string, ParsedField> {
	const result = {} as Record<string, ParsedField>;

	for (const key in input) {
		const field = input[key];
		// != is intentional to check for both null and undefined in the same condition
		if (field.__visible && field.value != null) {
			result[key] = {
				id: field.id,
				value: field.value,
				operator: field.operator,
			};
		}
	}

	return result;
}
