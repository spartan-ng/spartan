import { Component } from '@angular/core';
import { BrnSeparatorComponent } from '@spartan-ng/brain/separator';
import { HlmSeparatorDirective } from '@spartan-ng/ui-separator-helm';

@Component({
	selector: 'spartan-separator-preview',
	imports: [HlmSeparatorDirective, BrnSeparatorComponent],
	template: `
		<div>
			<div class="space-y-1">
				<h4 class="text-sm font-medium leading-none">Radix Primitives</h4>
				<p class="text-muted-foreground text-sm">An open-source UI component library.</p>
			</div>
			<brn-separator hlmSeparator class="my-4" />
			<div class="flex h-5 items-center space-x-4 text-sm">
				<div>Blog</div>
				<brn-separator decorative hlmSeparator orientation="vertical" />
				<div>Docs</div>
				<brn-separator decorative hlmSeparator orientation="vertical" />
				<div>Source</div>
			</div>
		</div>
	`,
})
export class SeparatorPreviewComponent {}

export const defaultCode = `
import { Component } from '@angular/core';
import { HlmSeparatorDirective } from '@spartan-ng/ui-separator-helm';
import { BrnSeparatorComponent } from '@spartan-ng/brain/separator';

@Component({
  selector: 'spartan-separator-preview',
  standalone: true,
  imports: [HlmSeparatorDirective, BrnSeparatorComponent],
  template: \`
    <div>
      <div class="space-y-1">
        <h4 class="text-sm font-medium leading-none">Radix Primitives</h4>
        <p class="text-sm text-muted-foreground">An open-source UI component library.</p>
      </div>
      <brn-separator hlmSeparator class="my-4" />
      <div class="flex items-center h-5 text-sm space-x-4">
        <div>Blog</div>
        <brn-separator decorative hlmSeparator orientation="vertical" />
        <div>Docs</div>
        <brn-separator decorative hlmSeparator orientation="vertical" />
        <div>Source</div>
      </div>
    </div>
  \`,
})
export class SeparatorPreviewComponent {}
`;

export const defaultImports = `
import { HlmSeparatorDirective } from '@spartan-ng/ui-separator-helm';
import { BrnSeparatorComponent } from '@spartan-ng/brain/separator';
`;
export const defaultSkeleton = `
<brn-separator hlmSeparator/>
`;
