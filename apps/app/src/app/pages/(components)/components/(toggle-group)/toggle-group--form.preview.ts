import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBookmark, lucideHeart, lucideStar } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmToggleGroupImports } from '@spartan-ng/helm/toggle-group';

@Component({
	selector: 'spartan-toggle-group-form',
	imports: [HlmToggleGroupImports, HlmButtonImports, NgIcon, FormRoot, FormField],
	providers: [provideIcons({ lucideStar, lucideHeart, lucideBookmark })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<form class="space-y-6" [formRoot]="form">
			<hlm-toggle-group [formField]="form.action" type="single" variant="outline" spacing="2" size="sm">
				<button
					hlmToggleGroupItem
					value="star"
					aria-label="Toggle star"
					class="data-[state=on]:bg-transparent data-[state=on]:*:[ng-icon]:*:[svg]:fill-yellow-500 data-[state=on]:*:[ng-icon]:*:[svg]:stroke-yellow-500"
				>
					<ng-icon name="lucideStar" />
					Star
				</button>
				<button
					hlmToggleGroupItem
					value="heart"
					aria-label="Toggle heart"
					class="data-[state=on]:bg-transparent data-[state=on]:*:[ng-icon]:*:[svg]:fill-red-500 data-[state=on]:*:[ng-icon]:*:[svg]:stroke-red-500"
				>
					<ng-icon name="lucideHeart" />
					Heart
				</button>
				<button
					hlmToggleGroupItem
					value="bookmark"
					aria-label="Toggle bookmark"
					class="data-[state=on]:bg-transparent data-[state=on]:*:[ng-icon]:*:[svg]:fill-blue-500 data-[state=on]:*:[ng-icon]:*:[svg]:stroke-blue-500"
				>
					<ng-icon name="lucideBookmark" />
					Bookmark
				</button>
			</hlm-toggle-group>

			<button hlmBtn type="submit">Submit</button>
		</form>
	`,
})
export class ToggleGroupSpacingForm {
	protected readonly _model = signal({
		action: 'star',
	});

	public readonly form = form(
		this._model,
		(schemaPath) => {
			required(schemaPath.action, { message: 'Please select an action' });
		},
		{
			submission: {
				action: async () => {
					const model = this._model();
					console.log(model);
				},
			},
		},
	);
}
