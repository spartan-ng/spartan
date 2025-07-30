import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCalendar } from '@ng-icons/lucide';
import { BrnHoverCardModule } from '@spartan-ng/brain/hover-card';
import { HlmAvatarModule } from '@spartan-ng/helm/avatar';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import { HlmHoverCardModule } from '@spartan-ng/helm/hover-card';
import { HlmIconDirective } from '@spartan-ng/helm/icon';

@Component({
	selector: 'spartan-hover-card-preview',
	imports: [BrnHoverCardModule, HlmHoverCardModule, HlmButtonDirective, NgIcon, HlmIconDirective, HlmAvatarModule],
	providers: [provideIcons({ lucideCalendar })],
	template: `
		<brn-hover-card>
			<button hlmBtn variant="link" brnHoverCardTrigger>&#64;analogjs</button>
			<hlm-hover-card-content *brnHoverCardContent class="w-80">
				<div class="flex justify-between space-x-4">
					<hlm-avatar variant="small" id="avatar-small">
						<img src="https://analogjs.org/img/logos/analog-logo.svg" alt="AnalogLogo" hlmAvatarImage />
						<span class="bg-red-600 text-red-800" hlmAvatarFallback>AN</span>
					</hlm-avatar>
					<div class="space-y-1">
						<h4 class="text-sm font-semibold">&#64;analogjs</h4>
						<p class="text-sm">The Angular meta-framework – build Angular applications faster.</p>
						<div class="flex items-center pt-2">
							<ng-icon hlm size="sm" name="lucideCalendar" class="mr-2 opacity-70" />
							<span class="text-muted-foreground text-xs">Joined December 2021</span>
						</div>
					</div>
				</div>
			</hlm-hover-card-content>
		</brn-hover-card>
	`,
})
export class HoverCardPreviewComponent {}

export const defaultImports = `
import {
  BrnHoverCardComponent,
  BrnHoverCardContentDirective,
  BrnHoverCardTriggerDirective,
} from '@spartan-ng/brain/hover-card';

import {
  HlmHoverCardContentComponent
} from '@spartan-ng/helm/hover-card';
`;

export const defaultSkeleton = `
<brn-hover-card>
  <button hlmBtn variant="link" brnHoverCardTrigger>&#64;analogjs</button>
  <hlm-hover-card-content *brnHoverCardContent>The Angular meta-framework.</hlm-hover-card-content>
</brn-hover-card>
`;
