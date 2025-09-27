import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCalendarDays } from '@ng-icons/lucide';
import { type BrnHoverCard, BrnHoverCardImports } from '@spartan-ng/brain/hover-card';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCard } from '@spartan-ng/helm/card';
import { HlmHoverCardImports } from '@spartan-ng/helm/hover-card';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';

@Component({
	selector: 'hover-card-example',
	imports: [BrnHoverCardImports, HlmHoverCardImports, HlmButton, NgIcon, HlmIcon, HlmAvatarImports],
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
class HoverCardExample {}

const meta: Meta<BrnHoverCard> = {
	title: 'Hover Card',
	component: HlmCard,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [HoverCardExample],
		}),
	],
};

export default meta;
type Story = StoryObj<BrnHoverCard>;

export const Default: Story = {
	render: () => ({
		template: '<hover-card-example/>',
	}),
};
