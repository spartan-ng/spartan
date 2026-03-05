import { Directionality } from '@angular/cdk/bidi';
import type { BooleanInput, NumberInput } from '@angular/cdk/coercion';
import { isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import {
	afterNextRender,
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	computed,
	contentChild,
	DestroyRef,
	DOCUMENT,
	ElementRef,
	inject,
	input,
	linkedSignal,
	numberAttribute,
	PLATFORM_ID,
	signal,
	TemplateRef,
	viewChild,
	ViewEncapsulation,
} from '@angular/core';
import { BrnSonnerIcon } from './brn-icon';
import { BrnSonnerLoader } from './brn-loader';
import { BrnSonnerToast } from './brn-toast';
import { injectBrnSonnerToasterConfig } from './brn-toaster.token';
import { ToastFilterPipe } from './pipes/toast-filter.pipe';
import { toastState } from './state';
import type { Position, Theme, ToasterProps } from './types';

@Component({
	selector: 'brn-sonner-toaster',
	imports: [BrnSonnerToast, ToastFilterPipe, BrnSonnerIcon, BrnSonnerLoader, NgTemplateOutlet],
	// eslint-disable-next-line @nx/workspace-avoid-component-styles
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	styleUrl: 'brn-toaster.css',
	template: `
		@if (_toasts().length > 0) {
			<section [attr.aria-label]="'Notifications ' + _hotKeyLabel()" [tabIndex]="-1">
				@for (pos of _possiblePositions(); track pos) {
					<ol
						#listRef
						[tabIndex]="-1"
						[class]="userClass()"
						data-sonner-toaster
						[attr.data-theme]="_actualTheme()"
						[attr.data-rich-colors]="richColors()"
						[attr.dir]="direction()"
						[attr.data-y-position]="pos.split('-')[0]"
						[attr.data-x-position]="pos.split('-')[1]"
						[style]="_toasterStyles()"
						(blur)="handleBlur($event)"
						(focus)="handleFocus($event)"
						(mouseenter)="_expanded.set(true)"
						(mousemove)="_expanded.set(true)"
						(mouseleave)="handleMouseLeave()"
						(pointerdown)="handlePointerDown($event)"
						(pointerup)="_interacting.set(false)"
					>
						@for (toast of _toasts() | toastFilter: $index : pos; track toast.id) {
							<brn-sonner-toast
								[index]="$index"
								[toast]="toast"
								[invert]="invert()"
								[visibleToasts]="visibleToasts()"
								[closeButton]="closeButton()"
								[interacting]="_interacting()"
								[position]="pos"
								[expandByDefault]="expand()"
								[expanded]="_expanded()"
								[actionButtonStyle]="toastOptions().actionButtonStyle"
								[cancelButtonStyle]="toastOptions().cancelButtonStyle"
								[class]="toastOptions().class ?? ''"
								[descriptionClass]="toastOptions().descriptionClass ?? ''"
								[classes]="toastOptions().classes ?? {}"
								[duration]="toastOptions().duration ?? duration()"
								[unstyled]="toastOptions().unstyled ?? false"
							>
								@if (_loadingIcon(); as loadingIcon) {
									<ng-container *ngTemplateOutlet="loadingIcon" loading-icon />
								} @else {
									<brn-sonner-loader [isVisible]="toast.type === 'loading'" loading-icon />
								}

								@if (_successIcon(); as successIcon) {
									<ng-container *ngTemplateOutlet="successIcon" success-icon />
								} @else {
									<brn-sonner-icon type="success" success-icon />
								}

								@if (_errorIcon(); as errorIcon) {
									<ng-container *ngTemplateOutlet="errorIcon" error-icon />
								} @else {
									<brn-sonner-icon type="error" error-icon />
								}

								@if (_warningIcon(); as warningIcon) {
									<ng-container *ngTemplateOutlet="warningIcon" warning-icon />
								} @else {
									<brn-sonner-icon type="warning" warning-icon />
								}

								@if (_infoIcon(); as infoIcon) {
									<ng-container *ngTemplateOutlet="infoIcon" info-icon />
								} @else {
									<brn-sonner-icon type="info" info-icon />
								}
							</brn-sonner-toast>
						}
					</ol>
				}
			</section>
		}
	`,
})
export class BrnSonnerToaster {
	private readonly _platformId = inject(PLATFORM_ID);
	private readonly _config = injectBrnSonnerToasterConfig();
	private readonly _document = inject(DOCUMENT);
	private readonly _window = this._document.defaultView;
	private readonly _dir = inject(Directionality);

	protected readonly _toasts = toastState.toasts;
	private readonly _heights = toastState.heights;
	private readonly _reset = toastState.reset;

	public readonly invert = input<ToasterProps['invert'], BooleanInput>(false, {
		transform: booleanAttribute,
	});
	public readonly theme = input<ToasterProps['theme']>('light');
	public readonly position = input<ToasterProps['position']>('bottom-right');
	public readonly hotKey = input<ToasterProps['hotkey']>(['altKey', 'KeyT']);
	public readonly richColors = input<ToasterProps['richColors'], BooleanInput>(false, {
		transform: booleanAttribute,
	});
	public readonly expand = input<ToasterProps['expand'], BooleanInput>(false, {
		transform: booleanAttribute,
	});
	public readonly duration = input<ToasterProps['duration'], NumberInput>(this._config.toastLifetime, {
		transform: numberAttribute,
	});
	public readonly visibleToasts = input<ToasterProps['visibleToasts'], NumberInput>(this._config.visibleToastsAmount, {
		transform: numberAttribute,
	});
	public readonly closeButton = input<ToasterProps['closeButton'], BooleanInput>(false, {
		transform: booleanAttribute,
	});
	public readonly toastOptions = input<ToasterProps['toastOptions']>({});
	public readonly offset = input<ToasterProps['offset']>(null);
	public readonly userClass = input('', { alias: 'class' });
	public readonly style = input<Record<string, string>>({});

	protected readonly _possiblePositions = computed(
		() =>
			Array.from(
				new Set(
					[
						this.position(),
						...this._toasts()
							.filter((toast) => toast.position)
							.map((toast) => toast.position),
					].filter(Boolean),
				),
			) as Position[],
	);

	protected readonly _expanded = linkedSignal({
		source: this._toasts,
		computation: (toasts) => toasts.length < 1,
	});
	protected readonly _actualTheme = linkedSignal({
		source: this.theme,
		computation: (newTheme) => this.getActualTheme(newTheme),
	});
	protected readonly _interacting = signal(false);

	/** internal **/
	public readonly direction = this._dir.valueSignal;

	private readonly _listRef = viewChild<ElementRef<HTMLOListElement>>('listRef');
	private readonly _lastFocusedElementRef = signal<HTMLElement | null>(null);
	private readonly _isFocusWithinRef = signal(false);

	protected readonly _hotKeyLabel = computed(() => this.hotKey().join('+').replace(/Key/g, '').replace(/Digit/g, ''));

	protected readonly _toasterStyles = computed(() => ({
		'--front-toast-height': `${this._heights()[0]?.height}px`,
		'--offset':
			typeof this.offset() === 'number' ? `${this.offset()}px` : (this.offset() ?? `${this._config.viewPortOffset}`),
		'--width': `${this._config.toastWidth}px`,
		'--gap': `${this._config.gap}px`,
		...this.style(),
	}));

	protected readonly _loadingIcon = contentChild('loadingIcon', { read: TemplateRef });
	protected readonly _successIcon = contentChild('successIcon', { read: TemplateRef });
	protected readonly _errorIcon = contentChild('errorIcon', { read: TemplateRef });
	protected readonly _warningIcon = contentChild('warningIcon', { read: TemplateRef });
	protected readonly _infoIcon = contentChild('infoIcon', { read: TemplateRef });

	constructor() {
		this._reset();

		const destroyRef = inject(DestroyRef);

		afterNextRender(() => {
			this._document.addEventListener('keydown', this.handleKeydown);

			const window = this._window;
			if (window) {
				this._window
					.matchMedia('(prefers-color-scheme: dark)')
					.addEventListener('change', this.handleThemePreferenceChange);
			}

			destroyRef.onDestroy(() => {
				this._document.removeEventListener('keydown', this.handleKeydown);
				if (window) {
					window
						.matchMedia('(prefers-color-scheme: dark)')
						.removeEventListener('change', this.handleThemePreferenceChange);
				}
			});
		});
	}

	handleBlur(event: FocusEvent) {
		if (this._isFocusWithinRef() && !(event.target as HTMLOListElement).contains(event.relatedTarget as HTMLElement)) {
			this._isFocusWithinRef.set(false);
			if (this._lastFocusedElementRef()) {
				this._lastFocusedElementRef()?.focus({ preventScroll: true });
				this._lastFocusedElementRef.set(null);
			}
		}
	}

	handleFocus(event: FocusEvent) {
		const isNotDismissible = event.target instanceof HTMLElement && event.target.dataset['dismissible'] === 'false';

		if (isNotDismissible) return;

		if (!this._isFocusWithinRef()) {
			this._isFocusWithinRef.set(true);
			this._lastFocusedElementRef.set(event.relatedTarget as HTMLElement);
		}
	}

	handlePointerDown(event: MouseEvent) {
		const isNotDismissible = event.target instanceof HTMLElement && event.target.dataset['dismissible'] === 'false';

		if (isNotDismissible) return;
		this._interacting.set(true);
	}

	handleMouseLeave() {
		if (!this._interacting()) {
			this._expanded.set(false);
		}
	}

	private readonly handleKeydown = (event: KeyboardEvent) => {
		const listRef = this._listRef()?.nativeElement;
		if (!listRef) return;

		const isHotkeyPressed = this.hotKey().every((key) => (event as never)[key] || event.code === key);

		if (isHotkeyPressed) {
			this._expanded.set(true);
			listRef.focus();
		}

		if (
			event.code === 'Escape' &&
			(this._document.activeElement === listRef || listRef.contains(this._document.activeElement))
		) {
			this._expanded.set(false);
		}
	};

	private readonly handleThemePreferenceChange = ({ matches }: MediaQueryListEvent) => {
		if (this.theme() === 'system') {
			this._actualTheme.set(matches ? 'dark' : 'light');
		}
	};

	private getActualTheme(theme: Theme): Theme {
		if (theme !== 'system') {
			return theme;
		}

		if (isPlatformBrowser(this._platformId) && this._window) {
			const prefersDark = this._window.matchMedia?.('(prefers-color-scheme: dark)').matches;
			return prefersDark ? 'dark' : 'light';
		}

		return 'light';
	}
}
