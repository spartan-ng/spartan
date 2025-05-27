import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCalendarDays } from '@ng-icons/lucide';
import { type BrnHoverCardComponent, BrnHoverCardModule } from '@spartan-ng/brain/hover-card';
import { HlmAvatarModule } from '@spartan-ng/helm/avatar';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import { HlmCardDirective } from '@spartan-ng/helm/card';
import { HlmHoverCardModule } from '@spartan-ng/helm/hover-card';
import { HlmIconDirective } from '@spartan-ng/helm/icon';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

@Component({
	selector: 'hover-card-example',
	imports: [BrnHoverCardModule, HlmHoverCardModule, HlmButtonDirective, NgIcon, HlmIconDirective, HlmAvatarModule],
	providers: [provideIcons({ lucideCalendarDays })],
	host: {
		class: 'flex w-full h-full justify-center py-80',
	},
	template: `
		<brn-hover-card>
			<button hlmBtn variant="link" brnHoverCardTrigger>&#64;analogjs</button>
			<hlm-hover-card-content *brnHoverCardContent class="w-80">
				<div class="flex justify-between space-x-4">
					<hlm-avatar variant="small" id="avatar-small">
						<img src="https://analogjs.org/img/logos/analog-logo.svg" alt="AnalogLogo" hlmAvatarImage />
						<span class="bg-sky-600 text-sky-50" hlmAvatarFallback>AN</span>
					</hlm-avatar>
					<div class="space-y-1">
						<h4 class="text-sm font-semibold">&#64;analogjs</h4>
						<p class="text-sm">The Angular meta-framework – build Angular applications faster.</p>
						<div class="flex items-center pt-2">
							<ng-icon hlm size="sm" name="lucideCalendarDays" class="mr-2 opacity-70" />
							<span class="text-muted-foreground text-xs">Joined December 2021</span>
						</div>
					</div>
				</div>
			</hlm-hover-card-content>
		</brn-hover-card>
	`,
})
class HoverCardExampleComponent {}

const meta: Meta<BrnHoverCardComponent> = {
	title: 'Hover Card',
	component: HlmCardDirective,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [HoverCardExampleComponent],
		}),
	],
};

export default meta;
type Story = StoryObj<BrnHoverCardComponent>;

export const Default: Story = {
	render: () => ({
		template: '<hover-card-example/>',
	}),
};
