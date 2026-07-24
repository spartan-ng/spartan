import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideGalleryVerticalEnd } from '@ng-icons/lucide';
import { SignupForm } from './signup-form';

@Component({
	selector: 'spartan-signup-simple-reactive-form',
	imports: [SignupForm, NgIcon, RouterLink],
	providers: [provideIcons({ lucideGalleryVerticalEnd })],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'block',
	},
	styleUrl: '../../blocks-preview-default.css',
	template: `
		<div class="grid min-h-svh lg:grid-cols-2">
			<div class="flex flex-col gap-4 p-6 md:p-10">
				<div class="flex justify-center gap-2 md:justify-start">
					<a routerLink="." class="flex items-center gap-2 font-medium">
						<div class="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
							<ng-icon name="lucideGalleryVerticalEnd" class="text-base" />
						</div>
						Acme Inc.
					</a>
				</div>
				<div class="flex flex-1 items-center justify-center">
					<div class="w-full max-w-xs">
						<spartan-two-column-signup-form />
					</div>
				</div>
			</div>
			<div class="bg-muted relative hidden lg:block">
				<img
					src="https://images.unsplash.com/photo-1604076850742-4c7221f3101b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
					alt="Image"
					class="absolute inset-0 h-full w-full object-cover brightness-60 grayscale dark:brightness-[0.2] dark:grayscale"
				/>
			</div>
		</div>
	`,
})
export default class SignupTwoColumnReactiveFormPage {}
