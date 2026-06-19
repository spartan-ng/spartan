import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { render, screen, waitFor } from '@testing-library/angular';
import { HlmAccordionImports } from '../index';

@Component({
	imports: [HlmAccordionImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-accordion>
			<hlm-accordion-item [isOpened]="isOpened()">
				<hlm-accordion-trigger>Dynamic item</hlm-accordion-trigger>
				<hlm-accordion-content class="custom-content" data-testid="content">
					<div data-testid="inner">
						@for (item of contentItems(); track item) {
							<div>Dynamic content</div>
						}
					</div>
				</hlm-accordion-content>
			</hlm-accordion-item>
		</hlm-accordion>
	`,
})
class HlmAccordionDynamicContentSpec {
	public readonly isOpened = signal(true);
	public readonly contentItems = signal([1]);
}

describe('HlmAccordionContent', () => {
	it('uses an understandable height collapse contract with natural open height', async () => {
		const { fixture } = await render(HlmAccordionDynamicContentSpec);
		const content = screen.getByTestId('content');
		const inner = content.querySelector('.spartan-accordion-content-inner');

		await waitFor(() => expect(content.classList.contains('spartan-accordion-content')).toBe(true));

		expect(content.classList.contains('custom-content')).toBe(true);
		expect(content.classList.contains('overflow-hidden')).toBe(true);
		expect(content.classList.contains('data-[state=closed]:h-0')).toBe(true);
		expect(content.classList.contains('data-[state=open]:h-auto')).toBe(true);
		expect(inner?.classList.contains('spartan-accordion-content-inner')).toBe(true);

		fixture.componentInstance.contentItems.set([1, 2]);
		fixture.componentInstance.isOpened.set(false);
		await fixture.whenStable();

		expect(content.getAttribute('data-state')).toBe('closed');
	});
});
