import { NgTemplateOutlet } from '@angular/common';
import {
	AfterContentInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	DestroyRef,
	ElementRef,
	Injector,
	afterNextRender,
	contentChild,
	contentChildren,
	effect,
	inject,
	signal,
	viewChild,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { BrnSelectOptionDirective } from './brn-select-option.directive';

import { FocusKeyManager } from '@angular/cdk/a11y';
import {
	A,
	DOWN_ARROW,
	END,
	ENTER,
	HOME,
	LEFT_ARROW,
	RIGHT_ARROW,
	SPACE,
	UP_ARROW,
	hasModifierKey,
} from '@angular/cdk/keycodes';
import { CdkOption } from '@angular/cdk/listbox';
import { Directive } from '@angular/core';
import { Subject, fromEvent, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { provideBrnSelectContent } from './brn-select-content.token';
import { injectBrnSelect } from './brn-select.token';

const SCROLLBY_PIXELS = 100;

@Directive({
	selector: '[brnSelectScrollUp], brn-select-scroll-up, hlm-select-scroll-up:not(noHlm)',
	standalone: true,
	host: {
		'aria-hidden': 'true',
		'(mouseenter)': 'startEmittingEvents()',
	},
})
export class BrnSelectScrollUpDirective {
	private readonly _el = inject(ElementRef);
	private readonly _selectContent = inject(BrnSelectContentComponent);

	private readonly _endReached = new Subject<boolean>();
	private readonly _destroyRef = inject(DestroyRef);

	public startEmittingEvents(): void {
		const mouseLeave$ = fromEvent(this._el.nativeElement, 'mouseleave');

		interval(100)
			.pipe(takeUntil(mouseLeave$), takeUntil(this._endReached), takeUntilDestroyed(this._destroyRef))
			.subscribe(() => this._selectContent.moveFocusUp());
	}

	public stopEmittingEvents(): void {
		this._endReached.next(true);
	}
}

@Directive({
	selector: '[brnSelectScrollDown], brn-select-scroll-down, hlm-select-scroll-down:not(noHlm)',
	standalone: true,
	host: {
		'aria-hidden': 'true',
		'(mouseenter)': 'startEmittingEvents()',
	},
})
export class BrnSelectScrollDownDirective {
	private readonly _el = inject(ElementRef);
	private readonly _selectContent = inject(BrnSelectContentComponent);

	private readonly _endReached = new Subject<boolean>();
	private readonly _destroyRef = inject(DestroyRef);

	public startEmittingEvents(): void {
		const mouseLeave$ = fromEvent(this._el.nativeElement, 'mouseleave');

		interval(100)
			.pipe(takeUntil(mouseLeave$), takeUntil(this._endReached), takeUntilDestroyed(this._destroyRef))
			.subscribe(() => this._selectContent.moveFocusDown());
	}

	public stopEmittingEvents(): void {
		this._endReached.next(true);
	}
}

@Component({
	selector: 'brn-select-content, hlm-select-content:not(noHlm)',
	imports: [NgTemplateOutlet],
	providers: [provideBrnSelectContent(BrnSelectContentComponent)],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		role: 'listbox',
		tabindex: '0',
		'[attr.aria-multiselectable]': '_select.multiple()',
		'aria-orientation': 'vertical',
		'(focus)': '_handleFocus()',
		'(keydown)': '_handleKeydown($event)',
		'(focusout)': '_handleFocusOut($event)',
		'(focusin)': '_handleFocusIn()',

		'[attr.aria-labelledBy]': '_select.labelId()',
		'[attr.aria-controlledBy]': "_select.id() +'--trigger'",
		'[id]': "_select.id() + '--content'",
		'[attr.dir]': '_select.dir()',
	},
	styles: [
		`
			:host {
				display: flex;
				box-sizing: border-box;
				flex-direction: column;
				outline: none;
				pointer-events: auto;
			}

			[data-brn-select-viewport] {
				scrollbar-width: none;
				-ms-overflow-style: none;
				-webkit-overflow-scrolling: touch;
			}

			[data-brn-select-viewport]::-webkit-scrollbar {
				display: none;
			}
		`,
	],
	template: `
		<ng-template #scrollUp>
			<ng-content select="hlm-select-scroll-up" />
			<ng-content select="brnSelectScrollUp" />
		</ng-template>
		<ng-container *ngTemplateOutlet="canScrollUp() && scrollUpBtn() ? scrollUp : null" />
		<div
			data-brn-select-viewport
			#viewport
			(scroll)="handleScroll()"
			style="flex: 1 1 0%;
			position: relative;
			width:100%;
			overflow:auto;
			min-height: 36px;
      padding-bottom: 2px;
      margin-bottom: -2px;"
		>
			<ng-content />
		</div>
		<ng-template #scrollDown>
			<ng-content select="brnSelectScrollDown" />
			<ng-content select="hlm-select-scroll-down" />
		</ng-template>
		<ng-container *ngTemplateOutlet="canScrollDown() && scrollDownBtn() ? scrollDown : null" />
	`,
})
export class BrnSelectContentComponent<T> implements AfterContentInit {
	private readonly _elementRef: ElementRef<HTMLElement> = inject(ElementRef);
	private readonly _destroyRef = inject(DestroyRef);
	private readonly _injector = inject(Injector);
	private readonly _changeDetectorRef = inject(ChangeDetectorRef);
	protected readonly _select = injectBrnSelect<T>();
	protected readonly canScrollUp = signal(false);
	protected readonly canScrollDown = signal(false);
	protected readonly viewport = viewChild.required<ElementRef<HTMLElement>>('viewport');
	protected readonly scrollUpBtn = contentChild(BrnSelectScrollUpDirective);
	protected readonly scrollDownBtn = contentChild(BrnSelectScrollDownDirective);
	protected readonly _options = contentChildren(BrnSelectOptionDirective, { descendants: true });

	/** The key manager that manages keyboard navigation for this listbox. */
	protected listKeyManager?: FocusKeyManager<BrnSelectOptionDirective<T>>;

	constructor() {
		effect(() => {
			this._select.open() && afterNextRender(() => this.updateArrowDisplay(), { injector: this._injector });
		});
	}

	ngAfterContentInit(): void {
		this.listKeyManager = new FocusKeyManager(this._options())
			.withHomeAndEnd()
			.withVerticalOrientation()
			.withTypeAhead()
			.withAllowedModifierKeys(['shiftKey'])
			.withWrap()
			.skipPredicate((option) => option.disabledSignal());

		this.listKeyManager.change.subscribe(() => this._focusActiveOption());

		toObservable(this._options)
			.pipe(takeUntilDestroyed(this._destroyRef))
			.subscribe(() => {
				const activeOption = this.listKeyManager?.activeItem;

				// If the active option was deleted, we need to reset
				// the key manager so it can allow focus back in.
				if (activeOption && !this._options().find((option) => option === activeOption)) {
					this.listKeyManager?.setActiveItem(-1);
					this._changeDetectorRef.markForCheck();
				}
			});
	}

	/** Focus the active option. */
	private _focusActiveOption() {
		this.listKeyManager?.activeItem?.focus();
		this._changeDetectorRef.markForCheck();
	}

	public updateArrowDisplay(): void {
		const { scrollTop, scrollHeight, clientHeight } = this.viewport().nativeElement;
		this.canScrollUp.set(scrollTop > 0);
		const maxScroll = scrollHeight - clientHeight;
		this.canScrollDown.set(Math.ceil(scrollTop) < maxScroll);
	}

	public handleScroll() {
		this.updateArrowDisplay();
	}

	public focusList(): void {
		this._elementRef.nativeElement.focus();
	}

	public moveFocusUp() {
		this.viewport().nativeElement.scrollBy({ top: -SCROLLBY_PIXELS, behavior: 'smooth' });
		if (this.viewport().nativeElement.scrollTop === 0) {
			this.scrollUpBtn()?.stopEmittingEvents();
		}
	}

	public moveFocusDown() {
		this.viewport().nativeElement.scrollBy({ top: SCROLLBY_PIXELS, behavior: 'smooth' });
		const viewportSize = this._elementRef.nativeElement.scrollHeight;
		const viewportScrollPosition = this.viewport().nativeElement.scrollTop;
		if (
			viewportSize + viewportScrollPosition + SCROLLBY_PIXELS >
			this.viewport().nativeElement.scrollHeight + SCROLLBY_PIXELS / 2
		) {
			this.scrollDownBtn()?.stopEmittingEvents();
		}
	}

	/** Sets the first selected option as first in the keyboard focus order. */
	private _setNextFocusToSelectedOption() {
		// Null check the options since they only get defined after `ngAfterContentInit`.
		const selected = this._options()?.find((option) => option.selected());

		if (selected) {
			this.listKeyManager?.updateActiveItem(selected);
		}
	}

	/** Called when the listbox receives focus. */
	protected _handleFocus() {
		if (this._select.selectedOptions().length > 0) {
			this._setNextFocusToSelectedOption();
		} else {
			this.listKeyManager?.setNextItemActive();
		}

		this._focusActiveOption();
	}

	/** Called when the user presses keydown on the listbox. */
	protected _handleKeydown(event: KeyboardEvent) {
		const { keyCode } = event;
		const previousActiveIndex = this.listKeyManager?.activeItemIndex;
		const ctrlKeys = ['ctrlKey', 'metaKey'] as const;

		if (this._select.multiple() && keyCode === A && hasModifierKey(event, ...ctrlKeys)) {
			// Toggle all options off if they're all selected, otherwise toggle them all on.
			this.triggerRange(
				null,
				0,
				this._options().length - 1,
				this._options().length !== this._select.selectedOptions().length,
			);
			event.preventDefault();
			return;
		}

		if (this._select.multiple() && (keyCode === SPACE || keyCode === ENTER) && hasModifierKey(event, 'shiftKey')) {
			if (this.listKeyManager.activeItem && this.listKeyManager.activeItemIndex != null) {
				this.triggerRange(
					this.listKeyManager.activeItem,
					this._getLastTriggeredIndex() ?? this.listKeyManager.activeItemIndex,
					this.listKeyManager.activeItemIndex,
					!this.listKeyManager.activeItem.isSelected(),
				);
			}
			event.preventDefault();
			return;
		}

		if (
			this._select.multiple() &&
			keyCode === HOME &&
			hasModifierKey(event, ...ctrlKeys) &&
			hasModifierKey(event, 'shiftKey')
		) {
			const trigger = this.listKeyManager!.activeItem;
			if (trigger) {
				const from = this.listKeyManager!.activeItemIndex!;
				this.listKeyManager.setFirstItemActive();
				this.triggerRange(trigger, from, this.listKeyManager!.activeItemIndex!, !trigger.isSelected());
			}
			event.preventDefault();
			return;
		}

		if (
			this._select.multiple() &&
			keyCode === END &&
			hasModifierKey(event, ...ctrlKeys) &&
			hasModifierKey(event, 'shiftKey')
		) {
			const trigger = this.listKeyManager!.activeItem;
			if (trigger) {
				const from = this.listKeyManager!.activeItemIndex!;
				this.listKeyManager!.setLastItemActive();
				this.triggerRange(trigger, from, this.listKeyManager!.activeItemIndex!, !trigger.isSelected());
			}
			event.preventDefault();
			return;
		}

		if (keyCode === SPACE || keyCode === ENTER) {
			this.triggerOption(this.listKeyManager!.activeItem);
			event.preventDefault();
			return;
		}

		const isNavKey =
			keyCode === UP_ARROW ||
			keyCode === DOWN_ARROW ||
			keyCode === LEFT_ARROW ||
			keyCode === RIGHT_ARROW ||
			keyCode === HOME ||
			keyCode === END;
		this.listKeyManager!.onKeydown(event);
		// Will select an option if shift was pressed while navigating to the option
		if (isNavKey && event.shiftKey && previousActiveIndex !== this.listKeyManager!.activeItemIndex) {
			this.triggerOption(this.listKeyManager!.activeItem);
		}
	}

	protected triggerRange(trigger: CdkOption<T> | null, from: number, to: number, on: boolean) {
		const updateValues = [...this._options()]
			.slice(Math.max(0, Math.min(from, to)), Math.min(this._options().length, Math.max(from, to) + 1))
			.filter((option) => !option.disabledSignal())
			.map((option) => option.value);

		const selected = [...this._select.selectedOptions()].map((option) => option.value);

		for (const updateValue of updateValues) {
			const selectedIndex = selected.findIndex((selectedValue) => isEqual(selectedValue, updateValue));
			if (on && selectedIndex === -1) {
				selected.push(updateValue);
			} else if (!on && selectedIndex !== -1) {
				selected.splice(selectedIndex, 1);
			}
		}
		let changed = this.selectionModel.setSelection(...selected);
		if (changed) {
			this._onChange(this.value);
		}
	}

	protected triggerOption(option: BrnSelectOptionDirective<T> | null) {
		if (option && !option.disabledSignal()) {
			this._select.multiple() ? this._select.toggleSelect(option.value()) : this._select.select(option.value());
		}
	}

	/** Called when a focus moves into the listbox. */
	protected _handleFocusIn() {
		// Note that we use a `focusin` handler for this instead of the existing `focus` handler,
		// because focus won't land on the listbox if `useActiveDescendant` is enabled.
		this._hasFocus = true;
	}

	/**
	 * Called when the focus leaves an element in the listbox.
	 * @param event The focusout event
	 */
	protected _handleFocusOut(event: FocusEvent) {
		// Some browsers (e.g. Chrome and Firefox) trigger the focusout event when the user returns back to the document.
		// To prevent losing the active option in this case, we store it in `_previousActiveOption` and restore it on the window `blur` event
		// This ensures that the `activeItem` matches the actual focused element when the user returns to the document.
		this._previousActiveOption = this.listKeyManager.activeItem;

		const otherElement = event.relatedTarget as Element;
		if (this.element !== otherElement && !this.element.contains(otherElement)) {
			this._onTouched();
			this._hasFocus = false;
			this._setNextFocusToSelectedOption();
		}
	}
}
