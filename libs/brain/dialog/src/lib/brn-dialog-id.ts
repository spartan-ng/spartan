let dialogIdSequence = 0;

/**
 * Generates a unique id for a dialog. Shared by `BrnDialog` and `BrnDialogService`
 * so dialogs created through either path never get the same id.
 */
export function nextBrnDialogId(): string {
	return `brn-dialog-${++dialogIdSequence}`;
}
