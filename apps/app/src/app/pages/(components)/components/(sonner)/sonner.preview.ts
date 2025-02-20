import { Component } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmToasterComponent } from '@spartan-ng/ui-sonner-helm';
import { toast } from 'ngx-sonner';

@Component({
	selector: 'spartan-sonner-preview',
	imports: [HlmToasterComponent, HlmButtonDirective],
	template: `
		<hlm-toaster />
		<button hlmBtn (click)="showToast()">Show Toast</button>
	`,
})
export class SonnerPreviewComponent {
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

export const defaultCode = `import { Component } from '@angular/core';
import { toast } from 'ngx-sonner';
import { HlmToasterComponent } from '@spartan-ng/ui-sonner-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

@Component({
	selector: 'spartan-sonner-preview',
	standalone: true,
	imports: [HlmToasterComponent, HlmButtonDirective],
	template: \`
	  <hlm-toaster />
	  <button hlmBtn (click)="showToast()">Show Toast</button>
	\`,
})
export class SonnerPreviewComponent {
  showToast() {
    toast('Event has been created', {
      description: 'Sunday, December 03, 2024 at 9:00 AM',
      action: {
        label: 'Undo',
        onClick: () => console.log('Undo'),
      }
    })
  }
}`;

export const defaultImports = `
import { toast } from 'ngx-sonner';
import { HlmToasterComponent } from '@spartan-ng/ui-sonner-helm';
`;
export const defaultSkeleton = `
<hlm-toaster />
<button (click)="toast('Hello world')">Show Toast</button>
`;
