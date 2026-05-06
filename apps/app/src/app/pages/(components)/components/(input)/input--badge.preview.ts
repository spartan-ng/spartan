import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-input-badge',
	imports: [HlmInputImports, HlmFieldImports, HlmBadgeImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'min-w-sm' },
	template: `
		<hlm-field>
			<label hlmFieldLabel for="input-badge">
				Webhook URL
				<span hlmBadge variant="secondary" class="ml-auto">Beta</span>
			</label>
			<input hlmInput id="input-badge" type="url" placeholder="https://api.example.com/webhook" />
		</hlm-field>
	`,
})
export class InputBadge {}
