import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmStreamTextImports } from '@spartan-ng/helm/stream-text';

@Component({
	selector: 'spartan-stream-text-static',
	imports: [HlmStreamTextImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-stream-text
			class="w-96 max-w-full text-sm"
			content="Once streaming ends, the cursor disappears and the content is shown as-is."
		/>
	`,
})
export class StreamTextStatic {}
