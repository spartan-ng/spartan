import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBold, lucideItalic, lucideUnderline } from '@ng-icons/lucide';
import { BrnToggleGroupComponent, BrnToggleGroupItemDirective } from '@spartan-ng/brain/toggle-group';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { HlmToggleGroupDirective, HlmToggleGroupItemDirective } from '@spartan-ng/ui-toggle-group-helm';

@Component({
	selector: 'spartan-toggle-group-small',
	standalone: true,
	imports: [
		BrnToggleGroupItemDirective,
		BrnToggleGroupComponent,
		HlmIconDirective,
		HlmToggleGroupItemDirective,
		HlmToggleGroupDirective,
		NgIcon,
	],
	providers: [provideIcons({ lucideBold, lucideItalic, lucideUnderline })],
	template: `
		<brn-toggle-group hlm multiple="false" nullable="true" size="sm">
			<button aria-label="Bold" value="bold" hlmToggleGroupItem>
				<ng-icon hlm size="sm" name="lucideBold" />
			</button>

			<button aria-label="Italic" value="italic" hlmToggleGroupItem>
				<ng-icon hlm size="sm" name="lucideItalic" />
			</button>

			<button aria-label="Underline" value="underline" hlmToggleGroupItem>
				<ng-icon hlm size="sm" name="lucideUnderline" />
			</button>
		</brn-toggle-group>
	`,
})
export class ToggleGroupSmallPreviewComponent {}

export const smallCode = `
import { Component } from '@angular/core';
import {
 HlmToggleGroupItemDirective,
 HlmToggleGroupDirective,
} from '@spartan-ng/ui-toggle-group-helm';
import { BrnToggleGroupItemDirective, BrnToggleGroupComponent } from '@spartan-ng/brain/toggle-group';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { provideIcons } from '@ng-icons/core';
import { lucideBold, lucideItalic, lucideUnderline } from '@ng-icons/lucide';

@Component({
  selector: 'spartan-toggle-group-small',
  standalone: true,
  imports: [
	 BrnToggleGroupItemDirective,
	 BrnToggleGroupComponent,
	 HlmIconDirective,
	 HlmToggleGroupItemDirective,
	 HlmToggleGroupDirective,
	 NgIcon,
	],
  providers: [provideIcons({ lucideBold, lucideItalic, lucideUnderline })],
  template: \`
	<brn-toggle-group hlm multiple="false" nullable="true" size="sm">
	 <button aria-label="Bold" value="bold" hlmToggleGroupItem>
		 <ng-icon hlm size="sm" name="lucideBold" />
	 </button>

	 <button aria-label="Italic" value="italic" hlmToggleGroupItem>
	   <ng-icon hlm size="sm" name="lucideItalic" />
	 </button>

	 <button aria-label="Underline" value="underline" hlmToggleGroupItem>
	 	 <ng-icon hlm size="sm" name="lucideUnderline" />
	 </button>
	</brn-toggle-group>
  \`,
})
export class ToggleGroupSmallPreviewComponent {}

`;
