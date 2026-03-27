import { HlmStepper, HlmStepperImports } from '@spartan-ng/helm/stepper';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

export default {
	title: 'Stepper',
	component: HlmStepper,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [HlmStepperImports, HlmButtonImports],
		}),
	],
} as Meta<HlmStepper>;

type Story = StoryObj<HlmStepper>;

export const Default: Story = {
	render: () => ({
		template: `
			<hlm-stepper>
				<hlm-step label="Account">
					<div class="flex flex-col gap-4">
						<div class="text-muted-foreground flex h-40 items-center justify-center rounded-lg border-2 border-dashed">
							Step 1 content
						</div>
						<div class="flex justify-end">
							<button hlmBtn hlmStepperNext>Next</button>
						</div>
					</div>
				</hlm-step>
				<hlm-step label="Profile">
					<div class="flex flex-col gap-4">
						<div class="text-muted-foreground flex h-40 items-center justify-center rounded-lg border-2 border-dashed">
							Step 2 content
						</div>
						<div class="flex justify-between gap-2">
							<button hlmBtn variant="outline" hlmStepperPrevious>Back</button>
							<button hlmBtn hlmStepperNext>Next</button>
						</div>
					</div>
				</hlm-step>
				<hlm-step label="Review">
					<div class="flex flex-col gap-4">
						<div class="text-muted-foreground flex h-40 items-center justify-center rounded-lg border-2 border-dashed">
							Step 3 content
						</div>
						<div class="flex justify-between gap-2">
							<button hlmBtn variant="outline" hlmStepperPrevious>Back</button>
							<button hlmBtn>Finish</button>
						</div>
					</div>
				</hlm-step>
			</hlm-stepper>
		`,
	}),
};

export const Vertical: Story = {
	render: () => ({
		template: `
			<hlm-stepper orientation="vertical">
				<hlm-step label="Campaign">
					<div class="flex flex-col gap-4">
						<div class="text-muted-foreground flex h-40 items-center justify-center rounded-lg border-2 border-dashed">
							Vertical step one
						</div>
						<div class="flex justify-end">
							<button hlmBtn hlmStepperNext>Next</button>
						</div>
					</div>
				</hlm-step>
				<hlm-step label="Audience">
					<div class="flex flex-col gap-4">
						<div class="text-muted-foreground flex h-40 items-center justify-center rounded-lg border-2 border-dashed">
							Vertical step two
						</div>
						<div class="flex justify-between gap-2">
							<button hlmBtn variant="outline" hlmStepperPrevious>Back</button>
							<button hlmBtn hlmStepperNext>Next</button>
						</div>
					</div>
				</hlm-step>
				<hlm-step label="Publish">
					<div class="flex flex-col gap-4">
						<div class="text-muted-foreground flex h-40 items-center justify-center rounded-lg border-2 border-dashed">
							Vertical step three
						</div>
						<div class="flex justify-between gap-2">
							<button hlmBtn variant="outline" hlmStepperPrevious>Back</button>
							<button hlmBtn>Publish</button>
						</div>
					</div>
				</hlm-step>
			</hlm-stepper>
		`,
	}),
};

export const RightToLeft: Story = {
	render: () => ({
		template: `
			<div dir="rtl">
				<hlm-stepper>
					<hlm-step label="الحساب">
						<div class="flex flex-col gap-4">
							<div class="text-muted-foreground flex h-40 items-center justify-center rounded-lg border-2 border-dashed">
								المحتوى ١
							</div>
							<div class="flex justify-end">
								<button hlmBtn hlmStepperNext>التالي</button>
							</div>
						</div>
					</hlm-step>
					<hlm-step label="العنوان">
						<div class="flex flex-col gap-4">
							<div class="text-muted-foreground flex h-40 items-center justify-center rounded-lg border-2 border-dashed">
								المحتوى ٢
							</div>
							<div class="flex justify-between gap-2">
								<button hlmBtn variant="outline" hlmStepperPrevious>السابق</button>
								<button hlmBtn hlmStepperNext>التالي</button>
							</div>
						</div>
					</hlm-step>
					<hlm-step label="المراجعة">
						<div class="flex flex-col gap-4">
							<div class="text-muted-foreground flex h-40 items-center justify-center rounded-lg border-2 border-dashed">
								المحتوى ٣
							</div>
							<div class="flex justify-between gap-2">
								<button hlmBtn variant="outline" hlmStepperPrevious>السابق</button>
								<button hlmBtn>إنهاء</button>
							</div>
						</div>
					</hlm-step>
				</hlm-stepper>
			</div>
		`,
	}),
};
