import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideDownload, lucideTerminal, lucideWrapText } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCodeBlock, HlmCodeBlockImports } from '@spartan-ng/helm/code-block';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

export default {
	title: 'Code Block',
	component: HlmCodeBlock,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [HlmCodeBlockImports, HlmButtonImports, NgIcon],
			providers: [provideIcons({ lucideTerminal, lucideWrapText, lucideDownload })],
		}),
	],
} as Meta<HlmCodeBlock>;

type Story = StoryObj<HlmCodeBlock>;

const routeCode = `import { Component, input } from '@angular/core';

@Component({
  selector: 'app-hello',
  template: \`<p>Hello, {{ name() }}!</p>\`,
})
export class HelloComponent {
  readonly name = input('Angular');
}`;

const terminalOutput = `$ pnpm add @spartan-ng/brain
Packages: +14
Progress: resolved 412, reused 398, downloaded 14, added 14, done
Done in 2.8s using pnpm v10.18.0`;

export const Default: Story = {
	render: () => ({
		props: { code: routeCode },
		template: `
		<div class="w-full max-w-lg p-4">
			<hlm-code-block>
				<hlm-code-block-header>
					<hlm-code-block-title>app/hello.component.ts</hlm-code-block-title>
					<hlm-code-block-actions>
						<button hlmCodeBlockCopyButton [value]="code"></button>
					</hlm-code-block-actions>
				</hlm-code-block-header>
				<pre hlmCodeBlockContent [code]="code"></pre>
			</hlm-code-block>
		</div>
		`,
	}),
};

export const Basic: Story = {
	render: () => ({
		props: { output: terminalOutput },
		template: `
		<div class="w-full max-w-md p-4">
			<hlm-code-block>
				<pre hlmCodeBlockContent [code]="output"></pre>
			</hlm-code-block>
		</div>
		`,
	}),
};

export const Header: Story = {
	render: () => ({
		props: { output: terminalOutput },
		template: `
		<div class="w-full max-w-md p-4">
			<hlm-code-block>
				<hlm-code-block-header>
					<hlm-code-block-title>
						<ng-icon name="lucideTerminal" />
						Terminal
					</hlm-code-block-title>
					<hlm-code-block-actions>
						<button hlmCodeBlockCopyButton [value]="output"></button>
					</hlm-code-block-actions>
				</hlm-code-block-header>
				<pre hlmCodeBlockContent [code]="output"></pre>
			</hlm-code-block>
		</div>
		`,
	}),
};

export const LineNumbers: Story = {
	render: () => ({
		props: {
			code: `{
  "name": "chat",
  "private": true,
  "scripts": {
    "start": "ng serve",
    "build": "ng build"
  }
}`,
		},
		template: `
		<div class="w-full max-w-md p-4">
			<hlm-code-block>
				<hlm-code-block-header>
					<hlm-code-block-title>package.json</hlm-code-block-title>
					<hlm-code-block-actions>
						<button hlmCodeBlockCopyButton [value]="code"></button>
					</hlm-code-block-actions>
				</hlm-code-block-header>
				<pre hlmCodeBlockContent [code]="code" lineNumbers></pre>
			</hlm-code-block>
		</div>
		`,
	}),
};

export const HighlightedLines: Story = {
	render: () => ({
		props: {
			lines: [
				{ text: '{', variant: 'default' },
				{ text: '  "projects": {', variant: 'default' },
				{ text: '    "app": {', variant: 'default' },
				{ text: '      "architect": {', variant: 'default' },
				{ text: '        "build": {', variant: 'default' },
				{ text: '          "options": {', variant: 'default' },
				{ text: '            "outputPath": "dist/app",', variant: 'highlighted' },
				{ text: '            "index": "src/index.html",', variant: 'default' },
				{ text: '            "browser": "src/main.ts"', variant: 'highlighted' },
				{ text: '          }', variant: 'default' },
				{ text: '        }', variant: 'default' },
				{ text: '      }', variant: 'default' },
				{ text: '    }', variant: 'default' },
				{ text: '  }', variant: 'default' },
				{ text: '}', variant: 'default' },
			],
		},
		template: `
		<div class="w-full max-w-md p-4">
			<hlm-code-block>
				<pre hlmCodeBlockContent lineNumbers>
					@for (line of lines; track $index) {
						<span hlmCodeBlockLine [variant]="line.variant">{{ line.text }}</span>
					}
				</pre>
			</hlm-code-block>
		</div>
		`,
	}),
};

