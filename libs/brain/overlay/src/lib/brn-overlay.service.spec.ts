import { Overlay, type OverlayRef } from '@angular/cdk/overlay';
import { CdkScrollable } from '@angular/cdk/scrolling';
import {
	ApplicationRef,
	ChangeDetectionStrategy,
	Component,
	type ElementRef,
	inject,
	type TemplateRef,
	type Type,
	viewChild,
	ViewContainerRef,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import type { BrnOverlayOptions } from './brn-overlay-options';
import { BrnOverlayService } from './brn-overlay.service';

@Component({
	selector: 'brn-overlay-scroll-host',
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div #scroller style="height: 100px; overflow: auto">
			<div style="height: 40px"></div>
			<button #anchor type="button">anchor</button>
			<div style="height: 400px"></div>
		</div>
		<ng-template #content><div style="height: 20px">content</div></ng-template>
	`,
})
class ScrollContainerHost {
	public readonly scroller = viewChild.required<ElementRef<HTMLElement>>('scroller');
	public readonly anchor = viewChild.required<ElementRef<HTMLElement>>('anchor');
	public readonly content = viewChild.required<TemplateRef<unknown>>('content');
	public readonly vcr = inject(ViewContainerRef);
}

@Component({
	selector: 'brn-overlay-cdk-scrollable-host',
	imports: [CdkScrollable],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div #scroller cdkScrollable style="height: 100px; overflow: auto">
			<div style="height: 40px"></div>
			<button #anchor type="button">anchor</button>
			<div style="height: 400px"></div>
		</div>
		<ng-template #content><div style="height: 20px">content</div></ng-template>
	`,
})
class CdkScrollableHost extends ScrollContainerHost {}

/** Scroll events are dispatched once per frame, before animation frame callbacks run. */
const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

const scrollTo = async (element: HTMLElement, top: number) => {
	element.scrollTop = top;
	await nextFrame();
	await nextFrame();
};

const open = async (host: Type<ScrollContainerHost>, scrollStrategy: BrnOverlayOptions['scrollStrategy']) => {
	const fixture = TestBed.createComponent(host);
	fixture.detectChanges();
	const component = fixture.componentInstance;
	const createSpy = vi.spyOn(TestBed.inject(Overlay), 'create');

	const ref = TestBed.inject(BrnOverlayService).open(
		component.content(),
		component.vcr,
		{},
		{
			attachTo: component.anchor(),
			attachPositions: [{ originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' }],
			scrollStrategy,
		},
	);
	const overlayRef = createSpy.mock.results[0].value as OverlayRef;
	const updatePosition = vi.spyOn(overlayRef, 'updatePosition');
	// The CDK positions an attached overlay after the next render; only scroll-driven calls are counted.
	TestBed.inject(ApplicationRef).tick();
	await nextFrame();
	updatePosition.mockClear();
	const scroller = component.scroller().nativeElement;
	const gap = () =>
		overlayRef.overlayElement.getBoundingClientRect().top -
		component.anchor().nativeElement.getBoundingClientRect().bottom;

	return { ref, overlayRef, updatePosition, scroller, gap };
};

describe('BrnOverlayService aria-modal', () => {
	afterEach(() => {
		TestBed.resetTestingModule();
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	const openWithAria = (ariaModal: boolean) => {
		const fixture = TestBed.createComponent(ScrollContainerHost);
		fixture.detectChanges();
		const component = fixture.componentInstance;
		const createSpy = vi.spyOn(TestBed.inject(Overlay), 'create');

		TestBed.inject(BrnOverlayService).open(component.content(), component.vcr, {}, {
			attachTo: component.anchor(),
			attachPositions: [{ originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' }],
			role: 'dialog',
			ariaModal,
		});

		return (createSpy.mock.results[0].value as OverlayRef).overlayElement;
	};

	it('sets aria-modal when ariaModal is true', () => {
		const pane = openWithAria(true);
		expect(pane.getAttribute('role')).toBe('dialog');
		expect(pane.getAttribute('aria-modal')).toBe('true');
	});

	it('omits aria-modal when ariaModal is false', () => {
		const pane = openWithAria(false);
		expect(pane.getAttribute('role')).toBe('dialog');
		expect(pane.hasAttribute('aria-modal')).toBe(false);
	});
});

describe('BrnOverlayService scroll containers', () => {
	afterEach(() => {
		TestBed.resetTestingModule();
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	it('keeps a reposition overlay on its anchor when an enclosing container scrolls', async () => {
		const { updatePosition, scroller, gap } = await open(ScrollContainerHost, 'reposition');
		expect(gap()).toBeCloseTo(0, 0);

		await scrollTo(scroller, 30);

		expect(updatePosition).toHaveBeenCalled();
		expect(gap()).toBeCloseTo(0, 0);
	});

	it('stops following the container once the overlay is closed', async () => {
		const { ref, updatePosition, scroller } = await open(ScrollContainerHost, 'reposition');
		await scrollTo(scroller, 30);
		expect(updatePosition).toHaveBeenCalled();

		ref.close();
		TestBed.inject(ApplicationRef).tick();
		await firstValueFrom(ref.closed$);
		updatePosition.mockClear();
		await scrollTo(scroller, 60);

		expect(updatePosition).not.toHaveBeenCalled();
	});

	it('closes a close overlay when an enclosing container scrolls', async () => {
		const { ref, scroller } = await open(ScrollContainerHost, 'close');
		expect(ref.open).toBe(true);

		await scrollTo(scroller, 30);

		expect(ref.open).toBe(false);
	});

	it('leaves a block overlay in place when an enclosing container scrolls', async () => {
		const { ref, updatePosition, scroller } = await open(ScrollContainerHost, null);

		await scrollTo(scroller, 30);

		expect(updatePosition).not.toHaveBeenCalled();
		expect(ref.open).toBe(true);
	});

	it('leaves containers registered as cdkScrollable to the CDK strategy', async () => {
		const { updatePosition, scroller, gap } = await open(CdkScrollableHost, 'reposition');

		await scrollTo(scroller, 30);

		expect(updatePosition).toHaveBeenCalledTimes(1);
		expect(gap()).toBeCloseTo(0, 0);
	});
});
