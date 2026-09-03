import { getTooltipArrowOffset, resolveTooltipPosition, type TooltipRect } from './brn-tooltip-position';

const rect = (partial: Partial<TooltipRect>): TooltipRect => ({ left: 0, top: 0, width: 0, height: 0, ...partial });

describe('getTooltipArrowOffset', () => {
	describe('top/bottom tooltips track on X', () => {
		it('is zero when the tooltip is centered on the trigger', () => {
			const trigger = rect({ left: 100, width: 40 }); // center 120
			const tooltip = rect({ left: 60, width: 120 }); // center 120
			expect(getTooltipArrowOffset(trigger, tooltip, 'top')).toEqual({ x: 0, y: 0 });
		});

		it('slides the arrow toward the trigger when the tooltip was pushed right', () => {
			const trigger = rect({ left: 0, width: 40 }); // center 20
			const tooltip = rect({ left: 8, width: 120 }); // center 68
			// arrow must move -48 to sit over the trigger; well within the clamp so it lands exactly
			expect(getTooltipArrowOffset(trigger, tooltip, 'bottom')).toEqual({ x: -48, y: 0 });
		});

		it('clamps so the arrow never leaves the tooltip', () => {
			const trigger = rect({ left: 1000, width: 40 }); // far to the right
			const tooltip = rect({ left: 0, width: 120 });
			// max = 120/2 - 10/2 - 4 = 51
			expect(getTooltipArrowOffset(trigger, tooltip, 'top')).toEqual({ x: 51, y: 0 });
		});
	});

	describe('left/right tooltips track on Y', () => {
		it('slides the arrow vertically toward the trigger', () => {
			const trigger = rect({ top: 0, height: 40 }); // center 20
			const tooltip = rect({ top: 8, height: 120 }); // center 68
			expect(getTooltipArrowOffset(trigger, tooltip, 'right')).toEqual({ x: 0, y: -48 });
		});

		it('clamps on the Y axis', () => {
			const trigger = rect({ top: -1000, height: 40 });
			const tooltip = rect({ top: 0, height: 120 });
			expect(getTooltipArrowOffset(trigger, tooltip, 'left')).toEqual({ x: 0, y: -51 });
		});
	});
});

describe('resolveTooltipPosition', () => {
	it('maps a known CDK connection pair back to a position', () => {
		expect(resolveTooltipPosition({ originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top' })).toBe(
			'bottom',
		);
	});

	it('returns null for an unknown pair', () => {
		expect(
			resolveTooltipPosition({ originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'bottom' }),
		).toBeNull();
	});
});
