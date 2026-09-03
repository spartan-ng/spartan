# @spartan-ng/helm/chart

> **Alpha** — This entry point wraps TanStack Charts, which is itself in alpha. Its API can change
> between releases, so expect breaking changes. Keep `@tanstack/charts`,
> `@tanstack/angular-charts`, and `@spartan-ng/helm/chart` on matching versions.

Theme integration for the official TanStack Charts Angular adapter.

Import from `@spartan-ng/helm/chart` and apply `hlmChart` to `tanstack-chart`. Use
`HLM_CHART_THEME` in the chart definition and `hlmChartTooltip()` when enabling the TanStack tooltip.

TanStack Charts owns chart rendering and interaction. This entry point supplies Spartan's color tokens, surface styling, and Angular import bundle.
