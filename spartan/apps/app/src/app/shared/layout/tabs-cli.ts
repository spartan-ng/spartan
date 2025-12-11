import { Component, computed, inject, input } from '@angular/core';
import { CLIModeService } from '../cli-mode.service';
import { Code } from '../code/code';
import { Tabs } from './tabs';

@Component({
	selector: 'spartan-cli-tabs',
	imports: [Tabs, Code],
	host: {
		class: 'block',
	},
	template: `
		<spartan-tabs
			firstTab="Angular CLI"
			secondTab="Nx Plugin"
			[value]="_tabValue()"
			(tabActivated)="onTabChanged($event)"
		>
			<spartan-code firstTab [language]="language()" [code]="ngCode()" />
			<spartan-code secondTab [language]="language()" [code]="nxCode()" />
		</spartan-tabs>
	`,
})
export class TabsCli {
	private readonly _cliService = inject(CLIModeService);
	public readonly nxCode = input('');
	public readonly ngCode = input('');
	public readonly language = input<'ts' | 'sh' | 'js'>('sh');
	protected readonly _tabValue = computed(() => {
		return this._cliService.cliMode() === 'nx' ? 'Nx Plugin' : 'Angular CLI';
	});
	protected onTabChanged(value: string) {
		const val = value === 'Nx Plugin' ? 'nx' : 'cli';
		this._cliService.setCliMode(val);
	}
}
