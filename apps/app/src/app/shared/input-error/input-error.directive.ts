import { Directive, Injector, type OnInit, effect, inject, untracked } from '@angular/core';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { SignalInputDirective, SignalInputErrorDirective } from 'ng-signal-forms';

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '[ngModel][formField]',
	hostDirectives: [SignalInputErrorDirective],
	standalone: true,
})
export class SpartanInputErrorDirective implements OnInit {
	private readonly _injector = inject(Injector);
	private readonly _label = inject(HlmLabelDirective, { skipSelf: true, optional: true });
	private readonly _signalInput = inject(SignalInputDirective, { optional: true });

	ngOnInit() {
		effect(
			() => {
				const touchedState = this._signalInput?.formField?.touchedState();
				const errors = this._signalInput?.formField?.errors() ?? {};
				untracked(() => {
					if (touchedState === 'TOUCHED' && Object.values(errors).length > 0) {
						if (this._label) this._label.setError(true);
					} else {
						if (this._label) this._label.setError('auto');
					}
				});
			},
			{
				injector: this._injector,
			},
		);
	}
}
