import {
	ChangeDetectionStrategy,
	Component,
	contentChildren,
	type ElementRef,
	input,
	signal,
	viewChild,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { render, type RenderResult, screen } from '@testing-library/angular';
import type { Observable } from 'rxjs';
import { BrnTabs } from './brn-tabs';
import { BrnTabsContent } from './brn-tabs-content';
import { BrnTabsContentLazy } from './brn-tabs-content-lazy';
import { BrnTabsList } from './brn-tabs-list';
import { type BrnPaginatedTabHeaderItem, BrnTabsPaginatedList } from './brn-tabs-paginated-list';
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

@Component({
	imports: [BrnTabs, BrnTabsTrigger, BrnTabsContent, BrnTabsContentLazy],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div brnTabs="tab1" #tabs="brnTabs">
			<button brnTabsTrigger="tab1" data-testid="lazy-trigger1">Tab 1</button>
			<button brnTabsTrigger="tab2" data-testid="lazy-trigger2">Tab 2</button>
			<div brnTabsContent="tab1" data-testid="lazy-content1">
				<ng-template brnTabsContentLazy>
					<span data-testid="lazy-inner1">Lazy Content 1</span>
				</ng-template>
			</div>
			<div brnTabsContent="tab2" data-testid="lazy-content2">
				<ng-template brnTabsContentLazy>
					<span data-testid="lazy-inner2">Lazy Content 2</span>
				</ng-template>
			</div>
		</div>
	`,
})
class BrnTabsLazySpec {
	public readonly tabsDir = viewChild.required<BrnTabs>('tabs');
}

@Component({
	imports: [BrnTabs, BrnTabsTrigger, BrnTabsContent, BrnTabsContentLazy],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div #tabs="brnTabs" [brnTabs]="initialTab()">
			<button brnTabsTrigger="tab1" data-testid="no-default-trigger1">Tab 1</button>
			<button brnTabsTrigger="tab2" data-testid="no-default-trigger2">Tab 2</button>
			<div brnTabsContent="tab1" data-testid="no-default-content1">
				<ng-template brnTabsContentLazy>
					<span data-testid="no-default-inner1">Lazy Content 1</span>
				</ng-template>
			</div>
			<div brnTabsContent="tab2" data-testid="no-default-content2">
				<ng-template brnTabsContentLazy>
					<span data-testid="no-default-inner2">Lazy Content 2</span>
				</ng-template>
			</div>
		</div>
	`,
})
class BrnTabsLazyNoDefaultSpec {
	public readonly tabsDir = viewChild.required<BrnTabs>('tabs');
	public readonly initialTab = input<string | undefined>(undefined);
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

	it('should preserve active tab when trigger is destroyed', async () => {
		expect(renderResult.fixture.componentInstance.tabsDir().$activeTab()).toBe('tab1');
		renderResult.fixture.componentRef.setInput('showTrigger', false);
		renderResult.fixture.detectChanges();
		expect(renderResult.fixture.componentInstance.tabsDir().$activeTab()).toBe('tab1');
	});

	it('should not emit brnTabsChange with undefined when trigger is destroyed', async () => {
		const tabsDir = renderResult.fixture.componentInstance.tabsDir();
		const emittedValues: (string | undefined)[] = [];
		const sub = tabsDir.activeTab.subscribe((v) => emittedValues.push(v));
		renderResult.fixture.componentRef.setInput('showTrigger', false);
		renderResult.fixture.detectChanges();
		// No change event should fire at all when a trigger is destroyed
		expect(emittedValues.length).toBe(0);
		expect(emittedValues).not.toContain(undefined);
		sub.unsubscribe();
	});

	it('should have tabindex -1 when it is disabled', async () => {
		renderResult.fixture.componentRef.setInput('disabled', true);
		renderResult.fixture.detectChanges();
		expect(screen.getByTestId('trigger').tabIndex).toBe(-1);
	});
});

