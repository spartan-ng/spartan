import { Component, HostBinding, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck } from '@ng-icons/lucide';
import {
	BrnDialogContentDirective,
	BrnDialogImports,
	BrnDialogRef,
	BrnDialogTriggerDirective,
	injectBrnDialogContext,
} from '@spartan-ng/brain/dialog';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import {
	HlmDialogComponent,
	HlmDialogContentComponent,
	HlmDialogDescriptionDirective,
	HlmDialogHeaderComponent,
	HlmDialogImports,
	HlmDialogService,
	HlmDialogTitleDirective,
} from '@spartan-ng/helm/dialog';
import { HlmIconDirective } from '@spartan-ng/helm/icon';
import { HlmInputDirective } from '@spartan-ng/helm/input';
import { HlmLabelDirective } from '@spartan-ng/helm/label';
import { HlmTableComponent, HlmTdComponent, HlmThComponent, HlmTrowComponent } from '@spartan-ng/helm/table';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

const meta: Meta<HlmDialogComponent> = {
	title: 'Dialog',
	component: HlmDialogComponent,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [BrnDialogImports, HlmDialogImports, HlmLabelDirective, HlmButtonDirective, HlmInputDirective],
		}),
	],
};

export default meta;
type Story = StoryObj<HlmDialogComponent>;

export const Default: Story = {
	render: () => ({
		template: `
    <hlm-dialog>
    <button id='edit-profile' brnDialogTrigger hlmBtn>Edit Profile</button>
    <hlm-dialog-content class='sm:max-w-[425px]' *brnDialogContent='let ctx'>
         <hlm-dialog-header>
          <h3 hlmDialogTitle>Edit profile</h3>
          <p hlmDialogDescription>
            Make changes to your profile here. Click save when you're done.
          </p>
        </hlm-dialog-header>
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
        <hlm-dialog-footer>
          <button hlmBtn type='submit'>Save changes</button>
        </hlm-dialog-footer>
    </hlm-dialog-content>
    </hlm-dialog>
    `,
	}),
};

@Component({
	selector: 'nested-dialog-story',
	standalone: true,
	imports: [
		HlmDialogComponent,
		HlmButtonDirective,
		BrnDialogTriggerDirective,
		BrnDialogContentDirective,
		HlmDialogContentComponent,
		HlmDialogHeaderComponent,
		HlmDialogDescriptionDirective,
		HlmDialogTitleDirective,
	],
	template: `
		<hlm-dialog>
			<button brnDialogTrigger hlmBtn>Open Dialog</button>
			<hlm-dialog-content *brnDialogContent>
				<hlm-dialog-header>
					<h3 hlmDialogTitle>First dialog</h3>
					<p hlmDialogDescription>Click the button below to open a nested dialog.</p>
				</hlm-dialog-header>

				<hlm-dialog>
					<button brnDialogTrigger hlmBtn class="w-full">Open Nested Dialog</button>
					<hlm-dialog-content *brnDialogContent="let ctx">
						<hlm-dialog-header>
							<h3 hlmDialogTitle>Nested dialog</h3>
							<p hlmDialogDescription>I am a nested dialog!</p>
						</hlm-dialog-header>

						<button hlmBtn (click)="ctx.close()">Close Nested Dialog</button>
					</hlm-dialog-content>
				</hlm-dialog>
			</hlm-dialog-content>
		</hlm-dialog>
	`,
})
class NestedDialogStory {}

export const NestedDialog: Story = {
	name: 'Nested Dialog',
	decorators: [
		moduleMetadata({
			imports: [NestedDialogStory],
		}),
	],
	render: () => ({
		template: '<nested-dialog-story />',
	}),
};

type ExampleUser = {
	name: string;
	email: string;
	phone: string;
};

@Component({
	selector: 'dialog-dynamic-component-story',
	standalone: true,
	imports: [HlmButtonDirective],
	template: `
		<button hlmBtn (click)="openDynamicComponent()">Select User</button>
	`,
})
class DialogDynamicComponentStory {
	private readonly _hlmDialogService = inject(HlmDialogService);

	private readonly _users: ExampleUser[] = [
		{
			name: 'Helena Chambers',
			email: 'helenachambers@chorizon.com',
			phone: '+1 (812) 588-3759',
		},
		{
			name: 'Josie Crane',
			email: 'josiecrane@hinway.com',
			phone: '+1 (884) 523-3324',
		},
		{
			name: 'Lou Hartman',
			email: 'louhartman@optyk.com',
			phone: '+1 (912) 479-3998',
		},
		{
			name: 'Lydia Zimmerman',
			email: 'lydiazimmerman@ultrasure.com',
			phone: '+1 (944) 511-2111',
		},
	];

	public openDynamicComponent() {
		const dialogRef = this._hlmDialogService.open(SelectUserComponent, {
			context: {
				users: this._users,
			},
			contentClass: 'sm:!max-w-[750px]',
		});

		dialogRef.closed$.subscribe((user) => {
			if (user) {
				console.log('Selected user:', user);
			}
		});
	}
}

