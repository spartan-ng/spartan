import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmCodeBlockImports } from '@spartan-ng/helm/code-block';

@Component({
	selector: 'spartan-code-block-start-line',
	imports: [HlmCodeBlockImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="w-full max-w-md">
			<hlm-code-block>
				<hlm-code-block-header>
					<hlm-code-block-title>app/dashboard/page.tsx</hlm-code-block-title>
					<hlm-code-block-actions>
						<button hlmCodeBlockCopyButton [value]="_code"></button>
					</hlm-code-block-actions>
				</hlm-code-block-header>
				<pre hlmCodeBlockContent [code]="_code" lineNumbers [startLine]="10"></pre>
			</hlm-code-block>
		</div>
	`,
})
export class CodeBlockStartLine {
	protected readonly _code = `  if (!session) {
    redirect("/login")
  }

  const projects = await db.project.findMany({
    where: { ownerId: session.user.id },
    orderBy: { updatedAt: "desc" },
  })

  return <ProjectList projects={projects} />
}`;
}
