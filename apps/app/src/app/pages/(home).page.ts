import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight, lucideStar } from '@ng-icons/lucide';
import { AlertPreview } from '@spartan-ng/app/app/pages/(components)/components/(alert)/alert.preview';
import { ButtonGroupPreview } from '@spartan-ng/app/app/pages/(components)/components/(button-group)/button-group.preview';
import { EmptyAvatarGroup } from '@spartan-ng/app/app/pages/(components)/components/(empty)/empty--avatar-group.preview';
import { FieldChoiceCardPreview } from '@spartan-ng/app/app/pages/(components)/components/(field)/field--choice-card.preview';
import { FieldRadioPreview } from '@spartan-ng/app/app/pages/(components)/components/(field)/field--radio.preview';
import { FieldSwitchPreview } from '@spartan-ng/app/app/pages/(components)/components/(field)/field--switch.preview';
import { FieldPreview } from '@spartan-ng/app/app/pages/(components)/components/(field)/field.preview';
import { InputGroupButtonPreview } from '@spartan-ng/app/app/pages/(components)/components/(input-group)/input-group--button.preview';
import { InputGroupTextareaPreview } from '@spartan-ng/app/app/pages/(components)/components/(input-group)/input-group--textarea.preview';
import { InputGroupPreview } from '@spartan-ng/app/app/pages/(components)/components/(input-group)/input-group.preview';
import { ItemPreview } from '@spartan-ng/app/app/pages/(components)/components/(item)/item.preview';
import { KbdButtonPreview } from '@spartan-ng/app/app/pages/(components)/components/(kbd)/kbd--button.preview';
import { KbdPreview } from '@spartan-ng/app/app/pages/(components)/components/(kbd)/kbd.preview';
import { PaginationPreview } from '@spartan-ng/app/app/pages/(components)/components/(pagination)/pagination.preview';
import { SpartanSpinnerBadgePreview } from '@spartan-ng/app/app/pages/(components)/components/(spinner)/spinner--badge.preview';
import { ZeropsLogo } from '@spartan-ng/app/app/pages/(home)/components/zerops-logo';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmFieldSeparator } from '@spartan-ng/helm/field';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { metaWith } from '../shared/meta/meta.util';
import { ThreeHundred } from './(home)/components/three-hundred';

export const routeMeta: RouteMeta = {
	meta: metaWith(
		'spartan - Cutting-edge tools powering Angular full-stack development',
		'Build next-level, full-stack applications with AnalogJs and the spartan/stack. Make them accessible and look incredible with spartan/ui.',
	),
	title: 'spartan - Cutting-edge tools powering Angular full-stack development',
};

const container = 'mx-auto flex flex-col items-center gap-4 text-center';
const subHeading =
	'text-primary leading-tighter max-w-4xl text-2xl font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-3xl xl:tracking-tighter';
const lead = 'text-foreground max-w-3xl text-base text-balance sm:text-lg';

