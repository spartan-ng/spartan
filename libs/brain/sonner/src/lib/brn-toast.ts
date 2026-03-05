import { NgComponentOutlet } from '@angular/common';
import {
	afterRenderEffect,
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	computed,
	effect,
	ElementRef,
	input,
	linkedSignal,
	OnDestroy,
	signal,
	viewChild,
} from '@angular/core';
import { cn } from './internal/cn';
import { defaultClasses, GAP, SWIPE_THRESHOLD, TIME_BEFORE_UNMOUNT, TOAST_LIFETIME } from './internal/constants';
import { AsComponentPipe } from './pipes/as-component.pipe';
import { IsStringPipe } from './pipes/is-string.pipe';
import { toastState } from './state';
import { ToastProps } from './types';

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
			[class]="toastClasses()"
			[attr.data-styled]="!(toast().component || toast().unstyled || unstyled())"
			[attr.data-mounted]="mounted()"
			[attr.data-promise]="!!toast().promise"
			[attr.data-removed]="removed()"
			[attr.data-visible]="isVisible()"
			[attr.data-y-position]="coords()[0]"
			[attr.data-x-position]="coords()[1]"
			[attr.data-index]="index()"
			[attr.data-front]="isFront()"
			[attr.data-swiping]="swiping()"
			[attr.data-dismissible]="toast().dismissible"
			[attr.data-type]="toastType()"
			[attr.data-invert]="invert()"
			[attr.data-swipe-out]="swipeOut()"
			[attr.data-expanded]="expanded() || (expandByDefault() && mounted())"
			[style]="toastStyle()"
			(pointerdown)="onPointerDown($event)"
			(pointerup)="onPointerUp()"
			(pointermove)="onPointerMove($event)"
		>
			@if (closeButton() && !toast().component) {
				<button
					aria-label="Close toast"
					[attr.data-disabled]="disabled()"
					data-close-button
					(click)="onCloseButtonClick()"
					[class]="cn(classes().closeButton, toast().classes?.closeButton)"
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
				@if (toastType() !== 'default' || toast().icon || toast().promise) {
					<div data-icon>
						@if (toastType() === 'loading' && !toast().icon) {
							<ng-content select="[loading-icon]" />
						}
						@if (toast().icon) {
							<ng-container *ngComponentOutlet="toast().icon | asComponent; inputs: toast().componentProps" />
						} @else {
							@switch (toastType()) {
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
						<div data-title [class]="cn(classes().title, toast().classes?.title)">
							@if (title | isString) {
								{{ toast().title }}
							} @else {
								<ng-container *ngComponentOutlet="title | asComponent; inputs: toast().componentProps" />
							}
						</div>
					}
					@if (toast().description; as description) {
						<div
							data-description
							[class]="
								cn(descriptionClass(), toastDescriptionClass(), classes().description, toast().classes?.description)
							"
						>
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
						[class]="cn(classes().cancelButton, toast().classes?.cancelButton)"
						(click)="onCancelClick()"
					>
						{{ cancel.label }}
					</button>
				}
				@if (toast().action; as action) {
					<button
						data-button
						[style]="actionButtonStyle() ?? toast().actionButtonStyle"
						[class]="cn(classes().actionButton, toast().classes?.actionButton)"
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
	protected readonly cn = cn;

	toasts = computed(() => toastState.toasts().filter((t) => t.position === this.position()));
	heights = computed(() => toastState.heights().filter((h) => h.position === this.position()));
	removeHeight = toastState.removeHeight;
	addHeight = toastState.addHeight;
	dismiss = toastState.dismiss;

	toast = input.required<ToastProps['toast']>();
	index = input.required<ToastProps['index']>();
	expanded = input.required<ToastProps['expanded']>();
	_invert = input.required<ToastProps['invert']>({ alias: 'invert' });
	position = input.required<ToastProps['position']>();
	visibleToasts = input.required<ToastProps['visibleToasts']>();
	expandByDefault = input.required<ToastProps['expandByDefault']>();
	_closeButton = input.required<ToastProps['closeButton']>({
		alias: 'closeButton',
	});
	interacting = input.required<ToastProps['interacting']>();
	cancelButtonStyle = input<ToastProps['cancelButtonStyle']>();
	actionButtonStyle = input<ToastProps['actionButtonStyle']>();
	duration = input<ToastProps['duration']>(TOAST_LIFETIME);
	descriptionClass = input<ToastProps['descriptionClass']>('');
	_classes = input<ToastProps['classes']>({}, { alias: 'classes' });
	unstyled = input<ToastProps['unstyled']>(false);
	_class = input('', { alias: 'class' });
	_style = input<Record<string, string>>({}, { alias: 'style' });

	mounted = signal(false);
	removed = signal(false);
	swiping = signal(false);
	swipeOut = signal(false);
	offsetBeforeRemove = signal(0);
	initialHeight = signal(0);

	toastRef = viewChild.required<ElementRef<HTMLLIElement>>('toastRef');

	classes: any = computed(() => ({
		...defaultClasses,
		...this._classes(),
	}));

	isFront = computed(() => this.index() === 0);
	isVisible = computed(() => this.index() + 1 <= this.visibleToasts());
	toastType = computed(() => this.toast().type ?? 'default');
	toastClass = computed(() => this.toast().class ?? '');
	toastPosition = computed(() => this.toast().position ?? this.position());
	toastDescriptionClass = computed(() => this.toast().descriptionClass ?? '');

	heightIndex = computed(() => this.heights().findIndex((height) => height.toastId === this.toast().id));

	offset = linkedSignal({
		source: () => ({
			heightIndex: this.heightIndex(),
			toastsHeightBefore: this.toastsHeightBefore(),
		}),
		computation: ({ heightIndex, toastsHeightBefore }) => Math.round(heightIndex * GAP + toastsHeightBefore),
	});

	closeTimerStartTimeRef = 0;
	lastCloseTimerStartTimeRef = 0;
	pointerStartRef: { x: number; y: number } | null = null;

	coords = computed(() => this.toastPosition().split('-'));
	toastsHeightBefore = computed(() =>
		this.heights().reduce((prev, curr, reducerIndex) => {
			if (reducerIndex >= this.heightIndex()) return prev;
			return prev + curr.height;
		}, 0),
	);
	invert = computed(() => this.toast().invert ?? this._invert());
	closeButton = computed(() => this.toast().closeButton ?? this._closeButton());
	disabled = computed(() => this.toastType() === 'loading');

	timeoutId: ReturnType<typeof setTimeout> | undefined;
	remainingTime = 0;

	isPromiseLoadingOrInfiniteDuration = computed(
		() =>
			(this.toast().promise && this.toastType() === 'loading') || this.toast().duration === Number.POSITIVE_INFINITY,
	);

	toastClasses = computed(() =>
		cn(
			this._class(),
			this.toastClass(),
			this.classes().toast,
			this.toast().classes?.toast,
			this.classes()[this.toastType()],
			this.toast().classes?.[this.toastType()],
		),
	);
	toastStyle = computed(() => ({
		'--index': `${this.index()}`,
		'--toasts-before': `${this.index()}`,
		'--z-index': `${this.toasts().length - this.index()}`,
		'--offset': `${this.removed() ? this.offsetBeforeRemove() : this.offset()}px`,
		'--initial-height': this.expandByDefault() ? 'auto' : `${this.initialHeight()}px`,
		...this._style(),
	}));

	constructor() {
		effect(() => {
			if (this.toast().updated) {
				// if the toast has been updated after the initial render,
				// we want to reset the timer and set the remaining time to the
				// new duration
				clearTimeout(this.timeoutId);
				this.remainingTime = this.toast().duration ?? this.duration() ?? TOAST_LIFETIME;
				this.startTimer();
			}
		});

		afterRenderEffect((onCleanup) => {
			if (!this.isPromiseLoadingOrInfiniteDuration()) {
				if (this.expanded() || this.interacting()) {
					this.pauseTimer();
				} else {
					this.startTimer();
				}
			}

			onCleanup(() => clearTimeout(this.timeoutId));
		});

		effect(() => {
			if (this.toast().delete) {
				this.deleteToast();
			}
		});
	}

	ngAfterViewInit() {
		this.remainingTime = this.toast().duration ?? this.duration() ?? TOAST_LIFETIME;
		this.mounted.set(true);
		const height = this.toastRef().nativeElement.getBoundingClientRect().height;
		this.initialHeight.set(height);
		this.addHeight({ toastId: this.toast().id, height, position: this.toastPosition() });
	}

	ngOnDestroy() {
		clearTimeout(this.timeoutId);
		this.removeHeight(this.toast().id);
	}

	deleteToast() {
		this.removed.set(true);
		this.offsetBeforeRemove.set(this.offset());

		this.removeHeight(this.toast().id);

		setTimeout(() => {
			this.dismiss(this.toast().id);
		}, TIME_BEFORE_UNMOUNT);
	}

	// If toast's duration changes, it will be out of sync with the
	// remainingAtTimeout, so we know we need to restart the timer
	// with the new duration

	// Pause the timer on each hover
	pauseTimer() {
		if (this.lastCloseTimerStartTimeRef < this.closeTimerStartTimeRef) {
			// Get the elapsed time since the timer started
			const elapsedTime = new Date().getTime() - this.closeTimerStartTimeRef;
			this.remainingTime = this.remainingTime - elapsedTime;
		}

		this.lastCloseTimerStartTimeRef = new Date().getTime();
	}

	startTimer() {
		this.closeTimerStartTimeRef = new Date().getTime();
		// Let the toast know it has started
		this.timeoutId = setTimeout(() => {
			this.toast().onAutoClose?.(this.toast());
			this.deleteToast();
		}, this.remainingTime);
	}

	onPointerDown(event: PointerEvent) {
		if (this.disabled() || !this.toast().dismissible) return;

		this.offsetBeforeRemove.set(this.offset());
		const target = event.target as HTMLElement;
		// Ensure we maintain correct pointer capture even when going outside the toast (e.g. when swiping)
		target.setPointerCapture(event.pointerId);
		if (target.tagName === 'BUTTON') {
			return;
		}
		this.swiping.set(true);
		this.pointerStartRef = { x: event.clientX, y: event.clientY };
	}

	onPointerUp() {
		if (this.swipeOut() || !this.toast().dismissible) return;

		this.pointerStartRef = null;
		const swipeAmount = Number(
			this.toastRef().nativeElement.style.getPropertyValue('--swipe-amount').replace('px', '') || 0,
		);

		// Remove only if threshold is met
		if (Math.abs(swipeAmount) >= SWIPE_THRESHOLD) {
			this.offsetBeforeRemove.set(this.offset());
			this.toast().onDismiss?.(this.toast());
			this.deleteToast();
			this.swipeOut.set(true);
			return;
		}

		this.toastRef().nativeElement.style.setProperty('--swipe-amount', '0px');
		this.swiping.set(false);
	}

	onPointerMove(event: PointerEvent) {
		if (!this.pointerStartRef || !this.toast().dismissible) return;

		const yPosition = event.clientY - this.pointerStartRef.y;
		const xPosition = event.clientX - this.pointerStartRef.x;

		const clamp = this.coords()[0] === 'top' ? Math.min : Math.max;
		const clampedY = clamp(0, yPosition);
		const swipeStartThreshold = event.pointerType === 'touch' ? 10 : 2;
		const isAllowedToSwipe = Math.abs(clampedY) > swipeStartThreshold;

		if (isAllowedToSwipe) {
			this.toastRef().nativeElement.style.setProperty('--swipe-amount', `${yPosition}px`);
		} else if (Math.abs(xPosition) > swipeStartThreshold) {
			// User is swiping in wrong direction, so we disable swipe gesture
			// for the current pointer down interaction
			this.pointerStartRef = null;
		}
	}

	onCloseButtonClick() {
		if (this.disabled() || !this.toast().dismissible) return;
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
