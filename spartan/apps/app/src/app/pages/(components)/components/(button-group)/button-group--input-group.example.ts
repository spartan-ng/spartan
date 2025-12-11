import { Component, signal } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideAudioLines, lucidePlus } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';

@Component({
	selector: 'spartan-button-group-input-group',
	imports: [HlmIconImports, HlmButtonImports, HlmButtonGroupImports, HlmInputGroupImports, HlmTooltipImports],
	providers: [provideIcons({ lucidePlus, lucideAudioLines })],
	template: `
		<div hlmButtonGroup class="[--radius:9999rem]">
			<div hlmButtonGroup>
				<button hlmBtn variant="outline" size="icon">
					<ng-icon hlm name="lucidePlus" size="sm" />
				</button>
			</div>
			<div hlmButtonGroup>
				<div hlmInputGroup>
					<input
						hlmInputGroupInput
						[placeholder]="voiceEnabled() ? 'Record and send audio...' : 'Send a message...'"
						[disabled]="voiceEnabled()"
					/>
					<div hlmInputGroupAddon align="inline-end">
						<button
							hlmInputGroupButton
							hlmTooltipTrigger="Voice Mode"
							size="icon-xs"
							[attr.data-active]="voiceEnabled()"
							[attr.aria-pressed]="voiceEnabled()"
							class="data-[active=true]:bg-orange-100 data-[active=true]:text-orange-700 dark:data-[active=true]:bg-orange-800 dark:data-[active=true]:text-orange-100"
							(click)="voiceEnabled.set(!voiceEnabled())"
						>
							<ng-icon hlm name="lucideAudioLines" size="sm" />
						</button>
					</div>
				</div>
			</div>
		</div>
	`,
})
export class ButtonGroupInputGroup {
	public readonly voiceEnabled = signal(false);
}
