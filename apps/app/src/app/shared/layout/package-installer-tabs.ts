import { KeyValuePipe } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';
import { BrnTabs, BrnTabsContent, BrnTabsList, BrnTabsTrigger } from '@spartan-ng/brain/tabs';
import { Code } from '../code/code';

const cliPackageInstallationCommands = {
	pnpm: 'pnpm add -D @spartan-ng/cli',
	npm: 'npm install -D @spartan-ng/cli',
	yarn: 'yarn add -D @spartan-ng/cli',
	bun: 'bun add --dev @spartan-ng/cli',
} as const;

type PackageKey = keyof typeof cliPackageInstallationCommands;

const brnPackageInstallationCommands = {
	pnpm: 'pnpm add @spartan-ng/brain',
	npm: 'npm install @spartan-ng/brain',
	yarn: 'yarn add @spartan-ng/brain',
	bun: 'bun add @spartan-ng/brain',
} as const;

const brnUpdatePackageInstallationCommands = {
	pnpm: 'pnpm add @spartan-ng/brain@latest @spartan-ng/cli@latest',
	npm: 'npm install @spartan-ng/brain@latest @spartan-ng/cli@latest',
	yarn: 'yarn add @spartan-ng/brain@latest @spartan-ng/cli@latest',
	bun: 'bun add @spartan-ng/brain@latest @spartan-ng/cli@latest',
} as const;

const angularCdkPackageInstallationCommands = {
	pnpm: 'pnpm add @angular/cdk',
	npm: 'npm install @angular/cdk',
	yarn: 'yarn add @angular/cdk',
	bun: 'bun add @angular/cdk',
} as const;

const tabBtn =
	'inline-flex items-center justify-center whitespace-nowrap py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none';
const tabContent =
	'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative rounded-md border border-border';

const globalValue = signal<PackageKey>('pnpm');

@Component({
	selector: 'spartan-package-installer-tab',
	imports: [BrnTabs, BrnTabsList, BrnTabsTrigger, BrnTabsContent, Code, KeyValuePipe],
	host: {
		class: 'block',
	},
	template: `
		<div [brnTabs]="value()" class="block" (tabActivated)="onTabActivated($event)">
			<div
				brnTabsList
				class="border-border text-muted-foreground mb-4 inline-flex h-9 w-full items-center justify-start rounded-none border-b bg-transparent p-0"
			>
				@for (item of cliInstallationCommands() | keyvalue: collationComparator; track item.key) {
					<button class="${tabBtn}" [brnTabsTrigger]="item.key">{{ item.key }}</button>
				}
			</div>
			<div class="${tabContent}" [brnTabsContent]="value()">
				<spartan-code [language]="language()" [code]="installCommand()" />
			</div>
		</div>
	`,
})
export class PackageInstallerTabs {
	public readonly value = globalValue;
	public readonly package = input<'cli' | 'brn' | 'cdk' | 'brn-update'>('cli');
	public readonly installCommand = computed(() => {
		const activeTab = this.value();
		return this.cliInstallationCommands()[activeTab] ?? '';
	});
	public readonly language = input<'ts' | 'sh' | 'js'>('sh');

	public cliInstallationCommands = computed(() => {
		switch (this.package()) {
			case 'cli':
				return cliPackageInstallationCommands;
			case 'brn':
				return brnPackageInstallationCommands;
			case 'brn-update':
				return brnUpdatePackageInstallationCommands;
			case 'cdk':
				return angularCdkPackageInstallationCommands;
			default:
				return cliPackageInstallationCommands;
		}
	});

	public collationComparator = () => 0;

	protected onTabActivated(value: string) {
		this.value.set(value as PackageKey);
	}
}
