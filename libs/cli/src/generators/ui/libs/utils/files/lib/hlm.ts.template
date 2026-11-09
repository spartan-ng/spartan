import { brnClasses, type BrnClassesOptions } from '@spartan-ng/brain/core';
import { type ClassValue, cn } from 'cn';

/**
 * Merges class values and resolves Tailwind CSS conflicts.
 *
 * To customize the merge (e.g. register custom theme values), create your own instance:
 *
 * @example
 * ```ts
 * import { createCn } from 'cn/config';
 *
 * export const hlm = createCn({
 *   extend: { classGroups: { 'font-size': [{ text: ['hero'] }] } },
 * });
 * ```
 */
export const hlm = cn;

/**
 * This function dynamically adds and removes classes for a given element without requiring
 * the a class binding (e.g. `[class]="..."`) which may interfere with other class bindings.
 * The classes are merged with `hlm`.
 */
export function classes(computed: () => ClassValue[] | string, options: Omit<BrnClassesOptions, 'merge'> = {}) {
	brnClasses(computed, { ...options, merge: hlm });
}
