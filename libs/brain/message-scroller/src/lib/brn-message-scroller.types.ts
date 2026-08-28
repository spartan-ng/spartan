// Default scrollEdgeThreshold. Sub-pixel tolerance so edge detection does not
// flicker across engines that round scrollTop differently.
const DEFAULT_SCROLL_EDGE_THRESHOLD = 8;

// Default scrollPreviousItemPeek. Pixels of the previous item kept visible above
// a newly anchored row.
const DEFAULT_SCROLL_PREVIOUS_ITEM_PEEK = 64;

// Default scrollMargin for scrollToMessage and programmatic targets.
const DEFAULT_SCROLL_MARGIN = 0;

// Two fractional scrollTop values within this range are treated as equal, to
// absorb zoom and HiDPI rounding drift.
const SCROLL_POSITION_EPSILON = 0.5;

// How long (ms) data-autoscrolling stays set during a programmatic smooth scroll
// before clearing.
const AUTOSCROLLING_CLEAR_DELAY = 180;

// Viewport keys that count as deliberate scroll intent and release follow-bottom.
const USER_SCROLL_KEYS = new Set([
	'ArrowDown',
	'ArrowUp',
	'End',
	'Home',
	'PageDown',
	'PageUp',
	' ', // Space key.
]);

// Internal scroll mode. Derived from intent and commands; decides how the
// viewport reacts to content and resize.
type BrnMessageScrollerMode =
	| 'following-bottom' // autoScroll on, pinned to the latest message.
	| 'free-scrolling' // reader scrolled away; position left alone (prepends still preserved).
	| 'anchored-to-message' // holding a turn at the reading line while it streams.
	| 'settling-jump'; // a programmatic jump is animating; intent detection suppressed until it settles.

// Where a saved transcript opens on the first non-empty render.
type BrnMessageScrollerDefaultScrollPosition = 'start' | 'end' | 'last-anchor';

// Which transcript edge MessageScrollerButton scrolls toward.
type BrnMessageScrollerButtonDirection = 'start' | 'end';

// Viewport alignment for scrollToMessage and programmatic jumps.
type BrnMessageScrollerScrollAlign = 'start' | 'center' | 'end' | 'nearest';

// Options for scrollToMessage, scrollToEnd, and scrollToStart.
type BrnMessageScrollerScrollOptions = {
	// Viewport edge or center to align the target to.
	align?: BrnMessageScrollerScrollAlign;
	// Native scroll behavior.
	behavior?: ScrollBehavior;
	// Margin on the aligned edge, in pixels. Defaults to the provider scrollMargin.
	scrollMargin?: number;
};

// Scroll snapshot: which edges the viewport can still scroll toward.
type BrnMessageScrollerScrollable = {
	// The viewport can scroll toward the start (content is hidden above).
	start: boolean;
	// The viewport can scroll toward the end (content is hidden below).
	end: boolean;
};

// Visibility snapshot for the transcript.
type BrnMessageScrollerVisibilityState = {
	// The anchored turn the reader is in, or null. Stays set after the anchor
	// scrolls above the viewport.
	currentAnchorId: string | null;
	// messageId values intersecting the viewport, in document order.
	visibleMessageIds: string[];
};

// Headless provider configuration for a chat transcript scroller.
type BrnMessageScrollerProviderProps = {
	// Follow new content at the bottom while the viewport is already at the end.
	autoScroll?: boolean;
	// Opening position on the first non-empty render, applied once.
	defaultScrollPosition?: BrnMessageScrollerDefaultScrollPosition;
	// Distance from an edge that still counts as at-top/at-bottom. Defaults to 8.
	scrollEdgeThreshold?: number;
	// Extra top margin for a newly anchored row, added to scrollMargin. Defaults to 64.
	scrollPreviousItemPeek?: number;
	// Default margin on the aligned edge for commands and visibility. Defaults to 0.
	scrollMargin?: number;
};

// Registers (or, with removedElement, unregisters) a MessageScrollerItem node by
// messageId.
type BrnMessageScrollerRegisterMessage = (
	messageId: string,
	element: HTMLElement | null,
	removedElement?: HTMLElement | null,
) => void;

// Initial BrnMessageScrollerScrollable before measurement. Stable reference for the
// server and first-render snapshot.
const EMPTY_MESSAGE_SCROLLER_SCROLLABLE: BrnMessageScrollerScrollable = {
	start: false,
	end: false,
};

// Shared empty array so empty visibility snapshots stay referentially stable.
const EMPTY_VISIBLE_MESSAGE_IDS: string[] = [];

// Initial BrnMessageScrollerVisibilityState. Nothing tracked, no current anchor.
const EMPTY_MESSAGE_SCROLLER_VISIBILITY_STATE: BrnMessageScrollerVisibilityState = {
	currentAnchorId: null,
	visibleMessageIds: EMPTY_VISIBLE_MESSAGE_IDS,
};

export {
	AUTOSCROLLING_CLEAR_DELAY,
	DEFAULT_SCROLL_EDGE_THRESHOLD,
	DEFAULT_SCROLL_MARGIN,
	DEFAULT_SCROLL_PREVIOUS_ITEM_PEEK,
	EMPTY_MESSAGE_SCROLLER_SCROLLABLE,
	EMPTY_MESSAGE_SCROLLER_VISIBILITY_STATE,
	EMPTY_VISIBLE_MESSAGE_IDS,
	SCROLL_POSITION_EPSILON,
	USER_SCROLL_KEYS,
};

export type {
	BrnMessageScrollerButtonDirection,
	BrnMessageScrollerDefaultScrollPosition,
	BrnMessageScrollerMode,
	BrnMessageScrollerProviderProps,
	BrnMessageScrollerRegisterMessage,
	BrnMessageScrollerScrollAlign,
	BrnMessageScrollerScrollOptions,
	BrnMessageScrollerScrollable,
	BrnMessageScrollerVisibilityState,
};
