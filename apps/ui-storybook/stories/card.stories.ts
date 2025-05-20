import { HlmBadgeDirective } from '@spartan-ng/helm/badge';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import { HlmCardDirective, HlmCardImports } from '@spartan-ng/helm/card';
import { HlmInputDirective } from '@spartan-ng/helm/input';
import { HlmLabelDirective } from '@spartan-ng/helm/label';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

const meta: Meta<HlmCardDirective> = {
	title: 'Card',
	component: HlmCardDirective,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [HlmCardImports, HlmLabelDirective, HlmInputDirective, HlmButtonDirective, HlmBadgeDirective],
		}),
	],
};

export default meta;
type Story = StoryObj<HlmCardDirective>;

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
