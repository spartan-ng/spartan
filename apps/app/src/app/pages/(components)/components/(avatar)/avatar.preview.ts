import { Component } from '@angular/core';
import { HlmAvatarComponent, HlmAvatarFallbackDirective, HlmAvatarImageDirective } from '@spartan-ng/ui-avatar-helm';

@Component({
	selector: 'spartan-avatar-preview',
	imports: [HlmAvatarImageDirective, HlmAvatarComponent, HlmAvatarFallbackDirective],
	template: `
		<hlm-avatar variant="large">
			<img src="/assets/avatar.png" alt="spartan logo. Resembling a spartanic shield" hlmAvatarImage />
			<span class="bg-[#FD005B] text-white" hlmAvatarFallback>RG</span>
		</hlm-avatar>
	`,
})
export class AvatarPreviewComponent {}

export const defaultCode = `
import { Component } from '@angular/core';
import { HlmAvatarComponent, HlmAvatarFallbackDirective, HlmAvatarImageDirective } from '@spartan-ng/ui-avatar-helm';

@Component({
  selector: 'spartan-avatar-preview',
  standalone: true,
  imports: [HlmAvatarImageDirective, HlmAvatarComponent, HlmAvatarFallbackDirective],
  template: \`
    <hlm-avatar variant="large">
      <img src="/assets/avatar.png" alt="spartan logo. Resembling a spartanic shield" hlmAvatarImage />
      <span class="bg-[#FD005B] text-white" hlmAvatarFallback>RG</span>
    </hlm-avatar>
  \`,
})
export class AvatarPreviewComponent {}
`;

export const defaultImports = `
import { HlmAvatarImageDirective, HlmAvatarComponent, HlmAvatarFallbackDirective } from '@spartan-ng/ui-avatar-helm';
`;

export const defaultSkeleton = `
<hlm-avatar>
   <img src='/assets/avatar.png' alt='spartan logo. Resembling a spartanic shield' hlmAvatarImage />
   <span class='text-white bg-destructive' hlmAvatarFallback>RG</span>
</hlm-avatar>
`;
