import { CdkListbox, type ListboxValueChangeEvent } from '@angular/cdk/listbox';
import { NgTemplateOutlet } from '@angular/common';
import {
	type AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	ElementRef,
	contentChild,
	contentChildren,
	effect,
	inject,
	signal,
	viewChild,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { BrnSelectOptionDirective } from './brn-select-option.directive';
import { BrnSelectService } from './brn-select.service';

import { Directive } from '@angular/core';
import { Subject, fromEvent, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
	standalone: true,
	imports: [BrnSelectScrollUpDirective, BrnSelectScrollDownDirective, NgTemplateOutlet],
	hostDirectives: [CdkListbox],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[attr.aria-labelledBy]': 'labelledBy()',
		'[attr.aria-controlledBy]': "id() +'--trigger'",
		'[id]': "id() + '--content'",
		'[attr.dir]': '_selectService.dir()',
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
export class BrnSelectContentComponent implements AfterViewInit {
	private readonly _el: ElementRef<HTMLElement> = inject(ElementRef);
	private readonly _cdkListbox = inject(CdkListbox, { host: true });
	private readonly _destroyRef = inject(DestroyRef);
	protected readonly _selectService = inject(BrnSelectService);

	protected readonly labelledBy = this._selectService.labelId;
	protected readonly id = this._selectService.id;
	protected readonly canScrollUp = signal(false);
	protected readonly canScrollDown = signal(false);

	protected initialSelectedOptions$ = toObservable(this._selectService.selectedOptions);

	protected viewport = viewChild.required<ElementRef<HTMLElement>>('viewport');

	protected scrollUpBtn = contentChild(BrnSelectScrollUpDirective);

	protected scrollDownBtn = contentChild(BrnSelectScrollDownDirective);

	protected _options = contentChildren(BrnSelectOptionDirective, { descendants: true });

	constructor() {
		this._cdkListbox.valueChange
			.asObservable()
			.pipe(takeUntilDestroyed())
			.subscribe((val: ListboxValueChangeEvent<unknown>) => this._selectService.listBoxValueChangeEvent$.next(val));

		effect(() => {
			this._cdkListbox.multiple = this._selectService.multiple();
			this._selectService.isExpanded() && setTimeout(() => this.updateArrowDisplay());
		});
	}

	ngAfterViewInit(): void {
		this.setInitiallySelectedOptions();
	}

	private setInitiallySelectedOptions() {
		this.initialSelectedOptions$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((selectedOptions) => {
			// Reapplying cdkLibstbox multiple because seems this is running before effect that
			// updates cdklistbox, reapplying multiple true so we can set the multiple initial options
			if (this._selectService.multiple()) {
				this._cdkListbox.multiple = true;
			}

			for (const cdkOption of this._selectService.possibleOptions()) {
				if (selectedOptions.includes(cdkOption)) {
					cdkOption?.select();
				} else {
					cdkOption?.deselect();
				}
			}

			for (const cdkOption of selectedOptions) {
				cdkOption?.select();
			}
		});
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
		this._cdkListbox.focus();
	}

	public moveFocusUp() {
		this.viewport().nativeElement.scrollBy({ top: -SCROLLBY_PIXELS, behavior: 'smooth' });
		if (this.viewport().nativeElement.scrollTop === 0) {
			this.scrollUpBtn()?.stopEmittingEvents();
		}
	}

	public moveFocusDown() {
		this.viewport().nativeElement.scrollBy({ top: SCROLLBY_PIXELS, behavior: 'smooth' });
		const viewportSize = this._el.nativeElement.scrollHeight;
		const viewportScrollPosition = this.viewport().nativeElement.scrollTop;
		if (
			viewportSize + viewportScrollPosition + SCROLLBY_PIXELS >
			this.viewport().nativeElement.scrollHeight + SCROLLBY_PIXELS / 2
		) {
			this.scrollDownBtn()?.stopEmittingEvents();
		}
	}
}
