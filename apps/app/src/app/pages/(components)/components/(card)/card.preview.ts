import { Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideChevronDown } from '@ng-icons/lucide';
import { BrnCommandImports } from '@spartan-ng/brain/command';
import { BrnPopoverComponent, BrnPopoverContentDirective, BrnPopoverTriggerDirective } from '@spartan-ng/brain/popover';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import {
	HlmCardContentDirective,
	HlmCardDescriptionDirective,
	HlmCardDirective,
	HlmCardFooterDirective,
	HlmCardHeaderDirective,
	HlmCardTitleDirective,
} from '@spartan-ng/ui-card-helm';
import { HlmCommandImports } from '@spartan-ng/ui-command-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { HlmPopoverContentDirective } from '@spartan-ng/ui-popover-helm';

type Framework = { label: string; value: string };

@Component({
	selector: 'spartan-card-preview',
	standalone: true,
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

					<brn-popover [state]="state()" (stateChanged)="stateChanged($event)" sideOffset="5" closeDelay="100">
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

export const defaultCode = `
import { Component, signal } from '@angular/core';
import { lucideCheck, lucideChevronDown } from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import {
  HlmCardContentDirective,
  HlmCardDescriptionDirective,
  HlmCardDirective,
  HlmCardFooterDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective,
} from '@spartan-ng/ui-card-helm';
import { BrnCommandImports } from '@spartan-ng/brain/command';
import { HlmCommandImports } from '@spartan-ng/ui-command-helm';
import { HlmIconDirective, provideIcons } from '@spartan-ng/ui-icon-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { HlmPopoverContentDirective } from '@spartan-ng/ui-popover-helm';
import {
  BrnPopoverComponent,
  BrnPopoverContentDirective,
  BrnPopoverTriggerDirective,
} from '@spartan-ng/brain/popover';

type Framework = { label: string; value: string };

@Component({
  selector: 'spartan-card-preview',
  standalone: true,
  imports: [
    BrnCommandImports,
    HlmCommandImports,
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
  template: \`
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

                  <brn-popover [state]="state()" (stateChanged)="stateChanged($event)" sideOffset="5" closeDelay="100">
                      <button
                              class="w-full mt-1.5 justify-between"
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
                              <hlm-command-group>
                                  @for (framework of frameworks;track framework) {
                                      <button hlm-command-item [value]="framework.value"
                                              (selected)="commandSelected(framework)" hlm>
                                          <ng-icon hlm
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
  \`,
})
export class CardPreviewComponent {
  public frameworks = [
    {
      label: 'AnalogJs',
      value: 'analogjs'
    },
    {
      label: 'Angular',
      value: 'angular'
    },
    {
      label: 'Vue',
      value: 'vue'
    },
    {
      label: 'Nuxt',
      value: 'nuxt'
    },
    {
      label: 'React',
      value: 'react'
    },
    {
      label: 'NextJs',
      value: 'nextjs'
    }
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
`;

export const defaultImports = `
import {
  HlmCardContentDirective,
  HlmCardDescriptionDirective,
  HlmCardDirective,
  HlmCardFooterDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective,
} from '@spartan-ng/ui-card-helm';
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
