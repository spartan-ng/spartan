import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDrawer, HlmDrawerImports } from '@spartan-ng/helm/drawer';
import { type Meta, type StoryObj, argsToTemplate, moduleMetadata } from '@storybook/angular';

export type DrawerProps = { swipeDirection: 'up' | 'down' | 'left' | 'right'; showSwipeHandle: boolean };

const meta: Meta<DrawerProps> = {
	title: 'Drawer',
	component: HlmDrawer,
	tags: ['autodocs'],
	args: { swipeDirection: 'down', showSwipeHandle: true },
	argTypes: {
		swipeDirection: { control: 'select', options: ['up', 'down', 'left', 'right'] },
		showSwipeHandle: { control: 'boolean' },
	},
	decorators: [
		moduleMetadata({
			imports: [HlmDrawerImports, HlmButtonImports],
		}),
	],
};

export default meta;
type Story = StoryObj<DrawerProps>;

const placeholder = `
	<div class="flex-1 p-4">
		<div class="bg-muted h-40 w-full rounded-2xl"></div>
	</div>
`;

export const Default: Story = {
	render: ({ ...args }) => ({
		props: args,
		template: `
		<hlm-drawer ${argsToTemplate(args)}>
			<button hlmDrawerTrigger hlmBtn variant="outline">Open Drawer</button>
			<hlm-drawer-content *hlmDrawerPortal="let ctx">
				<hlm-drawer-header>
					<h3 hlmDrawerTitle>Move Goal</h3>
					<p hlmDrawerDescription>Set your daily activity goal.</p>
				</hlm-drawer-header>
				${placeholder}
				<hlm-drawer-footer>
					<button hlmBtn>Submit</button>
					<button hlmDrawerClose hlmBtn variant="outline">Cancel</button>
				</hlm-drawer-footer>
			</hlm-drawer-content>
		</hlm-drawer>
		`,
	}),
};

export const Nested: Story = {
	render: () => ({
		template: `
		<hlm-drawer>
			<button hlmDrawerTrigger hlmBtn variant="outline">Open Drawer</button>
			<hlm-drawer-content *hlmDrawerPortal="let ctx">
				<hlm-drawer-header>
					<h3 hlmDrawerTitle>Drawer</h3>
					<p hlmDrawerDescription>Open another drawer from the same direction.</p>
				</hlm-drawer-header>
				${placeholder}
				<hlm-drawer-footer>
					<hlm-drawer>
						<button hlmDrawerTrigger hlmBtn variant="outline">Open Nested Drawer</button>
						<hlm-drawer-content *hlmDrawerPortal="let ctx">
							<hlm-drawer-header>
								<h3 hlmDrawerTitle>Nested Drawer</h3>
								<p hlmDrawerDescription>The parent drawer stays mounted behind this one.</p>
							</hlm-drawer-header>
							${placeholder}
							<hlm-drawer-footer>
								<button hlmDrawerClose hlmBtn variant="outline">Close Nested</button>
							</hlm-drawer-footer>
						</hlm-drawer-content>
					</hlm-drawer>
					<button hlmDrawerClose hlmBtn variant="outline">Close</button>
				</hlm-drawer-footer>
			</hlm-drawer-content>
		</hlm-drawer>
		`,
	}),
};

export const SnapPoints: Story = {
	render: () => ({
		props: { snapPoints: ['10rem', 1] },
		template: `
		<hlm-drawer [snapPoints]="snapPoints" showSwipeHandle>
			<button hlmDrawerTrigger hlmBtn variant="outline">Open Snap Drawer</button>
			<hlm-drawer-content *hlmDrawerPortal="let ctx">
				<hlm-drawer-header>
					<h3 hlmDrawerTitle>Snap points</h3>
					<p hlmDrawerDescription>Drag to snap between a compact peek and the full height.</p>
				</hlm-drawer-header>
				${placeholder}
				<hlm-drawer-footer>
					<button hlmDrawerClose hlmBtn>Close</button>
				</hlm-drawer-footer>
			</hlm-drawer-content>
		</hlm-drawer>
		`,
	}),
};

export const NonModal: Story = {
	render: () => ({
		template: `
		<hlm-drawer [modal]="false" [closeOnOutsidePointerEvents]="false" swipeDirection="right">
			<button hlmDrawerTrigger hlmBtn variant="outline">Non Modal</button>
			<hlm-drawer-content *hlmDrawerPortal="let ctx">
				<hlm-drawer-header>
					<h3 hlmDrawerTitle>Non Modal Drawer</h3>
				</hlm-drawer-header>
				${placeholder}
				<hlm-drawer-footer>
					<button hlmDrawerClose hlmBtn>Close</button>
				</hlm-drawer-footer>
			</hlm-drawer-content>
		</hlm-drawer>
		<button hlmBtn variant="ghost" class="ml-2">Outside</button>
		`,
	}),
};

export const SwipeArea: Story = {
	render: () => ({
		template: `
		<hlm-drawer showSwipeHandle>
			<p class="text-muted-foreground text-sm">Swipe up from the bottom edge to open the drawer.</p>
			<hlm-drawer-swipe-area data-testid="swipe-area" class="h-12 border-t border-dashed" />
			<hlm-drawer-content *hlmDrawerPortal="let ctx">
				<hlm-drawer-header>
					<h3 hlmDrawerTitle>Swipe Area</h3>
					<p hlmDrawerDescription>Opened by swiping up from the edge.</p>
				</hlm-drawer-header>
				${placeholder}
				<hlm-drawer-footer>
					<button hlmDrawerClose hlmBtn>Close</button>
				</hlm-drawer-footer>
			</hlm-drawer-content>
		</hlm-drawer>
		`,
	}),
};
