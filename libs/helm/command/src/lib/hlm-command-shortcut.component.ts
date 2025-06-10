import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	standalone: true,
	selector: 'hlm-command-shortcut',
	template: '<ng-content />',
	host: {
		class: 'text-muted-foreground ml-auto text-xs tracking-widest',
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmCommandShortcutComponent {}
