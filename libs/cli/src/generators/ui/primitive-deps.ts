import type { Primitive } from './primitives';

export const primitiveDependencies: Record<Primitive, Primitive[]> = {
	accordion: ['icon'],
	alert: ['icon'],
	'alert-dialog': ['button'],
	'aspect-ratio': [],
	avatar: [],
	badge: [],
	breadcrumb: ['icon'],
	button: [],
	calendar: ['button', 'icon'],
	card: [],
	carousel: [],
	checkbox: ['icon'],
	collapsible: [],
	command: ['button', 'icon'],
	'context-menu': [],
	'date-picker': ['calendar', 'icon', 'popover'],
	dialog: [],
	'form-field': [],
	'hover-card': [],
	icon: [],
	input: ['form-field'],
	label: [],
	menu: ['icon'],
	menubar: [],
	pagination: ['button', 'icon'],
	popover: [],
	progress: [],
	'radio-group': [],
	'scroll-area': [],
	select: ['icon', 'form-field'],
	separator: [],
	sheet: [],
	skeleton: [],
	sonner: ['icon'],
	spinner: [],
	switch: [],
	table: [],
	tabs: [],
	toggle: [],
	'toggle-group': [],
	tooltip: [],
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
