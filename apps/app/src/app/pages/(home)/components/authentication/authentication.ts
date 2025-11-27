import { Component } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';
import { AuthenticationForm } from './components/form';

@Component({
	selector: 'spartan-authentication-example',
	imports: [AuthenticationForm, HlmButton],
	host: {
		class: 'block',
	},
	template: `
		<div class="md:hidden">
			<img src="/assets/authentication-light.png" alt="Authentication" class="block dark:hidden" />
			<img src="/assets/authentication-dark.png" alt="Authentication" class="hidden dark:block" />
		</div>
		<div class="bg-background hidden overflow-hidden rounded-lg border shadow-md md:block md:shadow-xl">
			<div
				class="relative container flex h-[600px] flex-col items-center justify-center md:grid md:h-[800px] lg:max-w-none lg:grid-cols-2 lg:px-0"
			>
				<a hlmBtn variant="ghost" class="absolute top-4 right-4 md:top-8 md:right-8" href="/examples/authentication">
					Login
				</a>
				<div class="bg-muted text-primary relative hidden h-full flex-col border-r p-10 lg:flex dark:border-r-zinc-800">
					<div class="bg-primary/5 absolute inset-0"></div>
					<div class="relative z-20 flex items-center text-lg font-medium">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="mr-2 h-6 w-6"
						>
							<path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"></path>
						</svg>
						Acme Inc
					</div>
					<div class="relative z-20 mt-auto">
						<blockquote class="space-y-2">
							<p class="text-lg">
								“This library has saved me countless hours of work and helped me deliver stunning designs to my clients
								faster than ever before.”
							</p>
							<footer class="text-sm">Sofia Davis</footer>
						</blockquote>
					</div>
				</div>
				<div class="lg:p-8">
					<spartan-auth-example-form />
				</div>
			</div>
		</div>
	`,
})
export class AuthenticationExample {}
