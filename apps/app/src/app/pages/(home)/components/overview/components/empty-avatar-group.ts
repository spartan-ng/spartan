import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';

@Component({
	selector: 'spartan-empty-avatar-group',
	imports: [HlmEmptyImports, HlmAvatarImports, HlmButton, NgIcon],
	providers: [provideIcons({ lucidePlus })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div hlmEmpty class="border border-dashed">
			<div hlmEmptyHeader>
				<div hlmEmptyMedia>
					<div
						class="[&>hlm-avatar]:ring-background flex -space-x-2 [&>hlm-avatar]:size-12 [&>hlm-avatar]:ring-2 [&>hlm-avatar]:grayscale"
					>
						<hlm-avatar class="size-12">
							<img src="https://picsum.photos/1000/800?grayscale&random=1" alt="avatar 1" hlmAvatarImage />
							<span class="bg-[#FD005B] text-white" hlmAvatarFallback>A1</span>
						</hlm-avatar>
						<hlm-avatar class="size-12">
							<img src="https://picsum.photos/1000/800?grayscale&random=2" alt="avatar 2" hlmAvatarImage />
							<span class="bg-[#FD005B] text-white" hlmAvatarFallback>A2</span>
						</hlm-avatar>
						<hlm-avatar class="size-12">
							<img src="https://picsum.photos/1000/800?grayscale&random=3" alt="avatar 3" hlmAvatarImage />
							<span class="bg-[#FD005B] text-white" hlmAvatarFallback>A3</span>
						</hlm-avatar>
					</div>
				</div>
				<div hlmEmptyTitle>No Team Members</div>
				<div hlmEmptyDescription>Invite your team to collaborate on this project.</div>
			</div>
			<div hlmEmptyContent>
				<button hlmBtn size="sm">
					<ng-icon hlm name="lucidePlus" />
					Invite Members
				</button>
			</div>
		</div>
	`,
})
export class EmptyAvatarGroup {}
