import type { BrnDrawerTweenConfig } from './types';

/** Default height reserved to keep the drawer below the safe-area + status-bar gap. */
export const BRN_DRAWER_DEFAULT_HEIGHT = 'calc(100% - env(safe-area-inset-top) - 34px)';

/** Default tween configuration used for open / close / snap animations. */
export const BRN_DRAWER_DEFAULT_TWEEN_CONFIG: BrnDrawerTweenConfig = {
	ease: 'easeOut',
	duration: 0.2,
};

/** Tween configuration used when the user prefers reduced motion. */
export const BRN_DRAWER_REDUCED_MOTION_TWEEN_CONFIG: BrnDrawerTweenConfig = {
	ease: 'linear',
	duration: 0.01,
};

/** Fraction of the drawer height past which a low-velocity release dismisses (no snap points). */
export const BRN_DRAWER_DEFAULT_DRAG_CLOSE_THRESHOLD = 0.6;

/** Velocity (px/s) above which a release dismisses regardless of position. */
export const BRN_DRAWER_DEFAULT_DRAG_VELOCITY_THRESHOLD = 500;

/** Initial Y position used before the drawer is first measured. */
export const BRN_DRAWER_OFFSCREEN_Y = 9999;

/** Drag-indicator rotation (degrees) applied during drag. */
export const BRN_DRAWER_INDICATOR_ROTATION = 10;
