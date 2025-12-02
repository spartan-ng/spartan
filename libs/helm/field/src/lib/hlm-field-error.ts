import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-field-error',
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div role="alert" data-slot="field-error" [class]="_computedClass()">
			<ng-content>
				@if (_uniqueErrors().length === 1) {
					{{ _uniqueErrors()[0]?.message }}
				} @else if (_uniqueErrors().length > 1) {
					<ul class="ml-4 flex list-disc flex-col gap-1">
						@for (error of _uniqueErrors(); track $index) {
							@if (error?.message) {
								<li>{{ error?.message }}</li>
							}
						}
					</ul>
				}
			</ng-content>
		</div>
	`,
})
export class HlmFieldError {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	public readonly error = input<Array<{ message: string } | undefined>>();

	protected readonly _uniqueErrors = computed(() => {
		const errors = this.error();
		if (!errors?.length) {
			return [];
		}

		return [...new Map(errors.map((err) => [err?.message, err])).values()];
	});

	protected readonly _computedClass = computed(() => hlm('text-destructive text-sm font-normal', this.userClass()));
}
