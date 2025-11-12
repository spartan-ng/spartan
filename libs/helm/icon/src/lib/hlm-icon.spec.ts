import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck } from '@ng-icons/lucide';
import { render, type RenderResult } from '@testing-library/angular';
import { HlmIcon } from './hlm-icon';

@Component({
	selector: 'hlm-mock',
	imports: [HlmIcon, NgIcon],
	providers: [provideIcons({ lucideCheck })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<ng-icon hlm class="test" name="lucideCheck" [size]="size()" color="red" strokeWidth="2" />
	`,
})
class HlmMock {
	public readonly size = input('base');
}

describe('HlmIconDirective', () => {
	let r: RenderResult<HlmMock>;
	let icon: HTMLElement;

	beforeEach(async () => {
		r = await render(HlmMock);
		icon = r.container.querySelector('ng-icon')!;
	});

	it('should add the xs size', async () => {
		await r.rerender({ componentInputs: { size: 'xs' } });
		r.fixture.detectChanges();
		expect(icon.getAttribute('style')).toContain('--ng-icon__size: 12px');
	});

	it('should add the sm size', async () => {
		await r.rerender({ componentInputs: { size: 'sm' } });
		r.fixture.detectChanges();
		expect(icon.getAttribute('style')).toContain('--ng-icon__size: 16px');
	});

	it('should add the base size', () => {
		expect(icon.getAttribute('style')).toContain('--ng-icon__size: 24px');
	});

	it('should add the lg size', async () => {
		await r.rerender({ componentInputs: { size: 'lg' } });
		r.fixture.detectChanges();
		expect(icon.getAttribute('style')).toContain('--ng-icon__size: 32px');
	});

	it('should add the xl size', async () => {
		await r.rerender({ componentInputs: { size: 'xl' } });
		r.fixture.detectChanges();
		expect(icon.getAttribute('style')).toContain('--ng-icon__size: 48px');
	});

	it('should forward the size property if the size is not a pre-defined size', async () => {
		await r.rerender({ componentInputs: { size: '2rem' } });
		r.fixture.detectChanges();
		const debugEl = r.fixture.debugElement.query(By.directive(NgIcon));
		expect(debugEl.componentInstance.size()).toBe('2rem');
		expect(icon.getAttribute('style')).toContain('--ng-icon__size: 2rem');
	});
});
