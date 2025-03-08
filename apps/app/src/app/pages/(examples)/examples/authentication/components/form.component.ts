import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideGithub, lucideLoaderCircle } from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { HlmSpinnerComponent } from '@spartan-ng/ui-spinner-helm';

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'auth-example-form',
	imports: [
		HlmButtonDirective,
		NgIcon,
		HlmIconDirective,
		HlmInputDirective,
		HlmSpinnerComponent,
		FormsModule,
		HlmLabelDirective,
	],
	host: {
		class: 'block',
	},
	providers: [provideIcons({ lucideGithub, lucideLoaderCircle })],
	template: `
		<div class="mx-auto w-full justify-center space-y-6 sm:w-[350px]">
			<div class="space-y-2 text-center">
				<h1 class="text-2xl font-semibold tracking-tight">Create an account</h1>
				<p class="text-muted-foreground text-sm">Enter your email below to create your account</p>
			</div>
			<div class="grid gap-6">
				<form (ngSubmit)="send()">
					<label hlmLabel class="sr-only" for="email">Email</label>
					<input
						hlmInput
						class="w-full"
						placeholder="Email"
						type="email"
						id="email"
						placeholder="name@example.com"
						autocomplete="off"
					/>
					<button hlmBtn [disabled]="isLoading()" class="mt-2 w-full" type="submit">
						@if (isLoading()) {
							<ng-icon hlm name="lucideLoaderCircle" size="sm" class="mr-2 animate-spin" />
						}
						Sign In with Email
					</button>
				</form>
				<div class="relative">
					<div class="absolute inset-0 flex items-center"><span class="w-full border-t"></span></div>
					<div class="relative flex justify-center text-xs uppercase">
						<span class="bg-background text-muted-foreground px-2">Or continue with</span>
					</div>
				</div>
				<button hlmBtn variant="outline" [disabled]="isLoading()">
					@if (isLoading()) {
						<ng-icon hlm name="lucideLoaderCircle" size="sm" class="mr-2 animate-spin" />
					} @else {
						<ng-icon hlm class="mr-2" size="sm" name="lucideGithub" />
					}
					GitHub
				</button>
			</div>
			<p class="text-muted-foreground text-center text-sm sm:px-8">
				By clicking continue, you agree to our
				<a class="hover:text-primary cursor-pointer underline underline-offset-4">Terms of Service</a>
				and
				<a class="hover:text-primary cursor-pointer underline underline-offset-4">Privacy Policy</a>
				.
			</p>
		</div>
	`,
})
export class AuthenticationFormComponent {
	public isLoading = signal(false);

	send() {
		this.isLoading.set(true);
		setTimeout(() => this.isLoading.set(false), 3000);
	}
}
