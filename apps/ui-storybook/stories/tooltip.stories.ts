import { ChangeDetectionStrategy, Component, DoCheck, input, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';
import { BrnTooltipContentDirective } from '@spartan-ng/brain/tooltip';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import { HlmIconDirective } from '@spartan-ng/helm/icon';
import { HlmTooltipComponent, HlmTooltipTriggerDirective } from '@spartan-ng/helm/tooltip';
import { type Meta, type StoryObj, argsToTemplate, moduleMetadata } from '@storybook/angular';

const meta: Meta<HlmTooltipComponent> = {
	title: 'Tooltip',
	component: HlmTooltipComponent,
	tags: ['autodocs'],
	argTypes: {},
	decorators: [
		moduleMetadata({
			imports: [
				HlmButtonDirective,
				HlmTooltipComponent,
				BrnTooltipContentDirective,
				HlmTooltipTriggerDirective,
				NgIcon,
				HlmIconDirective,
			],
			providers: [provideIcons({ lucidePlus })],
		}),
	],
};

export default meta;
type Story = StoryObj<HlmTooltipComponent>;
export const Default: Story = {
	argTypes: {
		position: {
			control: { type: 'radio' },
			options: ['above', 'below', 'left', 'right'],
			defaultValue: 'above',
		},
	},
	render: ({ ...args }) => ({
		props: args,
		template: `
<div class='p-40'>
  <hlm-tooltip>
    <button hlmTooltipTrigger ${argsToTemplate(args)}  hlmBtn variant='outline'>Test</button>
    <span *brnTooltipContent class='flex items-center'>
      Add to library <ng-icon hlm class='ml-2' size='sm' name='lucidePlus'/>
     </span>
  </hlm-tooltip>
</div>
`,
	}),
};

@Component({
	selector: 'simple-tooltip-story',
	imports: [HlmButtonDirective, HlmTooltipTriggerDirective, NgIcon, HlmIconDirective],
	providers: [provideIcons({ lucidePlus })],
	template: `
		<div class="p-40">
			<button [hlmTooltipTrigger]="'Add to library'" hlmBtn variant="icon">
				<ng-icon hlm name="lucidePlus" size="sm" />
			</button>
		</div>
	`,
})
class SimpleTooltip {}

export const Simple: Story = {
	render: () => ({
		moduleMetadata: {
			imports: [SimpleTooltip],
		},
		template: '<simple-tooltip-story/>',
	}),
};

@Component({
	selector: 'disabled-tooltip-story',
	imports: [
		HlmButtonDirective,
		HlmTooltipComponent,
		BrnTooltipContentDirective,
		HlmTooltipTriggerDirective,
		NgIcon,
		HlmIconDirective,
	],
	providers: [provideIcons({ lucidePlus })],
	template: `
		<div class="p-40">
			<hlm-tooltip>
				<button
					(click)="disabled.set(!disabled())"
					hlmTooltipTrigger
					[hlmTooltipDisabled]="disabled()"
					hlmBtn
					variant="outline"
				>
					Test
				</button>
				<span *brnTooltipContent class="flex items-center">
					Add to library
					<ng-icon hlm class="ml-2" size="sm" name="lucidePlus" />
				</span>
			</hlm-tooltip>
			<p>{{ disabled() ? 'disabled' : 'enabled' }}</p>
		</div>
	`,
})
class DisabledTooltip {
	protected readonly disabled = signal(false);
}

export const Disabled: Story = {
	render: () => ({
		moduleMetadata: {
			imports: [DisabledTooltip],
		},
		template: '<disabled-tooltip-story/>',
	}),
};

@Component({
	selector: 'performance-tooltip-calendar-row',
	imports: [HlmTooltipTriggerDirective],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [provideIcons({ lucidePlus })],
	styles: `
		:host {
			display: contents;
		}
	`,
	template: `
		@for (day of month()?.days ?? []; track day) {
			@if (day === null) {
				<div class="bg-muted flex items-center justify-center rounded-md p-2">/</div>
			} @else {
				<button
					class="flex items-center justify-center rounded-md border p-2"
					[hlmTooltipTrigger]="month()?.name + ', ' + day"
					showDelay="50"
					hideDelay="0"
				>
					{{ day }}
				</button>
			}
		}
	`,
})
class CalendarRow implements DoCheck {
	public readonly month = input<{ name: string; days: (number | null)[] }>();
	ngDoCheck(): void {
		console.log('Running CD for: ' + this.month()?.name);
	}
}

@Component({
	selector: 'performance-tooltip-story',
	imports: [CalendarRow],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [provideIcons({ lucidePlus })],
	template: `
		<div style="grid-template-columns: repeat(31, minmax(0, 1fr))" class="grid gap-1">
			@for (month of months; track month.name) {
				<performance-tooltip-calendar-row [month]="month" />
			}
		</div>
	`,
})
class PerformanceTooltip {
	protected readonly months = this.generateYearDays(2025);
	private generateYearDays(year: number): { name: string; days: (number | null)[] }[] {
		const monthNames = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December',
		];

		return monthNames.map((name, index) => {
			const daysInMonth = new Date(year, index + 1, 0).getDate(); // get days in month
			return {
				name,
				days: Array.from({ length: 31 }, (_, i) => (i < daysInMonth ? i + 1 : null)),
			};
		});
	}
}

export const Performance: Story = {
	render: () => ({
		moduleMetadata: {
			imports: [PerformanceTooltip],
		},
		template: '<performance-tooltip-story/>',
	}),
};
