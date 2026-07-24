import { ChangeDetectionStrategy, Component } from '@angular/core';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
	selector: 'spartan-sonner-position-example',
	imports: [HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="flex flex-wrap justify-center gap-2">
			<button hlmBtn variant="outline" (click)="showTopLeft()">Top Left</button>
			<button hlmBtn variant="outline" (click)="showTopCenter()">Top Center</button>
			<button hlmBtn variant="outline" (click)="showTopRight()">Top Right</button>
			<button hlmBtn variant="outline" (click)="showBottomLeft()">Bottom Left</button>
			<button hlmBtn variant="outline" (click)="showBottomCenter()">Bottom Center</button>
			<button hlmBtn variant="outline" (click)="showBottomRight()">Bottom Right</button>
		</div>
	`,
})
export class SonnerPositionExample {
	showTopLeft() {
		toast('Event has been created', {
			position: 'top-left',
		});
	}

	showTopCenter() {
		toast('Event has been created', {
			position: 'top-center',
		});
	}

	showTopRight() {
		toast('Event has been created', {
			position: 'top-right',
		});
	}

	showBottomLeft() {
		toast('Event has been created', {
			position: 'bottom-left',
		});
	}

	showBottomCenter() {
		toast('Event has been created', {
			position: 'bottom-center',
		});
	}

	showBottomRight() {
		toast('Event has been created', {
			position: 'bottom-right',
		});
	}
}
