import { Component, signal } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDrawer, HlmDrawerImports } from '@spartan-ng/helm/drawer';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';

@Component({
	selector: 'drawer-default-story',
	imports: [HlmDrawerImports, HlmButtonImports],
	template: `
		<button hlmBtn variant="outline" (click)="open.set(true)">Open Drawer</button>

		<hlm-drawer [isOpen]="open()" (dismissed)="open.set(false)">
			<div hlmDrawerHeader>
				<h2 hlmDrawerTitle>Edit Profile</h2>
				<p hlmDrawerDescription>Make changes to your profile here. Click save when you're done.</p>
			</div>

			<div class="p-4">
				<p class="text-muted-foreground text-sm">Swipe the drawer down to close, or tap the backdrop.</p>
			</div>

			<div hlmDrawerFooter>
				<button hlmBtn (click)="open.set(false)">Save Changes</button>
				<button hlmBtn variant="ghost" (click)="open.set(false)">Cancel</button>
			</div>
		</hlm-drawer>
	`,
})
class DrawerDefaultStory {
	protected readonly open = signal(false);
}

@Component({
	selector: 'drawer-snap-story',
	imports: [HlmDrawerImports, HlmButtonImports],
	template: `
		<button hlmBtn variant="outline" (click)="open.set(true)">Open With Snap Points</button>

		<hlm-drawer [isOpen]="open()" [snapPoints]="snapPoints" [initialSnap]="1" (dismissed)="open.set(false)">
			<div hlmDrawerHeader>
				<h2 hlmDrawerTitle>Snap Points</h2>
				<p hlmDrawerDescription>
					Drag the drawer between snap points. Release slowly to settle at the closest one; flick to snap to the end.
				</p>
			</div>

			<div class="p-4">
				<p class="text-muted-foreground text-sm">
					Configured snap points:
					<code class="bg-muted rounded px-1">[0, 0.4, 1]</code>
					.
				</p>
			</div>
		</hlm-drawer>
	`,
})
class DrawerSnapStory {
	protected readonly open = signal(false);
	protected readonly snapPoints = [0, 0.4, 1];
}

@Component({
	selector: 'drawer-non-dismissible-story',
	imports: [HlmDrawerImports, HlmButtonImports],
	template: `
		<button hlmBtn variant="outline" (click)="open.set(true)">Open Non-Dismissible</button>

		<hlm-drawer [isOpen]="open()" [disableDismiss]="true" (dismissed)="open.set(false)">
			<div hlmDrawerHeader>
				<h2 hlmDrawerTitle>Confirm action</h2>
				<p hlmDrawerDescription>You can only close this drawer via the explicit button below.</p>
			</div>

			<div hlmDrawerFooter>
				<button hlmBtn (click)="open.set(false)">Dismiss</button>
			</div>
		</hlm-drawer>
	`,
})
class DrawerNonDismissibleStory {
	protected readonly open = signal(false);
}

const meta: Meta<HlmDrawer> = {
	title: 'Drawer',
	component: HlmDrawer,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [HlmDrawerImports, HlmButtonImports],
		}),
	],
};

export default meta;
type Story = StoryObj<HlmDrawer>;

export const Default: Story = {
	render: () => ({
		moduleMetadata: { imports: [DrawerDefaultStory] },
		template: `<drawer-default-story />`,
	}),
};

export const WithSnapPoints: Story = {
	render: () => ({
		moduleMetadata: { imports: [DrawerSnapStory] },
		template: `<drawer-snap-story />`,
	}),
};

export const NonDismissible: Story = {
	render: () => ({
		moduleMetadata: { imports: [DrawerNonDismissibleStory] },
		template: `<drawer-non-dismissible-story />`,
	}),
};
