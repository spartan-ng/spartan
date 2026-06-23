import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { render, screen, waitFor } from '@testing-library/angular';
import { BrnAccordion } from './brn-accordion';
import { BrnAccordionContent } from './brn-accordion-content';
import { BrnAccordionItem } from './brn-accordion-item';
import { BrnAccordionTrigger } from './brn-accordion-trigger';

function contentHeight(): number {
	const content = screen.getByRole('region');
	return Number.parseFloat(getComputedStyle(content).getPropertyValue('--brn-accordion-content-height')) || 0;
}

// Content in a single wrapper, like the helm/CLI markup, so the ResizeObserver sees inner changes.
@Component({
	imports: [BrnAccordion, BrnAccordionItem, BrnAccordionTrigger, BrnAccordionContent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div brnAccordion>
			<div brnAccordionItem isOpened>
				<h3>
					<button brnAccordionTrigger>Item</button>
				</h3>
				<brn-accordion-content style="display: block; overflow: hidden">
					<div>
						<div [style.height.px]="200">body</div>
						@if (extra()) {
							<div [style.height.px]="100">extra</div>
						}
					</div>
				</brn-accordion-content>
			</div>
		</div>
	`,
})
class DynamicContentSpec {
	public readonly extra = signal(false);
}

// First node is a text node (leading interpolation) - the case that used to crash `firstChild`.
@Component({
	imports: [BrnAccordion, BrnAccordionItem, BrnAccordionTrigger, BrnAccordionContent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div brnAccordion>
			<div brnAccordionItem isOpened>
				<h3>
					<button brnAccordionTrigger>Item</button>
				</h3>
				<brn-accordion-content style="display: block; overflow: hidden">
					{{ leading }}
					<div [style.height.px]="200">body</div>
				</brn-accordion-content>
			</div>
		</div>
	`,
})
class LeadingTextNodeSpec {
	public readonly leading = 'leading text';
}

describe('BrnAccordionContent dimensions', () => {
	it('measures the natural content height of an open item', async () => {
		await render(DynamicContentSpec);
		await waitFor(() => expect(contentHeight()).toBeGreaterThanOrEqual(200));
	});

	it('re-measures when content is added while open', async () => {
		const { fixture } = await render(DynamicContentSpec);
		await waitFor(() => expect(contentHeight()).toBeGreaterThanOrEqual(200));

		fixture.componentInstance.extra.set(true);
		fixture.detectChanges();

		await waitFor(() => expect(contentHeight()).toBeGreaterThanOrEqual(300));
	});

	// scrollHeight covers the whole host, so a leading text node before the first element is included
	// in the measured height (and a leading text node never crashes measurement).
	it('includes a leading text node in the measured height', async () => {
		await render(LeadingTextNodeSpec);
		const region = screen.getByRole('region');
		await waitFor(() => expect(contentHeight()).toBe(region.scrollHeight));
		expect(contentHeight()).toBeGreaterThan(200);
	});
});
