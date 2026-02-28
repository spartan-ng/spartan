import { QueryToken } from './constants';
import {
	EqualityOperators,
	IdentityOperators,
	Operators,
	RangeOperators,
	SelectOperators,
	SetOperators,
	TextOperators,
	TimeOperators,
} from './operators';
import { FieldTypes } from './types';

// ─── types.ts snapshot ──────────────────────────────────────────────

describe('FieldTypes', () => {
	it('should match the stable field-type mapping', () => {
		expect(FieldTypes).toMatchInlineSnapshot(`
			{
			  "asyncCombobox": "asyncCombobox",
			  "boolean": "boolean",
			  "combobox": "combobox",
			  "date": "date",
			  "daterange": "daterange",
			  "number": "number",
			  "range": "range",
			  "select": "select",
			  "text": "text",
			  "time": "time",
			}
		`);
	});
});

// ─── operators.ts snapshots ─────────────────────────────────────────

describe('Operators', () => {
	it('IdentityOperators should match snapshot', () => {
		expect(IdentityOperators).toMatchInlineSnapshot(`
			{
			  "is": "is",
			  "isNot": "not",
			}
		`);
	});

	it('EqualityOperators should match snapshot', () => {
		expect(EqualityOperators).toMatchInlineSnapshot(`
			{
			  "equals": "eq",
			  "greaterThan": "gt",
			  "greaterThanOrEqual": "gte",
			  "lessThan": "lt",
			  "lessThanOrEqual": "lte",
			  "notEquals": "neq",
			}
		`);
	});

	it('TextOperators should match snapshot', () => {
		expect(TextOperators).toMatchInlineSnapshot(`
			{
			  "endsWith": "end",
			  "includes": "inc",
			  "notEndsWith": "nend",
			  "notIncludes": "ninc",
			  "notStartsWith": "nstw",
			  "startsWith": "stw",
			}
		`);
	});

	it('SelectOperators should match snapshot', () => {
		expect(SelectOperators).toMatchInlineSnapshot(`
			{
			  "in": "in",
			  "notIn": "nin",
			}
		`);
	});

	it('SetOperators should match snapshot', () => {
		expect(SetOperators).toMatchInlineSnapshot(`
			{
			  "all": "all",
			  "none": "none",
			  "some": "some",
			}
		`);
	});

	it('RangeOperators should match snapshot', () => {
		expect(RangeOperators).toMatchInlineSnapshot(`
			{
			  "between": "bt",
			  "notBetween": "nbt",
			}
		`);
	});

	it('TimeOperators should match snapshot', () => {
		expect(TimeOperators).toMatchInlineSnapshot(`
			{
			  "at": "at",
			  "before": "bfr",
			  "notAt": "nat",
			  "notBefore": "nbfr",
			  "notPast": "npst",
			  "past": "pst",
			}
		`);
	});

	it('Operators should be the union of all operator groups', () => {
		expect(Operators).toEqual({
			...IdentityOperators,
			...EqualityOperators,
			...TextOperators,
			...SelectOperators,
			...SetOperators,
			...RangeOperators,
			...TimeOperators,
		});
	});

	it('every operator value should be a non-empty string', () => {
		for (const [, value] of Object.entries(Operators)) {
			expect(typeof value).toBe('string');
			expect(value.length).toBeGreaterThan(0);
		}
	});

	it('operator values should be unique', () => {
		const values = Object.values(Operators);
		expect(new Set(values).size).toBe(values.length);
	});
});

// ─── constants.ts snapshot ──────────────────────────────────────────

describe('QueryToken', () => {
	it('should be a stable string constant', () => {
		expect(QueryToken).toMatchInlineSnapshot(`"HTTP_RESOURCE_QUERY_TOKEN"`);
	});

	it('should not be empty', () => {
		expect(QueryToken.length).toBeGreaterThan(0);
	});
});
