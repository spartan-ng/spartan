import { Component, inject } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideCheck } from '@ng-icons/lucide';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import {
	HlmDialogDescriptionDirective,
	HlmDialogHeaderComponent,
	HlmDialogService,
	HlmDialogTitleDirective,
} from '@spartan-ng/helm/dialog';
import { HlmTableImports } from '@spartan-ng/helm/table';

type ExampleUser = {
	name: string;
	email: string;
	phone: string;
};

@Component({
	selector: 'spartan-dialog-dynamic-component-preview',
	imports: [HlmButtonDirective, ...HlmTableImports],
	template: `
		<button hlmBtn (click)="openDynamicComponent()">Select User</button>
	`,
})
export class DialogDynamicComponentPreviewComponent {
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
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'dynamic-content',
	imports: [HlmDialogHeaderComponent, HlmDialogTitleDirective, HlmDialogDescriptionDirective, ...HlmTableImports],
	providers: [provideIcons({ lucideCheck })],
	template: `
		<hlm-dialog-header>
			<h3 hlmDialogTitle>Select user</h3>
			<p hlmDialogDescription>Click a row to select a user.</p>
		</hlm-dialog-header>

		<table hlmTable class="w-full">
			<tr hlmTr>
				<th hlmTh>Name</th>
				<th hlmTh>Email</th>
				<th hlmTh>Phone</th>
			</tr>
			@for (user of users; track user.name) {
				<tr hlmTr (click)="selectUser(user)" class="cursor-pointer">
					<td hlmTd truncate class="font-medium">{{ user.name }}</td>
					<td hlmTd>{{ user.email }}</td>
					<td hlmTd>{{ user.phone }}</td>
				</tr>
			}
		</table>
	`,
	host: {
		class: 'flex flex-col gap-4',
	},
})
class SelectUserComponent {
	private readonly _dialogRef = inject<BrnDialogRef<ExampleUser>>(BrnDialogRef);
	private readonly _dialogContext = injectBrnDialogContext<{ users: ExampleUser[] }>();

	protected readonly users = this._dialogContext.users;

	public selectUser(user: ExampleUser) {
		this._dialogRef.close(user);
	}
}

export const dynamicComponentCode = `

import { Component, inject } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideCheck } from '@ng-icons/lucide';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import {
	HlmDialogDescriptionDirective,
	HlmDialogHeaderComponent,
	HlmDialogService,
	HlmDialogTitleDirective,
} from '@spartan-ng/helm/dialog';
import { HlmTableImports } from '@spartan-ng/helm/table';

type ExampleUser = {
	name: string;
	email: string;
	phone: string;
};

@Component({
	selector: 'spartan-dialog-dynamic-component-preview',
	imports: [HlmButtonDirective, ...HlmTableImports],
	template: \`
		<button hlmBtn (click)="openDynamicComponent()">Select User</button>
	\`,
})
export class DialogDynamicComponentPreviewComponent {
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
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'dynamic-content',
	imports: [HlmDialogHeaderComponent, HlmDialogTitleDirective, HlmDialogDescriptionDirective, ...HlmTableImports],
	providers: [provideIcons({ lucideCheck })],
	template: \`
		<hlm-dialog-header>
			<h3 hlmDialogTitle>Select user</h3>
			<p hlmDialogDescription>Click a row to select a user.</p>
		</hlm-dialog-header>

		<table hlmTable class="w-full">
			<tr hlmTr>
				<th hlmTh class="w-44">Name</th>
				<th hlmTh class="w-60">Email</th>
				<th hlmTh class="w-48">Phone</th>
			</tr>
			@for (user of users; track user.name) {
				<tr hlmTr (click)="selectUser(user)" class="cursor-pointer">
					<td hlmTd truncate class="font-medium">{{ user.name }}</td>
					<td hlmTd>{{ user.email }}</td>
					<td hlmTd>{{ user.phone }}</td>
				</tr>
			}
		</table>
	\`,
	host: {
		class: 'flex flex-col gap-4',
	},
})
class SelectUserComponent {
	private readonly _dialogRef = inject<BrnDialogRef<ExampleUser>>(BrnDialogRef);
	private readonly _dialogContext = injectBrnDialogContext<{ users: ExampleUser[] }>();

	protected readonly users = this._dialogContext.users;

	public selectUser(user: ExampleUser) {
		this._dialogRef.close(user);
	}
}
`;
