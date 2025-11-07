import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUp } from '@ng-icons/lucide';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';

@Component({
	selector: 'spartan-spinner-input-group-preview',
	imports: [HlmSpinnerImports, HlmInputGroupImports, NgIcon],
	providers: [provideIcons({ lucideArrowUp })],
	template: `
		<div class="flex w-full max-w-md flex-col gap-4">
			<hlm-input-group>
				<input hlmInputGroupInput placeholder="Send a message..." disabled />
				<hlm-input-group-addon align="inline-end">
					<hlm-spinner />
				</hlm-input-group-addon>
			</hlm-input-group>
			<hlm-input-group>
				<textarea hlmInputGroupTextarea placeholder="Send a message..." disabled></textarea>
				<hlm-input-group-addon align="block-end">
					<hlm-spinner />
					Validating...
					<button class="ml-auto" hlmInputGroupButton variant="default">
						<ng-icon name="lucideArrowUp" />
						<span class="sr-only">Send</span>
					</button>
				</hlm-input-group-addon>
			</hlm-input-group>
		</div>
	`,
})
export class SpartanSpinnerInputGroupPreview {}
