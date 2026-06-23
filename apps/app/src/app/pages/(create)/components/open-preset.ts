import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideX } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { isPresetCode } from '@spartan-ng/registry';

@Component({
	selector: 'spartan-open-preset-dialog',
	imports: [FormsModule, HlmButton, HlmDialogImports, HlmInput, HlmLabel, NgIcon],
	providers: [provideIcons({ lucideCheck, lucideX })],
	template: `
		<hlm-dialog [state]="open()" (stateChange)="openChange.emit($event)">
			<hlm-dialog-content class="sm:max-w-md" *hlmDialogPortal="let ctx">
				<hlm-dialog-header>
					<h3 hlmDialogTitle>Open Preset</h3>
					<p hlmDialogDescription>Paste a preset code to load its configuration.</p>
				</hlm-dialog-header>
				<div class="grid gap-4 py-4">
					<div class="grid gap-3">
						<label hlmLabel for="preset-code">Preset Code</label>
						<div class="flex gap-2">
							<input
								hlmInput
								id="preset-code"
								[value]="_inputValue()"
								(input)="_inputValue.set($any($event.target).value)"
								placeholder="b0 or --preset b0"
								class="flex-1"
								[class.border-destructive]="!!_error()"
							/>
							<button hlmBtn size="sm" [disabled]="!_inputValue() || _inputValue().length < 2" (click)="_apply(ctx)">
								<ng-icon name="lucideCheck" class="mr-1" size="14" />
								Apply
							</button>
						</div>
						@if (_error()) {
							<p class="text-destructive text-xs">{{ _error() }}</p>
						}
					</div>
				</div>
				<hlm-dialog-footer>
					<button hlmBtn variant="outline" hlmDialogClose>
						<ng-icon name="lucideX" class="mr-1" size="14" />
						Cancel
					</button>
				</hlm-dialog-footer>
			</hlm-dialog-content>
		</hlm-dialog>
	`,
})
export class OpenPresetDialog {
	public readonly open = input(false);
	public readonly openChange = output<boolean>();
	public readonly apply = output<string>();

	protected readonly _inputValue = signal('');
	protected readonly _error = signal('');

	protected _apply(ctx: { close: () => void }): void {
		const raw = this._inputValue().trim();
		let code = raw;
		if (raw.startsWith('--preset ')) {
			code = raw.slice('--preset '.length).trim();
		}
		if (!isPresetCode(code)) {
			this._error.set('Invalid preset code. Must start with "b" (e.g., b0).');
			return;
		}
		this._error.set('');
		this.apply.emit(code);
		ctx.close();
	}
}
