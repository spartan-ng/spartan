import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ClassValue } from 'clsx';

const alertVariants = cva(
	'relative w-full items-start gap-y-0.5 rounded-lg border px-4 py-3 text-sm has-[>[hlmAlertIcon]]:grid has-[>[hlmAlertIcon]]:grid-cols-[calc(theme(spacing.1)*4)_1fr] has-[>[hlmAlertIcon]]:gap-x-3 [&>[hlmAlertIcon]]:size-4 [&>[hlmAlertIcon]]:translate-y-0.5 [&>[hlmAlertIcon]]:text-current',
	{
		variants: {
			variant: {
				default: 'bg-card text-card-foreground',
				destructive:
					'text-destructive bg-card [&>[hlmAlertDescription]]:text-destructive/90 [&>[hlmAlertDesc]]:text-destructive/90 [&>[hlmAlertIcon]]:text-current',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	},
);

export type AlertVariants = VariantProps<typeof alertVariants>;

@Directive({
	selector: '[hlmAlert]',
	host: {
		role: 'alert',
		'[class]': '_computedClass()',
	},
})
export class HlmAlert {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm(alertVariants({ variant: this.variant() }), this.userClass()));

	public readonly variant = input<AlertVariants['variant']>('default');
}
