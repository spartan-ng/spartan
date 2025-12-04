import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BrnDialogImports } from '@spartan-ng/brain/dialog';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';

@Component({
	selector: 'spartan-code-viewer',
	imports: [BrnDialogImports, HlmDialogImports, HlmButton],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-dialog>
			<button id="save-presets" hlmDialogTrigger hlmBtn variant="secondary">View code</button>
			<hlm-dialog-content class="" *brnDialogContent="let ctx">
				<hlm-dialog-header>
					<h3 hlmDialogTitle>Save preset</h3>
					<p hlmDialogDescription>
						This will save the current playground state as a preset which you can access later or share with others.
					</p>
				</hlm-dialog-header>
				<div class="grid gap-4">
					<div class="h-fit rounded-md bg-black p-6">
						<code class="grid gap-1 text-sm text-white [&_span]:h-4">
							<span>
								<span class="text-sky-300">import</span>
								&nbsp;os
							</span>
							<span>
								<span class="text-sky-300">import</span>
								&nbsp;openai
							</span>
							<span></span>
							<span>
								openai.api_key&nbsp;=&nbsp;os.getenv(
								<span class="text-green-300">&quot;OPENAI_API_KEY&quot;</span>
								)
							</span>
							<span></span>
							<span>response&nbsp;=&nbsp;openai.Completion.create(</span>
							<span>
								&nbsp;&nbsp;&nbsp;&nbsp;model=
								<span class="text-green-300">&quot;davinci&quot;</span>
								,
							</span>
							<span>
								&nbsp;&nbsp;&nbsp;&nbsp;prompt=
								<span class="text-amber-300">&quot;&quot;</span>
								,
							</span>
							<span>
								&nbsp;&nbsp;&nbsp;&nbsp;temperature=
								<span class="text-amber-300">0.9</span>
								,
							</span>
							<span>
								&nbsp;&nbsp;&nbsp;&nbsp;max_tokens=
								<span class="text-amber-300">5</span>
								,
							</span>
							<span>
								&nbsp;&nbsp;&nbsp;&nbsp;top_p=
								<span class="text-amber-300">1</span>
								,
							</span>
							<span>
								&nbsp;&nbsp;&nbsp;&nbsp;frequency_penalty=
								<span class="text-amber-300">0</span>
								,
							</span>
							<span>
								&nbsp;&nbsp;&nbsp;&nbsp;presence_penalty=
								<span class="text-green-300">0</span>
								,
							</span>
							<span>)</span>
						</code>
					</div>
					<div>
						<p class="text-muted-foreground text-sm">
							Your API Key can be found here. You should use environment variables or a secret management tool to expose
							your key to your applications.
						</p>
					</div>
				</div>
			</hlm-dialog-content>
		</hlm-dialog>
	`,
})
export class CodeViewer {}
