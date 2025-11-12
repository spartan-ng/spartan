import { computed, contentChild, Directive, ElementRef, inject, input, signal, TemplateRef } from '@angular/core';
import { BrnButton } from '@spartan-ng/brain/button';
import { Observable, Subject } from 'rxjs';
import { BrnNavigationMenuContentService } from './brn-navigation-menu-content.service';
import { BrnNavigationMenuFocusable } from './brn-navigation-menu-item-focusable.token';
import { provideBrnNavigationMenuItem } from './brn-navigation-menu-item.token';
import { injectBrnNavigationMenu } from './brn-navigation-menu.token';

@Directive({
	selector: 'li[brnNavigationMenuItem]',
	providers: [provideBrnNavigationMenuItem(BrnNavigationMenuItem), BrnNavigationMenuContentService],
	host: {
		'[id]': 'id()',
		'[attr.data-disabled]': 'disabled() || null',
		'data-slot': 'navigation-menu-item',
	},
})
export class BrnNavigationMenuItem {
	private static _id = 0;

	private readonly _navigationMenu = injectBrnNavigationMenu();
	private readonly _contentService = inject(BrnNavigationMenuContentService);

	public readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

	public readonly navMenuElRef = this._navigationMenu.el;

	/** The id of the navigation menu item */
	public readonly id = input<string>(`brn-navigation-menu-item-${++BrnNavigationMenuItem._id}`);

	public readonly isActive = computed(() => this.id() === this._navigationMenu.value());

	public readonly wasActive = computed(() => this.id() === this._navigationMenu.previousValue());

	public readonly state = computed(() => (this.isActive() ? 'open' : 'closed'));

	public readonly contentTemplate = signal<TemplateRef<unknown> | null>(null);

	public readonly contentHovered$ = this._contentService.hovered$;

	public readonly subNavVisible$ = new Subject<Observable<boolean>>();

	public readonly focusable = contentChild.required(BrnNavigationMenuFocusable);

	private readonly _triggerOrLinkBtn = contentChild.required(BrnNavigationMenuFocusable, { read: BrnButton });

	public readonly disabled = computed(() => this._triggerOrLinkBtn().disabled());
}
