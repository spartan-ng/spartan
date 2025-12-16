import type { Primitive } from './primitives';

export const primitiveDependencies: Record<Primitive, Primitive[]> = {
	accordion: ['utils', 'icon'],
	alert: ['utils', 'icon'],
	'alert-dialog': ['utils', 'button'],
	'aspect-ratio': ['utils'],
	autocomplete: ['utils', 'popover', 'icon', 'input-group'],
	avatar: ['utils'],
	badge: ['utils'],
	breadcrumb: ['utils', 'icon'],
	button: ['utils'],
	'button-group': ['utils', 'button'],
	calendar: ['utils', 'button', 'icon', 'select'],
	card: ['utils'],
	carousel: ['utils', 'button', 'icon'],
	checkbox: ['utils', 'icon'],
	collapsible: ['utils'],
	command: ['utils', 'button', 'icon'],
	'context-menu': ['utils', 'dropdown-menu'],
	'date-picker': ['utils', 'calendar', 'icon', 'popover'],
	dialog: ['utils', 'icon'],
	'dropdown-menu': ['utils', 'icon'],
	empty: ['utils'],
	field: ['utils', 'label', 'separator'],
	'form-field': ['utils'],
	'hover-card': ['utils'],
	icon: [],
	input: ['utils'],
	'input-group': ['utils', 'button', 'input', 'textarea'],
	'input-otp': ['utils', 'icon'],
	item: ['utils', 'separator'],
	kbd: ['utils'],
	label: ['utils'],
	menubar: ['utils', 'dropdown-menu'],
	'navigation-menu': ['utils'],
	pagination: ['utils', 'button', 'icon', 'select'],
	popover: ['utils'],
	progress: ['utils'],
	'radio-group': ['utils'],
	resizable: ['utils', 'icon'],
	'scroll-area': ['utils'],
	select: ['utils', 'icon'],
	separator: ['utils'],
	sheet: ['utils', 'icon'],
	sidebar: ['utils', 'button', 'icon', 'input', 'separator', 'sheet', 'skeleton', 'tooltip'],
	skeleton: ['utils'],
	slider: ['utils'],
	sonner: ['utils'],
	spinner: ['utils'],
	switch: ['utils'],
	table: ['utils'],
	tabs: ['utils', 'icon'],
	textarea: ['utils'],
	toggle: ['utils'],
	'toggle-group': ['utils', 'toggle'],
	tooltip: [],
	typography: ['utils'],
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
