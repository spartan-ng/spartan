export type BrnDialogState = 'closed' | 'open';

export type BrnDialogPhase = 'closed' | 'closing' | 'open';

/**
 * The CSS transition status of an open dialog: `starting` for the first frame after it opens
 * (rendered with `data-starting-style`), `ending` while its exit transition runs (rendered with
 * `data-ending-style`), and `undefined` otherwise.
 */
export type BrnDialogTransitionStatus = 'starting' | 'ending' | undefined;

export type BrnDialogDismissReason = 'backdrop' | 'escape' | 'focus-out' | 'outside' | 'swipe';
