import { Component, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { BrnDialogImports } from '@spartan-ng/brain/dialog';

import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmTypographyImports } from '@spartan-ng/helm/typography';
import { debounceTime, map } from 'rxjs/operators';

@Component({
	selector: 'spartan-dialog-declarative-preview',
	imports: [FormsModule, BrnDialogImports, HlmDialogImports, HlmLabelImports, HlmInputImports, HlmTypographyImports],
	template: `
		<div class="mt-6 space-y-4">
			<p hlmH4>Enter passphrase to open dialog</p>
			<div class="flex flex-col gap-2">
				<label hlmLabel for="passphrase" class="px-1">Passphrase</label>
				<input
					id="passphrase"
					name="passphrase"
					hlmInput
					[ngModelOptions]="{ standalone: true }"
					[ngModel]="_passphrase()"
					(ngModelChange)="_passphrase.set($event)"
				/>
				<p hlmMuted class="px-1">Hint: It's sparta</p>
			</div>
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
export class DialogDeclarativePreview {
	protected readonly _passphrase = signal<string>('');
	private readonly _debouncedState$ = toObservable(this._passphrase).pipe(
		debounceTime(500),
		map((passphrase) => (passphrase === 'sparta' ? 'open' : 'closed')),
	);
	protected readonly _state = toSignal(this._debouncedState$, { initialValue: 'closed' as 'open' | 'closed' });
}
