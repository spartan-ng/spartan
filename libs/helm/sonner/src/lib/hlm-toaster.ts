import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input, numberAttribute } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleCheck, lucideInfo, lucideLoader2, lucideOctagonX, lucideTriangleAlert } from '@ng-icons/lucide';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';
import { NgxSonnerToaster, type ToasterProps } from 'ngx-sonner';

@Component({
	selector: 'hlm-toaster',
	imports: [NgxSonnerToaster, NgIcon],
	providers: [provideIcons({ lucideCircleCheck, lucideInfo, lucideTriangleAlert, lucideOctagonX, lucideLoader2 })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<ngx-sonner-toaster
			[class]="_computedClass()"
			[invert]="invert()"
			[theme]="theme()"
			[position]="position()"
			[hotKey]="hotKey()"
			[richColors]="richColors()"
			[expand]="expand()"
			[duration]="duration()"
			[visibleToasts]="visibleToasts()"
			[closeButton]="closeButton()"
			[toastOptions]="toastOptions()"
			[offset]="offset()"
			[dir]="dir()"
			[style]="userStyle()"
		>
			<!-- FIXME - custom icons vanish when two toasts are visible -->
			<ng-icon name="lucideLoader2" class="overflow-visible! text-base [&>svg]:motion-safe:animate-spin" loading-icon />
			<ng-icon name="lucideCircleCheck" class="overflow-visible! text-base" success-icon />
			<ng-icon name="lucideOctagonX" class="overflow-visible! text-base" error-icon />
			<ng-icon name="lucideInfo" class="overflow-visible! text-base" info-icon />
			<ng-icon name="lucideTriangleAlert" class="overflow-visible! text-base" warning-icon />
		</ngx-sonner-toaster>
	`,
})
export class HlmToaster {
	public readonly invert = input<ToasterProps['invert'], boolean | string>(false, {
		transform: booleanAttribute,
	});
	public readonly theme = input<ToasterProps['theme']>('light');
	public readonly position = input<ToasterProps['position']>('bottom-right');
	public readonly hotKey = input<ToasterProps['hotkey']>(['altKey', 'KeyT']);
	public readonly richColors = input<ToasterProps['richColors'], boolean | string>(false, {
		transform: booleanAttribute,
	});
	public readonly expand = input<ToasterProps['expand'], boolean | string>(false, {
		transform: booleanAttribute,
	});
	public readonly duration = input<ToasterProps['duration'], number | string>(4000, {
		transform: numberAttribute,
	});
	public readonly visibleToasts = input<ToasterProps['visibleToasts'], number | string>(3, {
		transform: numberAttribute,
	});
	public readonly closeButton = input<ToasterProps['closeButton'], boolean | string>(false, {
		transform: booleanAttribute,
	});
	public readonly toastOptions = input<ToasterProps['toastOptions']>({});
	public readonly offset = input<ToasterProps['offset']>(null);
	public readonly dir = input<ToasterProps['dir']>('auto');
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	public readonly userStyle = input<Record<string, string>>(
		{
			'--normal-bg': 'var(--popover)',
			'--normal-text': 'var(--popover-foreground)',
			'--normal-border': 'var(--border)',
			'--border-radius': 'var(--radius)',
		},
		{ alias: 'style' },
	);

	protected readonly _computedClass = computed(() => hlm('toaster group', this.userClass()));
}