export const Diff: Story = {
	render: () => ({
		props: {
			lines: [
				{ text: 'export class GreetingComponent {', variant: 'default' },
				{ text: '  protected readonly greeting = "Hello, " + this.name;', variant: 'removed' },
				{
					text: '  protected readonly greeting = computed(() => `Hello, ${this.name()}! Welcome back.`);',
					variant: 'added',
				},
				{ text: "  readonly name = input('Angular');", variant: 'default' },
				{ text: '}', variant: 'default' },
			],
		},
		template: `
		<div class="w-full max-w-md p-4">
			<hlm-code-block>
				<hlm-code-block-header>
					<hlm-code-block-title>app/greeting.component.ts</hlm-code-block-title>
				</hlm-code-block-header>
				<pre hlmCodeBlockContent>
					@for (line of lines; track $index) {
						<span hlmCodeBlockLine [variant]="line.variant">{{ line.text }}</span>
					}
				</pre>
			</hlm-code-block>
		</div>
		`,
	}),
};

export const Size: Story = {
	render: () => ({
		props: { output: terminalOutput },
		template: `
		<div class="grid w-full max-w-md gap-4 p-4">
			<hlm-code-block>
				<hlm-code-block-header>
					<hlm-code-block-title>
						<ng-icon name="lucideTerminal" />
						Terminal
					</hlm-code-block-title>
					<hlm-code-block-actions>
						<button hlmCodeBlockCopyButton [value]="output"></button>
					</hlm-code-block-actions>
				</hlm-code-block-header>
				<pre hlmCodeBlockContent [code]="output"></pre>
			</hlm-code-block>
			<hlm-code-block size="sm">
				<hlm-code-block-header>
					<hlm-code-block-title>
						<ng-icon name="lucideTerminal" />
						Terminal
					</hlm-code-block-title>
					<hlm-code-block-actions>
						<button hlmCodeBlockCopyButton [value]="output"></button>
					</hlm-code-block-actions>
				</hlm-code-block-header>
				<pre hlmCodeBlockContent [code]="output"></pre>
			</hlm-code-block>
		</div>
		`,
	}),
};

export const Destructive: Story = {
	render: () => ({
		props: {
			error: `TypeError: Cannot read properties of undefined (reading 'pipe')
    at MessageListComponent.ngOnInit (app/message-list.component.ts:18:22)
    at callHook (core.mjs:16305:18)`,
		},
		template: `
		<div class="w-full max-w-md p-4">
			<hlm-code-block variant="destructive">
				<hlm-code-block-header>
					<hlm-code-block-title>Error</hlm-code-block-title>
					<hlm-code-block-actions>
						<button hlmCodeBlockCopyButton [value]="error"></button>
					</hlm-code-block-actions>
				</hlm-code-block-header>
				<pre hlmCodeBlockContent [code]="error"></pre>
			</hlm-code-block>
		</div>
		`,
	}),
};

export const Actions: Story = {
	render: () => ({
		props: {
			state: { wrap: false },
			output: terminalOutput,
			download: (value: string, filename: string) => {
				const url = URL.createObjectURL(new Blob([value], { type: 'text/plain' }));
				const link = document.createElement('a');
				link.href = url;
				link.download = filename;
				link.click();
				URL.revokeObjectURL(url);
			},
		},
		template: `
		<div class="w-full max-w-md p-4">
			<hlm-code-block>
				<hlm-code-block-header>
					<hlm-code-block-title>
						<ng-icon name="lucideTerminal" />
						Terminal
					</hlm-code-block-title>
					<hlm-code-block-actions>
						<button
							hlmBtn
							variant="ghost"
							size="icon-xs"
							aria-label="Wrap lines"
							[attr.aria-pressed]="state.wrap"
							(click)="state.wrap = !state.wrap"
						>
							<ng-icon name="lucideWrapText" />
						</button>
						<button hlmBtn variant="ghost" size="icon-xs" aria-label="Download" (click)="download(output, 'output.log')">
							<ng-icon name="lucideDownload" />
						</button>
						<button hlmCodeBlockCopyButton [value]="output"></button>
					</hlm-code-block-actions>
				</hlm-code-block-header>
				<pre hlmCodeBlockContent [code]="output" [wrap]="state.wrap"></pre>
			</hlm-code-block>
		</div>
		`,
	}),
};
