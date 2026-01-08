import { stringifyAsLabel } from '@spartan-ng/brain/core';

export type BrnComboboxFilter = <Item>(
	item: Item,
	query: string,
	collator: Intl.Collator,
	itemToString?: (item: Item) => string,
) => boolean;

export const comboboxContainsFilter: BrnComboboxFilter = <Item>(
	item: Item,
	query: string,
	collator: Intl.Collator,
	itemToString?: (item: Item) => string,
): boolean => {
	if (!query) {
		return true;
	}

	const itemString = stringifyAsLabel(item, itemToString);

	for (let i = 0; i <= itemString.length - query.length; i += 1) {
		if (collator.compare(itemString.slice(i, i + query.length), query) === 0) {
			return true;
		}
	}

	return false;
};

export const comboboxStartsWithFilter: BrnComboboxFilter = <Item>(
	item: Item,
	query: string,
	collator: Intl.Collator,
	itemToString?: (item: Item) => string,
): boolean => {
	if (!query) {
		return true;
	}

	const itemString = stringifyAsLabel(item, itemToString);

	return collator.compare(itemString.slice(0, query.length), query) === 0;
};

export const comboboxEndsWithFilter: BrnComboboxFilter = <Item>(
	item: Item,
	query: string,
	collator: Intl.Collator,
	itemToString?: (item: Item) => string,
): boolean => {
	if (!query) {
		return true;
	}

	const itemString = stringifyAsLabel(item, itemToString);
	const queryLength = query.length;

	return (
		itemString.length >= queryLength && collator.compare(itemString.slice(itemString.length - queryLength), query) === 0
	);
};
