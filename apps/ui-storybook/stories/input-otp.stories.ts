import { HlmInputOtp, HlmInputOtpGroup, HlmInputOtpSeparator, HlmInputOtpSlot } from '@spartan-ng/helm/input-otp';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

const meta: Meta<HlmInputOtp> = {
	title: 'Input OTP',
	component: HlmInputOtp,
	tags: ['autodocs'],
	args: {},
	argTypes: {},
	decorators: [
		moduleMetadata({
			imports: [HlmInputOtp, HlmInputOtpGroup, HlmInputOtpSeparator, HlmInputOtpSlot],
		}),
	],
	render: ({ ...args }) => ({
		props: args,
		template: `
		<hlm-input-otp length="6" [autofocus]="true">
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
		</hlm-input-otp>
		`,
	}),
};

export default meta;

type Story = StoryObj<HlmInputOtp>;

export const Default: Story = {
	args: {},
};

export const Masked: Story = {
	render: () => ({
		template: `
		<hlm-input-otp mask value="123456" length="6">
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
		</hlm-input-otp>
		`,
	}),
};
