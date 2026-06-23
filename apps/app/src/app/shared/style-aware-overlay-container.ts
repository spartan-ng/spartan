import { OverlayContainer } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';

const STYLE_PREFIX = 'style-';
const DEFAULT_STYLE = 'style-nova';

/**
 * CDK renders every overlay into one shared root container, so the docs can't scope it per-component
 * (Overlay/Dialog are root singletons and ignore scoped OverlayContainer providers). Instead we stamp the
 * container with the `.style-*` of whatever opened the overlay: chrome triggers live under the body's
 * `.style-nova`, preview triggers under a `.style-<theme>` island. The donut @scope then keeps nova out of
 * a themed panel. Replaces StyleService's old global stamping, which forced the selected style onto chrome
 * overlays (search, AI Assist, the style switcher itself) too.
 */
@Injectable()
export class StyleAwareOverlayContainer extends OverlayContainer {
	private _lastTrigger: Element | null = null;

	private readonly _track = (event: Event) => {
		if (event.target instanceof Element) this._lastTrigger = event.target;
	};

	constructor() {
		super();
		if (!this._platform.isBrowser) return;
		// capture phase: see the trigger before the overlay opens, even if it stops propagation
		this._document.addEventListener('pointerdown', this._track, true);
		this._document.addEventListener('keydown', this._track, true);
	}

	override getContainerElement(): HTMLElement {
		const container = super.getContainerElement();
		const style = this._resolveStyle();
		// Called again on every scroll/resize reposition - skip the DOM when the style is unchanged.
		if (!container.classList.contains(style)) {
			container.classList.remove(...Array.from(container.classList).filter((cls) => cls.startsWith(STYLE_PREFIX)));
			container.classList.add(style);
		}
		return container;
	}

	override ngOnDestroy(): void {
		if (this._platform.isBrowser) {
			this._document.removeEventListener('pointerdown', this._track, true);
			this._document.removeEventListener('keydown', this._track, true);
		}
		super.ngOnDestroy();
	}

	// Nearest ancestor `.style-*` of the trigger; the body's `.style-nova` is the backstop.
	private _resolveStyle(): string {
		for (let el = this._lastTrigger; el; el = el.parentElement) {
			const match = Array.from(el.classList).find((cls) => cls.startsWith(STYLE_PREFIX));
			if (match) return match;
		}
		return DEFAULT_STYLE;
	}
}
