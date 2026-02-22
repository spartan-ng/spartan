import { Project, ScriptKind } from 'ts-morph';

import { type StyleMap } from './create-style-map';
import { transformStyleMap } from './transform-style-map';

const baseStyleMap: StyleMap = {
	'spartan-foo': 'bg-background gap-4 rounded-xl',
};

async function applyTransform(source: string, styleMap: StyleMap) {
	const project = new Project({
		useInMemoryFileSystem: true,
	});

	const sourceFile = project.createSourceFile('component.ts', source, {
		scriptKind: ScriptKind.TS,
		overwrite: true,
	});

	await transformStyleMap({ sourceFile, styleMap });

	return sourceFile.getText();
}

describe('transformStyleMap', () => {
	describe('classes call', () => {
		it('should replace string', async () => {
			const source = `import { Directive } from '@angular/core';
import { BrnAccordion } from '@spartan-ng/brain/accordion';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmAccordion], hlm-accordion',
	hostDirectives: [{ directive: BrnAccordion, inputs: ['type', 'dir', 'orientation'] }],
})
export class HlmAccordion {
	constructor() {
		classes(() => 'flex data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col spartan-foo');
	}
}
`;

			const result = await applyTransform(source, baseStyleMap);

			expect(result).toMatchInlineSnapshot(`
"import { Directive } from '@angular/core';
import { BrnAccordion } from '@spartan-ng/brain/accordion';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmAccordion], hlm-accordion',
	hostDirectives: [{ directive: BrnAccordion, inputs: ['type', 'dir', 'orientation'] }],
})
export class HlmAccordion {
	constructor() {
		classes(() => 'bg-background gap-4 rounded-xl flex data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col');
	}
}
"
`);
		});

		it('should replace array with condition', async () => {
			const source = `import { Directive } from '@angular/core';
import { BrnAccordion } from '@spartan-ng/brain/accordion';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmAccordion], hlm-accordion',
	hostDirectives: [{ directive: BrnAccordion, inputs: ['type', 'dir', 'orientation'] }],
})
export class HlmAccordion {
	constructor() {
		classes(() => ['min-w-0 shrink-0 grow-0 basis-full', this._orientation() === 'spartan-foo' ? 'pl-4' : 'pt-4']));
	}
}
`;

			const result = await applyTransform(source, baseStyleMap);

			expect(result).toMatchInlineSnapshot(`
"import { Directive } from '@angular/core';
import { BrnAccordion } from '@spartan-ng/brain/accordion';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmAccordion], hlm-accordion',
	hostDirectives: [{ directive: BrnAccordion, inputs: ['type', 'dir', 'orientation'] }],
})
export class HlmAccordion {
	constructor() {
		classes(() => ['min-w-0 shrink-0 grow-0 basis-full', this._orientation() === 'bg-background gap-4 rounded-xl' ? 'pl-4' : 'pt-4']));
	}
}
"
`);
		});

		it('should replace array', async () => {
			const source = `import { Directive } from '@angular/core';
import { BrnAccordion } from '@spartan-ng/brain/accordion';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmAccordion], hlm-accordion',
	hostDirectives: [{ directive: BrnAccordion, inputs: ['type', 'dir', 'orientation'] }],
})
export class HlmInputGroup {
	constructor() {
		classes(() => [
			'group/input-group border-input dark:bg-input/30 relative flex w-full items-center rounded-md border shadow-xs transition-[color,box-shadow] outline-none',
			'h-9 min-w-0 has-[>textarea]:h-auto spartan-foo',
			// Variants based on alignment.
			'has-[>[data-align=inline-start]]:[&>input]:ps-2',
			'has-[>[data-align=inline-end]]:[&>input]:pe-2',
			'has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-3',
			'has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3',
			// Focus state.
			'has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50 has-[[data-slot=input-group-control]:focus-visible]:ring-[3px]',
			// Error state.
			'has-[>.ng-invalid.ng-touched]:ring-destructive/20 has-[>.ng-invalid.ng-touched]:border-destructive dark:has-[>.ng-invalid.ng-touched]:ring-destructive/40',
		]);
	}
}
`;

			const result = await applyTransform(source, baseStyleMap);

			expect(result).toMatchInlineSnapshot(`
"import { Directive } from '@angular/core';
import { BrnAccordion } from '@spartan-ng/brain/accordion';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmAccordion], hlm-accordion',
	hostDirectives: [{ directive: BrnAccordion, inputs: ['type', 'dir', 'orientation'] }],
})
export class HlmInputGroup {
	constructor() {
		classes(() => [
			'group/input-group border-input dark:bg-input/30 relative flex w-full items-center rounded-md border shadow-xs transition-[color,box-shadow] outline-none',
			'bg-background gap-4 rounded-xl h-9 min-w-0 has-[>textarea]:h-auto',
			// Variants based on alignment.
			'has-[>[data-align=inline-start]]:[&>input]:ps-2',
			'has-[>[data-align=inline-end]]:[&>input]:pe-2',
			'has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-3',
			'has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3',
			// Focus state.
			'has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50 has-[[data-slot=input-group-control]:focus-visible]:ring-[3px]',
			// Error state.
			'has-[>.ng-invalid.ng-touched]:ring-destructive/20 has-[>.ng-invalid.ng-touched]:border-destructive dark:has-[>.ng-invalid.ng-touched]:ring-destructive/40',
		]);
	}
}
"
`);
		});
	});

	it('adds tailwind classes to string literal className', async () => {
		const source = `import * as React from "react"

function Foo(props: React.ComponentProps<"div">) {
  return <div className="spartan-foo" {...props} />
}
`;

		const result = await applyTransform(source, baseStyleMap);

		expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"

      function Foo(props: React.ComponentProps<"div">) {
        return <div className="bg-background gap-4 rounded-xl" {...props} />
      }
      "
    `);
	});

	it('applies base classes to cva base string', async () => {
		const source = `import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "spartan-button inline-flex items-center",
  {
    variants: {
      variant: {
        default: "",
      },
    },
  }
)

function Button({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button className={hlm(buttonVariants({ className }))} {...props} />
  )
}
`;

		const styleMap: StyleMap = {
			'spartan-button': 'rounded-lg border text-sm',
		};

		const result = await applyTransform(source, styleMap);

		expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"
      import { cva } from "class-variance-authority"
      import { cn } from "@/lib/utils"

      const buttonVariants = cva(
        "rounded-lg border text-sm inline-flex items-center",
        {
          variants: {
            variant: {
              default: "",
            },
          },
        }
      )

      function Button({ className, ...props }: React.ComponentProps<"button">) {
        return (
          <button className={hlm(buttonVariants({ className }))} {...props} />
        )
      }
      "
    `);
	});

	it('applies variant classes to cva variant entries', async () => {
		const source = `import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "spartan-button inline-flex items-center",
  {
    variants: {
      variant: {
        default: "spartan-button-variant-default",
      },
    },
  }
)

function Button({ className, variant = "default", ...props }: React.ComponentProps<"button">) {
  return (
    <button className={hlm(buttonVariants({ variant, className }))} {...props} />
  )
}
`;

		const styleMap: StyleMap = {
			'spartan-button-variant-default': 'text-primary-foreground bg-primary',
		};

		const result = await applyTransform(source, styleMap);

		expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"
      import { cva } from "class-variance-authority"
      import { cn } from "@/lib/utils"

      const buttonVariants = cva(
        "inline-flex items-center",
        {
          variants: {
            variant: {
              default: "text-primary-foreground bg-primary",
            },
          },
        }
      )

      function Button({ className, variant = "default", ...props }: React.ComponentProps<"button">) {
        return (
          <button className={hlm(buttonVariants({ variant, className }))} {...props} />
        )
      }
      "
    `);
	});

	it('handles multiple spartan-* classes in one className', async () => {
		const source = `import * as React from "react"
import { cn } from "@/lib/utils"

function Foo({ className, ...props }: { className?: string }) {
  return (
    <div className={hlm("spartan-foo spartan-bar", className)} {...props} />
  )
}
`;

		const styleMap: StyleMap = {
			'spartan-foo': 'bg-background gap-4',
			'spartan-bar': 'rounded-xl border',
		};

		const result = await applyTransform(source, styleMap);

		expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"
      import { cn } from "@/lib/utils"

      function Foo({ className, ...props }: { className?: string }) {
        return (
          <div className={hlm("bg-background gap-4 rounded-xl border", className)} {...props} />
        )
      }
      "
    `);
	});

	it('skips spartan-* classes not in styleMap', async () => {
		const source = `import * as React from "react"
import { cn } from "@/lib/utils"

function Foo({ className, ...props }: { className?: string }) {
  return (
    <div className={hlm("spartan-foo spartan-unknown", className)} {...props} />
  )
}
`;

		const result = await applyTransform(source, baseStyleMap);

		expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"
      import { cn } from "@/lib/utils"

      function Foo({ className, ...props }: { className?: string }) {
        return (
          <div className={hlm("bg-background gap-4 rounded-xl", className)} {...props} />
        )
      }
      "
    `);
	});

	it('handles className with no spartan-* classes', async () => {
		const source = `import * as React from "react"
import { cn } from "@/lib/utils"

function Foo({ className, ...props }: { className?: string }) {
  return (
    <div className={hlm("some-other-class", className)} {...props} />
  )
}
`;

		const result = await applyTransform(source, baseStyleMap);

		expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"
      import { cn } from "@/lib/utils"

      function Foo({ className, ...props }: { className?: string }) {
        return (
          <div className={hlm("some-other-class", className)} {...props} />
        )
      }
      "
    `);
	});

	it('handles multiple spartan-* classes in hlm() arguments', async () => {
		const source = `import * as React from "react"
import { cn } from "@/lib/utils"

function Foo({ className, ...props }: { className?: string }) {
  return (
    <div className={hlm("spartan-foo", "spartan-bar", className)} {...props} />
  )
}
`;

		const styleMap: StyleMap = {
			'spartan-foo': 'bg-background',
			'spartan-bar': 'rounded-xl',
		};

		const result = await applyTransform(source, styleMap);

		expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"
      import { cn } from "@/lib/utils"

      function Foo({ className, ...props }: { className?: string }) {
        return (
          <div className={hlm("bg-background rounded-xl", className)} {...props} />
        )
      }
      "
    `);
	});

	it('handles size variants in cva', async () => {
		const source = `import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "spartan-button inline-flex items-center",
  {
    variants: {
      size: {
        sm: "spartan-button-size-sm",
        lg: "spartan-button-size-lg",
      },
    },
  }
)

function Button({ className, size = "sm", ...props }: React.ComponentProps<"button">) {
  return (
    <button className={hlm(buttonVariants({ size, className }))} {...props} />
  )
}
`;

		const styleMap: StyleMap = {
			'spartan-button-size-sm': 'h-7 px-2.5',
			'spartan-button-size-lg': 'h-9 px-4',
		};

		const result = await applyTransform(source, styleMap);

		expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"
      import { cva } from "class-variance-authority"
      import { cn } from "@/lib/utils"

      const buttonVariants = cva(
        "inline-flex items-center",
        {
          variants: {
            size: {
              sm: "h-7 px-2.5",
              lg: "h-9 px-4",
            },
          },
        }
      )

      function Button({ className, size = "sm", ...props }: React.ComponentProps<"button">) {
        return (
          <button className={hlm(buttonVariants({ size, className }))} {...props} />
        )
      }
      "
    `);
	});

	it('handles button with base, variant, and size classes', async () => {
		const source = `import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "spartan-button inline-flex items-center justify-center",
  {
    variants: {
      variant: {
        default: "spartan-button-variant-default",
        destructive: "spartan-button-variant-destructive",
      },
      size: {
        sm: "spartan-button-size-sm",
        lg: "spartan-button-size-lg",
      },
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "sm",
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button className={hlm(buttonVariants({ variant, size, className }))} {...props} />
  )
}
`;

		const styleMap: StyleMap = {
			'spartan-button': 'rounded-lg border font-medium',
			'spartan-button-variant-default': 'bg-primary text-primary-foreground',
			'spartan-button-variant-destructive': 'bg-destructive text-destructive-foreground',
			'spartan-button-size-sm': 'h-8 px-3 text-sm',
			'spartan-button-size-lg': 'h-10 px-6 text-base',
		};

		const result = await applyTransform(source, styleMap);

		expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"
      import { cva } from "class-variance-authority"
      import { cn } from "@/lib/utils"

      const buttonVariants = cva(
        "rounded-lg border font-medium inline-flex items-center justify-center",
        {
          variants: {
            variant: {
              default: "bg-primary text-primary-foreground",
              destructive: "bg-destructive text-destructive-foreground",
            },
            size: {
              sm: "h-8 px-3 text-sm",
              lg: "h-10 px-6 text-base",
            },
          },
        }
      )

      function Button({
        className,
        variant = "default",
        size = "sm",
        ...props
      }: React.ComponentProps<"button">) {
        return (
          <button className={hlm(buttonVariants({ variant, size, className }))} {...props} />
        )
      }
      "
    `);
	});

	it('removes empty string arguments from hlm() calls', async () => {
		const source = `import * as React from "react"
import { cn } from "@/lib/utils"

function Foo({ className, ...props }: { className?: string }) {
  return (
    <div className={hlm("spartan-foo", "", "existing-class", "")} {...props} />
  )
}
`;

		const result = await applyTransform(source, baseStyleMap);

		expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"
      import { cn } from "@/lib/utils"

      function Foo({ className, ...props }: { className?: string }) {
        return (
          <div className={hlm("bg-background gap-4 rounded-xl", "existing-class")} {...props} />
        )
      }
      "
    `);
	});

	it('prevents duplicate application when spartan-* class is in both cva and className', async () => {
		const source = `import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva("spartan-button", {
  variants: {
    variant: {
      default: "",
    },
  },
})

function Button({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button className={hlm(buttonVariants({ className }), "spartan-button")} {...props} />
  )
}
`;

		const styleMap: StyleMap = {
			'spartan-button': 'rounded-lg border',
		};

		const result = await applyTransform(source, styleMap);

		expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"
      import { cva } from "class-variance-authority"
      import { cn } from "@/lib/utils"

      const buttonVariants = cva("rounded-lg border", {
        variants: {
          variant: {
            default: "",
          },
        },
      })

      function Button({ className, ...props }: React.ComponentProps<"button">) {
        return (
          <button className={hlm(buttonVariants({ className }))} {...props} />
        )
      }
      "
    `);
	});

	it('applies styles to multiple occurrences of the same spartan-* class', async () => {
		const source = `import * as React from "react"
import { cn } from "@/lib/utils"

function Foo() {
  return (
    <section>
      <div className="spartan-foo" />
      <div className={hlm("spartan-foo", "extra")} />
    </section>
  )
}
`;

		const result = await applyTransform(source, {
			'spartan-foo': 'bg-background gap-4 rounded-xl',
		});

		expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"
      import { cn } from "@/lib/utils"

      function Foo() {
        return (
          <section>
            <div className="bg-background gap-4 rounded-xl" />
            <div className={hlm("bg-background gap-4 rounded-xl", "extra")} />
          </section>
        )
      }
      "
    `);
	});

	it('applies styles to spartan-* classes inside mergeProps within useRender', async () => {
		const source = `import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cn } from "@/lib/utils"

function ButtonGroupText({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: hlm(
          "spartan-button-group-text flex items-center [&_svg]:pointer-events-none",
          className
        ),
      },
      props
    ),
    render,
    state: {
      slot: "button-group-text",
    },
  })
}
`;

		const styleMap: StyleMap = {
			'spartan-button-group-text': 'text-sm font-medium',
		};

		const result = await applyTransform(source, styleMap);

		expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"
      import { mergeProps } from "@base-ui/react/merge-props"
      import { useRender } from "@base-ui/react/use-render"
      import { cn } from "@/lib/utils"

      function ButtonGroupText({
        className,
        render,
        ...props
      }: useRender.ComponentProps<"div">) {
        return useRender({
          defaultTagName: "div",
          props: mergeProps<"div">(
            {
              className: hlm(
                "text-sm font-medium flex items-center [&_svg]:pointer-events-none",
                className
              ),
            },
            props
          ),
          render,
          state: {
            slot: "button-group-text",
          },
        })
      }
      "
    `);
	});

	it('preserves allowlisted classes even when not in styleMap', async () => {
		const source = `import * as React from "react"
import { cn } from "@/lib/utils"

function Menu({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={hlm("spartan-menu-target spartan-foo", className)} {...props} />
  )
}
`;

		const styleMap: StyleMap = {
			'spartan-foo': 'bg-background rounded-lg',
		};

		const result = await applyTransform(source, styleMap);

		expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"
      import { cn } from "@/lib/utils"

      function Menu({ className, ...props }: React.ComponentProps<"div">) {
        return (
          <div className={hlm("bg-background rounded-lg spartan-menu-target", className)} {...props} />
        )
      }
      "
    `);
	});

	it('preserves allowlisted classes even when in styleMap', async () => {
		const source = `import * as React from "react"
import { cn } from "@/lib/utils"

function Menu({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={hlm("spartan-menu-target", className)} {...props} />
  )
}
`;

		const styleMap: StyleMap = {
			'spartan-menu-target': 'z-50 origin-top',
		};

		const result = await applyTransform(source, styleMap);

		expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"
      import { cn } from "@/lib/utils"

      function Menu({ className, ...props }: React.ComponentProps<"div">) {
        return (
          <div className={hlm("z-50 origin-top spartan-menu-target", className)} {...props} />
        )
      }
      "
    `);
	});

	it('preserves allowlisted classes in mergeProps within useRender', async () => {
		const source = `import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cn } from "@/lib/utils"

function MenuContent({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: hlm(
          "spartan-menu-target spartan-menu-content flex items-center",
          className
        ),
      },
      props
    ),
    render,
    state: {
      slot: "menu-content",
    },
  })
}
`;

		const styleMap: StyleMap = {
			'spartan-menu-content': 'bg-background rounded-md',
		};

		const result = await applyTransform(source, styleMap);

		expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"
      import { mergeProps } from "@base-ui/react/merge-props"
      import { useRender } from "@base-ui/react/use-render"
      import { cn } from "@/lib/utils"

      function MenuContent({
        className,
        render,
        ...props
      }: useRender.ComponentProps<"div">) {
        return useRender({
          defaultTagName: "div",
          props: mergeProps<"div">(
            {
              className: hlm(
                "bg-background rounded-md spartan-menu-target flex items-center",
                className
              ),
            },
            props
          ),
          render,
          state: {
            slot: "menu-content",
          },
        })
      }
      "
    `);
	});

	it('deduplicates classes when style map classes overlap with existing', async () => {
		const source = `import * as React from "react"
import { cn } from "@/lib/utils"

function Foo({ className, ...props }: { className?: string }) {
  return (
    <div className={hlm("spartan-foo bg-background", className)} {...props} />
  )
}
`;

		const styleMap: StyleMap = {
			'spartan-foo': 'bg-background gap-4 rounded-xl',
		};

		const result = await applyTransform(source, styleMap);

		// bg-background should appear only once, not twice.
		expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"
      import { cn } from "@/lib/utils"

      function Foo({ className, ...props }: { className?: string }) {
        return (
          <div className={hlm("gap-4 rounded-xl bg-background", className)} {...props} />
        )
      }
      "
    `);
	});

	it('handles conflicting tailwind classes with tailwind-merge', async () => {
		const source = `import * as React from "react"
import { cn } from "@/lib/utils"

function Foo({ className, ...props }: { className?: string }) {
  return (
    <div className={hlm("spartan-foo p-4", className)} {...props} />
  )
}
`;

		const styleMap: StyleMap = {
			'spartan-foo': 'p-2 rounded-xl',
		};

		const result = await applyTransform(source, styleMap);

		// p-2 from style map should be overridden by p-4 from existing.
		expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"
      import { cn } from "@/lib/utils"

      function Foo({ className, ...props }: { className?: string }) {
        return (
          <div className={hlm("rounded-xl p-4", className)} {...props} />
        )
      }
      "
    `);
	});

	it('handles conflicting color classes with tailwind-merge', async () => {
		const source = `import * as React from "react"
import { cn } from "@/lib/utils"

function Foo({ className, ...props }: { className?: string }) {
  return (
    <div className={hlm("spartan-foo bg-primary", className)} {...props} />
  )
}
`;

		const styleMap: StyleMap = {
			'spartan-foo': 'bg-muted text-foreground',
		};

		const result = await applyTransform(source, styleMap);

		// bg-muted from style map should be overridden by bg-primary from existing.
		expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"
      import { cn } from "@/lib/utils"

      function Foo({ className, ...props }: { className?: string }) {
        return (
          <div className={hlm("text-foreground bg-primary", className)} {...props} />
        )
      }
      "
    `);
	});

	it('handles conflicting size classes with tailwind-merge', async () => {
		const source = `import * as React from "react"
import { cn } from "@/lib/utils"

function Foo({ className, ...props }: { className?: string }) {
  return (
    <div className={hlm("spartan-foo text-lg rounded-lg", className)} {...props} />
  )
}
`;

		const styleMap: StyleMap = {
			'spartan-foo': 'text-sm rounded-md border',
		};

		const result = await applyTransform(source, styleMap);

		// text-sm and rounded-md from style map should be overridden.
		expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"
      import { cn } from "@/lib/utils"

      function Foo({ className, ...props }: { className?: string }) {
        return (
          <div className={hlm("border text-lg rounded-lg", className)} {...props} />
        )
      }
      "
    `);
	});

	it('handles multiple duplicates in cva base and variants', async () => {
		const source = `import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "spartan-button rounded-md",
  {
    variants: {
      variant: {
        default: "spartan-button-default bg-primary",
      },
    },
  }
)

function Button({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button className={hlm(buttonVariants({ className }))} {...props} />
  )
}
`;

		const styleMap: StyleMap = {
			'spartan-button': 'rounded-lg border font-medium',
			'spartan-button-default': 'bg-muted text-foreground',
		};

		const result = await applyTransform(source, styleMap);

		// rounded-lg should be overridden by rounded-md, bg-muted should be overridden by bg-primary.
		expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"
      import { cva } from "class-variance-authority"
      import { cn } from "@/lib/utils"

      const buttonVariants = cva(
        "border font-medium rounded-md",
        {
          variants: {
            variant: {
              default: "text-foreground bg-primary",
            },
          },
        }
      )

      function Button({ className, ...props }: React.ComponentProps<"button">) {
        return (
          <button className={hlm(buttonVariants({ className }))} {...props} />
        )
      }
      "
    `);
	});

	it('handles conflicting spacing classes with tailwind-merge', async () => {
		const source = `import * as React from "react"
import { cn } from "@/lib/utils"

function Foo({ className, ...props }: { className?: string }) {
  return (
    <div className={hlm("spartan-foo mx-4 py-2", className)} {...props} />
  )
}
`;

		const styleMap: StyleMap = {
			'spartan-foo': 'mx-2 py-4 flex',
		};

		const result = await applyTransform(source, styleMap);

		// mx-2 and py-4 should be overridden by mx-4 and py-2.
		expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"
      import { cn } from "@/lib/utils"

      function Foo({ className, ...props }: { className?: string }) {
        return (
          <div className={hlm("flex mx-4 py-2", className)} {...props} />
        )
      }
      "
    `);
	});

	it('handles arbitrary values with tailwind-merge', async () => {
		const source = `import * as React from "react"
import { cn } from "@/lib/utils"

function Foo({ className, ...props }: { className?: string }) {
  return (
    <div className={hlm("spartan-foo p-[20px]", className)} {...props} />
  )
}
`;

		const styleMap: StyleMap = {
			'spartan-foo': 'p-4 rounded-xl',
		};

		const result = await applyTransform(source, styleMap);

		// p-4 should be overridden by p-[20px].
		expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"
      import { cn } from "@/lib/utils"

      function Foo({ className, ...props }: { className?: string }) {
        return (
          <div className={hlm("rounded-xl p-[20px]", className)} {...props} />
        )
      }
      "
    `);
	});

	it('preserves allowlisted classes in cva base string', async () => {
		const source = `import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const menuVariants = cva(
  "spartan-menu-target spartan-menu inline-flex items-center",
  {
    variants: {
      variant: {
        default: "",
      },
    },
  }
)

function Menu({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={hlm(menuVariants({ className }))} {...props} />
  )
}
`;

		const styleMap: StyleMap = {
			'spartan-menu': 'bg-background rounded-lg',
		};

		const result = await applyTransform(source, styleMap);

		expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"
      import { cva } from "class-variance-authority"
      import { cn } from "@/lib/utils"

      const menuVariants = cva(
        "bg-background rounded-lg spartan-menu-target inline-flex items-center",
        {
          variants: {
            variant: {
              default: "",
            },
          },
        }
      )

      function Menu({ className, ...props }: React.ComponentProps<"div">) {
        return (
          <div className={hlm(menuVariants({ className }))} {...props} />
        )
      }
      "
    `);
	});
});
