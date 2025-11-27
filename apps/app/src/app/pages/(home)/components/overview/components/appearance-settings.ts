import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMinus, lucidePlus } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmRadioGroupImports } from '@spartan-ng/helm/radio-group';
import { HlmSwitch } from '@spartan-ng/helm/switch';

@Component({
	selector: 'spartan-appearance-settings',
	imports: [
		HlmRadioGroupImports,
		HlmFieldImports,
		HlmButtonGroupImports,
		HlmSwitch,
		NgIcon,
		HlmIcon,
		HlmInput,
		HlmButton,
	],
	providers: [provideIcons({ lucidePlus, lucideMinus })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<fieldset hlmFieldSet>
			<div hlmFieldGroup>
				<fieldset hlmFieldSet>
					<legend hlmFieldLegend>Compute Environment</legend>
					<p hlmFieldDescription>Select the compute environment for your cluster.</p>
					<hlm-radio-group value="kubernetes">
						<label hlmFieldLabel for="kubernetes">
							<div hlmField orientation="horizontal">
								<div hlmFieldContent>
									<div hlmFieldTitle>Kubernetes</div>
									<div hlmFieldDescription>Run GPU workloads on a K8s configured cluster.</div>
								</div>
								<hlm-radio value="kubernetes" id="kubernetes">
									<hlm-radio-indicator indicator />
								</hlm-radio>
							</div>
						</label>
						<label hlmFieldLabel for="virtual-machine">
							<div hlmField orientation="horizontal">
								<div hlmFieldContent>
									<div hlmFieldTitle>Virtual Machine</div>
									<div hlmFieldDescription>Access a VM configured cluster to run GPU workloads.</div>
								</div>
								<hlm-radio value="virtual-machine" id="virtual-machine">
									<hlm-radio-indicator indicator />
								</hlm-radio>
							</div>
						</label>
					</hlm-radio-group>
				</fieldset>
			</div>
			<hlm-field-separator />
			<div hlmField orientation="horizontal">
				<div hlmFieldContent>
					<label hlmFieldLabel for="field-input-preview-firstname">Number of GPUs</label>
					<p hlmFieldDescription>You can add more later.</p>
				</div>
				<div hlmButtonGroup>
					<input hlmInput class="h-8 !w-14 font-mono" [value]="_gpuCount()" />
					<button hlmBtn variant="outline" size="icon-sm" (click)="_gpuCountDecrease()">
						<ng-icon hlm name="lucideMinus" size="sm" />
					</button>
					<button hlmBtn variant="outline" size="icon-sm" (click)="_gpuCountIncrease()">
						<ng-icon hlm name="lucidePlus" size="sm" />
					</button>
				</div>
			</div>
			<hlm-field-separator />
			<div hlmField orientation="horizontal">
				<div hlmFieldContent>
					<label hlmFieldLabel for="exp-wallpaper-tinting">Wallpaper Tinting</label>
					<p hlmFieldDescription>Allow the wallpaper to be tinted.</p>
				</div>
				<hlm-switch id="exp-wallpaper-tinting" />
			</div>
		</fieldset>
	`,
})
export class AppearanceSettings {
	protected readonly _gpuCount = signal(8);

	protected _gpuCountIncrease(): void {
		this._gpuCount.update((count) => count + 1);
	}

	protected _gpuCountDecrease(): void {
		this._gpuCount.update((count) => Math.max(0, count - 1));
	}
}
