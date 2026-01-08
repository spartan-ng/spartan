export function stringifyAsLabel(item: any, itemToStringLabel?: (item: any) => string) {
	if (itemToStringLabel && item != null) {
		return itemToStringLabel(item) ?? '';
	}
	if (item && typeof item === 'object') {
		if ('label' in item && item.label != null) {
			return String(item.label);
		}
		if ('value' in item) {
			return String(item.value);
		}
	}
	return serializeValue(item);
}

export function serializeValue(value: unknown): string {
	if (value == null) {
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
