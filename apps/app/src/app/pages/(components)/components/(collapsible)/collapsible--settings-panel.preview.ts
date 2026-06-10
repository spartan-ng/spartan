import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMaximize, lucideMinimize } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmCollapsibleImports } from '@spartan-ng/helm/collapsible';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInput } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-collapsible-settings-panel',
	imports: [HlmCardImports, HlmFieldImports, HlmCollapsibleImports, HlmButtonImports, NgIcon, HlmInput],
	providers: [provideIcons({ lucideMinimize, lucideMaximize })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'mx-auto w-full max-w-xs' },
	template: `
		<hlm-card size="sm">
			<hlm-card-header>
				<div hlmCardTitle>Radius</div>
				<p hlmCardDescription>Set the corner radius of the element.</p>
			</hlm-card-header>
			<div hlmCardContent>
				<hlm-collapsible #collapsible="brnCollapsible" class="flex items-start gap-2">
					<hlm-field-group class="grid w-full grid-cols-2 gap-2">
						<hlm-field>
							<label hlmFieldLabel for="radius-x" class="sr-only">Radius X</label>
							<input hlmInput id="radius-x" placeholder="0" value="0" />
						</hlm-field>
						<hlm-field>
							<label hlmFieldLabel for="radius-y" class="sr-only">Radius Y</label>
							<input hlmInput id="radius-y" placeholder="0" value="0" />
						</hlm-field>
						<hlm-collapsible-content class="col-span-full grid grid-cols-subgrid gap-2">
							<hlm-field>
								<label hlmFieldLabel for="radius-x" class="sr-only">Radius X</label>
								<input hlmInput id="radius-x" placeholder="0" value="0" />
							</hlm-field>
							<hlm-field>
								<label hlmFieldLabel for="radius-y" class="sr-only">Radius Y</label>
								<input hlmInput id="radius-y" placeholder="0" value="0" />
							</hlm-field>
						</hlm-collapsible-content>
					</hlm-field-group>
					<button hlmCollapsibleTrigger hlmBtn variant="outline" size="icon">
						<ng-icon [name]="collapsible.expanded() ? 'lucideMinimize' : 'lucideMaximize'" />
						<span class="sr-only">Toggle</span>
					</button>
				</hlm-collapsible>
			</div>
		</hlm-card>
	`,
})
export class CollapsibleSettingsPanel {}
