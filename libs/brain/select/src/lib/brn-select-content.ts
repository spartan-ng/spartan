import { NgTemplateOutlet } from '@angular/common';
import {
	AfterContentInit,
	ChangeDetectionStrategy,
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
	untracked,
	viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BrnSelectOption } from './brn-select-option';

import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { Directive } from '@angular/core';
import { Subject, fromEvent, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { provideBrnSelectContent } from './brn-select-content.token';
import { injectBrnSelect } from './brn-select.token';

const SCROLLBY_PIXELS = 100;

@Directive({
	selector: '[brnSelectScrollUp], brn-select-scroll-up, hlm-select-scroll-up:not(noHlm)',
	host: {
		'aria-hidden': 'true',
		'(mouseenter)': 'startEmittingEvents()',
	},
})
export class BrnSelectScrollUp {
	private readonly _el = inject(ElementRef);
	private readonly _selectContent = inject(BrnSelectContent);

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
	host: {
		'aria-hidden': 'true',
		'(mouseenter)': 'startEmittingEvents()',
	},
})
export class BrnSelectScrollDown {
	private readonly _el = inject(ElementRef);
	private readonly _selectContent = inject(BrnSelectContent);

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
	providers: [provideBrnSelectContent(BrnSelectContent)],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		role: 'listbox',
		tabindex: '0',
		'[attr.aria-multiselectable]': '_select.multiple()',
		'[attr.aria-disabled]': '_select.disabled() || _select.formDisabled()',
		'aria-orientation': 'vertical',
		'[attr.aria-activedescendant]': 'keyManager?.activeItem?.id()',
		'[attr.aria-labelledBy]': '_select.labelId()',
		'[attr.aria-controlledBy]': "_select.id() +'--trigger'",
		'[id]': "_select.id() + '--content'",
		'[attr.dir]': '_select.dir()',
		'(keydown)': 'keyManager?.onKeydown($event)',
		'(keydown.enter)': 'selectActiveItem($event)',
		'(keydown.space)': 'selectActiveItem($event)',
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
		<ng-container *ngTemplateOutlet="_canScrollUp() && _scrollUpBtn() ? scrollUp : null" />
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
		<ng-container *ngTemplateOutlet="_canScrollDown() && _scrollDownBtn() ? scrollDown : null" />
	`,
})
export class BrnSelectContent<T> implements AfterContentInit {
	private readonly _elementRef: ElementRef<HTMLElement> = inject(ElementRef);
	private readonly _injector = inject(Injector);
	protected readonly _select = injectBrnSelect<T>();
	protected readonly _canScrollUp = signal(false);
	protected readonly _canScrollDown = signal(false);
	protected readonly _viewport = viewChild.required<ElementRef<HTMLElement>>('viewport');
	protected readonly _scrollUpBtn = contentChild(BrnSelectScrollUp);
	protected readonly _scrollDownBtn = contentChild(BrnSelectScrollDown);
	private readonly _options = contentChildren(BrnSelectOption, { descendants: true });

	/** @internal */
	public keyManager: ActiveDescendantKeyManager<BrnSelectOption<T>> | null = null;

	constructor() {
		effect(() => {
			this._select.open() && afterNextRender(() => this.updateArrowDisplay(), { injector: this._injector });
		});
	}

	ngAfterContentInit(): void {
		this.keyManager = new ActiveDescendantKeyManager(this._options, this._injector)
			.withHomeAndEnd()
			.withVerticalOrientation()
			.withTypeAhead()
			.withAllowedModifierKeys(['shiftKey'])
			.withWrap()
			.skipPredicate((option) => option._disabled());

		effect(
			() => {
				// any time the select is opened, we need to focus the first selected option or the first option
				const open = this._select.open();
				const options = this._options();

				if (!open || !options.length) {
					return;
				}

				untracked(() => {
					const selectedOption = options.find((option) => option.selected());

					if (selectedOption) {
						this.keyManager?.setActiveItem(selectedOption);
					} else {
						this.keyManager?.setFirstItemActive();
					}
				});
			},
			{ injector: this._injector },
		);
	}

	public updateArrowDisplay(): void {
		const { scrollTop, scrollHeight, clientHeight } = this._viewport().nativeElement;
		this._canScrollUp.set(scrollTop > 0);
		const maxScroll = scrollHeight - clientHeight;
		this._canScrollDown.set(Math.ceil(scrollTop) < maxScroll);
	}

	public handleScroll(): void {
		this.updateArrowDisplay();
	}

	public focusList(): void {
		this._elementRef.nativeElement.focus();
	}

	public moveFocusUp(): void {
		this._viewport().nativeElement.scrollBy({ top: -SCROLLBY_PIXELS, behavior: 'smooth' });
		if (this._viewport().nativeElement.scrollTop === 0) {
			this._scrollUpBtn()?.stopEmittingEvents();
		}
	}

	public moveFocusDown(): void {
		this._viewport().nativeElement.scrollBy({ top: SCROLLBY_PIXELS, behavior: 'smooth' });
		const viewportSize = this._elementRef.nativeElement.scrollHeight;
		const viewportScrollPosition = this._viewport().nativeElement.scrollTop;
		if (
			viewportSize + viewportScrollPosition + SCROLLBY_PIXELS >
			this._viewport().nativeElement.scrollHeight + SCROLLBY_PIXELS / 2
		) {
			this._scrollDownBtn()?.stopEmittingEvents();
		}
	}

	setActiveOption(option: BrnSelectOption<T>): void {
		const index = this._options().findIndex((o) => o === option);

		if (index === -1) {
			return;
		}

		this.keyManager?.setActiveItem(index);
	}

	protected selectActiveItem(event: KeyboardEvent): void {
		event.preventDefault();

		const activeOption = this.keyManager?.activeItem;

		if (activeOption) {
			this._select.toggleSelect(activeOption.value()!);
		}
	}
}
