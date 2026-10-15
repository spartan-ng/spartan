import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'spartan-code-block-preview',
	imports: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: ``,
})
export class CodeBlockPreview {}

export const defaultImports = `
import { HlmCodeBlockImports } from '@spartan-ng/helm/code-block';
`;

export const defaultSkeleton = `
<hlm-code-block>
	<hlm-code-block-header>
		<hlm-code-block-title>Terminal</hlm-code-block-title>
		<hlm-code-block-actions>
			<hlm-code-block-copy-button value="value" />
		</hlm-code-block-actions>
	</hlm-code-block-header>
	<hlm-code-block-content>{{value}}</hlm-code-block-content>
</hlm-code-block>
`;
