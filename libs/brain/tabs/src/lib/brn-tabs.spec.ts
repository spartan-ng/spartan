import { ChangeDetectionStrategy, Component, input, viewChild } from '@angular/core';
import { render, type RenderResult, screen } from '@testing-library/angular';
import { BrnTabs } from './brn-tabs';
import { BrnTabsContent } from './brn-tabs-content';
import { BrnTabsTrigger } from './brn-tabs-trigger';

@Component({
	imports: [BrnTabs, BrnTabsTrigger, BrnTabsContent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div brnTabs="tab1" #tabs="brnTabs">
			@if (showTrigger()) {
				<button brnTabsTrigger [brnTabsTrigger]="'tab1'" data-testid="trigger" [disabled]="disabled()">
					Tab Trigger
				</button>
			}
			@if (showContent()) {
				<div brnTabsContent [brnTabsContent]="'tab1'" data-testid="content">Tab Content</div>
			}
		</div>
	`,
})
class BrnTabsDirectiveSpec {
	public readonly tabsDir = viewChild.required<BrnTabs>('tabs');

	public readonly showTrigger = input(true);
	public readonly showContent = input(true);
	public readonly disabled = input(false);
}

describe('BrnTabsDirective', () => {
	let renderResult: RenderResult<BrnTabsDirectiveSpec>;

	beforeEach(async () => {
		renderResult = await render(BrnTabsDirectiveSpec, {});
	});

	it('should register trigger and content on init', () => {
		const tabs = renderResult.fixture.componentInstance.tabsDir().$tabs();
		expect(Object.keys(tabs)).toContain('tab1');
		expect(tabs['tab1'].trigger).toBeInstanceOf(BrnTabsTrigger);
		expect(tabs['tab1'].content).toBeInstanceOf(BrnTabsContent);
	});

	it('should unregister only the trigger when it is removed', async () => {
		renderResult.fixture.componentRef.setInput('showTrigger', false);
		renderResult.fixture.detectChanges();
		const tabsAfter = renderResult.fixture.componentInstance.tabsDir().$tabs();
		expect(tabsAfter['tab1']).toBeDefined();
		expect(tabsAfter['tab1'].trigger).toBeUndefined();
		expect(tabsAfter['tab1'].content).toBeInstanceOf(BrnTabsContent);
	});

	it('should unregister only the content when it is removed', async () => {
		renderResult.fixture.componentRef.setInput('showContent', false);
		renderResult.fixture.detectChanges();
		const tabsAfter = renderResult.fixture.componentInstance.tabsDir().$tabs();
		expect(tabsAfter['tab1']).toBeDefined();
		expect(tabsAfter['tab1'].content).toBeUndefined();
		expect(tabsAfter['tab1'].trigger).toBeInstanceOf(BrnTabsTrigger);
	});

	it('should remove the entire tab entry when both trigger and content are gone', async () => {
		renderResult.fixture.componentRef.setInput('showContent', false);
		renderResult.fixture.componentRef.setInput('showTrigger', false);
		renderResult.fixture.detectChanges();
		const tabsAfter = renderResult.fixture.componentInstance.tabsDir().$tabs();
		expect(tabsAfter['tab1']).toBeUndefined();
	});

	it('should remove active tab when trigger was removed', async () => {
		expect(renderResult.fixture.componentInstance.tabsDir().$activeTab()).toBe('tab1');
		renderResult.fixture.componentRef.setInput('showTrigger', false);
		renderResult.fixture.detectChanges();
		expect(renderResult.fixture.componentInstance.tabsDir().$activeTab()).toBeUndefined();
	});

	it('should have tabindex -1 when it is disabled', async () => {
		renderResult.fixture.componentRef.setInput('disabled', true);
		renderResult.fixture.detectChanges();
		expect(screen.getByTestId('trigger').tabIndex).toBe(-1);
	});
});
