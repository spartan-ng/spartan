import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'spartan-trace-preview',
	imports: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: ``,
})
export class TracePreview {}

export const defaultImports = `
import { HlmTraceImports } from '@spartan-ng/helm/trace';
`;

export const defaultSkeleton = `
<hlm-trace>
  <hlm-trace-line>
    <hlm-trace-icon>
      <ng-icon name="lucideSearch" />
    </hlm-trace-icon>
    <hlm-trace-title>Searched for minimumReleaseAge</hlm-trace-title>
  </hlm-trace-line>
</hlm-trace>
`;
