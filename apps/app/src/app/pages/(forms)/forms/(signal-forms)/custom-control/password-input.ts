import { ChangeDetectionStrategy, Component, computed, input, model, output, signal } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEye, lucideEyeOff } from '@ng-icons/lucide';
import { HlmInputGroup, HlmInputGroupImports } from '@spartan-ng/helm/input-group';

@Component({
	selector: 'spartan-password-input',
	imports: [HlmInputGroupImports, NgIcon],
	providers: [provideIcons({ lucideEye, lucideEyeOff })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [HlmInputGroup],
	template: `
		<input
			hlmInputGroupInput
			[id]="inputId()"
			[placeholder]="placeholder()"
			[value]="value()"
			[disabled]="disabled()"
			[readonly]="readonly()"
			autoComplete="current-password"
			[type]="_inputType()"
			(input)="value.set($event.target.value)"
			(blur)="touch.emit()"
		/>
		<hlm-input-group-addon align="inline-end">
			<button hlmInputGroupButton size="icon-xs" (click)="togglePasswordVisibility()">
				<ng-icon [name]="_icon()" />
			</button>
		</hlm-input-group-addon>
	`,
})
export class PasswordInput implements FormValueControl<string> {
	public readonly value = model<string>('');
	public readonly disabled = input<boolean>(false);
	public readonly readonly = input<boolean>(false);

	// use touch output in starting with Angular v22
	public readonly touch = output<void>();

	public readonly inputId = input<string>();
	public readonly placeholder = input<string>('********');

	protected readonly _inputType = signal<'text' | 'password'>('password');

	protected readonly _icon = computed(() => (this._inputType() === 'password' ? 'lucideEye' : 'lucideEyeOff'));

	public togglePasswordVisibility() {
		this._inputType.set(this._inputType() === 'password' ? 'text' : 'password');
	}
}

export const passwordInputCode = `
// password-input.ts
import { ChangeDetectionStrategy, Component, computed, input, model, output, signal } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEye, lucideEyeOff } from '@ng-icons/lucide';
import { HlmInputGroup, HlmInputGroupImports } from '@spartan-ng/helm/input-group';

@Component({
	selector: 'spartan-password-input',
	imports: [HlmInputGroupImports, NgIcon],
	providers: [provideIcons({ lucideEye, lucideEyeOff })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [HlmInputGroup],
	template: \`
		<input
			hlmInputGroupInput
			[id]="inputId()"
			[placeholder]="placeholder()"
			[value]="value()"
			[disabled]="disabled()"
			[readonly]="readonly()"
			autoComplete="current-password"
			[type]="_inputType()"
			(input)="value.set($event.target.value)"
			(blur)="touch.emit()"
		/>
		<hlm-input-group-addon align="inline-end">
			<button hlmInputGroupButton size="icon-xs" (click)="togglePasswordVisibility()">
				<ng-icon [name]="_icon()" />
			</button>
		</hlm-input-group-addon>
	\`,
})
export class PasswordInput implements FormValueControl<string> {
	public readonly value = model<string>('');
	public readonly disabled = input<boolean>(false);
	public readonly readonly = input<boolean>(false);

	// use touch output in starting with Angular v22
	public readonly touch = output<void>();

	public readonly inputId = input<string>();
	public readonly placeholder = input<string>('********');

	protected readonly _inputType = signal<'text' | 'password'>('password');

	protected readonly _icon = computed(() => (this._inputType() === 'password' ? 'lucideEye' : 'lucideEyeOff'));

	public togglePasswordVisibility() {
		this._inputType.set(this._inputType() === 'password' ? 'text' : 'password');
	}
}
`;
