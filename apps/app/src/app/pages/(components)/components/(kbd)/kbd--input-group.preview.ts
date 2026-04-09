import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmKbdImports } from '@spartan-ng/helm/kbd';

@Component({
	selector: 'spartan-kbd-input-group-preview',
	imports: [HlmKbdImports, HlmInputGroupImports, NgIcon, HlmIcon],
	providers: [provideIcons({ lucideSearch })],
	template: `
		<div className="flex w-full max-w-xs flex-col gap-6">
			<div hlmInputGroup>
				<input hlmInputGroupInput placeholder="Search..." />
				<div hlmInputGroupAddon>
					<ng-icon hlmIcon name="lucideSearch" />
				</div>
				<div hlmInputGroupAddon align="inline-end">
					<kbd hlmKbd>⌘</kbd>
					<kbd hlmKbd>K</kbd>
				</div>
			</div>
		</div>
	`,
})
export class KbdInputGroupPreview {}
