import { Component } from '@angular/core';
import { HlmSelectImports } from '@spartan-ng/helm/select';

@Component({
	selector: 'spartan-select-object-preview',
	imports: [HlmSelectImports],
	template: `
		<hlm-select>
			<hlm-select-trigger class="w-72">
				<hlm-select-placeholder>Select a shipping method</hlm-select-placeholder>
				<ng-template hlmSelectValueTemplate let-value>
					<div class="flex items-baseline gap-0.5">
						<span>{{ value.name }}</span>
						<span class="text-muted-foreground text-xs">({{ value.price }})</span>
					</div>
				</ng-template>
			</hlm-select-trigger>
			<hlm-select-content *hlmSelectPortal>
				<hlm-select-group>
					@for (method of shippingMethods; track method.id) {
						<hlm-select-item [value]="method">
							<div class="flex flex-col gap-0.5">
								<div class="flex items-baseline gap-0.5">
									<span>{{ method.name }}</span>
									<span class="text-muted-foreground text-xs">({{ method.price }})</span>
								</div>
								<span class="text-muted-foreground text-xs">{{ method.duration }}</span>
							</div>
						</hlm-select-item>
					}
				</hlm-select-group>
			</hlm-select-content>
		</hlm-select>
	`,
})
export class SelectObjectPreview {
	public readonly shippingMethods = [
		{
			id: 'standard',
			name: 'Standard',
			duration: 'Delivers in 4-6 business days',
			price: '$4.99',
		},
		{
			id: 'express',
			name: 'Express',
			duration: 'Delivers in 2-3 business days',
			price: '$9.99',
		},
		{
			id: 'overnight',
			name: 'Overnight',
			duration: 'Delivers next business day',
			price: '$19.99',
		},
	];
}
