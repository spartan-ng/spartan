import { Component } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmToaster } from '@spartan-ng/helm/sonner';
import { toast } from 'ngx-sonner';

@Component({
	selector: 'spartan-sonner-preview',
	imports: [HlmToaster, HlmButton],
	template: `
		<hlm-toaster />
		<button hlmBtn (click)="showToast()">Show Toast</button>
	`,
})
export class SonnerPreview {
	showToast() {
		toast('Event has been created', {
			description: 'Sunday, December 03, 2023 at 9:00 AM',
			action: {
				label: 'Undo',
				onClick: () => console.log('Undo'),
			},
		});
	}
}

export const defaultImports = `
import { toast } from 'ngx-sonner';
import { HlmToasterComponent } from '@spartan-ng/helm/sonner';
`;
export const defaultSkeleton = `
<hlm-toaster />
<button hlmBtn (click)="showToast()">Show Toast</button>
`;
