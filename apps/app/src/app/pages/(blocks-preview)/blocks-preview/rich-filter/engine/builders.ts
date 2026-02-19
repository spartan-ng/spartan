/* eslint-disable @typescript-eslint/naming-convention */
import type { HttpResourceOptions, HttpResourceRequest } from '@angular/common/http';
import type { Signal } from '@angular/core';
import { computed, signal } from '@angular/core';
import type { RangeValue } from '@spartan-ng/brain/range-slider';
import { FOCUS_FALLBACK } from './constants';
import type { IEqualityOperator, IIdentityOperator, IOperator, ITextOperator, ITimeOperator } from './operators';
import { Operators } from './operators';
import type { IFieldType } from './types';
import { FieldTypes } from './types';

export const buildTextField = (
	id: string,
	value: string,
	operator: ITextOperator,
	options?: {
		label?: string;
		initialVisible?: boolean;
		required?: boolean;
		placeholder?: string;
	},
) => ({
	id,
	__type: FieldTypes.text,
	value,
	operator,
	__index: 0,
	__visible: !!options?.initialVisible,
	__required: !!options?.required,
	__placeholder: options?.placeholder,
	__label: options?.label,
	__reset: value,
});

export const buildNumberField = (
	id: string,
	value: number,
	operator: IEqualityOperator,
	options?: {
		initialVisible?: boolean;
		label?: string;
		min?: number;
		max?: number;
		step?: number;
	},
) => ({
	id,
	__type: FieldTypes.number,
	value,
	operator,
	__index: 0,
	__visible: !!options?.initialVisible,
	__min: options?.min,
	__max: options?.max,
	__step: options?.step,
	__reset: value,
	__label: options?.label,
});

export const buildDateField = (
	id: string,
	value: Date,
	operator: ITimeOperator,
	options?: {
		initialVisible?: boolean;
		min?: Date;
		max?: Date;
		label?: string;
	},
) => ({
	id,
	__type: FieldTypes.date,
	value,
	operator,
	__index: 0,
	__visible: !!options?.initialVisible,
	__min: options?.min,
	__max: options?.max,
	__label: options?.label,
	__reset: value,
});

export const buildTimeField = (
	id: string,
	value: Date,
	operator: ITimeOperator,
	options?: {
		initialVisible?: boolean;
		min?: Date;
		max?: Date;
		label?: string;
	},
) => ({
	id,
	__type: FieldTypes.time,
	value,
	operator,
	__index: 0,
	__visible: !!options?.initialVisible,
	__min: options?.min,
	__max: options?.max,
	__reset: value,
	__label: options?.label,
});

export const buildSelectField = (
	id: string,
	value: string | null,
	operator: IIdentityOperator,
	options: {
		initialVisible?: boolean;
		options: { label: string; value: unknown }[];
		label?: string;
		/**
		 * Pass a custom function to extract the "label" to display
		 * in the select input after selectiom
		 * For best UX, it should be the same string shown in the options
		 * @param item
		 * @returns
		 */
		itemToString?: (item: unknown) => string;
	},
) => ({
	id,
	__type: FieldTypes.select,
	value,
	operator,
	__index: 0,
	__visible: !!options?.initialVisible,
	__options: options?.options,
	__label: options?.label,
	__itemToString: options?.itemToString ?? ((item: unknown) => String(item ?? '')),
	__reset: value,
});

export const buildComboField = (
	id: string,
	value: string,
	operator: IIdentityOperator,
	options: {
		initialVisible?: boolean;
		options: { label: string; value: unknown }[];
		placeholder?: string;
		label?: string;
	},
) => ({
	id,
	__type: FieldTypes.combobox,
	value,
	operator,
	__index: 0,
	__visible: !!options?.initialVisible,
	__options: options?.options,
	__placeholder: options?.placeholder,
	__label: options?.label,
	__reset: value,
});

export const buildComboFieldAsync = <R extends Array<unknown>>(
	id: string,
	value: string,
	operator: IIdentityOperator,
	options: {
		label?: string;
		initialVisible?: boolean;
		placeholder?: string;
		resourceOptions: HttpResourceOptions<R extends Array<infer U> ? U[] : R[], unknown>;
		resourceRequest: HttpResourceRequest | Signal<HttpResourceRequest>;
		itemToString?: (item: R extends Array<infer U> ? U : R) => string;
	},
) => ({
	id,
	__type: FieldTypes.asyncCombobox,
	value,
	operator,
	__index: 0,
	__visible: !!options?.initialVisible,
	__placeholder: options?.placeholder,
	__resourceOptions: options?.resourceOptions,
	__resourceRequest: options?.resourceRequest,
	__itemToString: options.itemToString ?? ((item: R extends Array<infer U> ? U : R) => String(item ?? '')),
	__reset: value,
	__label: options?.label,
});

