import { HlmAvatarComponent, HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { type Meta, type StoryObj, argsToTemplate, moduleMetadata } from '@storybook/angular';

const meta: Meta<HlmAvatarComponent> = {
	title: 'Avatar',
	component: HlmAvatarComponent,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [HlmAvatarImports],
		}),
	],
	render: ({ ...args }) => ({
		props: { args },
		template: `
    <hlm-avatar ${argsToTemplate(args)}>
      <img src='/mountains.jpg' alt='Spartan logo. A red spearhead with the Angular A'  hlmAvatarImage>
      <span class='bg-sky-600 text-sky-50' hlmAvatarFallback>MT</span>
    </hlm-avatar>
`,
	}),
};

export default meta;
type Story = StoryObj<HlmAvatarComponent>;

export const Default: Story = {};
