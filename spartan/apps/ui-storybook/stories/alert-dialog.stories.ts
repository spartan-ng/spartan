import { BrnAlertDialogImports } from '@spartan-ng/brain/alert-dialog';
import { HlmAlertDialog, HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmButton } from '@spartan-ng/helm/button';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

const meta: Meta<HlmAlertDialog> = {
	title: 'Alert Dialog',
	component: HlmAlertDialog,
	tags: ['autodocs'],
	args: {},
	argTypes: {},
	decorators: [
		moduleMetadata({
			imports: [BrnAlertDialogImports, HlmAlertDialogImports, HlmButton],
		}),
	],
};

export default meta;
type Story = StoryObj<HlmAlertDialog>;

export const Default: Story = {
	render: () => ({
		template: `
    <hlm-alert-dialog>
      <button id="delete-account" variant="outline" hlmAlertDialogTrigger hlmBtn>Delete Account</button>
      <hlm-alert-dialog-content *brnAlertDialogContent="let ctx">
           <hlm-alert-dialog-header>
            <h2 hlmAlertDialogTitle>Are you absolutely sure?</h2>
            <p hlmAlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
            </p>
          </hlm-alert-dialog-header>
          <hlm-alert-dialog-footer>
            <button hlmAlertDialogCancel (click)="ctx.close()">Cancel</button>
            <button hlmAlertDialogAction type="submit">Delete account</button>
          </hlm-alert-dialog-footer>
      </hlm-alert-dialog-content>
    </hlm-alert-dialog>
    `,
	}),
};
