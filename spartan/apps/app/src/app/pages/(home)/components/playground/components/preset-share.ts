import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCopy } from '@ng-icons/lucide';
import { BrnPopoverImports } from '@spartan-ng/brain/popover';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCommandImports } from '@spartan-ng/helm/command';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';

@Component({
	selector: 'spartan-preset-share',
	imports: [BrnPopoverImports, HlmPopoverImports, HlmCommandImports, NgIcon, HlmIcon, HlmButton, HlmLabel, HlmInput],
	providers: [provideIcons({ lucideCopy })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-popover sideOffset="5" align="end">
			<button id="save-presets" hlmPopoverTrigger hlmBtn variant="secondary">Share</button>

			<div hlmPopoverContent class="flex w-[520px] flex-col gap-4" *brnPopoverContent="let ctx">
				<div class="flex flex-col gap-1 text-center sm:text-left">
					<h3 class="text-lg font-semibold">Share preset</h3>
					<p class="text-muted-foreground text-sm">
						Anyone who has this link and an OpenAI account will be able to view this.
					</p>
				</div>
				<div class="relative flex-1">
					<label hlmLabel htmlFor="link" class="sr-only">Link</label>
					<input
						hlmInput
						id="link"
						value="https://platform.openai.com/playground/p/7bbKYQvsVkNmVb8NGcdUOLae?model=text-davinci-003"
						readOnly
						class="h-9 pr-10"
					/>
					<button hlmBtn type="submit" size="icon" variant="ghost" class="absolute top-1 right-1 size-7">
						<span class="sr-only">Copy</span>
						<ng-icon hlm name="lucideCopy" class="!size-3.5" />
					</button>
				</div>
			</div>
		</hlm-popover>
	`,
})
export class PresetShare {}
