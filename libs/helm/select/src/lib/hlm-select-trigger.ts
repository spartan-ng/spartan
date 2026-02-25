import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	ElementRef,
	computed,
	contentChild,
	inject,
	input,
} from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { BrnSelect, BrnSelectTrigger } from '@spartan-ng/brain/select';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { hlm } from '@spartan-ng/helm/utils';
import { cva } from 'class-variance-authority';
import type { ClassValue } from 'clsx';

export const selectTriggerVariants = cva(
	`border-input [&>ng-icon:not([class*='text-'])]:text-muted-foreground focus-within:border-ring focus-within:ring-ring/50 dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-within:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 [&>ng-icon]:pointer-events-none [&>ng-icon]:size-4 [&>ng-icon]:shrink-0`,
	{
		variants: {
			error: {
				auto: '[&.ng-invalid.ng-touched]:text-destructive [&.ng-invalid.ng-touched]:border-destructive [&.ng-invalid.ng-touched]:focus-within:ring-destructive/20 dark:[&.ng-invalid.ng-touched]:focus-within:ring-destructive/40',
				true: 'text-destructive border-destructive focus-within:ring-destructive/20 dark:focus-within:ring-destructive/40',
			},
		},
		defaultVariants: {
			error: 'auto',
		},
	},
);

@Component({
	selector: 'hlm-select-trigger',
	imports: [BrnSelectTrigger, NgIcon, HlmIcon],
	providers: [provideIcons({ lucideChevronDown })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[class]': '_computedClass()',
		'[attr.data-size]': 'size()',
	},
	template: `
		<ng-content select="[hlmSelectPrefix]" />
		<input brnSelectTrigger class="min-w-0 flex-1 cursor-pointer bg-transparent outline-none" />
		<ng-content select="[hlmSelectSuffix]" />
		@if (_icon()) {
			<ng-content select="ng-icon" />
		} @else {
			<ng-icon hlm size="sm" class="ml-2 flex-none" name="lucideChevronDown" />
		}
	`,
})
export class HlmSelectTrigger implements AfterViewInit {
	protected readonly _icon = contentChild(HlmIcon);
	protected readonly _brnSelect = inject(BrnSelect, { optional: true });
	private readonly _elementRef = inject(ElementRef);
	private readonly _destroyRef = inject(DestroyRef);

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	public readonly size = input<'default' | 'sm'>('default');

	protected readonly _computedClass = computed(() =>
		hlm(selectTriggerVariants({ error: this._brnSelect?.errorState() }), this.userClass()),
	);

	ngAfterViewInit(): void {
		if (!this._brnSelect) return;

		// The host element (hlm-select-trigger) is the full styled container.
		// BrnSelectTrigger's ResizeObserver watches only the inner <input>, which
		// excludes padding and the icon. We replace it with a container-level observer
		// so triggerWidth always reflects the full trigger width.
		const el = this._elementRef.nativeElement;
		const updateWidth = () => this._brnSelect!.triggerWidth.set(el.offsetWidth);

		updateWidth();

		const observer = new ResizeObserver(updateWidth);
		observer.observe(el);
		this._destroyRef.onDestroy(() => observer.disconnect());
	}
}
