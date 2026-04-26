import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';

@Component({
	selector: 'spartan-separator-menu',
	imports: [HlmSeparatorImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="flex items-center gap-2 text-sm md:gap-4">
			<div class="flex flex-col gap-1">
				<span class="font-medium">Settings</span>
				<span class="text-muted-foreground text-xs">Manage preferences</span>
			</div>
			<hlm-separator orientation="vertical" />
			<div class="flex flex-col gap-1">
				<span class="font-medium">Account</span>
				<span class="text-muted-foreground text-xs">Profile & security</span>
			</div>
			<hlm-separator orientation="vertical" class="hidden md:block" />
			<div class="hidden flex-col gap-1 md:flex">
				<span class="font-medium">Help</span>
				<span class="text-muted-foreground text-xs">Support & docs</span>
			</div>
		</div>
	`,
})
export class SeparatorMenuPreview {}
