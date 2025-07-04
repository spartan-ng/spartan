import { Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideChevronDown } from '@ng-icons/lucide';
import { BrnCommandImports } from '@spartan-ng/brain/command';
import { BrnPopoverComponent, BrnPopoverContentDirective, BrnPopoverTriggerDirective } from '@spartan-ng/brain/popover';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import {
	HlmCardContentDirective,
	HlmCardDescriptionDirective,
	HlmCardDirective,
	HlmCardFooterDirective,
	HlmCardHeaderDirective,
	HlmCardTitleDirective,
} from '@spartan-ng/helm/card';
import { HlmCommandImports } from '@spartan-ng/helm/command';
import { HlmIconDirective } from '@spartan-ng/helm/icon';
import { HlmInputDirective } from '@spartan-ng/helm/input';
import { HlmLabelDirective } from '@spartan-ng/helm/label';
import { HlmPopoverContentDirective } from '@spartan-ng/helm/popover';

type Framework = { label: string; value: string };

@Component({
	selector: 'spartan-card-preview',
	imports: [
		BrnCommandImports,
		HlmCommandImports,
		NgIcon,
		HlmIconDirective,
		BrnPopoverComponent,
		BrnPopoverTriggerDirective,
		BrnPopoverContentDirective,
		HlmPopoverContentDirective,
		HlmCardDirective,
		HlmCardHeaderDirective,
		HlmCardTitleDirective,
		HlmCardDescriptionDirective,
		HlmCardContentDirective,
		HlmLabelDirective,
		HlmInputDirective,
		HlmCardFooterDirective,
		HlmButtonDirective,
	],
	providers: [provideIcons({ lucideCheck, lucideChevronDown })],
	template: `
		<section class="w-80" hlmCard>
			<div hlmCardHeader>
				<h3 hlmCardTitle>Create new project</h3>
				<p hlmCardDescription>Deploy your new project in one-click.</p>
			</div>
			<p hlmCardContent>
				<label class="block" hlmLabel>
					Name
					<input class="mt-1.5 w-full" placeholder="Name of your project" hlmInput />
				</label>

				<label class="my-4 mb-1.5 block" hlmLabel>
					Framework

					<brn-popover [state]="state()" (stateChanged)="stateChanged($event)" sideOffset="5">
						<button
							class="mt-1.5 w-full justify-between"
							id="edit-profile"
							variant="outline"
							brnPopoverTrigger
							(click)="state.set('open')"
							hlmBtn
						>
							{{ currentFramework() ? currentFramework()?.label : 'Select' }}
							<ng-icon hlm size="sm" name="lucideChevronDown" />
						</button>
						<hlm-command *brnPopoverContent="let ctx" hlmPopoverContent class="w-[270px] p-0">
							<div *brnCommandEmpty hlmCommandEmpty>No results found.</div>
							<hlm-command-list>
								<hlm-command-group hlm>
									@for (framework of frameworks; track framework) {
										<button hlm-command-item [value]="framework.value" (selected)="commandSelected(framework)">
											<ng-icon
												hlm
												[class.opacity-0]="currentFramework()?.value !== framework.value"
												name="lucideCheck"
												hlmCommandIcon
											/>
											{{ framework.label }}
										</button>
									}
								</hlm-command-group>
							</hlm-command-list>
						</hlm-command>
					</brn-popover>
				</label>
			</p>
			<div hlmCardFooter class="justify-between">
				<button hlmBtn variant="ghost">Cancel</button>
				<button hlmBtn>Create</button>
			</div>
		</section>
	`,
})
export class CardPreviewComponent {
	public frameworks = [
		{
			label: 'AnalogJs',
			value: 'analogjs',
		},
		{
			label: 'Angular',
			value: 'angular',
		},
		{
			label: 'Vue',
			value: 'vue',
		},
		{
			label: 'Nuxt',
			value: 'nuxt',
		},
		{
			label: 'React',
			value: 'react',
		},
		{
			label: 'NextJs',
			value: 'nextjs',
		},
	];

	public currentFramework = signal<Framework | undefined>(undefined);
	public state = signal<'closed' | 'open'>('closed');

	stateChanged(state: 'open' | 'closed') {
		this.state.set(state);
	}

	commandSelected(framework: Framework) {
		this.state.set('closed');
		if (this.currentFramework()?.value === framework.value) {
			this.currentFramework.set(undefined);
		} else {
			this.currentFramework.set(framework);
		}
	}
}

export const defaultImports = `
import {
  HlmCardContentDirective,
  HlmCardDescriptionDirective,
  HlmCardDirective,
  HlmCardFooterDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective,
} from '@spartan-ng/helm/card';
`;

export const defaultSkeleton = `
<section hlmCard>
  <div hlmCardHeader>
    <h3 hlmCardTitle>Card Title</h3>
    <p hlmCardDescription>Card Description</p>
  </div>
  <p hlmCardContent>Card Content</p>
  <p hlmCardFooter>Card Footer</p>
</section>
`;
