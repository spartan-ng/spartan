import { computed, Directive, effect, EffectRef, inject, input, OnDestroy } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import { ClassValue } from 'clsx';
import { HlmFieldA11yService } from './hlm-field-aria.service';

@Directive({
	selector: '[hlmFieldDescription],hlm-field-description',
	host: {
		'data-slot': 'field-description',
		'[class]': '_computedClass()',
		'[attr.id]': '_computedId()',
	},
})
export class HlmFieldDescription implements OnDestroy {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	private static _nextId = 0;
	public readonly providedId = input<string | undefined>(undefined);
	private readonly _autoId = `hlm-field-description-${++HlmFieldDescription._nextId}`;
	protected readonly _computedId = computed(() => this.providedId() ?? this._autoId);

	protected readonly _computedClass = computed(() =>
		hlm(
			'text-muted-foreground text-sm leading-normal font-normal group-has-[[data-orientation=horizontal]]/field:text-balance',
			'last:mt-0 nth-last-2:-mt-1 [[data-variant=legend]+&]:-mt-1.5',
			'[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4',
			this.userClass(),
		),
	);

	private _registeredId?: string;
	private readonly _a11y = inject(HlmFieldA11yService, { optional: true, host: true });
	private readonly _cleanup: EffectRef | null = this._a11y
		? effect(() => {
				const a11y = this._a11y;
				if (!a11y) return;

				const id = this._computedId();
				if (this._registeredId && this._registeredId !== id) {
					a11y.unregisterDescription(this._registeredId);
				}

				if (this._registeredId !== id) {
					a11y.registerDescription(id);
					this._registeredId = id;
				}
			})
		: null;

	ngOnDestroy() {
		this._cleanup?.destroy();

		if (this._registeredId) {
			this._a11y?.unregisterDescription(this._registeredId);
		}
	}
}
