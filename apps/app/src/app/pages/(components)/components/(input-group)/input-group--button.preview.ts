import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSend } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmToasterImports } from '@spartan-ng/helm/sonner';
import { toast } from 'ngx-sonner';

@Component({
	selector: 'spartan-input-group-button-preview',
	imports: [HlmInputGroupImports, HlmIcon, NgIcon, HlmToasterImports],
	providers: [provideIcons({ lucideSend })],
	template: `
		<hlm-toaster />
		<div class="flex flex-col gap-4">
			<hlm-input-group>
				<input hlmInput />
				<button hlmSuffix><ng-icon hlm name="lucideSend" (click)="_send()" /></button>
			</hlm-input-group>
			<hlm-input-group>
				<input hlmInput />
				<button hlmSuffixAddon><ng-icon hlm name="lucideSend" (click)="_send()" /></button>
			</hlm-input-group>
		</div>
	`,
})
export class InputGroupButtonPreview {
	protected _send(): void {
		toast.success('Message successful sent');
	}
}
