import type { CdkMenuTrigger } from '@angular/cdk/menu';
import { createMenuPosition, deriveMenuSideFromTransformOrigin, updateMenuPosition } from './menu-align';

describe(deriveMenuSideFromTransformOrigin.name, () => {
	it('reads the vertical token for a vertically placed menu', () => {
		// anchored at the top => sits below => side "bottom"
		expect(deriveMenuSideFromTransformOrigin('left top', 'bottom')).toBe('bottom');
		expect(deriveMenuSideFromTransformOrigin('center bottom', 'top')).toBe('top');
	});

	it('reflects a CDK flip on the vertical axis', () => {
		// configured bottom, but no room below => CDK anchors at the bottom => side flips to "top"
		expect(deriveMenuSideFromTransformOrigin('right bottom', 'bottom')).toBe('top');
	});

	it('reads the horizontal token for a horizontally placed menu', () => {
		// anchored at the left => sits to the right => side "right"
		expect(deriveMenuSideFromTransformOrigin('left top', 'right')).toBe('right');
		expect(deriveMenuSideFromTransformOrigin('right center', 'left')).toBe('left');
	});

	it('reflects a CDK flip on the horizontal axis (also covers RTL, which CDK bakes into the origin)', () => {
		expect(deriveMenuSideFromTransformOrigin('right top', 'right')).toBe('left');
	});

	it('does not couple the axis to root vs submenu: a horizontally placed root reads the x token', () => {
		// the old isRoot heuristic read the vertical token here and wrongly returned "bottom"
		expect(deriveMenuSideFromTransformOrigin('left top', 'right')).toBe('right');
	});

	it('falls back to the configured side when the origin is missing or centered', () => {
		expect(deriveMenuSideFromTransformOrigin('', 'bottom')).toBe('bottom');
		expect(deriveMenuSideFromTransformOrigin('center center', 'top')).toBe('top');
		expect(deriveMenuSideFromTransformOrigin('center center', 'right')).toBe('right');
	});
});

describe(updateMenuPosition.name, () => {
	it('assigns the positions and refreshes an existing overlay through the CDK change handler', () => {
		const position = createMenuPosition('start', 'right');
		const ngOnChanges = vi.fn();
		const trigger = { menuPosition: [], ngOnChanges } as unknown as CdkMenuTrigger;

		updateMenuPosition(trigger, position);

		expect(trigger.menuPosition).toBe(position);
		expect(ngOnChanges).toHaveBeenCalledTimes(1);
		expect(ngOnChanges.mock.calls[0][0]).toMatchObject({ menuPosition: { currentValue: position } });
	});
});
