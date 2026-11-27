import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BrnOverlay } from './brn-overlay';
import { BrnOverlayContent } from './brn-overlay-content';
import { provideBrnOverlayDefaultOptions } from './brn-overlay-token';
import { BrnOverlayTrigger } from './brn-overlay-trigger';

@Component({
	imports: [BrnOverlay, BrnOverlayContent, BrnOverlayTrigger],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<brn-overlay [restoreFocus]="restoreFocus()">
			<button id="trigger" brnOverlayTrigger>Open</button>
			<ng-template brnOverlayContent>
				<button id="inside">Inside</button>
			</ng-template>
		</brn-overlay>
		<button id="outside">Outside</button>
	`,
})
class OverlayHost {
	public readonly overlay = viewChild.required(BrnOverlay);
	public readonly restoreFocus = signal(true);
}

@Component({
	imports: [BrnOverlay, BrnOverlayContent, BrnOverlayTrigger],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<brn-overlay>
			<button id="trigger" brnOverlayTrigger>Open</button>
			<ng-template brnOverlayContent>
				<button id="inside">Inside</button>
			</ng-template>
		</brn-overlay>
	`,
})
class OverlayDefaultHost {
	public readonly overlay = viewChild.required(BrnOverlay);
}

const byId = (id: string) => document.getElementById(id) as HTMLElement;

async function openFromTrigger(overlay: BrnOverlay, fixture: { whenStable(): Promise<unknown> }) {
	const trigger = byId('trigger');
	trigger.focus();
	trigger.click();
	await fixture.whenStable();
	const inside = byId('inside');
	expect(inside).toBeTruthy();
	inside.focus();
	expect(document.activeElement).toBe(inside);
	return { overlay, trigger };
}

async function closeAndWait(overlay: BrnOverlay): Promise<void> {
	const closed = new Promise<void>((resolve) => {
		const sub = overlay.closed.subscribe(() => {
			sub.unsubscribe();
			resolve();
		});
	});
	overlay.close();
	await closed;
}

describe('BrnOverlay restoreFocus', () => {
	afterEach(() => (document.activeElement as HTMLElement | null)?.blur());

	it('restores focus to the trigger by default when the focused element is removed', async () => {
		const fixture = TestBed.createComponent(OverlayDefaultHost);
		fixture.autoDetectChanges();
		await fixture.whenStable();
		const { overlay, trigger } = await openFromTrigger(fixture.componentInstance.overlay(), fixture);

		await closeAndWait(overlay);

		expect(byId('inside')).toBeNull();
		expect(document.activeElement).toBe(trigger);
	});

	it('leaves focus on body when restoreFocus is false', async () => {
		const fixture = TestBed.createComponent(OverlayHost);
		fixture.componentInstance.restoreFocus.set(false);
		fixture.autoDetectChanges();
		await fixture.whenStable();
		const { overlay, trigger } = await openFromTrigger(fixture.componentInstance.overlay(), fixture);

		await closeAndWait(overlay);

		expect(byId('inside')).toBeNull();
		expect(document.activeElement).toBe(document.body);
		expect(document.activeElement).not.toBe(trigger);
	});

	it('reads restoreFocus when the overlay closes, not when it opens', async () => {
		const fixture = TestBed.createComponent(OverlayHost);
		fixture.autoDetectChanges();
		await fixture.whenStable();
		const { overlay } = await openFromTrigger(fixture.componentInstance.overlay(), fixture);

		fixture.componentInstance.restoreFocus.set(false);
		await fixture.whenStable();
		await closeAndWait(overlay);

		expect(document.activeElement).toBe(document.body);
	});

	it('leaves focus on body when restoreFocus is disabled through the default options', async () => {
		TestBed.configureTestingModule({ providers: [provideBrnOverlayDefaultOptions({ restoreFocus: false })] });
		const fixture = TestBed.createComponent(OverlayDefaultHost);
		fixture.autoDetectChanges();
		await fixture.whenStable();
		const { overlay, trigger } = await openFromTrigger(fixture.componentInstance.overlay(), fixture);

		await closeAndWait(overlay);

		expect(document.activeElement).toBe(document.body);
		expect(document.activeElement).not.toBe(trigger);
	});

	it.each([true, false])(
		'keeps focus on an element outside the overlay that was focused before close (restoreFocus=%s)',
		async (restoreFocus) => {
			const fixture = TestBed.createComponent(OverlayHost);
			fixture.componentInstance.restoreFocus.set(restoreFocus);
			fixture.autoDetectChanges();
			await fixture.whenStable();
			const { overlay } = await openFromTrigger(fixture.componentInstance.overlay(), fixture);

			const outside = byId('outside');
			outside.focus();
			await closeAndWait(overlay);

			expect(document.activeElement).toBe(outside);
		},
	);

	it('opens a new overlay when open() is called from a focus handler during restoration', async () => {
		const fixture = TestBed.createComponent(OverlayHost);
		fixture.autoDetectChanges();
		await fixture.whenStable();
		const overlay = fixture.componentInstance.overlay();
		const { trigger } = await openFromTrigger(overlay, fixture);
		trigger.addEventListener('focus', () => overlay.open(), { once: true });

		await closeAndWait(overlay);
		await fixture.whenStable();

		expect(document.activeElement).toBe(trigger);
		expect(overlay.stateComputed()).toBe('open');
		expect(byId('inside')).toBeTruthy();
	});
});
