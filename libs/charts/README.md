# @spartan-ng/charts

d3-based charts for Angular, styled to match shadcn/ui.

## Theme variables

The charts colour their series from the `--chart-1` … `--chart-5` CSS custom properties (and the
matching `--color-chart-*` Tailwind theme tokens). These ship with spartan's theme:

- `@spartan-ng/cli:init` writes `--chart-1` … `--chart-5` into your global stylesheet (`:root` and
  `.dark`).
- `@spartan-ng/brain/hlm-tailwind-preset.css` maps them to `--color-chart-*` so `*-chart-1`
  utilities resolve.

If you set up your theme by hand, add the five `--chart-*` variables to `:root` and `.dark`;
otherwise series render with no fill.