describe('BrnTabsContentLazy', () => {
	let renderResult: RenderResult<BrnTabsLazySpec>;

	beforeEach(async () => {
		renderResult = await render(BrnTabsLazySpec, {});
	});

	it('should render lazy content for the initially active tab', () => {
		expect(screen.getByTestId('lazy-inner1')).toBeTruthy();
	});

	it('should NOT render lazy content for an inactive tab', () => {
		expect(screen.queryByTestId('lazy-inner2')).toBeNull();
	});

	it('should render lazy content when switching to an inactive tab', async () => {
		screen.getByTestId('lazy-trigger2').click();
		renderResult.fixture.detectChanges();
		expect(screen.getByTestId('lazy-inner2')).toBeTruthy();
	});

	it('should preserve previously-rendered lazy content when switching away', async () => {
		// Switch to tab2 to render its lazy content
		screen.getByTestId('lazy-trigger2').click();
		renderResult.fixture.detectChanges();
		expect(screen.getByTestId('lazy-inner2')).toBeTruthy();

		// Switch back to tab1
		screen.getByTestId('lazy-trigger1').click();
		renderResult.fixture.detectChanges();

		// Both lazy contents should still exist in the DOM
		expect(screen.getByTestId('lazy-inner1')).toBeTruthy();
		expect(screen.getByTestId('lazy-inner2')).toBeTruthy();
	});

	it('should only instantiate lazy content once across multiple tab switches', async () => {
		// Switch to tab2
		screen.getByTestId('lazy-trigger2').click();
		renderResult.fixture.detectChanges();
		const firstRender = screen.getByTestId('lazy-inner2');

		// Switch away and back
		screen.getByTestId('lazy-trigger1').click();
		renderResult.fixture.detectChanges();
		screen.getByTestId('lazy-trigger2').click();
		renderResult.fixture.detectChanges();

		// Should be the same DOM node (not re-created)
		expect(screen.getByTestId('lazy-inner2')).toBe(firstRender);
	});
});

describe('BrnTabsContentLazy with no default tab', () => {
	let renderResult: RenderResult<BrnTabsLazyNoDefaultSpec>;

	beforeEach(async () => {
		renderResult = await render(BrnTabsLazyNoDefaultSpec, {});
	});

	it('should not render any lazy content when no tab is active', () => {
		expect(screen.queryByTestId('no-default-inner1')).toBeNull();
		expect(screen.queryByTestId('no-default-inner2')).toBeNull();
	});

	it('should render lazy content when a tab is activated', async () => {
		screen.getByTestId('no-default-trigger1').click();
		renderResult.fixture.detectChanges();
		expect(screen.getByTestId('no-default-inner1')).toBeTruthy();
		expect(screen.queryByTestId('no-default-inner2')).toBeNull();
	});
});

const ARROW_RIGHT = { key: 'ArrowRight', keyCode: 39 };
const HOME = { key: 'Home', keyCode: 36 };
const END = { key: 'End', keyCode: 35 };

function key(target: HTMLElement, init: Partial<KeyboardEventInit> & { key: string; keyCode: number }) {
	const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init });
	// Browsers ignore `keyCode` from the constructor, but the CDK key manager reads it.
	Object.defineProperty(event, 'keyCode', { value: init.keyCode });
	target.dispatchEvent(event);
}

