/* eslint-disable @typescript-eslint/naming-convention */
import type { WritableSignal } from '@angular/core';
import { computed } from '@angular/core';
import type { BrnTimeValue } from '@spartan-ng/brain/time-input';
import type { CastRFilterField, RFilterField } from './builders';
import { FOCUS_FALLBACK } from './constants';
import type { IOperator } from './operators';
import type { IFieldType } from './types';
import { FieldTypes } from './types';

export type HandlerGlobalState = {
	focusedField: WritableSignal<string | null>;
};

/**
 * helper function to create typed handlers
 * @returns
 */
function vGuard<T>(): T {
	return undefined as T;
}

export function throwHandlerException(message: string): never {
	throw new Error(`Exception in Handler: ${message}`);
}

function baseHandlers<T, K extends IFieldType>(
	fieldId: string,
	state: WritableSignal<Record<string, RFilterField>>,
	globalState: HandlerGlobalState,
	typeGuard: K,
	_valueGuard: () => T,
) {
	const current = state()[fieldId];

	const type =
		current.__type === typeGuard
			? typeGuard
			: throwHandlerException(`Field type mismatch. Expected ${typeGuard}, got ${current.__type}`);

	const readonlyModel = computed(() => state()[fieldId] as CastRFilterField<K>);

	const formId = computed(() => `${type}-${fieldId}` as const);
	const controlValue = computed<T>(() => readonlyModel().value as T);
	const controlLabel = computed(() => readonlyModel().__label ?? fieldId);
	const operatorValue = computed(() => readonlyModel().operator);
	const isFocused = computed(() => globalState.focusedField() === fieldId);

	function updateControl<T>(value: T) {
		state.update((v) => (v[fieldId] ? ({ ...v, [fieldId]: { ...v[fieldId], value } } as typeof v) : v));
	}

	const closeField = () => {
		state.update((v) => {
			const { [fieldId]: _, ...rest } = v;
			return { ...rest, [fieldId]: { ...current, __visible: false } } as typeof v;
		});
		globalState.focusedField.set(`${FOCUS_FALLBACK}-${fieldId}`);
	};

	const setOperator = (operator: IOperator | IOperator[] | undefined) => {
		const update = operator
			? Array.isArray(operator)
				? (operator.at(0) ?? current.operator)
				: operator
			: current.operator;

		state.update((v) => (v[fieldId] ? ({ ...v, [fieldId]: { ...v[fieldId], operator: update } } as typeof v) : v));
	};

	return {
		readonlyModel,
		formId,
		controlValue,
		controlLabel,
		operatorValue,
		isFocused,
		closeField,
		setOperator,
		updateControl,
		type,
	};
}

export function booleanFieldHandlers(
	fieldId: string,
	state: WritableSignal<Record<string, RFilterField>>,
	globalState: HandlerGlobalState,
) {
	const {
		operatorValue: _,
		setOperator: __,
		readonlyModel: ___,
		...rest
	} = baseHandlers(fieldId, state, globalState, FieldTypes.boolean, vGuard<boolean>);

	return {
		...rest,
	};
}

export function textFieldHandlers(
	fieldId: string,
	state: WritableSignal<Record<string, RFilterField>>,
	globalState: HandlerGlobalState,
) {
	const { readonlyModel, ...base } = baseHandlers(fieldId, state, globalState, FieldTypes.text, vGuard<string>);

	const fieldRequired = computed(() => {
		const v = readonlyModel();
		return v.__required ?? false;
	});

	return {
		...base,
		fieldRequired,
	};
}

export function numberFieldHandlers(
	fieldId: string,
	state: WritableSignal<Record<string, RFilterField>>,
	globalState: HandlerGlobalState,
) {
	const { readonlyModel, ...base } = baseHandlers(fieldId, state, globalState, FieldTypes.number, vGuard<number>);

	const min = computed(() => {
		const v = readonlyModel();
		return v.__min ?? Number.MIN_SAFE_INTEGER;
	});

	const max = computed(() => {
		const v = readonlyModel();
		return v.__max ?? Number.MAX_SAFE_INTEGER;
	});

	const step = computed(() => {
		const v = readonlyModel();
		return v.__step ?? 1;
	});

	return {
		...base,
		min,
		max,
		step,
	};
}

export function dateFieldHandlers(
	fieldId: string,
	state: WritableSignal<Record<string, RFilterField>>,
	globalState: HandlerGlobalState,
) {
	const { readonlyModel, ...base } = baseHandlers(fieldId, state, globalState, FieldTypes.date, vGuard<Date>);

	const min = computed(() => {
		const v = readonlyModel();
		return v.__min ?? null;
	});

	const max = computed(() => {
		const v = readonlyModel();
		return v.__max ?? null;
	});

	return {
		...base,
		min,
		max,
	};
}

