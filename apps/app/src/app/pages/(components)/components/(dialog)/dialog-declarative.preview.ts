import { Component, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { BrnDialogContentDirective } from '@spartan-ng/brain/dialog';
import { HlmBadgeDirective } from '@spartan-ng/ui-badge-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import {
	HlmDialogComponent,
	HlmDialogContentComponent,
	HlmDialogDescriptionDirective,
	HlmDialogFooterComponent,
	HlmDialogHeaderComponent,
	HlmDialogTitleDirective,
} from '@spartan-ng/ui-dialog-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { HlmH4Directive, HlmMutedDirective } from '@spartan-ng/ui-typography-helm';
import { debounceTime, map } from 'rxjs/operators';

@Component({
	selector: 'spartan-dialog-declarative-preview',
	imports: [
		FormsModule,
		BrnDialogContentDirective,
		HlmDialogComponent,
		HlmDialogContentComponent,
		HlmDialogHeaderComponent,
		HlmDialogFooterComponent,
		HlmDialogTitleDirective,
		HlmDialogDescriptionDirective,
		HlmLabelDirective,
		HlmInputDirective,
		HlmButtonDirective,
		HlmBadgeDirective,
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
					[ngModel]="passphrase()"
					(ngModelChange)="passphrase.set($event)"
				/>
				<span hlmMuted>Hint: It's sparta</span>
			</label>
		</div>
		<hlm-dialog [state]="state()" (closed)="passphrase.set('')">
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
	protected readonly passphrase = signal<string>('');
	private readonly _debouncedState$ = toObservable(this.passphrase).pipe(
		debounceTime(500),
		map((passphrase) => (passphrase === 'sparta' ? 'open' : 'closed')),
	);
	protected readonly state = toSignal(this._debouncedState$, { initialValue: 'closed' as 'open' | 'closed' });
}

export const declarativeCode = `
import { Component, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { HlmBadgeDirective } from '@spartan-ng/ui-badge-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { BrnDialogContentDirective } from '@spartan-ng/brain/dialog';
import {
	HlmDialogComponent,
	HlmDialogContentComponent,
	HlmDialogDescriptionDirective,
	HlmDialogFooterComponent,
	HlmDialogHeaderComponent,
	HlmDialogTitleDirective,
} from '@spartan-ng/ui-dialog-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { HlmH4Directive, HlmMutedDirective } from '@spartan-ng/ui-typography-helm';
import { debounceTime, map } from 'rxjs';

@Component({
	selector: 'spartan-dialog-declarative-preview',
	standalone: true,
	imports: [
		FormsModule,
		BrnDialogContentDirective,

		HlmDialogComponent,
		HlmDialogContentComponent,
		HlmDialogHeaderComponent,
		HlmDialogFooterComponent,
		HlmDialogTitleDirective,
		HlmDialogDescriptionDirective,

		HlmLabelDirective,
		HlmInputDirective,
		HlmButtonDirective,
		HlmBadgeDirective,
		HlmMutedDirective,
		HlmH4Directive,
	],
	template: \`
		<div class="space-y-4">
			<p hlmH4>Enter passphrase to open dialog</p>
			<label hlmLabel>
				Passphrase
				<input
					name="passphrase"
					hlmInput
					[ngModelOptions]="{ standalone: true }"
					[ngModel]="passphrase()"
					(ngModelChange)="passphrase.set($event)"
				/>
				<span hlmMuted>Hint: It's sparta</span>
			</label>
		</div>
		<hlm-dialog [state]="state()" (closed)="passphrase.set('')">
			<hlm-dialog-content *brnDialogContent="let ctx">
				<hlm-dialog-header class="w-[250px]">
					<h3 hlmDialogTitle>Welcome to Sparta</h3>
					<p hlmDialogDescription>Enjoy declarative dialogs.</p>
				</hlm-dialog-header>
			</hlm-dialog-content>
		</hlm-dialog>
	\`,
})
export class DialogDeclarativePreviewComponent {
	protected readonly passphrase = signal<string>('');
	private readonly _debouncedState$ = toObservable(this.passphrase).pipe(
		debounceTime(500),
		map((passphrase) => (passphrase === 'sparta' ? 'open' : 'closed')),
	);
	protected readonly state = toSignal(this._debouncedState$);
}
`;
