import { Component, signal } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDrawer, HlmDrawerImports } from '@spartan-ng/helm/drawer';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';

const LOREM = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit
in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

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
	selector: 'drawer-long-content-story',
	imports: [HlmDrawerImports, HlmButtonImports],
	template: `
		<button hlmBtn variant="outline" (click)="open.set(true)">Open Drawer With Long Content</button>

		<hlm-drawer [isOpen]="open()" (dismissed)="open.set(false)">
			<div hlmDrawerHeader>
				<h2 hlmDrawerTitle>Terms of Service</h2>
				<p hlmDrawerDescription>
					Scroll through the content. Dragging at the top of the scroll area dismisses the drawer.
				</p>
			</div>

			<div class="flex flex-col gap-4 p-4">
				@for (i of paragraphs; track i) {
					<p class="text-sm leading-relaxed">
						<span class="text-foreground font-medium">Section {{ i + 1 }}.</span>
						{{ lorem }}
					</p>
				}
			</div>

			<div hlmDrawerFooter>
				<button hlmBtn (click)="open.set(false)">I agree</button>
				<button hlmBtn variant="ghost" (click)="open.set(false)">Cancel</button>
			</div>
		</hlm-drawer>
	`,
})
class DrawerLongContentStory {
	protected readonly open = signal(false);
	protected readonly lorem = LOREM;
	protected readonly paragraphs = Array.from({ length: 20 }, (_, i) => i);
}

@Component({
	selector: 'drawer-with-input-story',
	imports: [HlmDrawerImports, HlmButtonImports, HlmInputImports, HlmLabelImports],
	template: `
		<!-- Long page body so we can verify body scroll-lock while the drawer is open. -->
		<div class="flex flex-col gap-4 p-8">
			<h1 class="text-2xl font-bold">Page with lots of content</h1>
			<p class="text-muted-foreground text-sm">
				The page body is long so you can scroll it. Open the drawer and try scrolling the page — it should be locked
				until the drawer closes.
			</p>
			<button hlmBtn variant="outline" (click)="open.set(true)">Open Drawer with Input</button>

			@for (i of paragraphs; track i) {
				<p class="text-sm leading-relaxed">
					<span class="text-foreground font-medium">Paragraph {{ i + 1 }}.</span>
					{{ lorem }}
				</p>
			}
		</div>

		<hlm-drawer [isOpen]="open()" (dismissed)="open.set(false)">
			<div hlmDrawerHeader>
				<h2 hlmDrawerTitle>Feedback</h2>
				<p hlmDrawerDescription>
					Focus an input on mobile — the drawer should shift up to stay above the virtual keyboard.
				</p>
			</div>

			<!-- Many fields so the drawer body itself becomes scrollable AND
			     the user can move focus between inputs near the bottom of the
			     list. Each focus / blur cycle is what historically triggered
			     Safari's keyboard-induced page scroll on iOS. -->
			<div class="flex flex-col gap-4 p-4">
				@for (n of inputs; track $index) {
					<div class="flex flex-col gap-2">
						<label hlmLabel [for]="'drawer-field-' + n">Field {{ n }}</label>
						<input hlmInput [id]="'drawer-field-' + n" [placeholder]="'Field ' + n + '…'" />
					</div>
				}
			</div>

			<div hlmDrawerFooter>
				<button hlmBtn (click)="open.set(false)">Send</button>
				<button hlmBtn variant="ghost" (click)="open.set(false)">Cancel</button>
			</div>
		</hlm-drawer>
	`,
})
class DrawerWithInputStory {
	protected readonly open = signal(false);
	protected readonly lorem = LOREM;
	protected readonly paragraphs = Array.from({ length: 30 }, (_, i) => i);
	protected readonly inputs = Array.from({ length: 20 }, (_, i) => i + 1);
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

@Component({
	selector: 'drawer-trigger-story',
	imports: [HlmDrawerImports, HlmButtonImports],
	template: `
		<!--
		  Vaul / shadcn-style trigger directive. The button references the
		  drawer via [hlmDrawerTriggerFor]; on click it calls drawer.open()
		  on the BrnDrawer host directive of <hlm-drawer>. The directive
		  also wires aria-haspopup, aria-expanded, aria-controls, and a
		  data-state attribute for screen readers and CSS theming. No
		  (click) handler or isOpen signal needed in the host.
		-->
		<button hlmBtn variant="outline" hlmDrawerTrigger [hlmDrawerTriggerFor]="myDrawer.drawer">Open Via Trigger</button>

		<hlm-drawer #myDrawer="hlmDrawer">
			<div hlmDrawerHeader>
				<h2 hlmDrawerTitle>Trigger demo</h2>
				<p hlmDrawerDescription>Opened by the [hlmDrawerTrigger] directive — no parent signal, no (click) handler.</p>
			</div>

			<div class="p-4">
				<p class="text-muted-foreground text-sm">
					Inspect the trigger button: aria-haspopup="dialog", aria-expanded reflects the drawer state, aria-controls
					points to the drawer's id, data-state mirrors the state machine for CSS hooks.
				</p>
			</div>
		</hlm-drawer>
	`,
})
class DrawerTriggerStory {}

const meta: Meta<HlmDrawer> = {
	title: 'Drawer',
	component: HlmDrawer,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [HlmDrawerImports, HlmButtonImports, HlmInputImports, HlmLabelImports],
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

export const LongContent: Story = {
	render: () => ({
		moduleMetadata: { imports: [DrawerLongContentStory] },
		template: `<drawer-long-content-story />`,
	}),
};

export const WithInputAndPageScroll: Story = {
	render: () => ({
		moduleMetadata: { imports: [DrawerWithInputStory] },
		template: `<drawer-with-input-story />`,
	}),
};

export const WithTrigger: Story = {
	render: () => ({
		moduleMetadata: { imports: [DrawerTriggerStory] },
		template: `<drawer-trigger-story />`,
	}),
};
