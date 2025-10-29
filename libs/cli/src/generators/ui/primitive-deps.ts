import type { Primitive } from './primitives';

export const primitiveDependencies: Record<Primitive, Primitive[]> = {
	accordion: ['utils', 'icon'],
	alert: ['utils', 'icon'],
	'alert-dialog': ['utils', 'button'],
	'aspect-ratio': ['utils'],
	autocomplete: ['utils', 'popover', 'command', 'icon', 'input-group'],
	avatar: ['utils'],
	badge: ['utils'],
	breadcrumb: ['utils', 'icon'],
	button: ['utils'],
	'button-group': ['utils', 'separator', 'button'],
	calendar: ['utils', 'button', 'icon'],
	card: ['utils'],
	carousel: ['utils'],
	checkbox: ['utils', 'icon'],
	collapsible: ['utils'],
	command: ['utils', 'button', 'icon'],
	'context-menu': ['utils'],
	'date-picker': ['utils', 'calendar', 'icon', 'popover'],
	dialog: ['utils'],
	empty: ['utils'],
	field: ['utils', 'label', 'separator'],
	'form-field': ['utils'],
	'hover-card': ['utils'],
	'input-group': ['utils', 'textarea', 'input'],
	'input-otp': ['utils', 'icon'],
	icon: ['utils'],
	input: ['utils', 'form-field'],
	item: ['utils', 'separator'],
	kbd: ['utils'],
	label: ['utils'],
	menu: ['utils', 'icon'],
	menubar: ['utils'],
	pagination: ['utils', 'button', 'icon'],
	popover: ['utils'],
	progress: ['utils'],
	'radio-group': ['utils'],
	resizable: ['utils', 'icon'],
	'scroll-area': ['utils'],
	select: ['utils', 'icon', 'form-field'],
	separator: ['utils'],
	sheet: ['utils'],
	sidebar: ['utils', 'button', 'icon', 'input', 'separator', 'sheet', 'tooltip'],
	skeleton: ['utils'],
	slider: ['utils'],
	sonner: ['utils', 'icon'],
	spinner: ['utils'],
	switch: ['utils'],
	table: ['utils'],
	tabs: ['utils'],
	textarea: ['utils', 'form-field'],
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
