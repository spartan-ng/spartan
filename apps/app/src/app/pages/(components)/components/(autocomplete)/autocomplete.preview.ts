import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmAutocomplete } from '@spartan-ng/helm/autocomplete';

@Component({
	selector: 'spartan-autocomplete-preview',
	imports: [HlmAutocomplete],
	template: `
		<hlm-autocomplete [options]="options" />
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompletePreview {
	public readonly options: string[] = [
		'Marty McFly',
		'Doc Brown',
		'Biff Tannen',
		'George McFly',
		'Jennifer Parker',
		'Emmett Brown',
		'Einstein',
		'Clara Clayton',
		'Needles',
		'Goldie Wilson',
		'Marvin Berry',
		'Lorraine Baines',
		'Strickland',
	];
}

export const defaultImports = `
import { HlmAutocomplete } from '@spartan-ng/helm/autocomplete';
`;

export const defaultSkeleton = `
<hlm-autocomplete [options]="options" />
`;
