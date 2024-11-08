import { Component } from '@angular/core';
import { BrnSelectImports } from '@spartan-ng/ui-select-brain';
import { HlmSelectImports } from '@spartan-ng/ui-select-helm';

@Component({
	selector: 'spartan-select-preview',
	standalone: true,
	imports: [BrnSelectImports, HlmSelectImports],
	template: `
		<brn-select class="inline-block" placeholder="Select an option">
			<hlm-select-trigger class="w-56">
				<hlm-select-value />
			</hlm-select-trigger>
			<hlm-select-content>
				<hlm-option value="Refresh">Refresh</hlm-option>
				<hlm-option value="Settings">Settings</hlm-option>
				<hlm-option value="Help">Help</hlm-option>
				<hlm-option value="Signout">Sign out</hlm-option>
			</hlm-select-content>
		</brn-select>
	`,
})
export class SelectPreviewComponent {}

export const defaultCode = `
import { Component } from '@angular/core';
import { BrnSelectImports } from '@spartan-ng/ui-select-brain';
import { HlmSelectImports } from '@spartan-ng/ui-select-helm';

@Component({
  selector: 'spartan-select-preview',
  standalone: true,
  imports: [BrnSelectImports, HlmSelectImports],
  template: \`
    <brn-select class="inline-block" placeholder="Select an option">
      <hlm-select-trigger class="w-56">
        <hlm-select-value />
      </hlm-select-trigger>
      <hlm-select-content>
        <hlm-option value="Refresh">Refresh</hlm-option>
        <hlm-option value="Settings">Settings</hlm-option>
        <hlm-option value="Help">Help</hlm-option>
        <hlm-option value="Signout">Sign out</hlm-option>
      </hlm-select-content>
    </brn-select>
  \`,
})
export class SelectPreviewComponent {}
`;

export const defaultImports = `
import { Component } from '@angular/core';
import { BrnSelectImports } from '@spartan-ng/ui-select-brain';
import { HlmSelectImports } from '@spartan-ng/ui-select-helm';
`;

export const defaultSkeleton = `
<brn-select class="inline-block" placeholder="Select an option">
	<hlm-select-trigger>
		<hlm-select-value />
	</hlm-select-trigger>
	<hlm-select-content class="w-56">
			<hlm-option value="Refresh">Refresh</hlm-option>
			<hlm-option value="Settings">Settings</hlm-option>
			<hlm-option value="Help">Help</hlm-option>
			<hlm-option value="Signout">Sign out</hlm-option>
	</hlm-select-content>
</brn-select>
`;

export const defaultStyles = `
@import '@angular/cdk/overlay-prebuilt.css';
`;
