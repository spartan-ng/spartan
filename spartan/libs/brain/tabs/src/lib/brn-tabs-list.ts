import { FocusKeyManager } from '@angular/cdk/a11y';
import { type AfterContentInit, Directive, ElementRef, contentChildren, inject } from '@angular/core';
import { fromEvent } from 'rxjs';
import { take } from 'rxjs/operators';
import { BrnTabs } from './brn-tabs';
import { BrnTabsTrigger } from './brn-tabs-trigger';

@Directive({
	selector: '[brnTabsList]',
	exportAs: 'brnTabsList',
	host: {
		role: 'tablist',
		'[attr.aria-orientation]': '_orientation()',
		'[attr.data-orientation]': '_orientation()',
	},
})
export class BrnTabsList implements AfterContentInit {
	private readonly _root = inject(BrnTabs);

	protected readonly _orientation = this._root.$orientation;
	private readonly _direction = this._root.$direction;
	private readonly _activeTab = this._root.$activeTab;
	private readonly _tabs = this._root.$tabs;
	private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
	private readonly _keyDownListener = fromEvent(this._elementRef.nativeElement, 'keydown');

	private _keyManager?: FocusKeyManager<BrnTabsTrigger>;

	public readonly triggers = contentChildren(BrnTabsTrigger, { descendants: true });

	public ngAfterContentInit() {
		this._keyManager = new FocusKeyManager<BrnTabsTrigger>(this.triggers())
			.withHorizontalOrientation(this._direction())
			.withHomeAndEnd()
			.withPageUpDown()
			.withWrap();

		// needed because by default the index is set to -1, which means first interaction is skipped
		this._keyDownListener.pipe(take(1)).subscribe(() => {
			const currentTabKey = this._activeTab();
			const tabs = this._tabs();
			let activeIndex = 0;
			if (currentTabKey) {
				const currentTab = tabs[currentTabKey];
				if (currentTab) {
					activeIndex = this.triggers().indexOf(currentTab.trigger);
				}
			}
			this._keyManager?.setActiveItem(activeIndex);
		});

		this._keyDownListener.subscribe((event) => {
			if ('key' in event) {
				if (this._orientation() === 'horizontal') {
					if (event.key === 'ArrowUp' || event.key === 'ArrowDown') return;
				}
				if (this._orientation() === 'vertical') {
					if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') return;
				}
			}
			this._keyManager?.onKeydown(event as KeyboardEvent);
		});
	}
}
