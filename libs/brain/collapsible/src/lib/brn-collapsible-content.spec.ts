import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { render, screen, waitFor } from '@testing-library/angular';
import { BrnCollapsible } from './brn-collapsible';
import { BrnCollapsibleContent } from './brn-collapsible-content';
import { BrnCollapsibleTrigger } from './brn-collapsible-trigger';

function contentHeight(): number {
	const content = screen.getByTestId('content');
	return Number.parseFloat(getComputedStyle(content).getPropertyValue('--brn-collapsible-content-height')) || 0;
}

// Content in a single wrapper, like the helm/CLI markup, so the ResizeObserver sees inner changes.
@Component({
	imports: [BrnCollapsible, BrnCollapsibleContent, BrnCollapsibleTrigger],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<brn-collapsible>
			<button brnCollapsibleTrigger>Toggle</button>
			<brn-collapsible-content style="display: block; overflow: hidden" data-testid="content">
				<div>
					<div [style.height.px]="200">body</div>
					@if (extra()) {
						<div [style.height.px]="100">extra</div>
					}
				</div>
			</brn-collapsible-content>
		</brn-collapsible>
	`,
})
class DynamicContentSpec {
	public readonly extra = signal(false);
}

// First node is a text node (leading interpolation) - the case that used to crash `firstChild`.
@Component({
	imports: [BrnCollapsible, BrnCollapsibleContent, BrnCollapsibleTrigger],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<brn-collapsible>
			<button brnCollapsibleTrigger>Toggle</button>
			<brn-collapsible-content style="display: block; overflow: hidden" data-testid="content">
				{{ leading }}
				<div [style.height.px]="200">body</div>
			</brn-collapsible-content>
		</brn-collapsible>
	`,
})
class LeadingTextNodeSpec {
	public readonly leading = 'leading text';
}

// Host clamped to the measured height (height: var), like a consumer animating the panel: the height
// must come back down when content is removed, not only grow.
@Component({
	imports: [BrnCollapsible, BrnCollapsibleContent, BrnCollapsibleTrigger],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<brn-collapsible>
			<button brnCollapsibleTrigger>Toggle</button>
			<brn-collapsible-content
				style="display: block; overflow: hidden; height: var(--brn-collapsible-content-height, auto)"
				data-testid="content"
			>
				<div>
					<div [style.height.px]="200">body</div>
					@if (extra()) {
						<div [style.height.px]="100">extra</div>
					}
				</div>
			</brn-collapsible-content>
		</brn-collapsible>
	`,
})
class ClampedContentSpec {
	public readonly extra = signal(true);
}

describe('BrnCollapsibleContent dimensions', () => {
	it('measures the natural content height', async () => {
		await render(DynamicContentSpec);
		await waitFor(() => expect(contentHeight()).toBeGreaterThanOrEqual(200));
	});

	it('re-measures when content is added', async () => {
		const { fixture } = await render(DynamicContentSpec);
		await waitFor(() => expect(contentHeight()).toBeGreaterThanOrEqual(200));

		fixture.componentInstance.extra.set(true);
		fixture.detectChanges();

		await waitFor(() => expect(contentHeight()).toBeGreaterThanOrEqual(300));
	});

	it('does not crash when the projected content starts with a text node', async () => {
		await render(LeadingTextNodeSpec);
		// A measured height means measurement ran without throwing.
		await waitFor(() => expect(contentHeight()).toBeGreaterThanOrEqual(200));
	});

	it('shrinks the measured height when content is removed while clamped', async () => {
		const { fixture } = await render(ClampedContentSpec);
		await waitFor(() => expect(contentHeight()).toBeGreaterThanOrEqual(300));

		fixture.componentInstance.extra.set(false);
		fixture.detectChanges();

		await waitFor(() => expect(contentHeight()).toBeLessThan(300));
	});
});
