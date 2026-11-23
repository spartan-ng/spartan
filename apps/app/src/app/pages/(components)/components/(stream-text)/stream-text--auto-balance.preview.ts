import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmStreamTextImports } from '@spartan-ng/helm/stream-text';

@Component({
	selector: 'spartan-stream-text-auto-balance',
	imports: [HlmStreamTextImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="grid w-96 max-w-full gap-4 text-sm">
			<div>
				<p class="text-muted-foreground mb-1 text-xs">autoBalance (default)</p>
				<hlm-stream-text [content]="_content" streaming />
			</div>
			<div>
				<p class="text-muted-foreground mb-1 text-xs">autoBalance disabled</p>
				<hlm-stream-text [content]="_content" streaming [autoBalance]="false" />
			</div>
		</div>
	`,
})
export class StreamTextAutoBalance {
	protected readonly _content = 'Install with **pnpm and run:\n\n```bash\npnpm install';
}
