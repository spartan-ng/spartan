import { CdkMenuTrigger } from '@angular/cdk/menu';
import { computed, Directive, effect, ElementRef, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { createMenuPosition, type MenuAlign, type MenuSide } from '@spartan-ng/brain/core';
import { injectHlmDropdownMenuConfig } from './hlm-dropdown-menu-token';

@Directive({
	selector: '[hlmDropdownMenuTrigger]',
	hostDirectives: [
		{
			directive: CdkMenuTrigger,
			inputs: ['cdkMenuTriggerFor: hlmDropdownMenuTrigger', 'cdkMenuTriggerData: hlmDropdownMenuTriggerData'],
			outputs: ['cdkMenuOpened: hlmDropdownMenuOpened', 'cdkMenuClosed: hlmDropdownMenuClosed'],
		},
	],
	host: {
		'data-slot': 'dropdown-menu-trigger',
	},
})
export class HlmDropdownMenuTrigger {
	private readonly _cdkTrigger = inject(CdkMenuTrigger, { host: true });
	private readonly _elementRef = inject(ElementRef<HTMLElement>);
	private readonly _config = injectHlmDropdownMenuConfig();

	public readonly align = input<MenuAlign>(this._config.align);
	public readonly side = input<MenuSide>(this._config.side);

	private readonly _menuPosition = computed(() => createMenuPosition(this.align(), this.side()));

	constructor() {
		// once the trigger opens we wait until the next tick and then grab the last position
		// used to position the menu. we store this in our trigger which the brnMenu directive has
		// access to through DI
		this._cdkTrigger.opened.pipe(takeUntilDestroyed()).subscribe(() =>
			setTimeout(
				() =>
					// eslint-disable-next-line
					((this._cdkTrigger as any)._spartanLastPosition = // eslint-disable-next-line
						(this._cdkTrigger as any).overlayRef._positionStrategy._lastPosition),
			),
		);

		effect(() => {
			this._cdkTrigger.menuPosition = this._menuPosition();
		});

		this._preventMouseenterReopenAfterClose();
		this._refocusTriggerOnSubmenuClose();
	}

	// CDK's mouseenter handler reopens a just-closed submenu within the same macrotask.
	// Suppress open() for one macrotask after close to block the unintended reopen.
	private _preventMouseenterReopenAfterClose(): void {
		const trigger = this._cdkTrigger;
		const originalOpen = trigger.open.bind(trigger);
		let suppressOpen = false;

		trigger.closed.pipe(takeUntilDestroyed()).subscribe(() => {
			suppressOpen = true;
			setTimeout(() => {
				suppressOpen = false;
			});
		});

		trigger.open = () => {
			if (suppressOpen) return;
			originalOpen();
		};
	}

	// Without focusParentTrigger, submenu close drops focus to document.body,
	// causing menuStack.hasFocus to resolve false and collapsing the entire tree.
	// Refocusing the trigger after the DOM settles keeps hasFocus true.
	private _refocusTriggerOnSubmenuClose(): void {
		this._cdkTrigger.closed.pipe(takeUntilDestroyed()).subscribe(() => {
			setTimeout(() => {
				if (document.activeElement === document.body || document.activeElement === null) {
					this._elementRef.nativeElement.focus();
				}
			});
		});
	}
}