@Component({
	selector: 'spartan-home',
	imports: [
		HlmButton,
		HlmIcon,
		RouterLink,
		HlmBadge,
		NgIcon,
		ThreeHundred,
		ZeropsLogo,
		FieldPreview,
		EmptyAvatarGroup,
		InputGroupPreview,
		SpartanSpinnerBadgePreview,
		KbdPreview,
		KbdButtonPreview,
		InputGroupButtonPreview,
		FieldChoiceCardPreview,
		ItemPreview,
		HlmFieldSeparator,
		FieldRadioPreview,
		InputGroupTextareaPreview,
		ButtonGroupPreview,
		FieldSwitchPreview,
		PaginationPreview,
		AlertPreview,
	],
	host: {
		class: 'block px-2',
	},
	providers: [provideIcons({ lucideStar, lucideArrowRight })],
	template: `
		<section class="flex flex-col items-center gap-2 py-8 text-center md:py-16 lg:py-20 xl:gap-4">
			<div class="${container} max-w-[64rem]">
				<a target="_blank" href="https://zerops.io" hlmBadge variant="outline" class="border-none outline-none">
					<spartan-zerops-logo class="mr-0.5 h-3 w-3 fill-red-800 text-red-700" />
					Powered by Zerops. The dev-first cloud platform.
					<ng-icon hlm name="lucideArrowRight" />
				</a>
				<h1
					class="text-primary leading-tighter max-w-4xl text-4xl font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-5xl xl:tracking-tighter"
				>
					Stop fighting your component library.
				</h1>
				<p class="${lead} max-w-[42rem]">
					Accessible UI primitives for Angular - built with signals, SSR compatible, zoneless ready. Install the
					behavior. Copy the styles. Customize without limits.
				</p>
				<div class="flex flex-wrap justify-center gap-4">
					<a hlmBtn size="sm" routerLink="/documentation">Get Started</a>
					<a hlmBtn size="sm" variant="ghost" routerLink="/components">View Components</a>
					<a
						hlmBtn
						size="sm"
						variant="ghost"
						target="_blank"
						rel="noreferrer"
						href="https://github.com/goetzrobin/spartan"
					>
						<ng-icon hlm size="sm" class="mr-0.5" name="lucideStar" />
						Star on GitHub
					</a>
				</div>
			</div>
		</section>

		<section class="container-wrapper hidden px-6 md:block">
			<div
				class="theme-container mx-auto grid gap-8 py-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6 2xl:gap-8"
			>
				<div class="flex flex-col gap-6 *:[div]:w-full *:[div]:max-w-full">
					<div class="w-full max-w-md rounded-lg border p-6">
						<spartan-field-preview />
					</div>
				</div>
				<div class="flex flex-col gap-6 *:[div]:w-full *:[div]:max-w-full">
					<spartan-empty-avatar-group class="rounded-lg border border-dashed" />
					<spartan-spinner-badge-preview />
					<spartan-input-group-preview />
					<spartan-kbd-preview />
					<spartan-kbd-button-preview class="self-center" />
				</div>

				<div class="flex flex-col gap-6 *:[div]:w-full *:[div]:max-w-full">
					<spartan-input-group-button-preview class="[&>*:not(:nth-child(2))]:hidden" />
					<spartan-item-preview class="[&>*:not(:nth-child(2))]:hidden" />
					<hlm-field-separator class="my-4">Appearance Settings</hlm-field-separator>
					<spartan-field-choice-card-preview />
					<hlm-field-separator class="my-4" />
					<spartan-field-radio-preview />
				</div>
				<div class="flex flex-col gap-6 *:[div]:w-full *:[div]:max-w-full">
					<spartan-input-group-textarea-preview />
					<spartan-button-group-preview />
					<spartan-field-switch-preview class="rounded-lg border p-4" />
					<spartan-pagination-preview />
					<spartan-alert-preview class="[&>*:not(:nth-child(3))]:hidden" />
				</div>
			</div>
		</section>

		<section id="the-300" class="space-y-6 py-8 md:py-12">
			<div class="${container} max-w-[58rem]">
				<h2 class="${subHeading}">Built By The 300</h2>
				<p class="${lead} max-w-[42rem]">
					Ready to make a difference? Join the first 300 and help shape the future of UI development with Angular &
					spartan.
				</p>
			</div>
			<div class="mx-auto space-y-12 text-center md:max-w-[64rem]">
				<spartan-three-hundred class="mt-12" />
				<p class="${lead} mx-auto max-w-[42rem]">
					Contribute code, share insights, or sponsor on GitHub. Let's build something extraordinary together!
				</p>
				<a hlmBtn size="lg" target="_blank" rel="noreferrer" href="https://github.com/goetzrobin/spartan">
					Claim your spot in the 300 today!
				</a>
			</div>
		</section>
	`,
})
export default class HomePage {}
