import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';

@Component({
	selector: 'spartan-rich-filter-field-close',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgIcon, HlmButtonImports, HlmIconImports],
	providers: [provideIcons({ lucideX })],
	host: {
		style: 'display: contents',
	},
	template: `
		<button (click)="onCloseField.emit()" hlmBtn variant="outline" size="icon" class="rounded-l-none border-l-0">
			<ng-icon name="lucideX" />
		</button>
	`,
})
export class FieldClose {
	readonly onCloseField = output<void>();
}
