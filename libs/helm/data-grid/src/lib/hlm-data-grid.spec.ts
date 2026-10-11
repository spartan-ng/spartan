import { ChangeDetectionStrategy, Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { HlmDataGrid } from './hlm-data-grid';

@Component({
	selector: 'hlm-data-grid-host',
	imports: [HlmDataGrid],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-data-grid [loading]="loading" [error]="error" [total]="total" [retry]="retry">
			<tr class="projected-row">
				<td>row</td>
			</tr>
		</hlm-data-grid>
	`,
})
class Host {
	public loading = false;
	public error: unknown = null;
	public total = 0;
	public readonly retry = vi.fn();
}

function setup(): { fixture: ComponentFixture<Host>; host: Host; el: HTMLElement } {
	TestBed.configureTestingModule({ imports: [Host] });
	const fixture = TestBed.createComponent(Host);
	const host = fixture.componentInstance;
	return { fixture, host, el: fixture.nativeElement as HTMLElement };
}

describe('hlm-data-grid states', () => {
	it('loading shows the skeleton', () => {
		const { fixture, host, el } = setup();
		host.loading = true;
		host.total = 5;
		fixture.detectChanges();
		expect(el.querySelector('.shimmer')?.textContent).toContain('Loading');
		expect(el.querySelector('[role="alert"]')).toBeNull();
		expect(el.querySelector('.projected-row')).toBeNull();
		expect(el.querySelector('table')?.getAttribute('aria-busy')).toBe('true');
	});

	it('error with rows keeps the rows visible under the alert banner', () => {
		const { fixture, host, el } = setup();
		host.error = new Error('boom');
		host.total = 5;
		fixture.detectChanges();
		expect(el.querySelector('[role="alert"]')).not.toBeNull();
		expect(el.querySelector('.projected-row')).not.toBeNull();
		expect((el.querySelector('[role="alert"]') as HTMLElement).textContent).toContain('Failed to load.');
	});

	it('error with zero rows shows the alert without rows or the empty message', () => {
		const { fixture, host, el } = setup();
		host.error = new Error('boom');
		host.total = 0;
		fixture.detectChanges();
		expect(el.querySelector('[role="alert"]')).not.toBeNull();
		expect(el.querySelector('.projected-row')).toBeNull();
		expect(el.textContent).not.toContain('No results.');
	});

	it('retry invokes the retry input', () => {
		const { fixture, host, el } = setup();
		host.error = new Error('boom');
		host.total = 5;
		fixture.detectChanges();
		(el.querySelector('[role="alert"] button') as HTMLButtonElement).click();
		expect(host.retry).toHaveBeenCalledTimes(1);
	});

	it('empty shows the empty message with aria-busy false', () => {
		const { fixture, host, el } = setup();
		host.total = 0;
		fixture.detectChanges();
		expect(el.textContent).toContain('No results.');
		expect(el.querySelector('[role="alert"]')).toBeNull();
		expect(el.querySelector('.projected-row')).toBeNull();
		expect(el.querySelector('table')?.getAttribute('aria-busy')).toBe('false');
	});

	it('rows render with no alert or empty message', () => {
		const { fixture, host, el } = setup();
		host.total = 3;
		fixture.detectChanges();
		expect(el.querySelector('.projected-row')).not.toBeNull();
		expect(el.querySelector('[role="alert"]')).toBeNull();
		expect(el.textContent).not.toContain('No results.');
	});
});
