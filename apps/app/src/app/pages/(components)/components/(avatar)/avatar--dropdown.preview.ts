import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';

@Component({
	selector: 'spartan-avatar-dropdown-preview',
	imports: [HlmAvatarImports, HlmDropdownMenuImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<button hlmBtn variant="ghost" size="icon" class="rounded-full" [hlmDropdownMenuTrigger]="menu">
			<hlm-avatar>
				<img hlmAvatarImage src="/assets/avatar.png" alt="@spartan-ui logo" />
				<span hlmAvatarFallback>RG</span>
			</hlm-avatar>
		</button>

		<ng-template #menu>
			<hlm-dropdown-menu>
				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem>Profile</button>
					<button hlmDropdownMenuItem>Billing</button>
					<button hlmDropdownMenuItem>Settings</button>
				</hlm-dropdown-menu-group>
				<hlm-dropdown-menu-separator />
				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem variant="destructive">Log out</button>
				</hlm-dropdown-menu-group>
			</hlm-dropdown-menu>
		</ng-template>
	`,
})
export class AvatarDropdownPreview {}
