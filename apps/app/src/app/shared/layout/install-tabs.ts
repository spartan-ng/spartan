import { Component, computed, inject, input } from '@angular/core';
import { PrimitiveSnippet } from '@spartan-ng/app/app/core/models/primitives-snippets.model';
import { ManualInstallService } from '@spartan-ng/app/app/core/services/manual-install.service';
import { Code } from '@spartan-ng/app/app/shared/code/code';
import { BrnTabs, BrnTabsContent, BrnTabsList, BrnTabsTrigger } from '@spartan-ng/brain/tabs';

const tabBtn =
	'inline-flex items-center justify-center whitespace-nowrap py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none';
const tabContent =
	'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative rounded-md border border-border';
@Component({
	selector: 'spartan-install-tabs',
	imports: [BrnTabs, BrnTabsList, BrnTabsTrigger, BrnTabsContent, Code],
	host: {
		class: 'block mt-4',
	},
	template: `
		<div class="block" brnTabs="Command">
			<div
				brnTabsList
				class="border-border text-muted-foreground inline-flex h-9 w-full items-center justify-start rounded-none border-b bg-transparent p-0"
				aria-label="Tablist showing command and manual"
			>
				<button class="${tabBtn}" brnTabsTrigger="Command">Command</button>
				<button class="${tabBtn}" brnTabsTrigger="Manual">Manuel</button>
			</div>
			<div brnTabsContent="Command">
				<ng-content />
			</div>
			<div class="${tabContent} mt-5" brnTabsContent="Manual">
				@let code = _code();
				@if (code) {
					<spartan-code [code]="code" language="ts" />
				}
			</div>
		</div>
	`,
})
export class InstallTabs {
	public readonly primitive = input.required<PrimitiveSnippet>();
	private readonly _installService = inject(ManualInstallService);

	protected readonly _code = computed(() => {
		return this._installService.getSnippets(this.primitive())();
	});
}
