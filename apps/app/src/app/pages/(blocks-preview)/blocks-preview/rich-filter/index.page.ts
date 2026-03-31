import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, ViewEncapsulation } from '@angular/core';
import { buildFilterModel, fieldBuilder as f } from './engine/builders';
import { QueryToken } from './engine/constants';
import { Operators } from './engine/operators';
import { filterParser } from './engine/parser';
import { SpartanRichFilter } from './rich-filter';

const roleOptions = [
	{ label: 'Admin', value: 'admin' },
	{ label: 'User', value: 'user' },
	{ label: 'Guest', value: 'guest' },
];

const comboboxOptions = [
	{ label: 'United States', value: 'US' },
	{ label: 'Canada', value: 'CA' },
	{ label: 'United Kingdom', value: 'UK' },
	{ label: 'Australia', value: 'AU' },
	{ label: 'Germany', value: 'DE' },
	{ label: 'France', value: 'FR' },
	{ label: 'Japan', value: 'JP' },
	{ label: 'China', value: 'CN' },
	{ label: 'India', value: 'IN' },
	{ label: 'Brazil', value: 'BR' },
];

/**
 *
 */
interface User {
	id: number;
	firstName: string;
	lastName: string;
	maidenName: string;
	age: number;
	gender: string;
	email: string;
	phone: string;
	username: string;
	password: string;
	birthDate: string;
	image: string;
	bloodGroup: string;
	height: number;
	weight: number;
	eyeColor: string;
	hair: {
		color: string;
		type: string;
	};
	ip: string;
	address: {
		address: string;
		city: string;
		state: string;
		stateCode: string;
		postalCode: string;
		coordinates: {
			lat: number;
			lng: number;
		};
		country: string;
	};
	macAddress: string;
	university: string;
	bank: {
		cardExpire: string;
		cardNumber: string;
		cardType: string;
		currency: string;
		iban: string;
	};
	company: {
		department: string;
		name: string;
		title: string;
		address: {
			address: string;
			city: string;
			state: string;
			stateCode: string;
			postalCode: string;
			coordinates: {
				lat: number;
				lng: number;
			};
			country: string;
		};
	};
	ein: string;
	ssn: string;
	userAgent: string;
	crypto: {
		coin: string;
		wallet: string;
		network: string;
	};
	role: string;
}

@Component({
	selector: 'spartan-rich-filter-page',
	imports: [SpartanRichFilter, JsonPipe],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'block',
	},
	styleUrl: '../../blocks-preview-default.css',
	template: `
		<div class="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
			<div class="w-full max-w-6xl">
				<spartan-rich-filter [state]="filterState" />
				<div class="mt-10">
					<div>Who's focused at start</div>
					<pre>{{ filterState.focusedField() }}</pre>
				</div>
				<div class="mt-10">
					<div>Parsed Value</div>
					<pre>{{ payload() | json }}</pre>
				</div>
				<div class="mt-10">
					<div>Raw Value</div>
					<pre>{{ filterState.value() | json }}</pre>
				</div>
			</div>
		</div>
	`,
})
export default class RichFilterPage {
	public readonly filterState = buildFilterModel(
		f.text('name', '', Operators.includes, { required: true, label: 'Name' }),
		f.number('age', 0, Operators.greaterThan, { min: 0, max: 120, step: 1, label: 'Age' }),
		f.boolean('isActive', true, { label: 'Is Active' }),
		f.select('role', null, Operators.is, { options: roleOptions, label: 'Role' }),
		f.date('createdAt', new Date(), Operators.at, { max: new Date(), label: 'Created At' }),
		f.daterange('dateRange', { start: new Date(), end: new Date() }, Operators.between, {
			max: new Date(),
			label: 'Date Range',
		}),
		f.range('priceRange', [1, 2], Operators.between, { min: -100, max: 100, label: 'Price Range' }),
		f.time('time', new Date(), Operators.notPast, { label: 'Time' }),
		f.combobox('country', '', Operators.is, {
			options: comboboxOptions,
			placeholder: 'Select a country',
			label: 'Country',
		}),
		f.asyncCombobox('reviewer', '', Operators.is, {
			placeholder: 'Search reviewers',
			itemToString: (user: unknown) => (<User>user).firstName + ' ' + (<User>user).lastName,
			resourceOptions: {
				defaultValue: [],
				parse: (response: unknown) => <User[]>(<any>response).users,
			},
			label: 'Reviewer',
			resourceRequest: {
				url: `https://dummyjson.com/users/search?q=${QueryToken}`,
			},
		}),
	);

	public readonly parserFn = filterParser;

	public readonly payload = computed(() => this.parserFn(this.filterState.value()));
}
