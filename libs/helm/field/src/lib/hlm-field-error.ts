import { Component, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-field-error',
	template: `
		<div role="alert" data-slot="field-error" [class]="_computedClass()">
			<ng-content>
				@if (error() && error()?.length === 1) {
					{{ error()![0]?.message }}
				} @else if (error() && error()!.length > 1) {
					<ul class="ml-4 flex list-disc flex-col gap-1">
						@for (error of error()!; track $index) {
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

	protected readonly _computedClass = computed(() => hlm('text-destructive text-sm font-normal', this.userClass()));
}
