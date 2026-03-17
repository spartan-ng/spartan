import { Clipboard } from '@angular/cdk/clipboard';
import { TitleCasePipe } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideClipboard, lucideTerminal } from '@ng-icons/lucide';
import {
	ManualInstallPrimitives,
	ManualInstallService,
	Theme,
	THEMES,
} from '@spartan-ng/app/app/core/services/manual-install.service';
import { CLIMode, CLIModeService } from '@spartan-ng/app/app/shared/cli-mode.service';
import { Code } from '@spartan-ng/app/app/shared/code/code';
import { SectionSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-heading';
import { tabBtn, tabContent } from '@spartan-ng/app/app/shared/layout/tabs';
import { BrnTabs, BrnTabsContent, BrnTabsList, BrnTabsTrigger } from '@spartan-ng/brain/tabs';
import { HlmAccordionImports } from '@spartan-ng/helm/accordion';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';

const cliBtn =
	"relative inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 group-data-[variant=default]/tabs-list:data-[state=active]:shadow-sm group-data-[variant=line]/tabs-list:data-[state=active]:shadow-none dark:text-muted-foreground dark:hover:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent dark:group-data-[variant=line]/tabs-list:data-[state=active]:border-transparent dark:group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent data-[state=active]:bg-background data-[state=active]:text-foreground dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 dark:data-[state=active]:text-foreground after:absolute after:bg-foreground after:opacity-0 after:transition-opacity group-data-[orientation=horizontal]/tabs:after:inset-x-0 group-data-[orientation=horizontal]/tabs:after:bottom-[-5px] group-data-[orientation=horizontal]/tabs:after:h-0.5 group-data-[orientation=vertical]/tabs:after:inset-y-0 group-data-[orientation=vertical]/tabs:after:-right-1 group-data-[orientation=vertical]/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-[state=active]:after:opacity-100 h-7 border border-transparent pt-0.5 shadow-none! data-[state=active]:border-input data-[state=active]:bg-background!";

@Component({
	selector: 'spartan-install-tabs',
	imports: [
		BrnTabs,
		BrnTabsList,
		BrnTabsTrigger,
		BrnTabsContent,
		Code,
		SectionSubHeading,
		HlmTabsImports,
		NgIcon,
		HlmButton,
		HlmIcon,
		TitleCasePipe,
		HlmAccordionImports,
	],
	providers: [provideIcons({ lucideTerminal, lucideClipboard, lucideCheck })],
	host: {
		class: 'block mt-4',
	},
	template: `
		<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>

		<div class="mt-6 block" hlmTabs tab="Command">
			<div
				brnTabsList
				class="border-border text-muted-foreground mb-4 inline-flex h-9 w-full items-center justify-start rounded-none border-b bg-transparent p-0"
				aria-label="Tablist showing Command and Manual"
			>
				<button class="${tabBtn}" brnTabsTrigger="Command">Command</button>
				<button class="${tabBtn}" brnTabsTrigger="Manual">Manual</button>
			</div>

			<!-- CLI -->
			<div class="${tabContent}" brnTabsContent="Command">
				<div
					class="border-border block rounded-md bg-[#f8f8f8] dark:bg-zinc-900"
					[brnTabs]="_activeCliTab()"
					(tabActivated)="onCliTabChange($event)"
				>
					<div class="border-border/50 flex items-center gap-2 border-b px-3 py-1">
						<div class="flex items-center rounded-xs bg-[#5e5e5e] p-px dark:bg-[#bdbdbd]">
							<ng-icon name="lucideTerminal" class="text-white dark:text-black" />
						</div>

						<div brnTabsList class="flex" aria-label="Tablist showing Angular CLI and Nx Plugin">
							<button class="${cliBtn}" brnTabsTrigger="cli">Angular CLI</button>
							<button class="${cliBtn}" brnTabsTrigger="nx">Nx Plugin</button>
						</div>

						<button (click)="copyCli()" hlmBtn variant="ghost" class="ml-auto h-6 w-6">
							<ng-icon hlm size="xs" [name]="_cliCopied ? 'lucideCheck' : 'lucideClipboard'" />
						</button>
					</div>

					<div hlmTabsContent="cli">
						<spartan-code [code]="'ng g @spartan-ng/cli:ui ' + primitive()" disableCopy />
					</div>
					<div hlmTabsContent="nx">
						<spartan-code [code]="'nx g @spartan-ng/cli:ui ' + primitive()" disableCopy />
					</div>
				</div>
			</div>

			<!-- MANUAL -->
			<div brnTabsContent="Manual">
				@let code = _code();
				@let utils = _utils();
				@let themes = _themes();

				@defer (on viewport) {
					@if (code && utils) {
						<div class="space-y-4">
							<div hlmAccordion type="multiple">
								<div hlmAccordionItem class="border-b-0">
									<h3 class="contents">
										<button
											hlmAccordionTrigger
											class="focus-visible:border-ring focus-visible:ring-ring/50 rounded-md px-0 py-0 hover:no-underline"
										>
											<span class="flex items-center gap-3">
												<span
													class="flex size-10 shrink-0 items-center justify-center rounded-full border"
													aria-hidden="true"
												>
													1
												</span>
												<span class="text-[15px] leading-6 font-semibold">Copy utils if needed</span>
											</span>
											<ng-icon hlm hlmAccIcon name="lucideChevronDown" class="opacity-60" />
										</button>
									</h3>

									<hlm-accordion-content class="text-muted-foreground ml-5 border-l ps-8">
										<spartan-code [code]="utils" language="ts" />
									</hlm-accordion-content>
								</div>
								<div class="ml-5 h-4 border-l ps-8 last:hidden"></div>

								<div hlmAccordionItem class="border-b-0" isOpened>
									<h3 class="contents">
										<button
											hlmAccordionTrigger
											class="focus-visible:border-ring focus-visible:ring-ring/50 rounded-md px-0 py-0 hover:no-underline"
										>
											<span class="flex items-center gap-3">
												<span
													class="flex size-10 shrink-0 items-center justify-center rounded-full border"
													aria-hidden="true"
												>
													2
												</span>
												<span class="text-[15px] leading-6 font-semibold">
													Copy and paste the following code into your project.
												</span>
											</span>
											<ng-icon hlm hlmAccIcon name="lucideChevronDown" class="opacity-60" />
										</button>
									</h3>

									<hlm-accordion-content class="text-muted-foreground ml-5 border-l ps-8">
										<div
											class="${tabContent} border-border block rounded-md bg-[#f8f8f8] dark:bg-zinc-900"
											[brnTabs]="_activeComponentTab()"
											(tabActivated)="onComponentTabChange($event)"
										>
											<div class="border-border/50 flex items-center gap-2 border-b px-3 py-1">
												<div brnTabsList class="flex" aria-label="Tablist showing themes">
													@for (theme of themes; track theme) {
														<button class="${cliBtn}" [brnTabsTrigger]="theme">
															{{ theme | titlecase }}
														</button>
													}
												</div>

												<button (click)="copyComponent()" hlmBtn variant="ghost" class="ml-auto h-6 w-6">
													<ng-icon hlm size="xs" [name]="_componentCopied ? 'lucideCheck' : 'lucideClipboard'" />
												</button>
											</div>

											@for (theme of themes; track theme) {
												<div [hlmTabsContent]="theme">
													<spartan-code [code]="code[theme]" language="ts" disableCopy />
												</div>
											}
										</div>
									</hlm-accordion-content>
								</div>
							</div>
						</div>
					}
				}
			</div>
		</div>
	`,
})
export class InstallTabs {
	private readonly _cliService = inject(CLIModeService);

	public readonly showOnlyVega = input(true);

	protected readonly _themes = computed(() => {
		if (this.showOnlyVega()) {
			return THEMES.filter((theme) => theme === 'vega');
		}
		return THEMES;
	});

	protected readonly _activeCliTab = computed(() => this._cliService.cliMode());
	protected readonly _activeComponentTab = signal<Theme>('vega');

	private readonly _clipboard = inject(Clipboard);
	private readonly _installService = inject(ManualInstallService);

	protected _cliCopied = false;

	protected _componentCopied = false;

	public readonly primitive = input.required<ManualInstallPrimitives>();

	protected readonly _code = computed(() => this._installService.getSnippets(this.primitive())());
	protected readonly _utils = computed(() => this._installService.getSnippets('utils' as const)()?.vega ?? '');

	copyCli() {
		const cli = this._activeCliTab();
		const command = cli === 'cli' ? 'ng' : 'nx';
		this._clipboard.copy(`${command} g @spartan-ng/cli:ui ${this.primitive()}`);
		this._flash('_cliCopied');
	}

	copyComponent() {
		const theme = this._activeComponentTab();
		this._clipboard.copy(this._code()![theme]);
		this._flash('_componentCopied');
	}

	private _flash(key: '_cliCopied' | '_componentCopied') {
		this[key] = true;
		setTimeout(() => (this[key] = false), 3000);
	}

	protected onComponentTabChange($event: string) {
		this._activeComponentTab.set($event as Theme);
	}

	protected onCliTabChange($event: string) {
		const val = $event as CLIMode;
		this._cliService.setCliMode(val);
	}
}
