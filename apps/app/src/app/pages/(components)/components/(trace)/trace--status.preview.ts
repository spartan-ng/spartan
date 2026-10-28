import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircle, lucideCircleAlert, lucideCircleCheck, lucideLoaderCircle } from '@ng-icons/lucide';
import { HlmTraceImports } from '@spartan-ng/helm/trace';

@Component({
	selector: 'spartan-trace-status',
	imports: [HlmTraceImports, NgIcon],
	providers: [provideIcons({ lucideCircleCheck, lucideCircleAlert, lucideLoaderCircle, lucideCircle })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-trace class="max-w-sm">
			<hlm-trace-line>
				<hlm-trace-icon>
					<ng-icon name="lucideCircleCheck" />
				</hlm-trace-icon>
				<hlm-trace-title>Ran pnpm install</hlm-trace-title>
			</hlm-trace-line>
			<hlm-trace-line status="error">
				<hlm-trace-icon>
					<ng-icon name="lucideCircleAlert" />
				</hlm-trace-icon>
				<hlm-trace-title>Failed to run pnpm lint</hlm-trace-title>
			</hlm-trace-line>
			<hlm-trace-line status="running">
				<hlm-trace-icon>
					<ng-icon name="lucideLoaderCircle" class="motion-safe:animate-spin" />
				</hlm-trace-icon>
				<hlm-trace-title>Running pnpm build</hlm-trace-title>
			</hlm-trace-line>
			<hlm-trace-line status="pending">
				<hlm-trace-icon>
					<ng-icon name="lucideCircle" />
				</hlm-trace-icon>
				<hlm-trace-title>Run pnpm test</hlm-trace-title>
			</hlm-trace-line>
		</hlm-trace>
	`,
})
export class TraceStatus {}
