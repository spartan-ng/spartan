import { Dialog } from '@angular/cdk/dialog';
import { OVERLAY_DEFAULT_CONFIG, OverlayContainer } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, ElementRef, inject, Injectable } from '@angular/core';
import { BrnDialogService } from '@spartan-ng/brain/dialog';
import { DrawerIndentPreview } from './drawer--indent.preview';

/** Renders the drawer overlay inside the preview frame instead of on the page. */
@Injectable()
class PreviewFrameOverlayContainer extends OverlayContainer {
	private readonly _frame: HTMLElement = inject(ElementRef).nativeElement;

	protected override _createContainer(): void {
		super._createContainer();
		const container = this._containerElement;
		if (!container) return;
		container.style.position = 'absolute';
		this._frame.appendChild(container);
	}
}

/**
 * Docs only: runs the indent example, written as an app root, inside the preview frame. A frame
 * scoped dialog stack opens the drawer in the frame, so the effect stays visible in the preview.
 */
@Component({
	selector: 'spartan-drawer-indent-frame',
	imports: [DrawerIndentPreview],
	providers: [
		{ provide: OverlayContainer, useClass: PreviewFrameOverlayContainer },
		// Popovers render in the top layer, which ignores the frame: render the overlay inline instead.
		{ provide: OVERLAY_DEFAULT_CONFIG, useValue: { usePopover: false } },
		Dialog,
		BrnDialogService,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	// `contain` makes the frame the containing block of the fixed drawer and indent background, and
	// `overflow-clip` keeps focusing the popup from scrolling the frame.
	host: { class: 'relative block h-80 w-full overflow-clip rounded-xl border [contain:layout_paint]' },
	template: `
		<spartan-drawer-indent-preview />
	`,
})
export class DrawerIndentFrame {}
