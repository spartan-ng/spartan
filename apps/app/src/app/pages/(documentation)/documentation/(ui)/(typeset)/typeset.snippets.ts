export const presetCss = `.typeset-docs {
  --typeset-font-body: var(--font-geist);
  --typeset-font-heading: var(--font-geist);
  --typeset-font-mono: var(--font-geist-mono);
  --typeset-size: 15px;
  --typeset-leading: 1.75;
  --typeset-flow: 1.25em;
}`;

export const importCss = `@import "tailwindcss";
@import "./typeset.css";`;

export const usageCode = `import { Component, input } from '@angular/core';

@Component({
  selector: 'app-markdown',
  template: \`
    <div class="typeset typeset-docs" [innerHTML]="content()"></div>
  \`,
})
export class MarkdownComponent {
  readonly content = input('');
}`;

export const defaultsCss = `.typeset {
  --typeset-font-body: inherit;
  --typeset-font-heading: var(--font-heading);
  --typeset-font-mono: var(--font-mono);

  --typeset-size: 1em; /* body font-size */
  --typeset-leading: 1.75; /* line-height */
  --typeset-flow: 1.25em; /* space between blocks */
}`;

export const twoPresetsCss = `.typeset-chat {
  --typeset-flow: 1em;
  --typeset-leading: 1.6;
}

.typeset-docs {
  --typeset-size: 15px;
  --typeset-flow: 1.5em;
}`;

export const inlineOverrideCode = `<div class="typeset typeset-chat">{{ message }}</div>
<article class="typeset typeset-docs">
  <ng-content />
</article>`;

export const oneOffOverrideCode = `<article class="typeset [--typeset-flow:1.75em]">...</article>`;

export const customThemesCss = `/* Reading: serif, larger type, roomy rhythm. */
.typeset-reading {
  --typeset-font-body: var(--font-lora);
  --typeset-font-heading: var(--font-lora);
  --typeset-size: 18px;
  --typeset-leading: 1.9;
  --typeset-flow: 2em;
}

/* Compact: sans, smaller type, tighter rhythm. */
.typeset-compact {
  --typeset-font-body: var(--font-geist);
  --typeset-font-heading: var(--font-geist);
  --typeset-size: 14px;
  --typeset-leading: 1.6;
  --typeset-flow: 1em;
}`;

export const accessibilityCss = `.typeset-large {
  --typeset-size: 16px;
  --typeset-leading: 2;
  --typeset-flow: 2em;
}

/* Dark mode follows your theme colors. Loosen the leading if it feels tight. */
.dark .typeset {
  --typeset-leading: 1.9;
}`;

export const responsiveTableCode = `<div class="typeset-scroll">
  <table>...</table>
</div>`;

export const overrideCode = `<div class="typeset typeset-docs">
  <p class="text-lg">...</p>
</div>`;

export const optingOutCode = `<div class="typeset">
  <p>Styled prose.</p>
  <app-card class="not-typeset">Untouched component.</app-card>
</div>`;

export const streamingCss = `/* Spacing flows in one direction. Only margin-block-start is used,
   so a newly appended block never shifts the blocks above it. */
.typeset :where(p, ul, ol, pre, blockquote, table) {
  margin-block-start: var(--typeset-flow);
  margin-block-end: 0;
}`;
