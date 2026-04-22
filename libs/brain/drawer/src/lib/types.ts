/** Height preset for the drawer's container. */
export type BrnDrawerDetent = 'default' | 'full' | 'content';

/** Internal state of the drawer state machine. */
export type BrnDrawerState = 'closed' | 'opening' | 'open' | 'closing';

/** Tween configuration for programmatic snap / dismiss animations. */
export interface BrnDrawerTweenConfig {
	ease: 'easeOut' | 'linear';
	/** Duration in seconds. */
	duration: number;
}

/** Absolute snap-point descriptor derived from user input. */
export interface BrnDrawerSnapPoint {
	snapIndex: number;
	/** Absolute value measured from the bottom of the drawer. */
	snapValue: number;
	/** Y translation value — inverted because `y = 0` means the drawer is at the top. */
	snapValueY: number;
}
