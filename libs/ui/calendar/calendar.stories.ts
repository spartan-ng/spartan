import { BrnCalendarImports } from '@spartan-ng/ui-calendar-brain';
import { type HlmCalendarComponent, HlmCalendarImports } from '@spartan-ng/ui-calendar-helm';
import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate, moduleMetadata } from '@storybook/angular';
import { MaterialStyleCalendarComponent } from './mocks/material-style.calendar';
import { ReactDayCalendarComponent } from './mocks/react-daypicker-style.calendar';

const meta: Meta<HlmCalendarComponent> = {
	title: 'Calendar',
	args: {},
	argTypes: {},
	decorators: [
		moduleMetadata({
			imports: [HlmCalendarImports, BrnCalendarImports, MaterialStyleCalendarComponent, ReactDayCalendarComponent],
			// providers: [provideSpartanDateLibrary()],
		}),
	],
};

export default meta;
type Story = StoryObj<HlmCalendarComponent>;

export const Default: Story = {
	render: (args) => ({
		props: { ...args, outputFn: ($event: unknown) => console.log('External', $event) },
		template: /* HTML */ `
			<hlm-calendar ${argsToTemplate(args)} (selectedChange)="outputFn($event)"/>
		`,
	}),
};

export const MaterialNavigation: Story = {
	render: (args) => ({
		props: { ...args },
		template: /* HTML */ `
			<hlm-material-calendar ${argsToTemplate(args)}/>
		`,
	}),
};

export const SelectDropdownNavigation: Story = {
	render: (args) => ({
		props: { ...args },
		template: /* HTML */ `
			<hlm-react-daypicker-calendar ${argsToTemplate(args)}/>
		`,
	}),
};
