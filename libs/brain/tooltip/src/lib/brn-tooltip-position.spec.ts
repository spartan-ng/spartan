import { getTooltipSideOffset } from './brn-tooltip-position';

describe('getTooltipSideOffset', () => {
	it('offsets each placement along its own axis', () => {
		expect(getTooltipSideOffset('top', 8)).toEqual({ x: 0, y: -8 });
		expect(getTooltipSideOffset('bottom', 8)).toEqual({ x: 0, y: 8 });
		expect(getTooltipSideOffset('left', 8)).toEqual({ x: -8, y: 0 });
		expect(getTooltipSideOffset('right', 8)).toEqual({ x: 8, y: 0 });
	});

	it('keeps explicit and negative offsets', () => {
		expect(getTooltipSideOffset('bottom', 0)).toEqual({ x: 0, y: 0 });
		expect(getTooltipSideOffset('bottom', -4)).toEqual({ x: 0, y: -4 });
	});
});
