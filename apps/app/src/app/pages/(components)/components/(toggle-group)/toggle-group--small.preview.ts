import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBold, lucideItalic, lucideUnderline } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmToggleGroup, HlmToggleGroupItem } from '@spartan-ng/helm/toggle-group';

@Component({
	selector: 'spartan-toggle-group-small',
	imports: [HlmIcon, HlmToggleGroupItem, HlmToggleGroup, NgIcon],
	providers: [provideIcons({ lucideBold, lucideItalic, lucideUnderline })],
	template: `
		<hlm-toggle-group type="single" nullable="true" size="sm">
			<button aria-label="Bold" value="bold" hlmToggleGroupItem>
				<ng-icon hlm size="sm" name="lucideBold" />
			</button>

			<button aria-label="Italic" value="italic" hlmToggleGroupItem>
				<ng-icon hlm size="sm" name="lucideItalic" />
			</button>

			<button aria-label="Underline" value="underline" hlmToggleGroupItem>
				<ng-icon hlm size="sm" name="lucideUnderline" />
			</button>
		</hlm-toggle-group>
	`,
})
export class ToggleGroupSmallPreview {}
