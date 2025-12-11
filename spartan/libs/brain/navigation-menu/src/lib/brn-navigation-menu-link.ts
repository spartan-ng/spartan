import { FocusableOption, FocusOrigin } from '@angular/cdk/a11y';
import { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, computed, Directive, ElementRef, inject, input } from '@angular/core';
import { BrnButton } from '@spartan-ng/brain/button';
import { provideBrnNavigationMenuFocusable } from './brn-navigation-menu-item-focusable.token';
import { injectBrnNavigationMenuItem } from './brn-navigation-menu-item.token';
import { injectBrnNavigationMenu } from './brn-navigation-menu.token';

@Directive({
	selector: 'a[brnNavigationMenuLink]',
	providers: [provideBrnNavigationMenuFocusable(BrnNavigationMenuLink)],
	hostDirectives: [
		{
			directive: BrnButton,
			inputs: ['disabled'],
		},
	],
	host: {
		'(click)': 'onClick()',
		'(mouseenter)': 'activate()',
		'(focus)': 'handleFocus()',
		'[attr.data-active]': '_isActive() ? "" : undefined',
		'[attr.aria-current]': '_isActive() ? "page" : undefined',
		'data-slot': 'navigation-menu-link',
	},
})
export class BrnNavigationMenuLink implements FocusableOption {
	private readonly _navigationMenu = injectBrnNavigationMenu();
	private readonly _navigationMenuItem = injectBrnNavigationMenuItem();
	private readonly _el = inject<ElementRef<HTMLAnchorElement>>(ElementRef);

	// Returns false if this BrnNavigationMenuLink is used "standalone", meaning it doesn't have a parent BrnNavigationMenuItem element.
	private readonly _hasParentNavMenuItem =
		this._el.nativeElement.parentElement === this._navigationMenuItem.el.nativeElement;

	/**
	 * Used to identify the link as the currently active page.
	 */
	public readonly active = input<boolean | undefined, BooleanInput>(undefined, { transform: booleanAttribute });

	protected readonly _isActive = computed(() => {
		const active = this.active();
		if (active !== undefined) return active;

		if (!this._hasParentNavMenuItem) return false;

		return this._navigationMenuItem.isActive();
	});

	public get disabled() {
		return this._navigationMenuItem.disabled();
	}

	public focus(_origin?: FocusOrigin) {
		if (!this._hasParentNavMenuItem || this._navigationMenuItem.disabled()) return;

		this._el.nativeElement.focus();
	}

	protected handleFocus() {
		if (!this._hasParentNavMenuItem) return;
		this._navigationMenu.setActiveItem(this);
	}

	protected onClick() {
		if (!this._hasParentNavMenuItem) return;
		this._navigationMenu.value.set(this._navigationMenuItem.id());
	}

	protected activate() {
		if (!this._hasParentNavMenuItem) return;
		this._navigationMenu.value.set(this._navigationMenuItem.id());
	}
}
