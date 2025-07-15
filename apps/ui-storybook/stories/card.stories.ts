import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCard, HlmCardImports } from '@spartan-ng/helm/card';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

const meta: Meta<HlmCard> = {
	title: 'Card',
	component: HlmCard,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [HlmCardImports, HlmLabel, HlmInput, HlmButton, HlmBadge],
		}),
	],
};

export default meta;
type Story = StoryObj<HlmCard>;

export const Default: Story = {
	render: () => ({
		template: `
    <section class='max-w-lg mx-auto' hlmCard>
       <div hlmCardHeader>
        <h3 hlmCardTitle>Create new project</h3>
        <p hlmCardDescription>
          Deploy your new project in one-click.
        </p>
      </div>
      <p hlmCardContent>
       <label class='block' hlmLabel>Name
       <input class='w-full mt-1.5' placeholder='Name of your project' hlmInput>
       </label>

       <label class='block my-4' hlmLabel>Framework
       <select class='w-full mt-1.5' hlmInput>
        <option>Angular</option>
        <option>React</option>
        <option>Vue</option>
       </select>
       </label>
      </p>
      <div hlmCardFooter class='justify-between'>
        <button hlmBtn variant='ghost'>Cancel</button>
        <button hlmBtn>Create</button>
      </div>
    </section>
    `,
	}),
};

export const Transposed: Story = {
	render: () => ({
		template: `
    <section class='max-w-lg mx-auto' hlmCard>
       <div hlmCardHeader direction='row'>
        <h3 hlmCardTitle>AngularGPT</h3>
        <p hlmCardDescription>
          <span variant='secondary' hlmBadge>beta</span>
        </p>
      </div>
      <p hlmCardContent>
       <label class='block' hlmLabel>E-mail
       <input class='w-full mt-1.5' placeholder='you@spartan-ng' hlmInput>
       </label>
         <label class='block my-4' hlmLabel>Password
       <input class='w-full mt-1.5' type='password' hlmInput>
       </label>
      </p>
      <div hlmCardFooter direction='column'>
        <button hlmBtn>Sign In</button>
        <button hlmBtn variant='ghost'>Create Account</button>
      </div>
    </section>
    `,
	}),
};
