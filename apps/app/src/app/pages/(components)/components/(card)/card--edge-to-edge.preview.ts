import { Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';

@Component({
	selector: 'spartan-card-edge-to-edge',
	imports: [HlmCardImports, HlmLabelImports, HlmInputImports, HlmButtonImports],
	host: { class: 'w-full max-w-md' },
	template: `
		<hlm-card class="mx-auto w-full max-w-sm">
			<hlm-card-header>
				<h3 hlmCardTitle>Terms of Service</h3>
				<p hlmCardDescription>Review the terms before accepting the agreement.</p>
			</hlm-card-header>

			<div hlmCardContent class="-mb-(--card-spacing)">
				<div
					class="bg-muted/50 -mx-(--card-spacing) max-h-48 space-y-4 overflow-y-scroll border-t px-(--card-spacing) py-4 text-sm leading-relaxed"
				>
					<p>
						These terms govern your use of the workspace, including access to shared documents, project files, and
						collaboration tools.
					</p>
					<p>
						You are responsible for the content you upload and for ensuring that your team has the appropriate
						permissions to view or edit it.
					</p>
					<p>
						We may update features or limits as the service evolves. When those changes materially affect your workflow,
						we will notify your workspace administrators.
					</p>
					<p>
						By continuing, you agree to keep your account credentials secure and to follow your organization&apos;s
						acceptable use policies.
					</p>
				</div>
			</div>

			<hlm-card-footer class="justify-end gap-2 pt-(--card-spacing)">
				<button hlmBtn variant="outline">Decline</button>
				<button hlmBtn>Accept</button>
			</hlm-card-footer>
		</hlm-card>
	`,
})
export class CardEdgeToEdge {}
