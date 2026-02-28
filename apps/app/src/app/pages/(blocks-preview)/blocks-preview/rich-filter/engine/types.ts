export const FieldTypes = {
	/**
	 * should be represented as a normal text input
	 */
	text: 'text',
	/**
	 * should be represented as a number input
	 */
	number: 'number',
	/**
	 * should be represented as a calendar input (no time)
	 */
	date: 'date',
	/**
	 * should be represented as a hh:mm time input
	 */
	time: 'time',
	/**
	 * should be represented as a dropdown with predefined options
	 * options will be a static list
	 */
	select: 'select',
	/**
	 * should be represented as a toggle or checkbox
	 */
	boolean: 'boolean',
	/**
	 * should be represented as a slider or from-to number input
	 */
	range: 'range',
	/**
	 * should be represented as 2 calendar inputs for from and to date (no time)
	 */
	daterange: 'daterange',
	// multiselect not implemented yet, waiting for angular signal forms to support them
	// multiselect: 'multiselect',

	/**
	 * should be represented as a combobox with search capabilities options that will be computed from the input
	 */
	combobox: 'combobox',

	/**
	 * should be represented as a combobox with search capabilities options that will be computed from the input asynchronously based on the user input
	 * Use this component to bind http GET calls to your filter options.
	 */
	asyncCombobox: 'asyncCombobox',
} as const;

export type IFieldType = (typeof FieldTypes)[keyof typeof FieldTypes];
