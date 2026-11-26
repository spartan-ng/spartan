import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BrnPopover } from './brn-popover';
import { BrnPopoverContent } from './brn-popover-content';
import { BrnPopoverTrigger } from './brn-popover-trigger';
import { provideBrnPopoverDefaultOptions } from './brn-popover.token';

@Component({
	imports: [BrnPopover, BrnPopoverContent, BrnPopoverTrigger],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<brn-popover>
			<button id="trigger" brnPopoverTrigger>Open</button>
			<div *brnPopoverContent="let ctx">
				<button id="inside">Inside</button>
			</div>
		</brn-popover>
	`,
})
class PopoverHost {
	public readonly popover = viewChild.required(BrnPopover);
}

const byId = (id: string) => document.getElementById(id) as HTMLElement;

async function openFocusAndClose(): Promise<HTMLElement> {
	const fixture = TestBed.createComponent(PopoverHost);
	fixture.autoDetectChanges();
	await fixture.whenStable();
	const popover = fixture.componentInstance.popover();

	const trigger = byId('trigger');
	trigger.focus();
	popover.open();
	await fixture.whenStable();
	byId('inside').focus();
	expect(document.activeElement).toBe(byId('inside'));

	const closed = new Promise<void>((resolve) => {
		const sub = popover.closed.subscribe(() => {
			sub.unsubscribe();
			resolve();
		});
	});
	popover.close();
	await closed;
	expect(byId('inside')).toBeNull();
	return trigger;
}

describe('BrnPopover restoreFocus', () => {
	afterEach(() => (document.activeElement as HTMLElement | null)?.blur());

	it('restores focus to the trigger by default', async () => {
		const trigger = await openFocusAndClose();
		expect(document.activeElement).toBe(trigger);
	});

	it('does not restore focus when disabled through provideBrnPopoverDefaultOptions', async () => {
		TestBed.configureTestingModule({ providers: [provideBrnPopoverDefaultOptions({ restoreFocus: false })] });
		const trigger = await openFocusAndClose();
		expect(document.activeElement).toBe(document.body);
		expect(document.activeElement).not.toBe(trigger);
	});
});
