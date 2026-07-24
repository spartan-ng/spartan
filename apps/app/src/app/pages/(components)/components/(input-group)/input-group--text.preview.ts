import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';

@Component({
	selector: 'spartan-input-group-text-preview',
	imports: [HlmInputGroupImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'grid w-full max-w-sm gap-6' },
	template: `
		<hlm-input-group>
			<hlm-input-group-addon>
				<hlm-input-group-text>$</hlm-input-group-text>
			</hlm-input-group-addon>
			<input hlmInputGroupInput placeholder="0.00" />
			<hlm-input-group-addon align="inline-end">
				<hlm-input-group-text>USD</hlm-input-group-text>
			</hlm-input-group-addon>
		</hlm-input-group>
		<hlm-input-group>
			<hlm-input-group-addon>
				<hlm-input-group-text>https://</hlm-input-group-text>
			</hlm-input-group-addon>
			<input hlmInputGroupInput placeholder="example.com" class="pl-0.5!" />
			<hlm-input-group-addon align="inline-end">
				<hlm-input-group-text>.com</hlm-input-group-text>
			</hlm-input-group-addon>
		</hlm-input-group>
		<hlm-input-group>
			<input hlmInputGroupInput placeholder="Enter your username" />
			<hlm-input-group-addon align="inline-end">
				<hlm-input-group-text>&#64;company.com</hlm-input-group-text>
			</hlm-input-group-addon>
		</hlm-input-group>
		<hlm-input-group>
			<textarea hlmInputGroupTextarea placeholder="Enter your message"></textarea>
			<hlm-input-group-addon align="block-end">
				<hlm-input-group-text class="text-muted-foreground text-xs">120 characters left</hlm-input-group-text>
			</hlm-input-group-addon>
		</hlm-input-group>
	`,
})
export class InputGroupTextPreview {}