export function timeFieldHandlers(
	fieldId: string,
	state: WritableSignal<Record<string, RFilterField>>,
	globalState: HandlerGlobalState,
) {
	const { readonlyModel, ...base } = baseHandlers(fieldId, state, globalState, FieldTypes.time, vGuard<Date>);
	const seed = readonlyModel();

	const min = computed(() => {
		const v = readonlyModel();
		return v.__min ?? null;
	});

	const max = computed(() => {
		const v = readonlyModel();
		return v.__max ?? null;
	});

	// state understands Date, filter talks in { hours: number; minutes: number; seconds: number; period: 'AM' | 'PM' }
	const updateTimeControl = (value: BrnTimeValue) => {
		const d = new Date(seed.value);
		let hours = value.hours % 12;
		if (value.period === 'PM') hours += 12;
		d.setHours(hours, value.minutes, value.seconds, 0);
		base.updateControl(d);
	};

	// state understands Date, filter talks in { hours: number; minutes: number; seconds: number; period: 'AM' | 'PM' }
	const timeControlValue = computed(() => {
		const v = readonlyModel().value ?? seed.value;
		const hours = v.getHours();
		const minutes = v.getMinutes();
		const seconds = v.getSeconds();
		const period = hours >= 12 ? 'PM' : 'AM';
		return { hours: hours % 12 || 12, minutes, seconds, period } satisfies BrnTimeValue;
	});

	return {
		...base,
		min,
		max,
		updateControl: updateTimeControl,
		controlValue: timeControlValue,
	};
}

export function selectFieldHandlers(
	fieldId: string,
	state: WritableSignal<Record<string, RFilterField>>,
	globalState: HandlerGlobalState,
) {
	const { readonlyModel, ...base } = baseHandlers(
		fieldId,
		state,
		globalState,
		FieldTypes.select,
		vGuard<unknown | unknown[]>,
	);

	const updateSelectControl = (value: unknown | unknown[]) => {
		const update = Array.isArray(value) ? value.at(0) : value;
		base.updateControl(update);
	};

	const options = computed(() => {
		const v = readonlyModel();
		return v.__options;
	});

	const selectedOptionLabel = computed(() => {
		const v = readonlyModel();
		return v.__itemToString(base.controlValue());
	});

	return {
		...base,
		updateControl: updateSelectControl,
		selectedOptionLabel,
		options,
	};
}

export function rangeFieldHandlers(
	fieldId: string,
	state: WritableSignal<Record<string, RFilterField>>,
	globalState: HandlerGlobalState,
) {
	const { readonlyModel, ...base } = baseHandlers(
		fieldId,
		state,
		globalState,
		FieldTypes.range,
		vGuard<[number, number]>,
	);

	const min = computed(() => {
		const v = readonlyModel();
		return v.__min ?? null;
	});

	const max = computed(() => {
		const v = readonlyModel();
		return v.__max ?? null;
	});

	return {
		...base,
		min,
		max,
	};
}

export function dateRangeFieldHandlers(
	fieldId: string,
	state: WritableSignal<Record<string, RFilterField>>,
	globalState: HandlerGlobalState,
) {
	const { readonlyModel, ...base } = baseHandlers(
		fieldId,
		state,
		globalState,
		FieldTypes.daterange,
		vGuard<[Date, Date]>,
	);

	const min = computed(() => {
		const v = readonlyModel();
		return v.__min ?? null;
	});

	const max = computed(() => {
		const v = readonlyModel();
		return v.__max ?? null;
	});

	return {
		...base,
		min,
		max,
	};
}

export function comboboxFieldHandlers(
	fieldId: string,
	state: WritableSignal<Record<string, RFilterField>>,
	globalState: HandlerGlobalState,
) {
	const { readonlyModel, ...base } = baseHandlers(fieldId, state, globalState, FieldTypes.combobox, vGuard<unknown>);

	const options = computed(() => {
		const v = readonlyModel();
		return v.__options ?? [];
	});

	const placeholder = computed(() => {
		const v = readonlyModel();
		return v.__placeholder ?? '';
	});

	return {
		...base,
		options,
		placeholder,
	};
}

export function asyncComboFieldHandlers(
	fieldId: string,
	state: WritableSignal<Record<string, RFilterField>>,
	globalState: HandlerGlobalState,
) {
	const { readonlyModel, ...base } = baseHandlers(
		fieldId,
		state,
		globalState,
		FieldTypes.asyncCombobox,
		vGuard<unknown>,
	);

	const placeholder = computed(() => {
		const v = readonlyModel();
		return v.__placeholder ?? '';
	});

	const itemToString = computed(() => {
		const v = readonlyModel();
		return v.__itemToString ?? ((item: unknown) => String(item));
	});

	const fieldResourceRequest = computed(() => {
		const v = readonlyModel();
		return v.__resourceRequest || throwHandlerException('Resource request is required for async combobox field');
	});

	const fieldResourceOptions =
		readonlyModel().__resourceOptions ||
		throwHandlerException('Resource options are required for async combobox field');

	return {
		...base,
		placeholder,
		itemToString,
		fieldResourceRequest,
		fieldResourceOptions,
	};
}

// functions above are only exported for unit testing purposes
// for any other use case, consider using the FIELD_HANDLERS_MAP

export const FIELD_HANDLERS_MAP = {
	[FieldTypes.asyncCombobox]: asyncComboFieldHandlers,
	[FieldTypes.boolean]: booleanFieldHandlers,
	[FieldTypes.combobox]: comboboxFieldHandlers,
	[FieldTypes.date]: dateFieldHandlers,
	[FieldTypes.daterange]: dateRangeFieldHandlers,
	[FieldTypes.number]: numberFieldHandlers,
	[FieldTypes.range]: rangeFieldHandlers,
	[FieldTypes.select]: selectFieldHandlers,
	[FieldTypes.text]: textFieldHandlers,
	[FieldTypes.time]: timeFieldHandlers,
};

export type TFieldHandlers = ReturnType<(typeof FIELD_HANDLERS_MAP)[IFieldType]>;

export type FHandler<K> = K extends IFieldType ? ReturnType<(typeof FIELD_HANDLERS_MAP)[K]> : never;
