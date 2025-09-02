import type { Primitive } from './primitives';

export const primitiveDependencies: Record<Primitive, Primitive[]> = {
	accordion: ['utils', 'icon'],
	alert: ['utils', 'icon'],
	'alert-dialog': ['utils', 'button'],
	'aspect-ratio': ['utils'],
	avatar: ['utils'],
	badge: ['utils'],
	breadcrumb: ['utils', 'icon'],
	button: ['utils'],
	calendar: ['utils', 'button', 'icon'],
	card: ['utils'],
	carousel: ['utils'],
	checkbox: ['utils', 'icon'],
	collapsible: ['utils'],
	command: ['utils', 'button', 'icon'],
	'context-menu': ['utils'],
	'date-picker': ['utils', 'calendar', 'icon', 'popover'],
	dialog: ['utils'],
	'form-field': ['utils'],
	'hover-card': ['utils'],
	icon: ['utils'],
	input: ['utils', 'form-field'],
	label: ['utils'],
	menu: ['utils', 'icon'],
	menubar: ['utils'],
	pagination: ['utils', 'button', 'icon'],
	popover: ['utils'],
	progress: ['utils'],
	'radio-group': ['utils'],
	'scroll-area': ['utils'],
	select: ['utils', 'icon', 'form-field'],
	separator: ['utils'],
	sheet: ['utils'],
	skeleton: ['utils'],
	sonner: ['utils', 'icon'],
	spinner: ['utils'],
	switch: ['utils'],
	table: ['utils'],
	tabs: ['utils'],
	toggle: ['utils'],
	'toggle-group': ['utils'],
	tooltip: ['utils'],
	utils: [],
};

export const getDependentPrimitives = (primitives: Primitive[]): Primitive[] => {
	const dependentPrimitives = new Set<Primitive>();

	for (const primitive of primitives) {
		const deps = primitiveDependencies[primitive] ?? [];
		for (const dep of deps) {
			if (!primitives.includes(dep)) {
				// only add the dependent primitive if it's not already in the list of primitives to create
				dependentPrimitives.add(dep);
			}
		}
	}

	return Array.from(dependentPrimitives);
};
