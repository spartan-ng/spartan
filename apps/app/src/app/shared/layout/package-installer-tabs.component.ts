import { KeyValuePipe } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';
import {
	BrnTabsContentDirective,
	BrnTabsDirective,
	BrnTabsListDirective,
	BrnTabsTriggerDirective,
} from '@spartan-ng/brain/tabs';
import { CodeComponent } from '../code/code.component';

const packageInstallationCommands = {
	npm: 'npm i -D @spartan-ng/cli',
	pnpm: 'pnpm add -D @spartan-ng/cli',
	yarn: 'yarn add -D @spartan-ng/cli',
	bun: 'bun install -D @spartan-ng/cli',
} as const;

type PackageKey = keyof typeof packageInstallationCommands;

const tabBtn =
	'inline-flex items-center justify-center whitespace-nowrap py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none';
const tabContent =
	'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative rounded-md border border-border';
@Component({
	selector: 'spartan-package-installer-tab',
	standalone: true,
	imports: [
		BrnTabsDirective,
		BrnTabsListDirective,
		BrnTabsTriggerDirective,
		BrnTabsContentDirective,
		CodeComponent,
		KeyValuePipe,
	],
	host: {
		class: 'block',
	},
	template: `
		<div [brnTabs]="value()" class="block" (tabActivated)="onTabActivated($event)">
			<div
				brnTabsList
				class="border-border text-muted-foreground mb-4 inline-flex h-9 w-full items-center justify-start rounded-none border-b bg-transparent p-0"
			>
				@for (item of cliInstallationCommands | keyvalue: collationComparator; track item.key) {
					<button class="${tabBtn}" [brnTabsTrigger]="item.key">{{ item.key }}</button>
				}
			</div>
			<div class="${tabContent}" [brnTabsContent]="value()">
				<spartan-code [language]="language()" [code]="installCommand()" />
			</div>
		</div>
	`,
})
export class PackageInstallerTabsComponent {
	public readonly value = signal<PackageKey>('npm');
	public readonly installCommand = computed(() => {
		const activeTab = this.value();
		return this.cliInstallationCommands[activeTab] ?? '';
	});
	public language = input<'ts' | 'sh' | 'js'>('sh');
	public cliInstallationCommands = packageInstallationCommands;

	public collationComparator = () => 0;

	protected onTabActivated(value: string) {
		this.value.set(value as PackageKey);
	}
}
