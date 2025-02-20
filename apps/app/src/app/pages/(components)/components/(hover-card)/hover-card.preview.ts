import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCalendar } from '@ng-icons/lucide';
import { BrnHoverCardModule } from '@spartan-ng/brain/hover-card';
import { HlmAvatarModule } from '@spartan-ng/ui-avatar-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmHoverCardModule } from '@spartan-ng/ui-hovercard-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';

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

export const defaultCode = `
import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideCalendar } from '@ng-icons/lucide';
import { HlmAvatarModule } from '@spartan-ng/ui-avatar-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { BrnHoverCardModule } from '@spartan-ng/brain/hover-card';
import { HlmHoverCardModule } from '@spartan-ng/ui-hovercard-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';

@Component({
  selector: 'spartan-hover-card-preview',
  standalone: true,
  imports: [BrnHoverCardModule, HlmHoverCardModule, HlmButtonDirective, HlmIconDirective, HlmAvatarModule],
  providers: [provideIcons({ lucideCalendar })],
  template: \`
    <brn-hover-card>
      <button hlmBtn variant="link" brnHoverCardTrigger>&#64;analogjs</button>
      <hlm-hover-card-content *brnHoverCardContent class="w-80">
        <div class="flex justify-between space-x-4">
          <hlm-avatar variant="small" id="avatar-small">
            <img src="https://analogjs.org/img/logos/analog-logo.svg" alt="AnalogLogo" hlmAvatarImage />
            <span class="text-red-800 bg-red-600" hlmAvatarFallback>AN</span>
          </hlm-avatar>
          <div class="space-y-1">
            <h4 class="text-sm font-semibold">&#64;analogjs</h4>
            <p class="text-sm">The Angular meta-framework – build Angular applications faster.</p>
            <div class="flex items-center pt-2">
              <ng-icon hlm size="sm" name="lucideCalendar" class="mr-2 opacity-70" />
              <span class="text-xs text-muted-foreground">Joined December 2021</span>
            </div>
          </div>
        </div>
      </hlm-hover-card-content>
    </brn-hover-card>
  \`,
})
export class HoverCardPreviewComponent {}
`;

export const defaultImports = `
import {
  BrnHoverCardComponent,
  BrnHoverCardContentDirective,
  BrnHoverCardTriggerDirective,
} from '@spartan-ng/brain/hover-card';

import {
  HlmHoverCardContentComponent
} from '@spartan-ng/ui-hovercard-helm';
`;

export const defaultSkeleton = `
<brn-hover-card>
  <button hlmBtn variant="link" brnHoverCardTrigger>&#64;analogjs</button>
  <hlm-hover-card-content *brnHoverCardContent>The Angular meta-framework.</hlm-hover-card-content>
</brn-hover-card>
`;
