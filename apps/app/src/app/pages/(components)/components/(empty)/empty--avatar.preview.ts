import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMessageCircle } from '@ng-icons/lucide';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';

@Component({
	selector: 'spartan-empty-avatar',
	imports: [NgIcon, HlmButton, HlmEmptyImports, HlmAvatarImports],
	providers: [provideIcons({ lucideMessageCircle })],
	template: `
		<div hlmEmpty>
			<div hlmEmptyHeader>
				<div hlmEmptyMedia>
					<hlm-avatar class="size-12">
						<img src="/assets/avatar.png" alt="spartan logo. Resembling a spartanic shield" hlmAvatarImage />
						<span class="bg-[#FD005B] text-white" hlmAvatarFallback>RG</span>
					</hlm-avatar>
				</div>
				<div hlmEmptyTitle>User Offline</div>
				<div hlmEmptyDescription>
					This user is currently offline. You can leave a message to notify them or try again later.
				</div>
			</div>
			<div hlmEmptyContent>
				<button hlmBtn size="sm">
					<ng-icon hlm name="lucideMessageCircle" />
					Leave message
				</button>
			</div>
		</div>
	`,
})
export class EmptyAvatar {}
