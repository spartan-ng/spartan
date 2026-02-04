import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideCalendar } from '@ng-icons/lucide';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmHoverCardImports } from '@spartan-ng/helm/hover-card';
import { HlmIconImports } from '@spartan-ng/helm/icon';

@Component({
	selector: 'spartan-hover-card-preview',
	imports: [HlmHoverCardImports, HlmButtonImports, HlmIconImports, HlmAvatarImports],
	providers: [provideIcons({ lucideCalendar })],
	template: `
		<hlm-hover-card>
			<button hlmBtn variant="link" hlmHoverCardTrigger>&#64;analogjs</button>
			<hlm-hover-card-content *hlmHoverCardPortal class="w-80">
				<div class="flex justify-between space-x-4">
					<hlm-avatar size="sm" id="avatar-small">
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
		</hlm-hover-card>
	`,
})
export class HoverCardPreview {}

export const defaultImports = `
import { HlmHoverCardImports } from '@spartan-ng/helm/hover-card';
`;

export const defaultSkeleton = `
<hlm-hover-card>
  <button hlmBtn variant="link" hlmHoverCardTrigger>&#64;analogjs</button>
  <hlm-hover-card-content *hlmHoverCardPortal>The Angular meta-framework.</hlm-hover-card-content>
</hlm-hover-card>
`;
