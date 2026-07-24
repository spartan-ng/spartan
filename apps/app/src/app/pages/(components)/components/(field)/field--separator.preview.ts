import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { remixGithubFill } from '@ng-icons/remixicon';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-field-separator-preview',
	imports: [HlmFieldImports, HlmButtonImports, HlmInputImports, NgIcon, RouterLink],
	providers: [provideIcons({ remixGithubFill })],
	host: {
		class: 'w-full max-w-xs',
	},
	template: `
		<div hlmFieldGroup>
			<div hlmField>
				<label hlmFieldLabel for="field-separator-email">Email</label>
				<input hlmInput id="field-separator-email" type="email" placeholder="m@example.com" />
			</div>
			<div hlmField>
				<button hlmBtn type="submit">Login</button>
			</div>
			<hlm-field-separator>Or continue with</hlm-field-separator>
			<div hlmField>
				<button hlmBtn variant="outline" type="button">
					<ng-icon name="remixGithubFill" class="text-xl" />
					Login with GitHub
				</button>
				<p hlmFieldDescription class="text-center">
					Don't have an account?
					<a routerLink=".">Sign up</a>
				</p>
			</div>
		</div>
	`,
})
export class FieldSeparatorPreview {}
