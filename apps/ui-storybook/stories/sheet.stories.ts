import { BrnSheet, BrnSheetImports } from '@spartan-ng/brain/sheet';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';
import { type Meta, type StoryObj, argsToTemplate, moduleMetadata } from '@storybook/angular';

export type SheetProps = { side: 'top' | 'bottom' | 'left' | 'right' };
const meta: Meta<SheetProps> = {
	title: 'Sheet',
	component: BrnSheet,
	tags: ['autodocs'],
	args: { side: 'left' },
	argTypes: {
		side: { control: 'select', options: ['top', 'bottom', 'left', 'right'] },
	},
	decorators: [
		moduleMetadata({
			imports: [BrnSheetImports, HlmSheetImports, HlmButtonImports, HlmInputImports],
		}),
	],
};

export default meta;
type Story = StoryObj<SheetProps>;

export const Default: Story = {
	render: ({ ...args }) => ({
		props: args,
		template: `
    <hlm-sheet ${argsToTemplate(args)}>
    <button id='edit-profile' variant='outline' hlmSheetTrigger hlmBtn>Edit Profile</button>
    <hlm-sheet-content *brnSheetContent='let ctx'>
         <hlm-sheet-header>
          <h3 hlmSheetTitle>Edit Profile</h3>
          <p hlmSheetDescription>
          Make changes to your profile here. Click save when you're done.
          </p>
        </hlm-sheet-header>
                <div class='py-4 grid gap-4'>
          <div class='items-center grid grid-cols-4 gap-4'>
            <label hlmLabel for='name' class='text-right'>
              Name
            </label>
            <input hlmInput id='name' value='Pedro Duarte' class='col-span-3' />
          </div>
          <div class='items-center grid grid-cols-4 gap-4'>
            <label hlmLabel for='username' class='text-right'>
              Username
            </label>
            <input hlmInput id='username' value='@peduarte' class='col-span-3' />
          </div>
        </div>
        <hlm-sheet-footer>
          <button hlmBtn type='submit'>Save Changes</button>
        </hlm-sheet-footer>
    </hlm-sheet-content>
    </hlm-sheet>
    `,
	}),
};