@Component({
	selector: 'dynamic-content',
	standalone: true,
	imports: [
		HlmDialogHeaderComponent,
		HlmDialogTitleDirective,
		HlmDialogDescriptionDirective,
		HlmTableComponent,
		HlmThComponent,
		HlmTrowComponent,
		HlmTdComponent,
		HlmButtonDirective,
		NgIcon,
		HlmIconDirective,
	],
	providers: [provideIcons({ lucideCheck })],
	template: `
		<hlm-dialog-header>
			<h3 hlmDialogTitle>Select user</h3>
			<p hlmDialogDescription>Click a row to select a user.</p>
		</hlm-dialog-header>

		<hlm-table>
			<hlm-trow>
				<hlm-th class="w-44">Name</hlm-th>
				<hlm-th class="w-60">Email</hlm-th>
				<hlm-th class="w-48">Phone</hlm-th>
			</hlm-trow>
			@for (user of users; track user.name) {
				<button class="text-left" (click)="selectUser(user)">
					<hlm-trow>
						<hlm-td truncate class="w-44 font-medium">{{ user.name }}</hlm-td>
						<hlm-td class="w-60">{{ user.email }}</hlm-td>
						<hlm-td class="w-48">{{ user.phone }}</hlm-td>
					</hlm-trow>
				</button>
			}
		</hlm-table>
	`,
})
class SelectUserComponent {
	@HostBinding('class') private readonly _class: string = 'flex flex-col gap-4';

	private readonly _hlmDialogService = inject(HlmDialogService);
	private readonly _dialogRef = inject<BrnDialogRef<ExampleUser>>(BrnDialogRef);
	private readonly _dialogContext = injectBrnDialogContext<{ users: ExampleUser[] }>();

	protected readonly users = this._dialogContext.users;

	public selectUser(user: ExampleUser) {
		this._hlmDialogService.open(SelectUserComponent, { context: { users: [user] }, contentClass: 'sm:!max-w-[750px]' });
		// this._dialogRef.close(user);
	}
}

export const DynamicComponent: Story = {
	name: 'Dynamic Component',
	decorators: [
		moduleMetadata({
			imports: [DialogDynamicComponentStory],
		}),
	],
	render: () => ({
		template: '<dialog-dynamic-component-story />',
	}),
};

@Component({
	selector: 'nested-dialog-dynamic-first',
	standalone: true,
	imports: [
		HlmButtonDirective,
		HlmDialogContentComponent,
		HlmDialogHeaderComponent,
		HlmDialogTitleDirective,
		HlmDialogDescriptionDirective,
	],
	template: `
		<hlm-dialog-header>
			<h3 hlmDialogTitle>First dialog</h3>
			<p hlmDialogDescription>Click the button below to open a nested dialog.</p>
		</hlm-dialog-header>

		<button hlmBtn (click)="openNestedDialog()">Open Nested Dialog</button>
	`,
	host: {
		class: 'flex flex-col gap-4',
	},
})
class NestedDialogDynamicFirstComponent {
	private readonly _hlmDialogService = inject(HlmDialogService);

	public openNestedDialog() {
		this._hlmDialogService.open(NestedDialogDynamicNestedComponent);
	}
}

@Component({
	selector: 'nested-dialog-dynamic-nested',
	standalone: true,
	imports: [HlmButtonDirective, HlmDialogHeaderComponent, HlmDialogTitleDirective, HlmDialogDescriptionDirective],
	template: `
		<hlm-dialog-header>
			<h3 hlmDialogTitle>Nested dialog</h3>
			<p hlmDialogDescription>I am a nested dialog!</p>
		</hlm-dialog-header>

		<button hlmBtn (click)="close()">Close Nested Dialog</button>
	`,
	host: {
		class: 'flex flex-col gap-4',
	},
})
class NestedDialogDynamicNestedComponent {
	private readonly _brnDialogRef = inject(BrnDialogRef);

	public close() {
		this._brnDialogRef.close();
	}
}

@Component({
	selector: 'nested-dialog-dynamic-content-story',
	standalone: true,
	imports: [HlmButtonDirective],
	template: `
		<button hlmBtn (click)="openDialog()">Open Dialog</button>
	`,
})
class NestedDialogDynamicComponentStory {
	private readonly _hlmDialogService = inject(HlmDialogService);

	public openDialog() {
		this._hlmDialogService.open(NestedDialogDynamicFirstComponent);
	}
}

export const NestedDynamicComponent: Story = {
	name: 'Nested Dynamic Component',
	decorators: [
		moduleMetadata({
			imports: [NestedDialogDynamicComponentStory],
		}),
	],
	render: () => ({
		template: '<nested-dialog-dynamic-content-story />',
	}),
};
