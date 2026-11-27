import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component, Injector, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrnOverlay, BrnOverlayRef } from '@spartan-ng/brain/overlay';
import { render, waitFor } from '@testing-library/angular';
import { BrnComboboxContent } from './brn-combobox-content';
import { BrnComboboxBaseToken } from './brn-combobox.token';

@Component({
	selector: 'brn-combobox-content-host',
	imports: [BrnComboboxContent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div brnComboboxContent [style.height.px]="height()">
			@for (item of items(); track item) {
				<div style="height: 30px;">{{ item }}</div>
			}
		</div>
	`,
})
class ComboboxContentHost {
	public readonly height = signal(40);
	public readonly items = signal<string[]>(['Item 1']);
}

const overlayStub = () =>
	({
		updatePosition: vi.fn(),
	}) as unknown as BrnOverlay;

const overlayRefStub = () =>
	({
		updatePosition: vi.fn(),
	}) as unknown as BrnOverlayRef;

const comboboxStub = (expanded = true) => ({
	isExpanded: signal(expanded),
	visibleItems: signal(true),
	searchInputWrapperWidth: signal(200),
	updatePosition: vi.fn(),
});

describe('BrnComboboxContent', () => {
	it('updates overlay position when content size increases', async () => {
		const overlay = overlayStub();
		const combobox = comboboxStub(true);
		const view = await render(ComboboxContentHost, {
			providers: [
				{ provide: BrnOverlay, useValue: overlay },
				{ provide: BrnComboboxBaseToken, useValue: combobox },
			],
		});

		// Wait for initial render measurement
		await waitFor(() => {
			expect(overlay.updatePosition).toHaveBeenCalled();
		});

		(overlay.updatePosition as ReturnType<typeof vi.fn>).mockClear();

		// Simulate async items arriving and growing the panel
		view.fixture.componentInstance.height.set(300);
		view.fixture.detectChanges();

		await waitFor(() => {
			expect(overlay.updatePosition).toHaveBeenCalled();
		});
	});

	it('updates overlayRef position when content size increases', async () => {
		const overlayRef = overlayRefStub();
		const combobox = comboboxStub(true);
		const view = await render(ComboboxContentHost, {
			providers: [
				{ provide: BrnOverlayRef, useValue: overlayRef },
				{ provide: BrnComboboxBaseToken, useValue: combobox },
			],
		});

		await waitFor(() => {
			expect(overlayRef.updatePosition).toHaveBeenCalled();
		});

		(overlayRef.updatePosition as ReturnType<typeof vi.fn>).mockClear();

		view.fixture.componentInstance.height.set(250);
		view.fixture.detectChanges();

		await waitFor(() => {
			expect(overlayRef.updatePosition).toHaveBeenCalled();
		});
	});

	it('avoids duplicate repositioning when both overlay and overlayRef are provided', async () => {
		const overlay = overlayStub();
		const overlayRef = overlayRefStub();
		const combobox = comboboxStub(true);
		const view = await render(ComboboxContentHost, {
			providers: [
				{ provide: BrnOverlay, useValue: overlay },
				{ provide: BrnOverlayRef, useValue: overlayRef },
				{ provide: BrnComboboxBaseToken, useValue: combobox },
			],
		});

		const contentDirective = view.fixture.debugElement
			.query(By.directive(BrnComboboxContent))
			.injector.get(BrnComboboxContent);

		(overlay.updatePosition as ReturnType<typeof vi.fn>).mockClear();
		(overlayRef.updatePosition as ReturnType<typeof vi.fn>).mockClear();

		contentDirective.updatePosition();

		expect(overlayRef.updatePosition).toHaveBeenCalledTimes(1);
		expect(overlay.updatePosition).not.toHaveBeenCalled();
	});

	it('falls back to combobox updatePosition when overlay is not provided directly', async () => {
		const combobox = comboboxStub(true);
		const view = await render(ComboboxContentHost, {
			providers: [{ provide: BrnComboboxBaseToken, useValue: combobox }],
		});

		const contentDirective = view.fixture.debugElement
			.query(By.directive(BrnComboboxContent))
			.injector.get(BrnComboboxContent);

		(combobox.updatePosition as ReturnType<typeof vi.fn>).mockClear();

		contentDirective.updatePosition();

		expect(combobox.updatePosition).toHaveBeenCalledTimes(1);
	});

	it('does not update overlay position when content is closed', async () => {
		const overlay = overlayStub();
		const combobox = comboboxStub(false);
		const view = await render(ComboboxContentHost, {
			providers: [
				{ provide: BrnOverlay, useValue: overlay },
				{ provide: BrnComboboxBaseToken, useValue: combobox },
			],
		});

		// Wait briefly to allow any initial observer cycle to pass
		await new Promise((resolve) => setTimeout(resolve, 50));
		expect(overlay.updatePosition).not.toHaveBeenCalled();

		view.fixture.componentInstance.height.set(300);
		view.fixture.detectChanges();

		await new Promise((resolve) => setTimeout(resolve, 50));
		expect(overlay.updatePosition).not.toHaveBeenCalled();
	});

	it('flips CDK overlay above trigger when panel size increases near viewport bottom', async () => {
		const cdkOverlay = TestBed.inject(Overlay);
		const anchorEl = document.createElement('button');
		anchorEl.style.position = 'fixed';
		anchorEl.style.left = '100px';
		anchorEl.style.top = `${window.innerHeight - 80}px`;
		anchorEl.style.height = '30px';
		anchorEl.style.width = '150px';
		document.body.appendChild(anchorEl);

		const positionStrategy = cdkOverlay
			.position()
			.flexibleConnectedTo(anchorEl)
			.withPositions([
				{ originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
				{ originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' },
			])
			.withPush(false);

		const overlayRef = cdkOverlay.create({ positionStrategy });

		@Component({
			imports: [BrnComboboxContent],
			changeDetection: ChangeDetectionStrategy.OnPush,
			template: `
				<div brnComboboxContent [style.height.px]="height()" style="width: 150px;">Content</div>
			`,
		})
		class FlipHost {
			public readonly height = signal(40);
		}

		const portal = new ComponentPortal(
			FlipHost,
			null,
			Injector.create({
				providers: [
					{
						provide: BrnOverlayRef,
						useValue: { updatePosition: () => overlayRef.updatePosition() },
					},
					{ provide: BrnComboboxBaseToken, useValue: comboboxStub(true) },
				],
			}),
		);

		const componentRef = overlayRef.attach(portal);
		componentRef.changeDetectorRef.detectChanges();

		// Initially, height is 40px and space below is 50px, so it fits below the anchor
		await waitFor(() => {
			const overlayRect = overlayRef.overlayElement.getBoundingClientRect();
			const anchorRect = anchorEl.getBoundingClientRect();
			expect(overlayRect.top).toBeGreaterThanOrEqual(anchorRect.bottom);
		});

		// Grow the panel so it no longer fits below (200px > 50px available)
		componentRef.instance.height.set(200);
		componentRef.changeDetectorRef.detectChanges();

		// CDK overlay should recalculate position via updatePosition() and flip above the trigger
		await waitFor(() => {
			const overlayRect = overlayRef.overlayElement.getBoundingClientRect();
			const anchorRect = anchorEl.getBoundingClientRect();
			expect(overlayRect.bottom).toBeLessThanOrEqual(anchorRect.top);
		});

		overlayRef.dispose();
		anchorEl.remove();
	});
});
