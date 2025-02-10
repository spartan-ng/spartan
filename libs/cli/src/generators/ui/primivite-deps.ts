import type { Primitive } from './primivites';

export const primitiveDependencies: Record<Primitive, Primitive[]> = {
	accordion: ['icon'],
	alert: ['icon'],
	alertdialog: ['button'],
	aspectratio: [],
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
	contextmenu: [],
	datepicker: ['calendar', 'icon', 'popover'],
	dialog: [],
	formfield: [],
	hovercard: [],
	icon: [],
	input: ['formfield'],
	label: [],
	menu: ['icon'],
	menubar: [],
	pagination: ['button', 'icon'],
	popover: [],
	progress: [],
	radiogroup: [],
	scrollarea: [],
	select: ['icon', 'formfield'],
	separator: [],
	sheet: [],
	skeleton: [],
	sonner: ['icon'],
	spinner: [],
	switch: [],
	table: [],
	tabs: [],
	toggle: [],
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
