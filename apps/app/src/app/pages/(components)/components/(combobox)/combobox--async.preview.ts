import { ChangeDetectionStrategy, Component, computed, resource, signal } from '@angular/core';
import { HlmComboboxImports } from '@spartan-ng/helm/combobox';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';

interface DirectoryUser {
	id: string;
	name: string;
	username: string;
	email: string;
	title: string;
}

@Component({
	selector: 'spartan-combobox-async-preview',
	imports: [HlmComboboxImports, HlmSpinnerImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-combobox [(search)]="search" [itemToString]="itemToString">
			<hlm-combobox-input placeholder="Assign reviewer" showClear />
			<hlm-combobox-content *hlmComboboxPortal>
				@if (showStatus()) {
					<hlm-combobox-status>
						@if (users.error(); as error) {
							{{ error }}
						} @else if (users.isLoading()) {
							<hlm-spinner />
							Loading...
						} @else if (search().length === 0) {
							Type to search users.
						} @else {
							No matches for "{{ search() }}".
						}
					</hlm-combobox-status>
				}
				@if (!users.isLoading()) {
					<hlm-combobox-empty>Try a different search term.</hlm-combobox-empty>
				}
				<div hlmComboboxList>
					@if (users.hasValue()) {
						@for (user of users.value(); track user.id) {
							<hlm-combobox-item [value]="user">{{ user.name }}</hlm-combobox-item>
						}
					}
				</div>
			</hlm-combobox-content>
		</hlm-combobox>
	`,
})
export class ComboboxAsyncPreview {
	public search = signal('');

	public itemToString = (user: DirectoryUser) => user.name;

	public users = resource({
		defaultValue: [],
		params: () => ({ search: this.search() }),
		loader: async ({ params }) => {
			const search = params.search;

			if (search.length === 0) {
				return [];
			}

			return await this.searchUsers(search, (item, query) => item.toLowerCase().includes(query.toLowerCase()));
		},
	});

	public showStatus = computed(
		() =>
			this.users.error() ||
			this.users.isLoading() ||
			this.search().length === 0 ||
			(this.users.hasValue() && this.users.value().length === 0),
	);

	async searchUsers(query: string, filter: (item: string, query: string) => boolean): Promise<DirectoryUser[]> {
		// Simulate network delay
		await new Promise((resolve) => {
			setTimeout(resolve, Math.random() * 500 + 100);
		});

		// Simulate occasional network errors (1% chance)
		if (Math.random() < 0.01 || query === 'will_error') {
			throw new Error('Network error.');
		}

		return this._allUsers.filter((user) => {
			return (
				filter(user.name, query) ||
				filter(user.username, query) ||
				filter(user.email, query) ||
				filter(user.title, query)
			);
		});
	}

	private readonly _allUsers: DirectoryUser[] = [
		{
			id: 'leslie-alexander',
			name: 'Leslie Alexander',
			username: 'leslie',
			email: 'leslie.alexander@example.com',
			title: 'Product Manager',
		},
		{
			id: 'kathryn-murphy',
			name: 'Kathryn Murphy',
			username: 'kathryn',
			email: 'kathryn.murphy@example.com',
			title: 'Marketing Lead',
		},
		{
			id: 'courtney-henry',
			name: 'Courtney Henry',
			username: 'courtney',
			email: 'courtney.henry@example.com',
			title: 'Design Systems',
		},
		{
			id: 'michael-foster',
			name: 'Michael Foster',
			username: 'michael',
			email: 'michael.foster@example.com',
			title: 'Engineering Manager',
		},
		{
			id: 'lindsay-walton',
			name: 'Lindsay Walton',
			username: 'lindsay',
			email: 'lindsay.walton@example.com',
			title: 'Product Designer',
		},
		{
			id: 'tom-cook',
			name: 'Tom Cook',
			username: 'tom',
			email: 'tom.cook@example.com',
			title: 'Frontend Engineer',
		},
		{
			id: 'whitney-francis',
			name: 'Whitney Francis',
			username: 'whitney',
			email: 'whitney.francis@example.com',
			title: 'Customer Success',
		},
		{
			id: 'jacob-jones',
			name: 'Jacob Jones',
			username: 'jacob',
			email: 'jacob.jones@example.com',
			title: 'Security Engineer',
		},
		{
			id: 'arlene-mccoy',
			name: 'Arlene McCoy',
			username: 'arlene',
			email: 'arlene.mccoy@example.com',
			title: 'Data Analyst',
		},
		{
			id: 'marvin-mckinney',
			name: 'Marvin McKinney',
			username: 'marvin',
			email: 'marvin.mckinney@example.com',
			title: 'QA Specialist',
		},
		{
			id: 'eleanor-pena',
			name: 'Eleanor Pena',
			username: 'eleanor',
			email: 'eleanor.pena@example.com',
			title: 'Operations',
		},
		{
			id: 'jerome-bell',
			name: 'Jerome Bell',
			username: 'jerome',
			email: 'jerome.bell@example.com',
			title: 'DevOps Engineer',
		},
	];
}
