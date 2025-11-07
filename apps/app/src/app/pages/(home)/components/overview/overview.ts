import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { HlmFieldSeparator } from '@spartan-ng/helm/field';
import { AppearanceSettings } from './components/appearance-settings';
import { ButtonGroupDemo } from './components/button-group-demo';
import { ButtonGroupInputGroup } from './components/button-group-input-group';
import { ButtonGroupNested } from './components/button-group-nested';
import { ButtonGroupPopover } from './components/button-group-popover';
import { EmptyAvatarGroup } from './components/empty-avatar-group';
import { FieldCheckbox } from './components/field-checkbox';
import { FieldDemo } from './components/field-demo';
import { FieldHear } from './components/field-hear';
import { FieldSlider } from './components/field-slider';
import { InputGroupDemo } from './components/input-group';
import { InputGroupButtonExample } from './components/input-group-button-example';
import { ItemDemo } from './components/item-demo';
import { NotionPrompt } from './components/notion-prompt';
import { SpinnerBadge } from './components/spinner-badge';
import { SpinnerEmpty } from './components/spinner-empty';

@Component({
	selector: 'spartan-overview-example',
	imports: [
		HlmFieldSeparator,
		FieldDemo,
		EmptyAvatarGroup,
		SpinnerBadge,
		ButtonGroupInputGroup,
		FieldSlider,
		InputGroupDemo,
		InputGroupButtonExample,
		ItemDemo,
		AppearanceSettings,
		NotionPrompt,
		ButtonGroupDemo,
		FieldCheckbox,
		ButtonGroupPopover,
		ButtonGroupNested,
		FieldHear,
		SpinnerEmpty,
	],
	template: `
		<div class="theme-container mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6 2xl:gap-8">
			<div class="flex flex-col gap-6 *:[div]:w-full *:[div]:max-w-full">
				<spartan-field-demo />
			</div>
			<div class="flex flex-col gap-6 *:[div]:w-full *:[div]:max-w-full">
				<spartan-empty-avatar-group />
				<spartan-spinner-badge />
				<spartan-button-group-input-group />
				<spartan-field-slider />
				<spartan-input-group />
			</div>
			<div class="flex flex-col gap-6 *:[div]:w-full *:[div]:max-w-full">
				<spartan-input-group-button-example />
				<spartan-item-demo />
				<hlm-field-separator class="my-4">Appearance Settings</hlm-field-separator>
				<spartan-appearance-settings />
			</div>
			<div class="flex flex-col gap-6 *:[div]:w-full *:[div]:max-w-full">
				<spartan-notion-prompt />
				<spartan-button-group-demo />
				<spartan-field-checkbox />
				<div class="flex justify-between gap-4">
					<spartan-button-group-nested />
					<spartan-button-group-popover />
				</div>
				<spartan-field-hear />
				<spartan-spinner-empty />
			</div>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewExample {
	protected readonly _isFavorite = signal(false);
	protected readonly _gpuCount = signal(8);
	public readonly label = signal('personal');
	public readonly sliderValue = signal(500);
	protected readonly _favoriteClass = computed(() =>
		this._isFavorite() ? '[&>svg]:fill-blue-600 [&>svg]:stroke-blue-600' : '',
	);

	protected _toggleFavorite(): void {
		this._isFavorite.update((f) => !f);
	}

	protected _gpuCountIncrease(): void {
		this._gpuCount.update((count) => count + 1);
	}

	protected _gpuCountDecrease(): void {
		this._gpuCount.update((count) => Math.max(0, count - 1));
	}
}
