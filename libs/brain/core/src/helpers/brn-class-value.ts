/**
 * A class value: a class string, or arrays and objects of them. The same shape as `ClassValue` from `cn` or
 * `clsx`, so brain can accept them without depending on a class merging package.
 */
export type BrnClassValue =
	| BrnClassValue[]
	| Record<string, unknown>
	| string
	| number
	| bigint
	| null
	| boolean
	| undefined;