@Component({
	selector: 'brn-test-paginated-tabs-list',
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<button #previousPaginator type="button" tabindex="-1" aria-hidden="true"></button>
		<div #tabListContainer (keydown)="_handleKeydown($event)">
			<div #tabList role="tablist">
				<div #tabListInner>
					<ng-content />
				</div>
			</div>
		</div>
		<button #nextPaginator type="button" tabindex="-1" aria-hidden="true"></button>
	`,
})
class BrnTestPaginatedTabsList extends BrnTabsPaginatedList {
	public readonly items = contentChildren(BrnTabsTrigger);
	public readonly itemsChanges: Observable<ReadonlyArray<BrnPaginatedTabHeaderItem>> = toObservable(this.items);

	public readonly tabListContainer = viewChild.required<ElementRef<HTMLElement>>('tabListContainer');
	public readonly tabList = viewChild.required<ElementRef<HTMLElement>>('tabList');
	public readonly tabListInner = viewChild.required<ElementRef<HTMLElement>>('tabListInner');
	public readonly nextPaginator = viewChild.required<ElementRef<HTMLElement>>('nextPaginator');
	public readonly previousPaginator = viewChild.required<ElementRef<HTMLElement>>('previousPaginator');

	protected _itemSelected(event: KeyboardEvent) {
		event.preventDefault();
	}
}

@Component({
	imports: [BrnTabs, BrnTabsList, BrnTabsTrigger],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div [(brnTabs)]="active" (tabActivated)="activations.push($event)">
			<div brnTabsList>
				<button brnTabsTrigger="A" data-testid="list-A">Tab A</button>
				<button brnTabsTrigger="B" data-testid="list-B">Tab B</button>
				<button brnTabsTrigger="C" data-testid="list-C">Tab C</button>
			</div>
		</div>
	`,
})
class BrnTabsListActivationSpec {
	public readonly active = signal<string | undefined>('A');
	public readonly activations: string[] = [];
}

@Component({
	imports: [BrnTabs, BrnTestPaginatedTabsList, BrnTabsTrigger],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div [(brnTabs)]="active" (tabActivated)="activations.push($event)">
			<brn-test-paginated-tabs-list>
				<button brnTabsTrigger="A" data-testid="paginated-A">Tab A</button>
				<button brnTabsTrigger="B" data-testid="paginated-B">Tab B</button>
				<button brnTabsTrigger="C" data-testid="paginated-C">Tab C</button>
			</brn-test-paginated-tabs-list>
		</div>
	`,
})
class BrnTabsPaginatedListActivationSpec {
	public readonly active = signal<string | undefined>('A');
	public readonly activations: string[] = [];
}

describe('BrnTabsList automatic activation', () => {
	it('should emit tabActivated once per arrow key', async () => {
		const { fixture } = await render(BrnTabsListActivationSpec);
		screen.getByTestId('list-A').focus();

		key(screen.getByTestId('list-A'), ARROW_RIGHT);
		key(screen.getByTestId('list-B'), ARROW_RIGHT);

		expect(fixture.componentInstance.activations).toEqual(['B', 'C']);
		expect(fixture.componentInstance.active()).toBe('C');
		expect(document.activeElement).toBe(screen.getByTestId('list-C'));
	});

	it('should not emit tabActivated when focus lands on the already active tab', async () => {
		const { fixture } = await render(BrnTabsListActivationSpec);
		screen.getByTestId('list-A').focus();

		key(screen.getByTestId('list-A'), HOME);

		expect(fixture.componentInstance.activations).toEqual([]);
		expect(fixture.componentInstance.active()).toBe('A');
	});

	it('should still emit tabActivated when the active tab is clicked', async () => {
		const { fixture } = await render(BrnTabsListActivationSpec);

		screen.getByTestId('list-A').click();

		expect(fixture.componentInstance.activations).toEqual(['A']);
	});
});

describe('BrnTabsPaginatedList automatic activation', () => {
	it('should emit tabActivated once per arrow key', async () => {
		const { fixture } = await render(BrnTabsPaginatedListActivationSpec);
		screen.getByTestId('paginated-A').focus();

		key(screen.getByTestId('paginated-A'), ARROW_RIGHT);
		key(screen.getByTestId('paginated-B'), ARROW_RIGHT);

		expect(fixture.componentInstance.activations).toEqual(['B', 'C']);
		expect(fixture.componentInstance.active()).toBe('C');
		expect(document.activeElement).toBe(screen.getByTestId('paginated-C'));
	});

	it('should emit tabActivated once for End and Home', async () => {
		const { fixture } = await render(BrnTabsPaginatedListActivationSpec);
		screen.getByTestId('paginated-A').focus();

		key(screen.getByTestId('paginated-A'), END);
		key(screen.getByTestId('paginated-C'), HOME);

		expect(fixture.componentInstance.activations).toEqual(['C', 'A']);
		expect(fixture.componentInstance.active()).toBe('A');
	});
});
