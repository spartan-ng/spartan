import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input, numberAttribute } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';
import { NgxSonnerToaster, type ToasterProps } from 'ngx-sonner';

@Component({
	selector: 'hlm-toaster',
	imports: [NgxSonnerToaster],
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
		/>
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