export const buildBooleanField = (
	id: string,
	value: boolean | null,
	options?: {
		initialVisible?: boolean;
		label?: string;
	},
) => ({
	id,
	__type: FieldTypes.boolean,
	value,
	// boolean fields are always "is" to maker the UX simpler
	// double negatives like "is not false" can be confusing
	// this field is not intended for indeterminate boolean states, so we don't need "is not" or "is any"
	operator: Operators.is,
	__index: 0,
	__visible: !!options?.initialVisible,
	__label: options?.label,
	__reset: value,
});

export const buildRangeField = <K extends RangeValue>(
	id: string,
	value: K,
	operator: IOperator,
	options?: {
		initialVisible?: boolean;
		min?: number;
		max?: number;
		label?: string;
	},
) => ({
	id,
	__type: FieldTypes.range,
	value,
	operator,
	__index: 0,
	__visible: !!options?.initialVisible,
	__min: options?.min ?? 0,
	__max: options?.max ?? 100,
	__label: options?.label,
	__reset: value,
});

export const buildDateRangeField = (
	id: string,
	value: { start: Date; end: Date },
	operator: IOperator,
	options?: {
		initialVisible?: boolean;
		min?: Date;
		max?: Date;
		label?: string;
	},
) => ({
	id,
	__type: FieldTypes.daterange,
	value,
	operator,
	__index: 0,
	__visible: !!options?.initialVisible,
	__min: options?.min,
	__max: options?.max,
	__reset: value,
	__label: options?.label,
});

export const fieldBuilder = {
	[FieldTypes.text]: buildTextField,
	[FieldTypes.number]: buildNumberField,
	[FieldTypes.date]: buildDateField,
	[FieldTypes.time]: buildTimeField,
	[FieldTypes.select]: buildSelectField,
	[FieldTypes.boolean]: buildBooleanField,
	[FieldTypes.range]: buildRangeField,
	[FieldTypes.daterange]: buildDateRangeField,
	[FieldTypes.combobox]: buildComboField,
	[FieldTypes.asyncCombobox]: buildComboFieldAsync,
};

export type RFilterField = ReturnType<(typeof fieldBuilder)[IFieldType]>;

/**
 * helper type to cast one field into a specific type (runtime checks still needed)
 */
export type CastRFilterField<T extends IFieldType> = ReturnType<(typeof fieldBuilder)[T]>;

export function buildFilterModel<T extends RFilterField[]>(...fields: [...T]) {
	const focusedField = signal<string | null>(null);

	const _base = fields.reduce(
		(acc, field, i) => {
			field.__index = i;
			acc[field.id as T[number]['id']] = field;
			return acc;
		},
		{} as Record<T[number]['id'], T[number]>,
	);
	const _v = signal(_base);

	const _baseIndex = signal(fields.length);

	const fieldsArray = computed(
		() => {
			const v = _v();
			const unsorted = fields.map((f) => v[f.id as T[number]['id']]).filter((f) => f.__visible);
			unsorted.sort((a, b) => a.__index - b.__index);
			return unsorted;
		},
		{
			equal: (a, b) => a.length === b.length && a.every((v, i) => v.id === b[i].id),
		},
	);

	const availableFields = computed(() => {
		const v = _v();
		return fields.map((f) => v[f.id as T[number]['id']]).filter((f) => !f.__visible);
	});

	// ===== whole state manipulation =====
	const reset = () => {
		_v.set(_base);
	};

	// ===== single field update =====

	const addField = (fieldId: T[number]['id']) => {
		const fieldToAdd = _base[fieldId as T[number]['id']];
		if (!fieldToAdd) return;
		_baseIndex.update((i) => i + 1);
		_v.update((s) => ({
			...s,
			[fieldId]: { ...fieldToAdd, __index: _baseIndex(), __visible: true },
		}));
		focusedField.set(fieldId);
	};

	const clear = () => {
		_v.update((c) => {
			const next = { ...c };
			for (const key in next) {
				next[key as T[number]['id']] = {
					..._base[key as T[number]['id']],
					__visible: false,
					__index: 0,
				} satisfies T[number];
			}
			return next;
		});
		focusedField.set(FOCUS_FALLBACK);
	};

	return {
		value: _v,
		reset,
		// addfield is used to add back a "removed" field by resetting its value and operator to the initial state defined in _base
		fieldsArray,
		availableFields,
		addField,
		clear,
		focusedField,
	};
}

export type FilterModelRef = ReturnType<typeof buildFilterModel>;
