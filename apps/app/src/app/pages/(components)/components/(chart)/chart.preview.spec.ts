import { TestBed } from '@angular/core/testing';
import { ChartPreview } from './chart.preview';

describe('ChartPreview', () => {
	it('switches between the desktop and mobile series', async () => {
		const fixture = TestBed.createComponent(ChartPreview);
		fixture.detectChanges();
		await fixture.whenStable();

		const buttons = fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
		expect(buttons[0]?.textContent).toContain('7,324');
		expect(buttons[1]?.textContent).toContain('7,250');
		expect(buttons[0]?.getAttribute('aria-pressed')).toBe('true');

		buttons[1]?.click();
		fixture.detectChanges();
		await fixture.whenStable();

		expect(buttons[1]?.getAttribute('aria-pressed')).toBe('true');
		expect(fixture.nativeElement.querySelector('svg')?.getAttribute('aria-label')).toBe('Mobile visitors by day');
	});
});
