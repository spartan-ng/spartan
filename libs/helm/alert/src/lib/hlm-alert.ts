import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ClassValue } from 'clsx';

const alertVariants = cva(
	'relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>[hlmAlertIcon]]:grid-cols-[calc(theme(spacing.1)*4)_1fr] grid-cols-[0_1fr] has-[>[hlmAlertIcon]]:gap-x-3 gap-y-0.5 items-start [&>[hlmAlertIcon]]:size-4 [&>[hlmAlertIcon]]:translate-y-0.5 [&>[hlmAlertIcon]]:text-current',
	{
		variants: {
			variant: {
				default: 'bg-card text-card-foreground',
				destructive:
					'text-destructive bg-card [&>[hlmAlertIcon]]:text-current [&>[hlmAlertDescription]]:text-destructive/90 [&>[hlmAlertDesc]]:text-destructive/90',
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
