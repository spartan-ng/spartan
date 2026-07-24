import { Directionality } from '@angular/cdk/bidi';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BrnPopover } from '@spartan-ng/brain/popover';
import { fireEvent, render } from '@testing-library/angular';
import { HlmPopover } from './hlm-popover';
import { HlmPopoverContent } from './hlm-popover-content';
import { HlmPopoverPortal } from './hlm-popover-portal';
import { HlmPopoverTrigger } from './hlm-popover-trigger';

// Lets afterNextRender (autoFocus runs there) and microtasks settle.
const flush = async () => {
	await new Promise((resolve) => setTimeout(resolve, 0));
	await new Promise((resolve) => setTimeout(resolve, 0));
};

@Component({
	selector: 'hlm-popover-focusable-host',
	imports: [HlmPopover, HlmPopoverContent, HlmPopoverPortal, HlmPopoverTrigger],
	providers: [Directionality],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-popover>
			<button hlmPopoverTrigger>open</button>
			<hlm-popover-content *hlmPopoverPortal="let ctx">
				<input data-testid="field" />
			</hlm-popover-content>
		</hlm-popover>
	`,
})
class PopoverFocusableHost {}

@Component({
	selector: 'hlm-popover-non-focusable-host',
	imports: [HlmPopover, HlmPopoverContent, HlmPopoverPortal, HlmPopoverTrigger],
	providers: [Directionality],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-popover>
			<button hlmPopoverTrigger>open</button>
			<hlm-popover-content *hlmPopoverPortal="let ctx">
				<span data-testid="text">content</span>
			</hlm-popover-content>
		</hlm-popover>
	`,
})
class PopoverNonFocusableHost {}

@Component({
	selector: 'hlm-popover-nested-host',
	imports: [HlmPopover, HlmPopoverContent, HlmPopoverPortal, HlmPopoverTrigger],
	providers: [Directionality],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-popover>
			<button hlmPopoverTrigger>open-parent</button>
			<hlm-popover-content *hlmPopoverPortal="let ctx">
				<hlm-popover>
					<button hlmPopoverTrigger>open-child</button>
					<hlm-popover-content *hlmPopoverPortal="let childCtx">
						<span data-testid="child-content">child</span>
					</hlm-popover-content>
				</hlm-popover>
			</hlm-popover-content>
		</hlm-popover>
	`,
})
class PopoverNestedHost {}

describe('HlmPopover focus management', () => {
	afterEach(() => {
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	it('moves focus to the first tabbable element in the content on open', async () => {
		const view = await render(PopoverFocusableHost);
		const trigger = view.container.querySelector('button[hlmPopoverTrigger]') as HTMLButtonElement;

		trigger.focus();
		trigger.click();
		view.detectChanges();
		await flush();

		const field = document.querySelector('[data-testid="field"]') as HTMLInputElement;
		expect(field).toBeTruthy();
		expect(document.activeElement).toBe(field);
	});

	it('restores focus to the trigger when dismissed with Escape', async () => {
		const view = await render(PopoverFocusableHost);
		const trigger = view.container.querySelector('button[hlmPopoverTrigger]') as HTMLButtonElement;

		trigger.focus();
		trigger.click();
		view.detectChanges();
		await flush();

		const field = document.querySelector('[data-testid="field"]') as HTMLInputElement;
		expect(document.activeElement).toBe(field);

		fireEvent.keyDown(field, { key: 'Escape' });
		view.detectChanges();
		await flush();

		expect(document.querySelector('[data-testid="field"]')).toBeNull();
		expect(document.activeElement).toBe(trigger);
	});

	// Guards the select/combobox keyboard model: the select listbox has no tabbable element, so
	// autoFocus must leave focus on the trigger rather than pulling it into the panel.
	it('leaves focus on the trigger when the content has no tabbable element', async () => {
		const view = await render(PopoverNonFocusableHost);
		const trigger = view.container.querySelector('button[hlmPopoverTrigger]') as HTMLButtonElement;

		trigger.focus();
		trigger.click();
		view.detectChanges();
		await flush();

		expect(document.querySelector('[data-testid="text"]')).toBeTruthy();
		expect(document.activeElement).toBe(trigger);
	});
});

describe('HlmPopover nested dismissal', () => {
	afterEach(() => {
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	it('keeps the parent open while the nested child is the topmost overlay', async () => {
		const view = await render(PopoverNestedHost);
		const parent = view.fixture.debugElement.query(By.directive(HlmPopover)).injector.get(BrnPopover);

		parent.open();
		view.detectChanges();
		await flush();

		const childTrigger = document.querySelector('button[hlmPopoverTrigger]') as HTMLButtonElement;
		// the parent's own trigger lives in the light DOM; the child trigger is the one inside the panel
		const childTriggerInPanel = document.querySelector(
			'.cdk-overlay-container button[hlmPopoverTrigger]',
		) as HTMLButtonElement;
		expect(childTriggerInPanel).toBeTruthy();
		childTriggerInPanel.click();
		view.detectChanges();
		await flush();

		const childContent = document.querySelector('[data-testid="child-content"]') as HTMLElement;
		expect(childContent).toBeTruthy();

		// A pointer interaction inside the child must not dismiss the parent: the parent is not the
		// topmost overlay, so its outside-pointer dismissal is ignored.
		fireEvent.pointerDown(childContent);
		fireEvent.click(childContent);
		view.detectChanges();
		await flush();

		expect(parent.stateComputed()).toBe('open');
		expect(document.querySelector('[data-testid="child-content"]')).toBeTruthy();
		expect(childTrigger).toBeTruthy();
	});

	it('dismisses the topmost (child) overlay first on an outside pointer event', async () => {
		const view = await render(PopoverNestedHost);
		const parent = view.fixture.debugElement.query(By.directive(HlmPopover)).injector.get(BrnPopover);

		parent.open();
		view.detectChanges();
		await flush();

		const childTriggerInPanel = document.querySelector(
			'.cdk-overlay-container button[hlmPopoverTrigger]',
		) as HTMLButtonElement;
		childTriggerInPanel.click();
		view.detectChanges();
		await flush();
		expect(document.querySelector('[data-testid="child-content"]')).toBeTruthy();

		// Click fully outside both overlays: only the topmost (child) should close.
		fireEvent.pointerDown(document.body);
		fireEvent.click(document.body);
		view.detectChanges();
		await flush();

		expect(document.querySelector('[data-testid="child-content"]')).toBeNull();
		expect(parent.stateComputed()).toBe('open');
	});
});
