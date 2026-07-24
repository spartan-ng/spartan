import { Component, computed, signal } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmToggleGroupImports } from '@spartan-ng/helm/toggle-group';

@Component({
	selector: 'spartan-card-spacing',
	imports: [HlmCardImports, HlmLabelImports, HlmInputImports, HlmButtonImports, HlmToggleGroupImports],
	host: { class: 'w-full max-w-md grid gap-4' },
	template: `
		<hlm-toggle-group type="single" size="sm" variant="outline" spacing="2" [(value)]="spacing">
			@for (space of spacingOptions; track $index) {
				<button hlmToggleGroupItem [value]="space.value" [aria-label]="'Toggle ' + space.label">
					{{ space.label }}
				</button>
			}
		</hlm-toggle-group>

		<hlm-card class="w-full max-w-sm" [class]="spacingClass()">
			<hlm-card-header>
				<h3 hlmCardTitle>Login to your account</h3>
				<p hlmCardDescription>Enter your email below to login to your account</p>

				<div hlmCardAction>
					<button hlmBtn variant="link">Sign Up</button>
				</div>
			</hlm-card-header>

			<div hlmCardContent>
				<form id="login-form">
					<div class="flex flex-col gap-6">
						<div class="grid gap-2">
							<label hlmLabel for="email">Email</label>
							<input type="email" id="email" placeholder="m@example.com" required hlmInput />
						</div>

						<div class="grid gap-2">
							<div class="flex items-center">
								<label hlmLabel for="password">Password</label>
								<a href="#" class="ml-auto inline-block text-sm underline-offset-4 hover:underline">
									Forgot your password?
								</a>
							</div>
							<input type="password" id="password" hlmInput />
						</div>
					</div>
				</form>
			</div>

			<hlm-card-footer class="flex-col gap-2">
				<button hlmBtn type="submit" class="w-full" form="login-form">Login</button>
				<button hlmBtn variant="outline" class="w-full">Login with Google</button>
			</hlm-card-footer>
		</hlm-card>
	`,
})
export class CardSpacing {
	public readonly spacing = signal('4');
	public readonly spacingOptions = [
		{
			className: '[--card-spacing:--spacing(4)]',
			label: '16px',
			value: '4',
		},
		{
			className: '[--card-spacing:--spacing(5)]',
			label: '20px',
			value: '5',
		},
		{
			className: '[--card-spacing:--spacing(6)]',
			label: '24px',
			value: '6',
		},
		{
			className: '[--card-spacing:--spacing(8)]',
			label: '32px',
			value: '8',
		},
	];

	public readonly spacingClass = computed(
		() => this.spacingOptions.find((option) => option.value === this.spacing())?.className,
	);
}
