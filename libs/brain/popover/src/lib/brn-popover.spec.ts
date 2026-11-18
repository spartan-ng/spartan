import { type ConnectedPosition } from '@angular/cdk/overlay';
import { Component, input } from '@angular/core';
import { By } from '@angular/platform-browser';
import { render } from '@testing-library/angular';
import { BrnPopover } from './brn-popover';
import { type BrnPopoverAlign } from './brn-popover.token';

@Component({
	imports: [BrnPopover],
	template: `
		<div brnPopover [align]="align()"></div>
	`,
})
class PopoverHost {
	public readonly align = input<BrnPopoverAlign>('center');
}

const attachPositionsFor = async (align: BrnPopoverAlign): Promise<ConnectedPosition[]> => {
	const view = await render(PopoverHost, { inputs: { align } });
	const popover = view.fixture.debugElement.query(By.directive(BrnPopover)).injector.get(BrnPopover);
	return (popover as unknown as { getAttachPositions(): ConnectedPosition[] }).getAttachPositions();
};

const anchors = (positions: ConnectedPosition[]) => positions.map((p) => `${p.originX}/${p.overlayX}`);

describe('BrnPopover attach positions', () => {
	it('falls back to the opposite edge when aligned to start', async () => {
		expect(anchors(await attachPositionsFor('start'))).toEqual(['start/start', 'start/start', 'end/end', 'end/end']);
	});

	it('falls back to the opposite edge when aligned to end', async () => {
		expect(anchors(await attachPositionsFor('end'))).toEqual(['end/end', 'end/end', 'start/start', 'start/start']);
	});

	it('tries centred positions first, then falls back to start and end when aligned to center', async () => {
		expect(anchors(await attachPositionsFor('center'))).toEqual([
			'center/center',
			'center/center',
			'start/start',
			'start/start',
			'end/end',
			'end/end',
		]);
	});
});
