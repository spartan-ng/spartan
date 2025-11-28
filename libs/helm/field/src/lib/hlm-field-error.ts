import { ChangeDetectionStrategy, Component, computed, effect, EffectRef, Host, input, OnDestroy, Optional } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import { ClassValue } from 'clsx';
import { HlmFieldA11yService } from './hlm-field-aria.service';

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
	host: {
		'[attr.id]': '_computedId()',
	},
})
export class HlmFieldError implements OnDestroy {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	public readonly error = input<Array<{ message: string } | undefined>>();
	private static _nextId = 0;
	private readonly _autoId = `hlm-field-error-${++HlmFieldError._nextId}`;
	public readonly _providedId = input<string | undefined>(undefined);
	protected readonly _computedId = computed(() => this._providedId() ?? this._autoId);

	protected readonly _uniqueErrors = computed(() => {
		const errors = this.error();
		if (!errors?.length) {
			return [];
		}

		return [...new Map(errors.map((err) => [err?.message, err])).values()];
	});

	protected readonly _computedClass = computed(() => hlm('text-destructive text-sm font-normal', this.userClass()));

	private _registeredId?: string;
	private readonly _cleanup: EffectRef | null;

	constructor(@Optional() @Host() private readonly _a11y: HlmFieldA11yService | null) {
		if (!this._a11y) {
			this._cleanup = null;
			return;
		}

		this._cleanup = effect(() => {
			const a11y = this._a11y;
			if (!a11y) return;

			const id = this._computedId();
			if (this._registeredId && this._registeredId !== id) {
				a11y.unregisterError(this._registeredId);
			}

			if (this._registeredId !== id) {
				a11y.registerError(id);
				this._registeredId = id;
			}
		});
	}

	ngOnDestroy() {
		this._cleanup?.destroy();

		if (this._registeredId) {
			this._a11y?.unregisterError(this._registeredId);
		}
	}
}
