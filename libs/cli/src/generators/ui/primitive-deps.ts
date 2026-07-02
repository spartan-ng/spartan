import type { Primitive } from './primitives';

export const primitiveDependencies: Record<Primitive, Primitive[]> = {
	accordion: ['utils'],
	alert: ['utils'],
	'alert-dialog': ['utils', 'button'],
	'aspect-ratio': ['utils'],
	autocomplete: ['utils', 'popover', 'input-group'],
	avatar: ['utils'],
	badge: ['utils'],
	breadcrumb: ['utils'],
	button: ['utils'],
	'button-group': ['utils', 'button'],
	calendar: ['utils', 'button', 'select'],
	card: ['utils'],
	carousel: ['utils', 'button'],
	checkbox: ['utils'],
	collapsible: ['utils'],
	combobox: ['utils', 'input-group', 'button'],
	command: ['utils', 'button'],
	'context-menu': ['utils', 'dropdown-menu'],
	'date-picker': ['utils', 'calendar', 'popover'],
	dialog: ['utils'],
	drawer: ['utils'],
	'dropdown-menu': ['utils'],
	empty: ['utils'],
	field: ['utils', 'label', 'separator'],
	'hover-card': ['utils'],
	input: ['utils'],
	'input-group': ['utils', 'button', 'input', 'textarea'],
	'input-otp': ['utils'],
	item: ['utils', 'separator'],
	kbd: ['utils'],
	label: ['utils'],
	menubar: ['utils', 'dropdown-menu'],
	'month-year-calendar': ['utils', 'button'],
	'native-select': ['utils'],
	'navigation-menu': ['utils'],
	pagination: ['utils', 'button', 'select'],
	popover: ['utils'],
	progress: ['utils'],
	'radio-group': ['utils'],
	resizable: ['utils'],
	'scroll-area': ['utils'],
	select: ['utils'],
	separator: ['utils'],
	sheet: ['utils', 'button'],
	sidebar: ['utils', 'button', 'input', 'separator', 'sheet', 'skeleton', 'tooltip'],
	skeleton: ['utils'],
	slider: ['utils'],
	sonner: ['utils'],
	spinner: ['utils'],
	switch: ['utils'],
	table: ['utils'],
	tabs: ['utils'],
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
				getDependentPrimitives([dep])
					.filter((primitive) => !dependentPrimitives.has(primitive) && !primitives.includes(primitive))
					.forEach((d) => dependentPrimitives.add(d));
			}
		}
	}

	return Array.from(dependentPrimitives);
};
