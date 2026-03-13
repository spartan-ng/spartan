import { createStyleMap } from './create-style-map';

describe('parseStyle', () => {
	it('extracts tailwind classes from @apply directives', () => {
		const css = `
      .style-nova {
        .spartan-alert-dialog-content {
          @apply bg-background gap-4 rounded-xl border;
        }
      }
    `;

		const result = createStyleMap(css);

		expect(result).toMatchInlineSnapshot(`
      {
        "spartan-alert-dialog-content": "bg-background gap-4 rounded-xl border",
      }
    `);
	});

	it('handles multiple @apply directives', () => {
		const css = `
      .spartan-button {
        @apply rounded-lg border;
        @apply text-sm;
      }
    `;

		const result = createStyleMap(css);

		expect(result).toMatchInlineSnapshot(`
      {
        "spartan-button": "rounded-lg border text-sm",
      }
    `);
	});

	it('handles variant classes', () => {
		const css = `
      .spartan-button-variant-default {
        @apply text-primary-foreground bg-primary;
      }
    `;

		const result = createStyleMap(css);

		expect(result).toMatchInlineSnapshot(`
      {
        "spartan-button-variant-default": "text-primary-foreground bg-primary",
      }
    `);
	});

	it('handles nested selectors', () => {
		const css = `
      .spartan-card {
        @apply rounded-xl border;

        .spartan-card-header {
          @apply gap-2 px-6;
        }
      }
    `;

		const result = createStyleMap(css);

		expect(result).toMatchInlineSnapshot(`
      {
        "spartan-card": "rounded-xl border",
        "spartan-card-header": "gap-2 px-6",
      }
    `);
	});

	it('ignores rules without @apply', () => {
		const css = `
      .spartan-button {
        color: red;
      }
    `;

		const result = createStyleMap(css);

		expect(result).toMatchInlineSnapshot(`{}`);
	});

	it('handles size variants', () => {
		const css = `
      .spartan-button-size-sm {
        @apply h-7 gap-1 px-2.5;
      }
    `;

		const result = createStyleMap(css);

		expect(result).toMatchInlineSnapshot(`
      {
        "spartan-button-size-sm": "h-7 gap-1 px-2.5",
      }
    `);
	});

	it('handles nested variant selectors with &', () => {
		const css = `
      .spartan-button {
        @apply rounded-lg;

        &.spartan-button-variant-default {
          @apply bg-primary text-white;
        }
      }
    `;

		const result = createStyleMap(css);

		expect(result).toMatchInlineSnapshot(`
      {
        "spartan-button": "rounded-lg",
        "spartan-button-variant-default": "bg-primary text-white",
      }
    `);
	});

	it('merges duplicate class names', () => {
		const css = `
      .spartan-button {
        @apply rounded-lg;
      }
      .spartan-button {
        @apply border;
      }
    `;

		const result = createStyleMap(css);

		expect(result).toMatchInlineSnapshot(`
      {
        "spartan-button": "border rounded-lg",
      }
    `);
	});

	it('ignores non-spartan- classes', () => {
		const css = `
      .button {
        @apply rounded-lg border;
      }
      .some-other-class {
        @apply text-sm;
      }
      .spartan-button {
        @apply px-4;
      }
    `;

		const result = createStyleMap(css);

		expect(result).toMatchInlineSnapshot(`
      {
        "spartan-button": "px-4",
      }
    `);
	});
});
