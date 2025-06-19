import { BrnInputOtpComponent } from '@spartan-ng/brain/input-otp';
import {
	HlmInputOtpDirective,
	HlmInputOtpGroupDirective,
	HlmInputOtpSeparatorComponent,
	HlmInputOtpSlotComponent,
} from '@spartan-ng/helm/input-otp';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

const meta: Meta<BrnInputOtpComponent> = {
	title: 'Input OTP',
	component: BrnInputOtpComponent,
	tags: ['autodocs'],
	args: {},
	argTypes: {},
	decorators: [
		moduleMetadata({
			imports: [
				BrnInputOtpComponent,
				HlmInputOtpDirective,
				HlmInputOtpGroupDirective,
				HlmInputOtpSeparatorComponent,
				HlmInputOtpSlotComponent,
			],
		}),
	],
	render: ({ ...args }) => ({
		props: args,
		template: `
		<brn-input-otp hlmInputOtp maxLength="6" inputClass="disabled:cursor-not-allowed">
			<div hlmInputOtpGroup>
				<hlm-input-otp-slot index="0" />
				<hlm-input-otp-slot index="1" />
				<hlm-input-otp-slot index="2" />
			</div>
			<hlm-input-otp-separator />
			<div hlmInputOtpGroup>
				<hlm-input-otp-slot index="3" />
				<hlm-input-otp-slot index="4" />
				<hlm-input-otp-slot index="5" />
			</div>
		</brn-input-otp>
		`,
	}),
};

export default meta;

type Story = StoryObj<BrnInputOtpComponent>;

export const Default: Story = {
	args: {},
};
