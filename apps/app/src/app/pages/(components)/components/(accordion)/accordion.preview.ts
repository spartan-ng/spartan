import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import {
	HlmAccordionContentComponent,
	HlmAccordionDirective,
	HlmAccordionIconDirective,
	HlmAccordionItemDirective,
	HlmAccordionTriggerDirective,
} from '@spartan-ng/ui-accordion-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';

@Component({
	selector: 'spartan-accordion-preview',
	standalone: true,
	imports: [
		HlmAccordionDirective,
		HlmAccordionItemDirective,
		HlmAccordionTriggerDirective,
		HlmAccordionIconDirective,
		HlmAccordionContentComponent,
		NgIcon,
		HlmIconDirective,
	],
	viewProviders: [provideIcons({ lucideChevronDown })],
	template: `
		<div hlmAccordion>
			<div hlmAccordionItem>
				<button hlmAccordionTrigger>
					Is it accessible?
					<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
				</button>
				<hlm-accordion-content>Yes. It adheres to the WAI-ARIA design pattern.</hlm-accordion-content>
			</div>

			<div hlmAccordionItem>
				<button hlmAccordionTrigger>
					Is it styled?
					<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
				</button>
				<hlm-accordion-content>
					Yes. It comes with default styles that match the other components' aesthetics.
				</hlm-accordion-content>
			</div>

			<div hlmAccordionItem>
				<button hlmAccordionTrigger>
					Is it animated?
					<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
				</button>
				<hlm-accordion-content>
					Yes. It's animated by default, but you can disable it if you prefer.
				</hlm-accordion-content>
			</div>
		</div>
	`,
})
export class AccordionPreviewComponent {}

export const codeImports = `
import {
  HlmAccordionContentComponent,
  HlmAccordionDirective,
  HlmAccordionIconDirective,
  HlmAccordionItemDirective,
  HlmAccordionTriggerDirective,
} from '@spartan-ng/ui-accordion-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
`;

export const codeString = `import { Component } from '@angular/core';${codeImports}
@Component({
	selector: 'spartan-accordion-preview',
	standalone: true,
	imports: [
		HlmAccordionDirective,
		HlmAccordionItemDirective,
		HlmAccordionTriggerDirective,
		HlmAccordionContentComponent,
		HlmAccordionIconDirective,
		HlmIconDirective,
	],
	viewProviders: [provideIcons({ lucideChevronDown })],
	template: \`
		<div hlmAccordion>
			<div hlmAccordionItem>
				<button hlmAccordionTrigger>
					Is it accessible?
					<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
				</button>
				<hlm-accordion-content>Yes. It adheres to the WAI-ARIA design pattern.</hlm-accordion-content>
			</div>

			<div hlmAccordionItem>
				<button hlmAccordionTrigger>
					Is it styled?
					<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
				</button>
				<hlm-accordion-content>
					Yes. It comes with default styles that match the other components' aesthetics.
				</hlm-accordion-content>
			</div>

			<div hlmAccordionItem>
				<button hlmAccordionTrigger>
					Is it animated?
					<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
				</button>
				<hlm-accordion-content>
					Yes. It's animated by default, but you can disable it if you prefer.
				</hlm-accordion-content>
			</div>
		</div>
	\`,
})
export class AccordionPreviewComponent {}`;

export const codeSkeleton = `
<div hlmAccordion>
	<div hlmAccordionItem>
		<button hlmAccordionTrigger>
			Is it accessible?
			<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
		</button>
		<hlm-accordion-content>Yes. It adheres to the WAI-ARIA design pattern.</hlm-accordion-content>
	</div>
</div>
`;
