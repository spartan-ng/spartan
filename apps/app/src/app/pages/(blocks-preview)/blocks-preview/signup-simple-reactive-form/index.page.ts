import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { SignupForm } from './signup-form';

@Component({
	selector: 'spartan-signup-simple-reactive-form',
	imports: [SignupForm],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'block',
	},
	styleUrl: '../../blocks-preview-default.css',
	template: `
		<div class="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
			<div class="w-full max-w-sm">
				<spartan-simple-signup-form />
			</div>
		</div>
	`,
})
export default class SignupSimpleReactiveFormPage {}
