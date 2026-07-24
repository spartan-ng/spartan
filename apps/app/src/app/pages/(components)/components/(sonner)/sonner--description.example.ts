import { ChangeDetectionStrategy, Component } from '@angular/core';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
	selector: 'spartan-sonner-description-example',
	imports: [HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<button hlmBtn variant="outline" (click)="showToast()">Show Toast</button>
	`,
})
export class SonnerDescriptionExample {
	showToast() {
		toast('Event has been created', {
			description: 'Monday, January 3rd at 6:00pm',
		});
	}
}
