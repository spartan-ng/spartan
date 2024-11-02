import { Component } from '@angular/core';
import { BrnSelectImports } from '@spartan-ng/ui-select-brain';
import { HlmSelectImports } from '@spartan-ng/ui-select-helm';

@Component({
	selector: 'spartan-select-header-footer-preview',
	standalone: true,
	imports: [BrnSelectImports, HlmSelectImports],
	template: `
		<hlm-select class="inline-block" placeholder="Select some fruit">
			<hlm-select-trigger class="w-56">
				<hlm-select-value/>
			</hlm-select-trigger>
			<hlm-select-content>
				<hlm-select-content-header class="mx-auto font-semibold">Header...</hlm-select-content-header>
				<hlm-option value="apple">Apple</hlm-option>
				<hlm-option value="banana">Banana</hlm-option>
				<hlm-option value="blueberry">Blueberry</hlm-option>
				<hlm-option value="grapes">Grapes</hlm-option>
				<hlm-option value="pineapple">Pineapple</hlm-option>
				<hlm-select-content-footer class="mx-auto font-semibold">Footer...</hlm-select-content-footer>
			</hlm-select-content>
		</hlm-select>
	`,
})
export class SelectHeaderFooterPreviewComponent {}

export const headerFooterCode = `
		import { Component } from '@angular/core';
		import { BrnSelectImports } from '@spartan-ng/ui-select-brain';
		import { HlmSelectImports } from '@spartan-ng/ui-select-helm';

		@Component({
			selector: 'spartan-select-header-footer-preview',
			standalone: true,
			imports: [BrnSelectImports, HlmSelectImports],
			template: \`
				<hlm-select class="inline-block">
					<hlm-select-trigger class="w-56">
						<hlm-select-value/>
					</hlm-select-trigger>
					<hlm-select-content>
						<hlm-select-content-header class="mx-auto font-semibold">Header...</hlm-select-content-header>
						<hlm-option value="apple">Apple</hlm-option>
						<hlm-option value="banana">Banana</hlm-option>
						<hlm-option value="blueberry">Blueberry</hlm-option>
						<hlm-option value="grapes">Grapes</hlm-option>
						<hlm-option value="pineapple">Pineapple</hlm-option>
						<hlm-select-content-footer class="mx-auto font-semibold">Footer...</hlm-select-content-footer>
					</hlm-select-content>
				</hlm-select>
			\`,
		})
		export class SelectHeaderFooterPreviewComponent {}
`;
