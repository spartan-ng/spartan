import { Component } from '@angular/core';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmRadioGroupImports } from '@spartan-ng/helm/radio-group';

@Component({
	selector: 'spartan-field-choice-card-preview',
	imports: [HlmFieldImports, HlmRadioGroupImports],
	host: {
		class: 'w-full max-w-md',
	},
	template: `
		<div hlmFieldGroup>
			<fieldset hlmFieldSet>
				<label hlmFieldLabel>Compute Environment</label>
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
	`,
})
export class FieldChoiceCardPreview {}
