import { Directive, input } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmTraceLine],hlm-trace-line',
	exportAs: 'hlmTraceLine',
	host: { 'data-slot': 'trace-line', '[attr.data-status]': 'status()' },
})
export class HlmTraceLine {
	public readonly status = input<'running' | 'error' | 'pending'>();

	constructor() {
		classes(
			() =>
				'spartan-trace-line text-muted-foreground [a:hover,button:hover]:text-foreground data-[status=error]:text-destructive data-[status=error]:in-[a:hover,button:hover]:text-destructive data-[status=running]:*:data-[slot=trace-title]:shimmer flex w-fit max-w-full min-w-0 items-center transition-colors data-[status=pending]:opacity-60 [a,button]:cursor-pointer',
		);
	}
}
