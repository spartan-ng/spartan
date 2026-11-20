// Adapted from Base UI (https://github.com/mui/base-ui), MIT License, Copyright (c) 2019 Material-UI SAS.

/** CSS variables the drawer parts write. The names match Base UI, so shadcn styles port as-is. */
export const BrnDrawerCssVars = {
	/** The number of open drawers nested in this one. */
	nestedDrawers: '--nested-drawers',
	/** The popup height. */
	height: '--drawer-height',
	/** The height of the frontmost open drawer in the nested stack. */
	frontmostHeight: '--drawer-frontmost-height',
	/** The swipe movement on the x axis. */
	swipeMovementX: '--drawer-swipe-movement-x',
	/** The swipe movement on the y axis. */
	swipeMovementY: '--drawer-swipe-movement-y',
	/** The offset of the active snap point. */
	snapPointOffset: '--drawer-snap-point-offset',
	/** A scalar (0.1 to 1) for the release transition duration: faster flicks close faster. */
	swipeStrength: '--drawer-swipe-strength',
	/** The swipe progress, from 0 (open) to 1 (dismissed). */
	swipeProgress: '--drawer-swipe-progress',
	/** The height of the virtual keyboard covering the viewport. */
	keyboardInset: '--drawer-keyboard-inset',
} as const;

let swipeVarsRegistered = false;

/**
 * Registers the high-frequency swipe vars as non-inherited, so updating them during a drag does not
 * restyle the whole popup subtree. Drawer parts never read them from descendants.
 */
export function registerDrawerCssVars(): void {
	if (swipeVarsRegistered) return;
	swipeVarsRegistered = true;
	if (typeof CSS === 'undefined' || !('registerProperty' in CSS)) return;

	const register = (name: string, syntax: string, initialValue: string) => {
		try {
			CSS.registerProperty({ name, syntax, inherits: false, initialValue });
		} catch {
			// Already registered.
		}
	};

	register(BrnDrawerCssVars.swipeMovementX, '<length>', '0px');
	register(BrnDrawerCssVars.swipeMovementY, '<length>', '0px');
	register(BrnDrawerCssVars.snapPointOffset, '<length>', '0px');
	register(BrnDrawerCssVars.swipeProgress, '<number>', '0');
	register(BrnDrawerCssVars.swipeStrength, '<number>', '1');
}
