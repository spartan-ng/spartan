import type { BrnDrawerSnapPoint } from '../types';
import { isAscendingOrder } from './platform';

/**
 * Convert negative / percentage snap points to absolute values.
 *
 * Example output for `snapPointsProp = [0, 0.21, 0.5, 0.94, 1]` and `sheetHeight = 810`:
 *
 * ```json
 * [
 *   { "snapIndex": 0, "snapValue": 0,   "snapValueY": 810 },
 *   { "snapIndex": 1, "snapValue": 170, "snapValueY": 640 },
 *   { "snapIndex": 2, "snapValue": 405, "snapValueY": 405 },
 *   { "snapIndex": 3, "snapValue": 760, "snapValueY": 50 },
 *   { "snapIndex": 4, "snapValue": 810, "snapValueY": 0 }
 * ]
 * ```
 */
export function computeSnapPoints({
	snapPointsProp: inputSnapPoints,
	sheetHeight,
}: {
	snapPointsProp: number[];
	sheetHeight: number;
}): BrnDrawerSnapPoint[] {
	const snapPointsProp = [...inputSnapPoints];

	if (snapPointsProp[0] !== 0) {
		console.error(
			'First snap point should be 0 to ensure the drawer can be fully closed. ' + `Got: [${snapPointsProp.join(', ')}]`,
		);
		snapPointsProp.unshift(0);
	}

	if (snapPointsProp[snapPointsProp.length - 1] !== 1) {
		console.error(
			'Last snap point should be 1 to ensure the drawer can be fully opened. ' + `Got: [${snapPointsProp.join(', ')}]`,
		);
		snapPointsProp.push(1);
	}

	if (sheetHeight <= 0) {
		console.error(
			`Drawer height is ${sheetHeight}, cannot compute snap points. ` +
				'Make sure the drawer is mounted and has a valid height.',
		);
		return [];
	}

	const snapPointValues = snapPointsProp.map((point) => {
		// Percentage values e.g. between 0.0 and 1.0
		if (point > 0 && point <= 1) {
			return Math.round(point * sheetHeight);
		}

		return point < 0 ? sheetHeight + point : point; // negative values
	});

	console.assert(
		isAscendingOrder(snapPointValues),
		`Snap points need to be in ascending order got: [${snapPointsProp.join(', ')}]`,
	);

	// Make sure all snap points are within the drawer height
	snapPointValues.forEach((snap) => {
		if (snap < 0 || snap > sheetHeight) {
			console.warn(
				`Snap point ${snap} is outside of the drawer height ${sheetHeight}. ` +
					'This can cause unexpected behavior. Consider adjusting your snap points.',
			);
		}
	});

	if (!snapPointValues.includes(sheetHeight)) {
		console.warn(
			'Snap points do not include the drawer height. ' +
				'Please include `1` as the last snap point or it will be included automatically. ' +
				'This is to ensure the drawer can be fully opened.',
		);
		snapPointValues.push(sheetHeight);
	}

	return snapPointValues.map((snap, index) => ({
		snapIndex: index,
		snapValue: snap, // Absolute value from the bottom of the drawer
		snapValueY: sheetHeight - snap, // Y value is inverted as `y = 0` means drawer is at the top
	}));
}

function findClosestSnapPoint({
	snapPoints,
	currentY,
}: {
	snapPoints: BrnDrawerSnapPoint[];
	currentY: number;
}): BrnDrawerSnapPoint {
	return snapPoints.reduce((closest, snap) =>
		Math.abs(snap.snapValueY - currentY) < Math.abs(closest.snapValueY - currentY) ? snap : closest,
	);
}

function findNextSnapPointInDirection({
	y,
	snapPoints,
	dragDirection,
}: {
	y: number;
	snapPoints: BrnDrawerSnapPoint[];
	dragDirection: 'up' | 'down';
}): BrnDrawerSnapPoint | undefined {
	// NOTE: lower Y means higher in the drawer position!
	if (dragDirection === 'down') {
		return snapPoints
			.slice()
			.reverse()
			.find((s) => s.snapValueY > y);
	} else {
		return snapPoints.find((s) => s.snapValueY < y);
	}
}

/**
 * Resolve the snap target when the release velocity exceeds the high-velocity threshold.
 * Flicks to the endpoint in the gesture's direction.
 */
export function handleHighVelocityDrag({
	dragDirection,
	snapPoints,
}: {
	dragDirection: 'up' | 'down';
	snapPoints: BrnDrawerSnapPoint[];
}): { yTo: number; snapIndex: number } {
	// Go to either the last or the first snap point depending on the direction
	const bottomSnapPoint = snapPoints[0];
	const topSnapPoint = snapPoints[snapPoints.length - 1];

	if (!bottomSnapPoint || !topSnapPoint) {
		return { yTo: 0, snapIndex: 0 };
	}

	if (dragDirection === 'down') {
		return {
			yTo: bottomSnapPoint.snapValueY,
			snapIndex: bottomSnapPoint.snapIndex,
		};
	}
	return {
		yTo: topSnapPoint.snapValueY,
		snapIndex: topSnapPoint.snapIndex,
	};
}

/**
 * Resolve the snap target when the release velocity is below the high-velocity threshold.
 *
 * - If velocity is effectively zero, snap to the closest point.
 * - Otherwise, snap to the next point in the gesture's direction, falling back to the closest.
 */
export function handleLowVelocityDrag({
	currentY,
	dragDirection,
	snapPoints,
	velocity,
}: {
	currentY: number;
	dragDirection: 'up' | 'down';
	snapPoints: BrnDrawerSnapPoint[];
	velocity: number;
}): { yTo: number; snapIndex: number } {
	const closestSnapRelativeToCurrentY = findClosestSnapPoint({
		snapPoints,
		currentY,
	});

	/**
	 * If velocity is very low the user has stopped the drawer at a specific position,
	 * so we snap to the closest snap point — there is no "momentum" to push further.
	 */
	if (Math.abs(velocity) < 5) {
		return {
			yTo: closestSnapRelativeToCurrentY.snapValueY,
			snapIndex: closestSnapRelativeToCurrentY.snapIndex,
		};
	}

	/**
	 * With a bit more velocity, we prefer the next snap point in the given direction if any.
	 */
	const nextSnapInDirectionRelativeToCurrentY = findNextSnapPointInDirection({
		y: currentY,
		snapPoints,
		dragDirection,
	});

	if (nextSnapInDirectionRelativeToCurrentY) {
		return {
			yTo: nextSnapInDirectionRelativeToCurrentY.snapValueY,
			snapIndex: nextSnapInDirectionRelativeToCurrentY.snapIndex,
		};
	}

	// No next snap in this direction — snap to the closest one
	return {
		yTo: closestSnapRelativeToCurrentY.snapValueY,
		snapIndex: closestSnapRelativeToCurrentY.snapIndex,
	};
}
