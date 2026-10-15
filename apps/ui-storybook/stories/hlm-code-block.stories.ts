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

const routeCode = `import { streamText } from "ai"

export async function POST(request: Request) {
  const { messages } = await request.json()

  const result = streamText({
    model: "anthropic/claude-sonnet-4.5",
    system: "You are a helpful assistant. Answer in one short paragraph.",
    messages,
  })

  return result.toUIMessageStreamResponse()
}`;

const terminalOutput = `$ pnpm add ai @ai-sdk/react zod
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
					<hlm-code-block-title>app/api/chat/route.ts</hlm-code-block-title>
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
    "dev": "next dev",
    "build": "next build"
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
				{ text: 'export default {', variant: 'default' },
				{ text: '  experimental: {', variant: 'default' },
				{ text: '    reactCompiler: true,', variant: 'highlighted' },
				{ text: '    viewTransition: true,', variant: 'highlighted' },
				{ text: '  },', variant: 'default' },
				{ text: '  images: {', variant: 'default' },
				{ text: '    remotePatterns: [{ hostname: "avatars.githubusercontent.com" }],', variant: 'default' },
				{ text: '  },', variant: 'default' },
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
				{ text: 'export function Greeting({ name }: { name: string }) {', variant: 'default' },
				{ text: '  return <p>Hello, {name}</p>', variant: 'removed' },
				{ text: '  return <p className="text-sm text-muted-foreground">', variant: 'added' },
				{ text: '    Hello, {name}!', variant: 'added' },
				{ text: '  </p>', variant: 'added' },
				{ text: '}', variant: 'default' },
			],
		},
		template: `
		<div class="w-full max-w-md p-4">
			<hlm-code-block>
				<hlm-code-block-header>
					<hlm-code-block-title>components/greeting.tsx</hlm-code-block-title>
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
			error: `TypeError: Cannot read properties of undefined (reading 'map')
    at MessageList (components/message-list.tsx:18:22)
    at renderWithHooks (react-dom.development.js:16305:18)`,
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
