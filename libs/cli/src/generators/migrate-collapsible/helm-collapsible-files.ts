/**
 * Helm components that intentionally wrap the brain collapsible directives as host directives (to
 * expose their inputs). They are not consumers of the deprecated `<brn-collapsible>` component, so
 * both the healthcheck and the migration must skip them.
 */
export const HELM_COLLAPSIBLE_FILES = [
	'hlm-collapsible.ts',
	'hlm-collapsible-trigger.ts',
	'hlm-collapsible-content.ts',
	'hlm-trace-collapsible.ts',
	'hlm-trace-collapsible-trigger.ts',
	'hlm-trace-collapsible-content.ts',
];
