import { Component, signal } from '@angular/core';
import type { BrnDialogState } from '@spartan-ng/brain/dialog';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';

const STORAGE_KEY = 'spartan-create-welcome-dismissed';

@Component({
	selector: 'spartan-welcome-dialog',
	imports: [HlmButton, HlmDialogImports],
	template: `
		<hlm-dialog [state]="_open()" (stateChange)="_open.set($event)">
			<hlm-dialog-content class="sm:max-w-md" *hlmDialogPortal="let ctx">
				<hlm-dialog-header>
					<h3 hlmDialogTitle>Build your own spartan</h3>
					<p hlmDialogDescription>
						Customize your design system — pick styles, colors, fonts, and more. Then copy the CLI command to use it in
						your project.
					</p>
				</hlm-dialog-header>
				<div class="text-muted-foreground py-4 text-sm">
					<ul class="list-disc space-y-1 pl-5">
						<li>Choose from 6 component styles</li>
						<li>Pick colors, fonts, and icons</li>
						<li>Live preview to see changes instantly</li>
						<li>Share your preset with a short code</li>
					</ul>
				</div>
				<hlm-dialog-footer>
					<button hlmBtn (click)="_dismiss(ctx)">Get Started</button>
				</hlm-dialog-footer>
			</hlm-dialog-content>
		</hlm-dialog>
	`,
})
export class WelcomeDialog {
	protected readonly _open = signal<BrnDialogState>(
		typeof localStorage !== 'undefined' && !localStorage.getItem(STORAGE_KEY) ? 'open' : 'closed',
	);

	protected _dismiss(ctx: { close: () => void }): void {
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem(STORAGE_KEY, 'true');
		}
		ctx.close();
	}
}
