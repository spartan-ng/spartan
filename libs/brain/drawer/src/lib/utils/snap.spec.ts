import { computeSnapPoints, handleHighVelocityDrag, handleLowVelocityDrag } from './snap';

describe('computeSnapPoints', () => {
	it('converts percentage snap points to absolute values', () => {
		const result = computeSnapPoints({ snapPointsProp: [0, 0.5, 1], sheetHeight: 800 });

		expect(result).toEqual([
			{ snapIndex: 0, snapValue: 0, snapValueY: 800 },
			{ snapIndex: 1, snapValue: 400, snapValueY: 400 },
			{ snapIndex: 2, snapValue: 800, snapValueY: 0 },
		]);
	});

	it('converts negative snap points (distance from top) to absolute values', () => {
		const result = computeSnapPoints({ snapPointsProp: [0, -100, 1], sheetHeight: 800 });

		expect(result[1]?.snapValue).toBe(700); // 800 - 100
	});

	it('returns [] when sheetHeight is zero', () => {
		const result = computeSnapPoints({ snapPointsProp: [0, 0.5, 1], sheetHeight: 0 });
		expect(result).toEqual([]);
	});

	it('prepends 0 when first snap point is not 0', () => {
		const result = computeSnapPoints({ snapPointsProp: [0.5, 1], sheetHeight: 800 });
		expect(result[0]?.snapValue).toBe(0);
	});

	it('appends 1 (full height) when last snap point is not 1', () => {
		const result = computeSnapPoints({ snapPointsProp: [0, 0.5], sheetHeight: 800 });
		expect(result[result.length - 1]?.snapValue).toBe(800);
	});
});

describe('handleHighVelocityDrag', () => {
	const snapPoints = [
		{ snapIndex: 0, snapValue: 0, snapValueY: 800 },
		{ snapIndex: 1, snapValue: 400, snapValueY: 400 },
		{ snapIndex: 2, snapValue: 800, snapValueY: 0 },
	];

	it('flicks to the bottom snap point when dragged down', () => {
		expect(handleHighVelocityDrag({ dragDirection: 'down', snapPoints })).toEqual({
			yTo: 800,
			snapIndex: 0,
		});
	});

	it('flicks to the top snap point when dragged up', () => {
		expect(handleHighVelocityDrag({ dragDirection: 'up', snapPoints })).toEqual({
			yTo: 0,
			snapIndex: 2,
		});
	});

	it('returns safe defaults when snap points are empty', () => {
		expect(handleHighVelocityDrag({ dragDirection: 'down', snapPoints: [] })).toEqual({
			yTo: 0,
			snapIndex: 0,
		});
	});
});

describe('handleLowVelocityDrag', () => {
	const snapPoints = [
		{ snapIndex: 0, snapValue: 0, snapValueY: 800 },
		{ snapIndex: 1, snapValue: 400, snapValueY: 400 },
		{ snapIndex: 2, snapValue: 800, snapValueY: 0 },
	];

	it('snaps to the closest point when velocity is effectively zero', () => {
		const result = handleLowVelocityDrag({
			currentY: 450,
			dragDirection: 'down',
			snapPoints,
			velocity: 2, // below 5 px/s threshold
		});

		expect(result.snapIndex).toBe(1); // closest to y=450 is snap 1 (y=400)
	});

	it('snaps to the next point in gesture direction when velocity is non-trivial (down)', () => {
		const result = handleLowVelocityDrag({
			currentY: 410,
			dragDirection: 'down',
			snapPoints,
			velocity: 100, // moderate velocity
		});

		expect(result.snapIndex).toBe(0); // next point below y=410 in the "down" direction
	});

	it('snaps to the next point in gesture direction when velocity is non-trivial (up)', () => {
		const result = handleLowVelocityDrag({
			currentY: 390,
			dragDirection: 'up',
			snapPoints,
			velocity: 100,
		});

		expect(result.snapIndex).toBe(2); // next point above y=390 in the "up" direction
	});

	it('falls back to closest when no next snap in the given direction', () => {
		// Already at topmost; dragging up cannot find a next point
		const result = handleLowVelocityDrag({
			currentY: 0,
			dragDirection: 'up',
			snapPoints,
			velocity: 100,
		});

		expect(result.snapIndex).toBe(2); // closest is the top itself
	});
});
