import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBold, lucideItalic, lucideUnderline } from '@ng-icons/lucide';
import { BrnToggleDirective, BrnToggleGroupComponent } from '@spartan-ng/brain/toggle';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { HlmToggleDirective, HlmToggleGroupDirective } from '@spartan-ng/ui-toggle-helm';

@Component({
	selector: 'spartan-toggle-group-outline',
	standalone: true,
	imports: [
		BrnToggleDirective,
		BrnToggleGroupComponent,

		HlmIconDirective,
		HlmToggleDirective,
		HlmToggleGroupDirective,

		NgIcon,
	],
	providers: [provideIcons({ lucideBold, lucideItalic, lucideUnderline })],
	template: `
		<brn-toggle-group hlm multiple="true" nullable="true" variant="outline">
			<button aria-label="Bold" value="bold" hlmToggle>
				<ng-icon hlm size="sm" name="lucideBold" />
			</button>

			<button aria-label="Italic" value="italic" hlmToggle>
				<ng-icon hlm size="sm" name="lucideItalic" />
			</button>

			<button aria-label="Underline" value="underline" hlmToggle>
				<ng-icon hlm size="sm" name="lucideUnderline" />
			</button>
		</brn-toggle-group>
	`,
})
export class ToggleGroupOutlinePreviewComponent {}

export const outlineCode = `
import { Component } from '@angular/core';
import {
 HlmToggleDirective,
 HlmToggleGroupDirective,
} from '@spartan-ng/ui-toggle-helm';
import { BrnToggleDirective, BrnToggleGroupComponent } from '@spartan-ng/brain/toggle';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { provideIcons } from '@ng-icons/core';
import { lucideBold, lucideItalic, lucideUnderline } from '@ng-icons/lucide';

@Component({
  selector: 'spartan-toggle-group-outline',
  standalone: true,
  imports: [
	 BrnToggleDirective,
	 BrnToggleGroupComponent,
	 HlmToggleDirective,
	 HlmIconDirective,
	 HlmToggleGroupDirective,
	 NgIcon,
	],
  providers: [provideIcons({ lucideBold, lucideItalic, lucideUnderline })],
  template: \`
	<brn-toggle-group hlm multiple="true" nullable="true" variant="outline">
	 <button aria-label="Bold" value="bold" hlmToggle>
		 <ng-icon hlm size="sm" name="lucideBold" />
	 </button>

	 <button aria-label="Italic" value="italic" hlmToggle>
	   <ng-icon hlm size="sm" name="lucideItalic" />
	 </button>

	 <button aria-label="Underline" value="underline" hlmToggle>
	 	 <ng-icon hlm size="sm" name="lucideUnderline" />
	 </button>
	</brn-toggle-group>
  \`,
})
export class ToggleGroupOutlinePreviewComponent {}

`;
