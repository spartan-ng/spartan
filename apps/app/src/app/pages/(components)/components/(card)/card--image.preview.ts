import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';

@Component({
	selector: 'spartan-card-image-preview',
	imports: [HlmCardImports, HlmButtonImports, HlmBadgeImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-card class="relative mx-auto w-full max-w-sm pt-0">
			<div class="bg-primary absolute inset-0 z-30 aspect-video opacity-50 mix-blend-color"></div>
			<img
				src="https://images.unsplash.com/photo-1604076850742-4c7221f3101b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
				alt="Event cover"
				class="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
			/>
			<hlm-card-header>
				<div hlmCardAction>
					<span hlmBadge variant="secondary">Featured</span>
				</div>
				<h3 hlmCardTitle>Design systems meetup</h3>
				<p hlmCardDescription>A practical talk on component APIs, accessibility, and shipping faster.</p>
			</hlm-card-header>
			<hlm-card-footer>
				<button hlmBtn class="w-full">View Event</button>
			</hlm-card-footer>
		</hlm-card>
	`,
})
export class CardImagePreview {}
