import { Directive } from '@angular/core';
import { BrnStreamText } from '@spartan-ng/brain/stream-text';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmStreamText],hlm-stream-text',
	exportAs: 'hlmStreamText',
	hostDirectives: [
		{
			directive: BrnStreamText,
			inputs: ['content', 'streaming', 'autoBalance', 'markdown', 'smooth'],
		},
	],
	host: {
		'data-slot': 'stream-text',
	},
})
export class HlmStreamText {
	constructor() {
		classes(
			() =>
				'spartan-stream-text text-foreground [&_code]:bg-muted [&_pre]:bg-muted relative block leading-relaxed font-normal whitespace-pre-wrap data-[markdown]:whitespace-normal data-[streaming]:after:ml-0.5 data-[streaming]:after:inline-block data-[streaming]:after:h-4 data-[streaming]:after:w-1.5 data-[streaming]:after:animate-pulse data-[streaming]:after:bg-current data-[streaming]:after:align-middle [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:pl-3 [&_code]:rounded [&_code]:px-1 [&_code]:py-0.5 [&_h1]:text-lg [&_h1]:font-semibold [&_h2]:text-base [&_h2]:font-semibold [&_h3]:font-semibold [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-2 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:p-3 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_ul]:list-disc [&_ul]:pl-5',
		);
	}
}
