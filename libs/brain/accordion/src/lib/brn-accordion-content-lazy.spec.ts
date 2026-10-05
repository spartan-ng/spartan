import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { render, screen, type RenderResult } from '@testing-library/angular';
import { BrnAccordion } from './brn-accordion';
import { BrnAccordionContent } from './brn-accordion-content';
import { BrnAccordionContentLazy } from './brn-accordion-content-lazy';
import { BrnAccordionItem } from './brn-accordion-item';
import { BrnAccordionTrigger } from './brn-accordion-trigger';

@Component({
	imports: [BrnAccordion, BrnAccordionItem, BrnAccordionTrigger, BrnAccordionContent, BrnAccordionContentLazy],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div brnAccordion #accordion="brnAccordion">
			<div brnAccordionItem isOpened #item1="brnAccordionItem">
				<h3>
					<button brnAccordionTrigger data-testid="lazy-trigger1">Item 1</button>
				</h3>
				<brn-accordion-content data-testid="lazy-content1">
					<ng-template brnAccordionContentLazy>
						<span data-testid="lazy-inner1">Lazy Content 1</span>
					</ng-template>
				</brn-accordion-content>
			</div>
			<div brnAccordionItem #item2="brnAccordionItem">
				<h3>
					<button brnAccordionTrigger data-testid="lazy-trigger2">Item 2</button>
				</h3>
				<brn-accordion-content data-testid="lazy-content2">
					<ng-template brnAccordionContentLazy>
						<span data-testid="lazy-inner2">Lazy Content 2</span>
					</ng-template>
				</brn-accordion-content>
			</div>
		</div>
	`,
})
class BrnAccordionLazySpec {
	public readonly accordionDir = viewChild.required<BrnAccordion>('accordion');
}

describe('BrnAccordionContentLazy', () => {
	let renderResult: RenderResult<BrnAccordionLazySpec>;

	beforeEach(async () => {
		renderResult = await render(BrnAccordionLazySpec, {});
	});

	it('should render lazy content for an initially opened item', () => {
		expect(screen.getByTestId('lazy-inner1')).toBeTruthy();
	});

	it('should NOT render lazy content for a closed item', () => {
		expect(screen.queryByTestId('lazy-inner2')).toBeNull();
	});

	it('should render lazy content when an item is opened', async () => {
		screen.getByTestId('lazy-trigger2').click();
		renderResult.fixture.detectChanges();
		expect(screen.getByTestId('lazy-inner2')).toBeTruthy();
	});

	it('should preserve previously-rendered lazy content when the item is closed again', async () => {
		screen.getByTestId('lazy-trigger2').click();
		renderResult.fixture.detectChanges();
		expect(screen.getByTestId('lazy-inner2')).toBeTruthy();

		// Closing an opened item should not destroy its lazily rendered content.
		screen.getByTestId('lazy-trigger2').click();
		renderResult.fixture.detectChanges();
		expect(screen.getByTestId('lazy-inner2')).toBeTruthy();
	});

	it('should only instantiate lazy content once across multiple open/close toggles', async () => {
		screen.getByTestId('lazy-trigger2').click();
		renderResult.fixture.detectChanges();
		const firstRender = screen.getByTestId('lazy-inner2');

		screen.getByTestId('lazy-trigger2').click();
		renderResult.fixture.detectChanges();
		screen.getByTestId('lazy-trigger2').click();
		renderResult.fixture.detectChanges();

		expect(screen.getByTestId('lazy-inner2')).toBe(firstRender);
	});
});

@Component({
	imports: [BrnAccordion, BrnAccordionItem, BrnAccordionTrigger, BrnAccordionContent, BrnAccordionContentLazy],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div brnAccordion #accordion="brnAccordion">
			<div brnAccordionItem>
				<h3>
					<button brnAccordionTrigger data-testid="no-default-trigger1">Item 1</button>
				</h3>
				<brn-accordion-content data-testid="no-default-content1">
					<ng-template brnAccordionContentLazy>
						<span data-testid="no-default-inner1">Lazy Content 1</span>
					</ng-template>
				</brn-accordion-content>
			</div>
		</div>
	`,
})
class BrnAccordionLazyNoDefaultSpec {
	public readonly accordionDir = viewChild.required<BrnAccordion>('accordion');
}

describe('BrnAccordionContentLazy with no initially opened item', () => {
	it('should not render any lazy content when no item is opened', async () => {
		await render(BrnAccordionLazyNoDefaultSpec, {});
		expect(screen.queryByTestId('no-default-inner1')).toBeNull();
	});

	it('should render lazy content when the item is opened', async () => {
		const renderResult = await render(BrnAccordionLazyNoDefaultSpec, {});
		screen.getByTestId('no-default-trigger1').click();
		renderResult.fixture.detectChanges();
		expect(screen.getByTestId('no-default-inner1')).toBeTruthy();
	});
});
