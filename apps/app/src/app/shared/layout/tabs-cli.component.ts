import { Component, computed, inject, input } from '@angular/core';
import { CLIModeService } from '../cli-mode.service';
import { CodeComponent } from '../code/code.component';
import { TabsComponent } from './tabs.component';

@Component({
	selector: 'spartan-cli-tabs',
	imports: [TabsComponent, CodeComponent],
	host: {
		class: 'block',
	},
	template: `
		<spartan-tabs
			class="mt-4"
			firstTab="Nx Plugin"
			secondTab="Angular CLI"
			[value]="tabValue()"
			(tabActivated)="onTabChanged($event)"
		>
			<spartan-code firstTab [language]="language()" [code]="nxCode()" />
			<spartan-code secondTab [language]="language()" [code]="ngCode()" />
		</spartan-tabs>
	`,
})
export class TabsCliComponent {
	private readonly _cliService = inject(CLIModeService);
	public readonly nxCode = input('');
	public readonly ngCode = input('');
	public readonly language = input<'ts' | 'sh' | 'js'>('sh');
	protected tabValue = computed(() => {
		return this._cliService.cliMode() === 'nx' ? 'Nx Plugin' : 'Angular CLI';
	});
	protected onTabChanged(value: string) {
		const val = value === 'Nx Plugin' ? 'nx' : 'cli';
		this._cliService.setCliMode(val);
	}
}
