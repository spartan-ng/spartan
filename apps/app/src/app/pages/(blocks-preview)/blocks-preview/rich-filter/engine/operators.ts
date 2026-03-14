/**
 * use to compare a field to a specific value, ideal for boolean comparisons, or identities (object is object)
 */
export const IdentityOperators = {
	is: 'is',
	isNot: 'not',
} as const;

export type IIdentityOperator = (typeof IdentityOperators)[keyof typeof IdentityOperators];

/**
 * operators that compare a quantifiable field to another, number, dates, time
 */
export const EqualityOperators = {
	equals: 'eq',
	notEquals: 'neq',
	greaterThan: 'gt',
	greaterThanOrEqual: 'gte',
	lessThan: 'lt',
	lessThanOrEqual: 'lte',
} as const;

export type IEqualityOperator = (typeof EqualityOperators)[keyof typeof EqualityOperators];

/**
 * operators specific to text fields, where the value is always a string. The operators define how the value should relate to the field value
 */
export const TextOperators = {
	includes: 'inc',
	notIncludes: 'ninc',
	startsWith: 'stw',
	notStartsWith: 'nstw',
	endsWith: 'end',
	notEndsWith: 'nend',
} as const;

export type ITextOperator = (typeof TextOperators)[keyof typeof TextOperators];

/**
 * The value is one element, compared to a group of elements
 */
export const SelectOperators = {
	in: 'in',
	notIn: 'nin',
} as const;

export type ISelectOperator = (typeof SelectOperators)[keyof typeof SelectOperators];

/**
 * The value is a group of elements, compared to another group of elements. The operators define how the groups should relate to each other.
 */
export const SetOperators = {
	all: 'all',
	none: 'none',
	some: 'some',
} as const;

export type ISetOperator = (typeof SetOperators)[keyof typeof SetOperators];

export const RangeOperators = {
	between: 'bt',
	notBetween: 'nbt',
} as const;

export type IRangeOperator = (typeof RangeOperators)[keyof typeof RangeOperators];

export const TimeOperators = {
	at: 'at',
	notAt: 'nat',
	past: 'pst',
	notPast: 'npst',
	before: 'bfr',
	notBefore: 'nbfr',
} as const;

export type ITimeOperator = (typeof TimeOperators)[keyof typeof TimeOperators];

export const Operators = {
	...IdentityOperators,
	...EqualityOperators,
	...TextOperators,
	...SelectOperators,
	...SetOperators,
	...RangeOperators,
	...TimeOperators,
} as const;

export type IOperator = (typeof Operators)[keyof typeof Operators];
