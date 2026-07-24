export function stringifyAsLabel(item: any, itemToStringLabel?: (item: any) => string) {
	if (itemToStringLabel && item !== null && item !== undefined) {
		return itemToStringLabel(item) ?? '';
	}
	if (item && typeof item === 'object') {
		if ('label' in item && item.label !== null && item.label !== undefined) {
			return String(item.label);
		}
		if ('value' in item && item.value !== null && item.value !== undefined) {
			return String(item.value);
		}
	}
	return serializeValue(item);
}

export function serializeValue(value: unknown): string {
	if (value === null || value === undefined) {
		return '';
	}
	if (typeof value === 'string') {
		return value;
	}
	try {
		return JSON.stringify(value);
	} catch {
		return String(value);
	}
}
