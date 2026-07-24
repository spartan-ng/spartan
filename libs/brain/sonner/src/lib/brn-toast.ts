import { NgComponentOutlet } from '@angular/common';
import {
	afterRenderEffect,
	type AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	computed,
	effect,
	ElementRef,
	input,
	linkedSignal,
	type OnDestroy,
	signal,
	viewChild,
} from '@angular/core';
import clsx from 'clsx';
import { defaultClasses, injectBrnSonnerToasterConfig } from './brn-toaster.token';
import { AsComponentPipe } from './pipes/as-component.pipe';
import { IsStringPipe } from './pipes/is-string.pipe';
import { toastState } from './state';
import type { ToastProps } from './types';

@Component({
	selector: 'brn-sonner-toast',
	imports: [NgComponentOutlet, IsStringPipe, AsComponentPipe],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<li
			#toastRef
			data-sonner-toast
			[attr.aria-live]="toast().important ? 'assertive' : 'polite'"
			aria-atomic="true"
			role="status"
			tabindex="0"
			[class]="_toastClasses()"
			[attr.data-styled]="!(toast().component || toast().unstyled || unstyled())"
			[attr.data-mounted]="_mounted()"
			[attr.data-promise]="!!toast().promise"
			[attr.data-removed]="_removed()"
			[attr.data-visible]="_isVisible()"
			[attr.data-y-position]="_coords()[0]"
			[attr.data-x-position]="_coords()[1]"
			[attr.data-index]="index()"
			[attr.data-front]="_isFront()"
			[attr.data-swiping]="_swiping()"
			[attr.data-dismissible]="toast().dismissible"
			[attr.data-type]="_toastType()"
			[attr.data-invert]="_invert()"
			[attr.data-swipe-out]="_swipeOut()"
			[attr.data-expanded]="expanded() || (expandByDefault() && _mounted())"
			[style]="_toastStyle()"
			(pointerdown)="onPointerDown($event)"
			(pointerup)="onPointerUp()"
			(pointermove)="onPointerMove($event)"
		>
			@if (_closeButton() && !toast().component) {
				<button
					aria-label="Close toast"
					[attr.data-disabled]="_disabled()"
					data-close-button
					(click)="onCloseButtonClick()"
					[class]="_closeButtonClasses()"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="12"
						height="12"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<line x1="18" y1="6" x2="6" y2="18" />
						<line x1="6" y1="6" x2="18" y2="18" />
					</svg>
				</button>
			}

			@if (toast().component) {
				<ng-container *ngComponentOutlet="toast().component | asComponent; inputs: toast().componentProps" />
			} @else {
				@if (_toastType() !== 'default' || toast().icon || toast().promise) {
					<div data-icon>
						@if (_toastType() === 'loading' && !toast().icon) {
							<ng-content select="[loading-icon]" />
						}
						@if (toast().icon) {
							<ng-container *ngComponentOutlet="toast().icon | asComponent; inputs: toast().componentProps" />
						} @else {
							@switch (_toastType()) {
								@case ('success') {
									<ng-content select="[success-icon]" />
								}
								@case ('error') {
									<ng-content select="[error-icon]" />
								}
								@case ('warning') {
									<ng-content select="[warning-icon]" />
								}
								@case ('info') {
									<ng-content select="[info-icon]" />
								}
							}
						}
					</div>
				}
				<div data-content>
					@if (toast().title; as title) {
						<div data-title [class]="_titleClasses()">
							@if (title | isString) {
								{{ toast().title }}
							} @else {
								<ng-container *ngComponentOutlet="title | asComponent; inputs: toast().componentProps" />
							}
						</div>
					}
					@if (toast().description; as description) {
						<div data-description [class]="_toastDescriptionClasses()">
							@if (description | isString) {
								{{ toast().description }}
							} @else {
								<ng-container *ngComponentOutlet="description | asComponent; inputs: toast().componentProps" />
							}
						</div>
					}
				</div>
				@if (toast().cancel; as cancel) {
					<button
						data-button
						data-cancel
						[style]="cancelButtonStyle() ?? toast().cancelButtonStyle"
						[class]="_cancelButtonClasses()"
						(click)="onCancelClick()"
					>
						{{ cancel.label }}
					</button>
				}
				@if (toast().action; as action) {
					<button
						data-button
						[style]="actionButtonStyle() ?? toast().actionButtonStyle"
						[class]="_actionButtonClasses()"
						(click)="onActionClick($event)"
					>
						{{ action.label }}
					</button>
				}
			}
		</li>
	`,
})
export class BrnSonnerToast implements AfterViewInit, OnDestroy {
	private readonly _config = injectBrnSonnerToasterConfig();

	protected readonly _toasts = computed(() => toastState.toasts().filter((t) => t.position === this.position()));
	protected readonly _heights = computed(() => toastState.heights().filter((h) => h.position === this.position()));
	protected readonly _removeHeight = toastState.removeHeight;
	protected readonly _addHeight = toastState.addHeight;
	protected readonly _dismiss = toastState.dismiss;

	public readonly toast = input.required<ToastProps['toast']>();
	public readonly index = input.required<ToastProps['index']>();
	public readonly expanded = input.required<ToastProps['expanded']>();
	public readonly invert = input.required<ToastProps['invert']>();
	public readonly position = input.required<ToastProps['position']>();
	public readonly visibleToasts = input.required<ToastProps['visibleToasts']>();
	public readonly expandByDefault = input.required<ToastProps['expandByDefault']>();
	public readonly closeButton = input.required<ToastProps['closeButton']>();
	public readonly interacting = input.required<ToastProps['interacting']>();
	public readonly cancelButtonStyle = input<ToastProps['cancelButtonStyle']>();
	public readonly actionButtonStyle = input<ToastProps['actionButtonStyle']>();
	public readonly duration = input<ToastProps['duration']>(this._config.toastLifetime);
	public readonly descriptionClass = input<ToastProps['descriptionClass']>('');
	public readonly classes = input<ToastProps['classes']>({});
	public readonly unstyled = input<ToastProps['unstyled']>(false);
	public readonly userClass = input('', { alias: 'class' });
	public readonly style = input<Record<string, string>>({});

	protected readonly _mounted = signal(false);
	protected readonly _removed = signal(false);
	protected readonly _swiping = signal(false);
	protected readonly _swipeOut = signal(false);
	private readonly _offsetBeforeRemove = signal(0);
	private readonly _initialHeight = signal(0);

	private readonly _toastRef = viewChild.required<ElementRef<HTMLLIElement>>('toastRef');

	protected readonly _classes = computed(() => ({
		...defaultClasses,
		...this.classes(),
	}));

	protected readonly _isFront = computed(() => this.index() === 0);
	protected readonly _isVisible = computed(() => this.index() + 1 <= this.visibleToasts());
	protected readonly _toastType = computed(() => this.toast().type ?? 'default');
	private readonly _toastClass = computed(() => this.toast().class ?? '');
	private readonly _toastPosition = computed(() => this.toast().position ?? this.position());
	protected readonly _toastDescriptionClass = computed(() => this.toast().descriptionClass ?? '');

	private readonly _heightIndex = computed(() =>
		this._heights().findIndex((height) => height.toastId === this.toast().id),
	);

	private readonly _offset = linkedSignal({
		source: () => ({
			heightIndex: this._heightIndex(),
			toastsHeightBefore: this._toastsHeightBefore(),
		}),
		computation: ({ heightIndex, toastsHeightBefore }) =>
			Math.round(heightIndex * this._config.gap + toastsHeightBefore),
	});

	private _closeTimerStartTimeRef = 0;
	private _lastCloseTimerStartTimeRef = 0;
	private _pointerStartRef: { x: number; y: number } | null = null;

	protected readonly _coords = computed(() => this._toastPosition().split('-'));
	private readonly _toastsHeightBefore = computed(() =>
		this._heights().reduce((prev, curr, reducerIndex) => {
			if (reducerIndex >= this._heightIndex()) return prev;
			return prev + curr.height;
		}, 0),
	);
	protected readonly _invert = computed(() => this.toast().invert ?? this.invert());
	protected readonly _closeButton = computed(() => this.toast().closeButton ?? this.closeButton());
	protected readonly _disabled = computed(() => this._toastType() === 'loading');

	private _timeoutId: ReturnType<typeof setTimeout> | undefined;
	private _remainingTime = 0;

	private readonly _isPromiseLoadingOrInfiniteDuration = computed(
		() =>
			(this.toast().promise && this._toastType() === 'loading') || this.toast().duration === Number.POSITIVE_INFINITY,
	);

	protected readonly _toastClasses = computed(() =>
		clsx(
			this.userClass(),
			this._toastClass(),
			this._classes().toast,
			this.toast().classes?.toast,
			this._classes()[this._toastType()],
			this.toast().classes?.[this._toastType()],
		),
	);
	protected readonly _toastStyle = computed(() => ({
		'--index': `${this.index()}`,
		'--toasts-before': `${this.index()}`,
		'--z-index': `${this._toasts().length - this.index()}`,
		'--offset': `${this._removed() ? this._offsetBeforeRemove() : this._offset()}px`,
		'--initial-height': this.expandByDefault() ? 'auto' : `${this._initialHeight()}px`,
		...this.style(),
	}));
	protected readonly _actionButtonClasses = computed(() =>
		clsx(this._classes().actionButton, this.toast().classes?.actionButton),
	);
	protected readonly _cancelButtonClasses = computed(() =>
		clsx(this._classes().cancelButton, this.toast().classes?.cancelButton),
	);
	protected readonly _toastDescriptionClasses = computed(() =>
		clsx(
			this.descriptionClass(),
			this._toastDescriptionClass(),
			this._classes().description,
			this.toast().classes?.description,
		),
	);
	protected readonly _titleClasses = computed(() => clsx(this._classes().title, this.toast().classes?.title));
	protected readonly _closeButtonClasses = computed(() =>
		clsx(this._classes().closeButton, this.toast().classes?.closeButton),
	);

	constructor() {
		effect(() => {
			if (this.toast().updated) {
				// if the toast has been updated after the initial render,
				// we want to reset the timer and set the remaining time to the
				// new duration
				clearTimeout(this._timeoutId);
				this._remainingTime = this.toast().duration ?? this.duration() ?? this._config.toastLifetime;
				this.startTimer();
			}
		});

		afterRenderEffect((onCleanup) => {
			if (!this._isPromiseLoadingOrInfiniteDuration()) {
				if (this.expanded() || this.interacting()) {
					this.pauseTimer();
				} else {
					this.startTimer();
				}
			}

			onCleanup(() => clearTimeout(this._timeoutId));
		});

		effect(() => {
			if (this.toast().delete) {
				this.deleteToast();
			}
		});
	}

	ngAfterViewInit() {
		this._remainingTime = this.toast().duration ?? this.duration() ?? this._config.toastLifetime;
		this._mounted.set(true);
		const height = this._toastRef().nativeElement.getBoundingClientRect().height;
		this._initialHeight.set(height);
		this._addHeight({ toastId: this.toast().id, height, position: this._toastPosition() });
	}

	ngOnDestroy() {
		clearTimeout(this._timeoutId);
		this._removeHeight(this.toast().id);
	}

	deleteToast() {
		this._removed.set(true);
		this._offsetBeforeRemove.set(this._offset());

		this._removeHeight(this.toast().id);

		setTimeout(() => {
			this._dismiss(this.toast().id);
		}, this._config.timeBeforeUnmount);
	}

	// If toast's duration changes, it will be out of sync with the
	// remainingAtTimeout, so we know we need to restart the timer
	// with the new duration

	// Pause the timer on each hover
	pauseTimer() {
		if (this._lastCloseTimerStartTimeRef < this._closeTimerStartTimeRef) {
			// Get the elapsed time since the timer started
			const elapsedTime = new Date().getTime() - this._closeTimerStartTimeRef;
			this._remainingTime = this._remainingTime - elapsedTime;
		}

		this._lastCloseTimerStartTimeRef = new Date().getTime();
	}

	startTimer() {
		this._closeTimerStartTimeRef = new Date().getTime();
		// Let the toast know it has started
		this._timeoutId = setTimeout(() => {
			this.toast().onAutoClose?.(this.toast());
			this.deleteToast();
		}, this._remainingTime);
	}

	onPointerDown(event: PointerEvent) {
		if (this._disabled() || !this.toast().dismissible) return;

		this._offsetBeforeRemove.set(this._offset());
		const target = event.target as HTMLElement;
		// Ensure we maintain correct pointer capture even when going outside the toast (e.g. when swiping)
		target.setPointerCapture(event.pointerId);
		if (target.tagName === 'BUTTON') {
			return;
		}
		this._swiping.set(true);
		this._pointerStartRef = { x: event.clientX, y: event.clientY };
	}

	onPointerUp() {
		if (this._swipeOut() || !this.toast().dismissible) return;

		this._pointerStartRef = null;
		const swipeAmount = Number(
			this._toastRef().nativeElement.style.getPropertyValue('--swipe-amount').replace('px', '') || 0,
		);

		// Remove only if threshold is met
		if (Math.abs(swipeAmount) >= this._config.swipeThreshold) {
			this._offsetBeforeRemove.set(this._offset());
			this.toast().onDismiss?.(this.toast());
			this.deleteToast();
			this._swipeOut.set(true);
			return;
		}

		this._toastRef().nativeElement.style.setProperty('--swipe-amount', '0px');
		this._swiping.set(false);
	}

	onPointerMove(event: PointerEvent) {
		if (!this._pointerStartRef || !this.toast().dismissible) return;

		const yPosition = event.clientY - this._pointerStartRef.y;
		const xPosition = event.clientX - this._pointerStartRef.x;

		const clamp = this._coords()[0] === 'top' ? Math.min : Math.max;
		const clampedY = clamp(0, yPosition);
		const swipeStartThreshold = event.pointerType === 'touch' ? 10 : 2;
		const isAllowedToSwipe = Math.abs(clampedY) > swipeStartThreshold;

		if (isAllowedToSwipe) {
			this._toastRef().nativeElement.style.setProperty('--swipe-amount', `${yPosition}px`);
		} else if (Math.abs(xPosition) > swipeStartThreshold) {
			// User is swiping in wrong direction, so we disable swipe gesture
			// for the current pointer down interaction
			this._pointerStartRef = null;
		}
	}

	onCloseButtonClick() {
		if (this._disabled() || !this.toast().dismissible) return;
		this.deleteToast();
		this.toast().onDismiss?.(this.toast());
	}

	onCancelClick() {
		const toast = this.toast();
		if (!toast.dismissible) return;
		this.deleteToast();
		if (toast.cancel?.onClick) {
			toast.cancel.onClick();
		}
	}

	onActionClick(event: MouseEvent) {
		const toast = this.toast();
		toast.action?.onClick(event);
		if (event.defaultPrevented) return;
		this.deleteToast();
	}
}
