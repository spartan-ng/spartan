import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';

@Component({
	selector: 'spartan-card-size-preview',
	imports: [HlmCardImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-card size="sm" class="mx-auto w-full max-w-sm">
			<hlm-card-header>
				<h3 hlmCardTitle>Small Card</h3>
				<p hlmCardDescription>This card uses the small size variant.</p>
			</hlm-card-header>
			<div hlmCardContent>
				<p>The card component supports a size prop that can be set to "sm" for a more compact appearance.</p>
			</div>
			<hlm-card-footer>
				<button hlmBtn variant="outline" size="sm" class="w-full">Action</button>
			</hlm-card-footer>
		</hlm-card>
	`,
})
export class CardSizePreview {}
