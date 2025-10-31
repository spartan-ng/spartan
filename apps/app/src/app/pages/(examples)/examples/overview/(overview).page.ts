import { RouteMeta } from '@analogjs/router';
import { Component, computed, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
	lucideArrowLeft,
	lucideArrowRight,
	lucideArrowUp,
	lucideAudioLines,
	lucideBadgeCheck,
	lucideBot,
	lucideCheck,
	lucideChevronDown,
	lucideEllipsis,
	lucideInfo,
	lucideMinus,
	lucidePlus,
	lucideSearch,
	lucideSend,
} from '@ng-icons/lucide';
import { tablerInfoCircle, tablerStar } from '@ng-icons/tabler-icons';
import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';
import { BrnMenuTrigger } from '@spartan-ng/brain/menu';
import { BrnPopoverImports } from '@spartan-ng/brain/popover';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmCheckbox } from '@spartan-ng/helm/checkbox';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmItemImports } from '@spartan-ng/helm/item';
import { HlmMenuImports } from '@spartan-ng/helm/menu';
import { HlmRadioGroupImports } from '@spartan-ng/helm/radio-group';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSliderImports } from '@spartan-ng/helm/slider';
import { HlmSwitch } from '@spartan-ng/helm/switch';
import { HlmTextarea } from '@spartan-ng/helm/textarea';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';
import { HlmLabel } from '../../../../../../../../libs/helm/label/src/lib/hlm-label';
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

export const routeMeta: RouteMeta = {
	meta: metaWith(
		'spartan/examples - Examples Overview',
		"SPARTAN comes with helpful directives that enforce consistent styling across your application's typography.",
	),
	title: 'spartan/examples - Examples Overview',
};

@Component({
	selector: 'spartan-examples-overview',
	imports: [
		HlmCheckbox,
		HlmTextarea,
		HlmButton,
		HlmInputImports,
		HlmFieldImports,
		BrnSelectImports,
		HlmSelectImports,
		HlmEmptyImports,
		HlmAvatarImports,
		HlmBadgeImports,
		HlmButtonGroupImports,
		HlmInputGroupImports,
		HlmFieldImports,
		HlmSliderImports,
		HlmSeparatorImports,
		HlmTooltipImports,
		BrnPopoverImports,
		HlmItemImports,
		HlmRadioGroupImports,
		BrnMenuTrigger,
		HlmMenuImports,
		NgIcon,
		HlmIcon,
		ReactiveFormsModule,
		HlmSwitch,
		HlmLabel,
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
	providers: [
		provideIcons({
			lucidePlus,
			lucideAudioLines,
			lucideSearch,
			lucideSend,
			lucideInfo,
			lucideArrowUp,
			lucideCheck,
			lucideBadgeCheck,
			lucideMinus,
			lucideArrowLeft,
			lucideArrowRight,
			lucideBot,
			lucideChevronDown,
			lucideEllipsis,
			tablerStar,
			tablerInfoCircle,
		}),
	],
	template: `
		<div
			class="theme-container mx-auto grid gap-8 py-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6 2xl:gap-8"
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
				<hlm-field-separator>Appearance Settings</hlm-field-separator>
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
export default class OverviewPage {
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
