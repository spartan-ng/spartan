import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';

@Component({
	selector: 'spartan-separator-list',
	imports: [HlmSeparatorImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex w-full max-w-sm flex-col gap-2 text-sm',
	},
	template: `
		<dl class="flex items-center justify-between">
			<dt>Item 1</dt>
			<dd class="text-muted-foreground">Value 1</dd>
		</dl>
		<hlm-separator />
		<dl class="flex items-center justify-between">
			<dt>Item 2</dt>
			<dd class="text-muted-foreground">Value 2</dd>
		</dl>
		<hlm-separator />
		<dl class="flex items-center justify-between">
			<dt>Item 3</dt>
			<dd class="text-muted-foreground">Value 3</dd>
		</dl>
	`,
})
export class SeparatorListPreview {}
