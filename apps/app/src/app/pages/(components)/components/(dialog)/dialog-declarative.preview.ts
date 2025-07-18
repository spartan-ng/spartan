import { Component, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { BrnDialogContentDirective } from '@spartan-ng/brain/dialog';

import {
	HlmDialogComponent,
	HlmDialogContentComponent,
	HlmDialogDescriptionDirective,
	HlmDialogHeaderComponent,
	HlmDialogTitleDirective,
} from '@spartan-ng/helm/dialog';
import { HlmInputDirective } from '@spartan-ng/helm/input';
import { HlmLabelDirective } from '@spartan-ng/helm/label';
import { HlmH4Directive, HlmMutedDirective } from '@spartan-ng/helm/typography';
import { debounceTime, map } from 'rxjs/operators';

@Component({
	selector: 'spartan-dialog-declarative-preview',
	imports: [
		FormsModule,
		BrnDialogContentDirective,
		HlmDialogComponent,
		HlmDialogContentComponent,
		HlmDialogHeaderComponent,
		HlmDialogTitleDirective,
		HlmDialogDescriptionDirective,
		HlmLabelDirective,
		HlmInputDirective,
		HlmMutedDirective,
		HlmH4Directive,
	],
	template: `
		<div class="space-y-4">
			<p hlmH4>Enter passphrase to open dialog</p>
			<label hlmLabel>
				Passphrase
				<input
					name="passphrase"
					hlmInput
					[ngModelOptions]="{ standalone: true }"
					[ngModel]="_passphrase()"
					(ngModelChange)="_passphrase.set($event)"
				/>
				<span hlmMuted>Hint: It's sparta</span>
			</label>
		</div>
		<hlm-dialog [state]="_state()" (closed)="_passphrase.set('')">
			<hlm-dialog-content *brnDialogContent="let ctx">
				<hlm-dialog-header class="w-[250px]">
					<h3 hlmDialogTitle>Welcome to Sparta</h3>
					<p hlmDialogDescription>Enjoy declarative dialogs.</p>
				</hlm-dialog-header>
			</hlm-dialog-content>
		</hlm-dialog>
	`,
})
export class DialogDeclarativePreviewComponent {
	protected readonly _passphrase = signal<string>('');
	private readonly _debouncedState$ = toObservable(this._passphrase).pipe(
		debounceTime(500),
		map((passphrase) => (passphrase === 'sparta' ? 'open' : 'closed')),
	);
	protected readonly _state = toSignal(this._debouncedState$, { initialValue: 'closed' as 'open' | 'closed' });
}
