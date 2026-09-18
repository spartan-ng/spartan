import type { BrnMessageScrollerScrollable, BrnMessageScrollerVisibilityState } from './brn-message-scroller.types';

function areScrollStatesEqual(current: BrnMessageScrollerScrollable, next: BrnMessageScrollerScrollable) {
	return current.start === next.start && current.end === next.end;
}

function areVisibilityStatesEqual(current: BrnMessageScrollerVisibilityState, next: BrnMessageScrollerVisibilityState) {
	if (current.currentAnchorId !== next.currentAnchorId) {
		return false;
	}

	if (current.visibleMessageIds.length !== next.visibleMessageIds.length) {
		return false;
	}

	return current.visibleMessageIds.every((messageId, index) => messageId === next.visibleMessageIds[index]);
}

export { areScrollStatesEqual, areVisibilityStatesEqual };
