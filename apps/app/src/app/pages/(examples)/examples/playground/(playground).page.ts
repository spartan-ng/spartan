import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { tablerBrowserPlus, tablerEdit, tablerMessageCheck, tablerRotate } from '@ng-icons/tabler-icons';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';
import { HlmTextarea } from '@spartan-ng/helm/textarea';
import { CodeViewer, PresetActions, PresetSave, PresetSelector, PresetShare } from './components';
import { PRESETS_DATA } from './data/presets';

@Component({
	selector: 'spartan-examples-playground-page',
	imports: [
		PresetShare,
		PresetSave,
		PresetSelector,
		PresetActions,
		CodeViewer,
		HlmSeparator,
		HlmTabsImports,
		HlmIcon,
		NgIcon,
		HlmTextarea,
		HlmButton,
	],
	providers: [provideIcons({ tablerMessageCheck, tablerBrowserPlus, tablerEdit, tablerRotate })],
	template: `
		<div class="hidden flex-1 flex-col rounded-lg border md:flex">
			<div
				class="flex flex-col items-start justify-between gap-2 px-8 py-4 sm:flex-row sm:items-center sm:gap-0 md:h-16"
			>
				<h2 class="pl-0.5 text-lg font-semibold">Playground</h2>
				<div class="ml-auto flex w-full gap-2 sm:justify-end">
					<preset-selector [presets]="presets" />
					<preset-save />
					<div class="hidden gap-2 md:flex">
						<code-viewer />
						<preset-share />
					</div>
					<preset-actions />
				</div>
			</div>
			<hlm-separator />
			<hlm-tabs tab="complete" class="grid flex-1 items-stretch gap-6 p-6 md:grid-cols-[1fr_200px]">
				<div class="col-span-2 md:col-span-1">
					<div hlmTabsContent="complete" class="mt-0">
						<div class="flex h-full flex-col gap-4">
							<textarea
								hlmTextarea
								placeholder="Write a tagline for an ice cream shop"
								class="min-h-[400px] flex-1 p-4 md:min-h-[700px] lg:min-h-[700px]"
							></textarea>
							<div class="flex items-center gap-2">
								<button hlmBtn>Submit</button>
								<Button hlmBtn variant="secondary">
									<span class="sr-only">Show history</span>
									<ng-icon hlm name="tablerRotate" size="sm" />
								</Button>
							</div>
						</div>
					</div>
					<div hlmTabsContent="insert"></div>
					<div hlmTabsContent="edit"></div>
				</div>
				<div class="hidden flex-col gap-6 sm:flex md:order-2">
					<div class="grid gap-3">
						<hlm-tabs-list aria-label="tabs example" class="w-full">
							<button hlmTabsTrigger="complete">
								<ng-icon hlm name="tablerMessageCheck" size="sm" />
							</button>
							<button hlmTabsTrigger="insert">
								<ng-icon hlm name="tablerBrowserPlus" size="sm" />
							</button>
							<button hlmTabsTrigger="edit">
								<ng-icon hlm name="tablerEdit" size="sm" />
							</button>
						</hlm-tabs-list>
					</div>
				</div>
			</hlm-tabs>
		</div>
	`,
})
export default class ExamplesPlaygroundPage {
	protected readonly presets = PRESETS_DATA;
}
