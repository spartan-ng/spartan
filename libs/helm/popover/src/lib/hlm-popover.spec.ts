import { Directionality } from '@angular/cdk/bidi';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrnOverlayService } from '@spartan-ng/brain/overlay';
import { BrnPopover } from '@spartan-ng/brain/popover';
import { render } from '@testing-library/angular';
import { HlmPopover } from './hlm-popover';
import { HlmPopoverContent } from './hlm-popover-content';
import { HlmPopoverPortal } from './hlm-popover-portal';
import { HlmPopoverTrigger } from './hlm-popover-trigger';

@Component({
	selector: 'hlm-popover-direction-host',
	imports: [HlmPopover, HlmPopoverContent, HlmPopoverPortal, HlmPopoverTrigger],
	providers: [Directionality],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-popover>
			<button hlmPopoverTrigger>open</button>
			<hlm-popover-content *hlmPopoverPortal="let ctx">
				<span>content</span>
			</hlm-popover-content>
		</hlm-popover>
	`,
})
class PopoverDirectionHost {
	public readonly directionality = inject(Directionality);
}

describe('HlmPopover direction', () => {
	const setup = async (dir: 'ltr' | 'rtl' | null) => {
		const view = await render(PopoverDirectionHost);
		const host = view.fixture.componentInstance;
		const service = TestBed.inject(BrnOverlayService);
		const openSpy = vi.spyOn(service, 'open');

		if (dir) {
			host.directionality.valueSignal.set(dir);
		}
		view.detectChanges();

		const popover = view.fixture.debugElement.query(By.directive(HlmPopover)).injector.get(BrnPopover);
		popover.open();

		return openSpy;
	};

	afterEach(() => {
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	it('passes the ambient rtl direction to the opened overlay', async () => {
		const openSpy = await setup('rtl');
		expect(openSpy).toHaveBeenCalled();
		expect(openSpy.mock.calls.at(-1)?.[3]?.direction).toBe('rtl');
	});

	it('passes ltr to the overlay by default', async () => {
		const openSpy = await setup(null);
		expect(openSpy).toHaveBeenCalled();
		expect(openSpy.mock.calls.at(-1)?.[3]?.direction).toBe('ltr');
	});
});
