import { BrnDrawer } from './lib/brn-drawer';
import { BrnDrawerContent } from './lib/brn-drawer-content';
import { BrnDrawerFooter } from './lib/brn-drawer-footer';
import { BrnDrawerHandle } from './lib/brn-drawer-handle';
import { BrnDrawerOverlay } from './lib/brn-drawer-overlay';
import { BrnDrawerScroller } from './lib/brn-drawer-scroller';
import { BrnDrawerTrigger } from './lib/brn-drawer-trigger';

export { BrnDrawer } from './lib/brn-drawer';
export { BrnDrawerContent } from './lib/brn-drawer-content';
export { BrnDrawerFooter } from './lib/brn-drawer-footer';
export { BrnDrawerHandle } from './lib/brn-drawer-handle';
export { BrnDrawerOverlay } from './lib/brn-drawer-overlay';
export { BrnDrawerScroller } from './lib/brn-drawer-scroller';
export { BrnDrawerTrigger } from './lib/brn-drawer-trigger';

export {
	BRN_DRAWER_DEFAULT_DRAG_CLOSE_THRESHOLD,
	BRN_DRAWER_DEFAULT_DRAG_VELOCITY_THRESHOLD,
	BRN_DRAWER_DEFAULT_HEIGHT,
	BRN_DRAWER_DEFAULT_TWEEN_CONFIG,
	BRN_DRAWER_INDICATOR_ROTATION,
	BRN_DRAWER_OFFSCREEN_Y,
	BRN_DRAWER_REDUCED_MOTION_TWEEN_CONFIG,
} from './lib/constants';
export { trackDimensions } from './lib/effects/dimensions';
export { applyModalEffect } from './lib/effects/modal-effect';
export { preventScroll } from './lib/effects/prevent-scroll';
export { getSafeAreaInsets } from './lib/effects/safe-area-insets';
export { trackScrollPosition } from './lib/effects/scroll-position';
export { trackVirtualKeyboard } from './lib/effects/virtual-keyboard';
export type { BrnDrawerDetent, BrnDrawerSnapPoint, BrnDrawerState, BrnDrawerTweenConfig } from './lib/types';
export { isAscendingOrder, isIOS } from './lib/utils/platform';
export { computeSnapPoints, handleHighVelocityDrag, handleLowVelocityDrag } from './lib/utils/snap';
export { tweenTo } from './lib/utils/tween';

export const BrnDrawerImports = [
	BrnDrawer,
	BrnDrawerContent,
	BrnDrawerOverlay,
	BrnDrawerHandle,
	BrnDrawerScroller,
	BrnDrawerFooter,
	BrnDrawerTrigger,
] as const;
