import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideApple, lucideCreditCard } from '@ng-icons/lucide';
import { BrnRadioComponent } from '@spartan-ng/brain/radio-group';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { HlmRadioDirective, HlmRadioGroupComponent } from '@spartan-ng/ui-radiogroup-helm';

@Component({
	selector: 'spartan-radio-card-preview',
	standalone: true,
	providers: [provideIcons({ lucideCreditCard, lucideApple })],
	imports: [FormsModule, BrnRadioComponent, HlmRadioDirective, HlmRadioGroupComponent, NgIcon, HlmIconDirective],
	template: `
		<hlm-radio-group class="grid grid-cols-3 gap-4" [(ngModel)]="payment">
			<brn-radio hlm value="card" class="group space-x-0">
				<div
					class="border-muted bg-popover hover:bg-accent hover:text-accent-foreground group-data-[checked=true]:border-primary flex flex-col items-center justify-between rounded-md border-2 p-4"
				>
					<ng-icon hlm name="lucideCreditCard" class="mb-3" />
					<!-- FIXME style issue with short text -->
					Card
				</div>
			</brn-radio>
			<brn-radio hlm value="paypal" class="group space-x-0">
				<div
					class="border-muted bg-popover hover:bg-accent hover:text-accent-foreground group-data-[checked=true]:border-primary flex flex-col items-center justify-between rounded-md border-2 p-4"
				>
					<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="mb-3 size-6">
						<title>PayPal</title>
						<path
							d="M7.016 19.198h-4.2a.562.562 0 0 1-.555-.65L5.093.584A.692.692 0 0 1 5.776 0h7.222c3.417 0 5.904 2.488 5.846 5.5-.006.25-.027.5-.066.747A6.794 6.794 0 0 1 12.071 12H8.743a.69.69 0 0 0-.682.583l-.325 2.056-.013.083-.692 4.39-.015.087zM19.79 6.142c-.01.087-.01.175-.023.261a7.76 7.76 0 0 1-7.695 6.598H9.007l-.283 1.795-.013.083-.692 4.39-.134.843-.014.088H6.86l-.497 3.15a.562.562 0 0 0 .555.65h3.612c.34 0 .63-.249.683-.585l.952-6.031a.692.692 0 0 1 .683-.584h2.126a6.793 6.793 0 0 0 6.707-5.752c.306-1.95-.466-3.744-1.89-4.906z"
						/>
					</svg>
					PayPal
				</div>
			</brn-radio>
			<brn-radio hlm value="apple" class="group space-x-0">
				<div
					class="border-muted bg-popover hover:bg-accent hover:text-accent-foreground group-data-[checked=true]:border-primary flex flex-col items-center justify-between rounded-md border-2 p-4"
				>
					<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="mb-3 size-6">
						<title>Apple</title>
						<path
							d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
						/>
					</svg>
					Apple
				</div>
			</brn-radio>
		</hlm-radio-group>
	`,
})
export class RadioGroupCardComponent {
	public payment = 'card';
}

export const cardCode = `
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideIcons } from '@ng-icons/core';
import { lucideApple, lucideCreditCard } from '@ng-icons/lucide';
import { BrnRadioComponent } from '@spartan-ng/brain/radio-group';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { HlmRadioDirective, HlmRadioGroupComponent } from '@spartan-ng/ui-radiogroup-helm';

@Component({
	selector: 'spartan-radio-card-preview',
	standalone: true,
	providers: [provideIcons({ lucideCreditCard, lucideApple })],
	imports: [FormsModule, BrnRadioComponent, HlmRadioDirective, HlmRadioGroupComponent, HlmIconDirective],
	template: \`
		<hlm-radio-group class="grid grid-cols-3 gap-4" [(ngModel)]="payment">
			<brn-radio hlm value="card" class="group space-x-0">
				<div
					class="border-muted bg-popover hover:bg-accent hover:text-accent-foreground group-data-[checked=true]:border-primary flex flex-col items-center justify-between rounded-md border-2 p-4"
				>
					<ng-icon hlm name="lucideCreditCard" class="mb-3" />
					Card
				</div>
			</brn-radio>
			<brn-radio hlm value="paypal" class="group space-x-0">
				<div
					class="border-muted bg-popover hover:bg-accent hover:text-accent-foreground group-data-[checked=true]:border-primary flex flex-col items-center justify-between rounded-md border-2 p-4"
				>
					<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="mb-3 size-6">
						<title>PayPal</title>
						<path
							d="M7.016 19.198h-4.2a.562.562 0 0 1-.555-.65L5.093.584A.692.692 0 0 1 5.776 0h7.222c3.417 0 5.904 2.488 5.846 5.5-.006.25-.027.5-.066.747A6.794 6.794 0 0 1 12.071 12H8.743a.69.69 0 0 0-.682.583l-.325 2.056-.013.083-.692 4.39-.015.087zM19.79 6.142c-.01.087-.01.175-.023.261a7.76 7.76 0 0 1-7.695 6.598H9.007l-.283 1.795-.013.083-.692 4.39-.134.843-.014.088H6.86l-.497 3.15a.562.562 0 0 0 .555.65h3.612c.34 0 .63-.249.683-.585l.952-6.031a.692.692 0 0 1 .683-.584h2.126a6.793 6.793 0 0 0 6.707-5.752c.306-1.95-.466-3.744-1.89-4.906z"
						/>
					</svg>
					PayPal
				</div>
			</brn-radio>
			<brn-radio hlm value="apple" class="group space-x-0">
				<div
					class="border-muted bg-popover hover:bg-accent hover:text-accent-foreground group-data-[checked=true]:border-primary flex flex-col items-center justify-between rounded-md border-2 p-4"
				>
					<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="mb-3 size-6">
						<title>Apple</title>
						<path
							d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
						/>
					</svg>
					Apple
				</div>
			</brn-radio>
		</hlm-radio-group>
	\`,
})
export class RadioGroupCardComponent {
	public payment = 'card';
}
`;
