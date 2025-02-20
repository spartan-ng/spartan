import { Component, Input, ViewEncapsulation, booleanAttribute, inject } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { marked } from 'marked';
import { gfmHeadingId } from 'marked-gfm-heading-id';
import { markedHighlight } from 'marked-highlight';

import { Clipboard } from '@angular/cdk/clipboard';
import { NgIf } from '@angular/common';
import { provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideClipboard } from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-typescript';

declare const Prism: typeof import('prismjs');

@Component({
	selector: 'spartan-code',
	imports: [HlmButtonDirective, NgIcon, HlmIconDirective, NgIf],
	providers: [provideIcons({ lucideClipboard, lucideCheck })],
	host: {
		class: 'spartan-scroll relative block font-mono rounded-md text-sm text-white bg-zinc-950 dark:bg-zinc-900',
	},
	template: `
		<button
			*ngIf="!_disableCopy"
			(click)="copyToClipBoard()"
			hlmBtn
			variant="ghost"
			class="absolute right-2 top-2 h-6 w-6 p-1"
		>
			<ng-icon hlm size="xs" [name]="copied ? 'lucideCheck' : 'lucideClipboard'" />
		</button>
		<div class="max-h-[650px] w-full overflow-auto whitespace-nowrap p-4">
			<div class="max-w-screen max-w-full" [innerHTML]="_content"></div>
		</div>
	`,
	styles: [
		`
			.spartan-scroll .token.class-name {
				opacity: 1;
			}

			.spartan-scroll .token.property,
			.spartan-scroll .token.tag,
			.spartan-scroll .token.boolean,
			.spartan-scroll .token.number,
			.spartan-scroll .token.constant,
			.spartan-scroll .token.symbol,
			.spartan-scroll .token.deleted,
			.spartan-scroll .token.selector,
			.spartan-scroll .token.attr-name,
			.spartan-scroll .token.string,
			.spartan-scroll .token.char,
			.spartan-scroll .token.builtin,
			.spartan-scroll .token.inserted,
			.spartan-scroll .token.atrule,
			.spartan-scroll .token.attr-value,
			.spartan-scroll .token.function,
			.spartan-scroll .token.regex,
			.spartan-scroll .token.important,
			.spartan-scroll .token.variable {
				opacity: 0.533;
			}

			.spartan-scroll .token.operator,
			.spartan-scroll .token.entity,
			.spartan-scroll .token.url,
			.spartan-scroll .token.keyword,
			.spartan-scroll .language-css .token.string,
			.spartan-scroll .style .token.string {
				opacity: 0.733;
			}
		`,
	],
	encapsulation: ViewEncapsulation.None,
})
export class CodeComponent {
	private readonly _clipboard = inject(Clipboard);
	private readonly _marked: typeof marked;
	protected _content = '';
	protected copied = false;

	protected _disableCopy = false;
	@Input({ transform: booleanAttribute })
	public set disableCopy(value: boolean) {
		this._disableCopy = value;
	}

	private _language: 'ts' | 'sh' | 'js' = 'ts';
	@Input()
	public set language(value: 'ts' | 'sh' | 'js') {
		this._language = value;
	}

	private _code: string | null | undefined;
	@Input()
	public set code(value: string | null | undefined) {
		this._code = value;
		(this._language === 'sh'
			? this._marked.parse(value?.trim() ?? '')
			: // eslint-disable-next-line @typescript-eslint/no-explicit-any
				(this._marked.parse(`\`\`\`typescript\n${value?.trim() ?? ''}\n\`\`\``) as any)
		).then((content: string) => {
			this._content = content;
		});
	}

	constructor() {
		const renderer = new marked.Renderer();
		renderer.code = (code, lang) => {
			if (!lang) {
				return `<pre><code>${code}</code></pre>`;
			}
			const langClass = `language-${lang}`;
			return `<pre class="${langClass}"><code class="${langClass}">${code}</code></pre>`;
		};

		marked.use(
			gfmHeadingId(),
			markedHighlight({
				async: true,
				highlight: (code, lang) => {
					lang = lang || 'typescript';
					if (!Prism.languages[lang]) {
						console.warn(`Notice:
    ---------------------------------------------------------------------------------------
    The requested language '${lang}' is not available with the provided setup.
    To enable, import your main.ts as:
      import  'prismjs/components/prism-${lang}';
    ---------------------------------------------------------------------------------------
        `);
						return code;
					}
					return Prism.highlight(code, Prism.languages[lang], lang);
				},
			}),
			{
				renderer,
				pedantic: false,
				gfm: true,
				breaks: false,
				mangle: false,
			},
		);

		this._marked = marked;
	}

	copyToClipBoard() {
		if (!this._code) return;
		this._clipboard.copy(this._code);
		this.copied = true;
		setTimeout(() => (this.copied = false), 3000);
	}
}
