import { ChangeDetectionStrategy, Component } from '@angular/core';
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
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="md:hidden">
			<img src="/assets/examples-light.png" alt="Examples" class="block dark:hidden" />
			<img src="/assets/examples-dark.png" alt="Examples" class="hidden dark:block" />
		</div>
		<div
			class="theme-container mx-auto hidden h-full gap-8 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6 2xl:gap-8"
		>
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
})
export class OverviewExample {}
