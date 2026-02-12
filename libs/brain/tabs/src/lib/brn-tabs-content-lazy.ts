import { Directive, effect, inject, type OnDestroy, TemplateRef, untracked, ViewContainerRef } from '@angular/core';
import { BrnTabs } from './brn-tabs';
import { BrnTabsContent } from './brn-tabs-content';

@Directive({
	selector: 'ng-template[brnTabsContentLazy]',
	exportAs: 'brnTabsContentLazy',
})
export class BrnTabsContentLazy implements OnDestroy {
	private readonly _root = inject(BrnTabs);
	private readonly _content = inject(BrnTabsContent);
	private readonly _templateRef = inject(TemplateRef);
	private readonly _viewContainerRef = inject(ViewContainerRef);

	private _hasBeenActivated = false;

	constructor() {
		effect(() => {
			const activeTab = this._root.$activeTab();
			const contentFor = this._content.contentFor();

			untracked(() => {
				if (activeTab === contentFor && !this._hasBeenActivated) {
					this._viewContainerRef.createEmbeddedView(this._templateRef);
					this._hasBeenActivated = true;
				}
			});
		});
	}

	ngOnDestroy(): void {
		this._viewContainerRef.clear();
	}
}
