import { isPlatformBrowser } from '@angular/common';
import { computed, Directive, inject, input, PLATFORM_ID } from '@angular/core';

export type AiType = 'chatgpt' | 'claude';

@Directive({
	selector: '[spartanAiChatLink]',
	host: {
		'[href]': '_computedHref()',
		target: '_blank',
		rel: 'noopener noreferrer',
	},
})
export class AiChatLinkDirective {
	private readonly _platformId = inject(PLATFORM_ID);

	/** The type of AI service to use */
	public readonly aiType = input.required<AiType>();

	/** Base query to start the conversation (defaults to spartan ui documentation) */
	public readonly baseQuery = input<string>("I'm looking at this spartan ui documentation");

	/** Custom follow-up query to append to the base prompt */
	public readonly customQuery = input<string>(
		'Help me understand how to use it. Be ready to explain concepts, give examples, or help debug based on it.',
	);

	/** Base URL templates for each AI service */
	private readonly _aiUrlTemplates = {
		chatgpt: 'https://chatgpt.com/?q={baseQuery}: {url}\n{customQuery}',
		claude: 'https://claude.ai/new?q={baseQuery}: {url}\n{customQuery}',
	};

	/** Computed href that builds the complete AI chat URL */
	protected readonly _computedHref = computed(() => {
		const currentUrl = this._getCurrentUrl();
		const template = this._aiUrlTemplates[this.aiType()];
		const baseQuery = this.baseQuery();
		const customQuery = this.customQuery();

		const fullQuery = template
			.replace('{baseQuery}', baseQuery)
			.replace('{url}', currentUrl)
			.replace('{customQuery}', customQuery);

		return encodeURI(fullQuery);
	});

	/** Get the current page URL */
	private _getCurrentUrl(): string {
		const pathname = (isPlatformBrowser(this._platformId) && window.location.pathname) ?? '';
		const baseUrl = 'https://www.spartan.ng';
		return `${baseUrl}${pathname}`;
	}
}
