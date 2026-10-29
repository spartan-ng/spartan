import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { fireEvent, render } from '@testing-library/angular';
import { HlmSheetImports } from '../../index';

const flush = async () => {
	await new Promise((resolve) => setTimeout(resolve, 0));
	await new Promise((resolve) => setTimeout(resolve, 0));
};

@Component({
	selector: 'hlm-sheet-host',
	imports: [HlmSheetImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-sheet [side]="side()">
			<button hlmSheetTrigger>Open Sheet</button>
			<hlm-sheet-content *hlmSheetPortal [closeLabel]="closeLabel()">
				<h3 hlmSheetTitle>Edit Profile</h3>
				<button hlmSheetClose data-testid="close">Cancel</button>
			</hlm-sheet-content>
		</hlm-sheet>
	`,
})
class SheetHost {
	public readonly side = input<'top' | 'bottom' | 'left' | 'right'>('right');
	public readonly closeLabel = input('Close');
}

@Component({
	selector: 'hlm-sheet-nested-host',
	imports: [HlmSheetImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-sheet side="top">
			<button hlmSheetTrigger data-testid="outer-trigger">Open Sheet</button>
			<hlm-sheet-content *hlmSheetPortal>
				<hlm-sheet side="right">
					<button hlmSheetTrigger data-testid="nested-trigger">Open Nested</button>
					<hlm-sheet-content *hlmSheetPortal>
						<button hlmSheetClose data-testid="nested-close">Close</button>
					</hlm-sheet-content>
				</hlm-sheet>
			</hlm-sheet-content>
		</hlm-sheet>
	`,
})
class NestedSheetHost {}

const trigger = () => document.querySelector('button[hlmSheetTrigger]') as HTMLButtonElement;
const content = () => document.querySelector('hlm-sheet-content') as HTMLElement | null;
const contents = () => Array.from(document.querySelectorAll<HTMLElement>('hlm-sheet-content'));

describe('HlmSheet', () => {
	afterEach(() => {
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	it('opens with content and closes via the close button', async () => {
		const view = await render(SheetHost);

		fireEvent.click(trigger());
		view.detectChanges();
		await flush();

		expect(content()).toBeTruthy();
		expect(content()?.textContent).toContain('Edit Profile');
		expect(content()?.querySelector('.spartan-sheet-close .sr-only')?.textContent?.trim()).toBe('Close');

		fireEvent.click(document.querySelector('[data-testid="close"]') as HTMLButtonElement);
		view.detectChanges();
		await flush();

		expect(content()).toBeNull();
	});

	it('uses the close label input for the close button', async () => {
		const view = await render(SheetHost, { inputs: { closeLabel: 'Schließen' } });

		fireEvent.click(trigger());
		view.detectChanges();
		await flush();

		const closeLabel = content()?.querySelector('.spartan-sheet-close .sr-only');
		expect(closeLabel?.textContent?.trim()).toBe('Schließen');
	});

	it('uses the nested sheet side instead of the parent sheet side', async () => {
		const style = document.createElement('style');
		// Keep the overlay mounted while it animates out so the content's state can be observed.
		style.textContent = `
			@keyframes brn-test-sheet-exit { from { opacity: 1; } to { opacity: 0; } }
			.cdk-overlay-pane[data-state='closed'] { animation: brn-test-sheet-exit 150ms linear; }
		`;
		document.head.appendChild(style);

		try {
			const view = await render(NestedSheetHost);

			fireEvent.click(document.querySelector('[data-testid="outer-trigger"]') as HTMLButtonElement);
			view.detectChanges();
			await flush();

			fireEvent.click(document.querySelector('[data-testid="nested-trigger"]') as HTMLButtonElement);
			view.detectChanges();
			await flush();

			const nestedContent = contents().at(-1);
			expect(nestedContent?.getAttribute('data-side')).toBe('right');

			fireEvent.click(document.querySelector('[data-testid="nested-close"]') as HTMLButtonElement);
			view.detectChanges();
			await flush();

			const [outerContent, closingContent] = contents();
			expect(closingContent.getAttribute('data-state')).toBe('closed');
			expect(outerContent.getAttribute('data-state')).toBe('open');

			await new Promise((resolve) => setTimeout(resolve, 300));

			expect(contents()).toHaveLength(1);
			expect(contents()[0].getAttribute('data-side')).toBe('top');
		} finally {
			style.remove();
		}
	});
});
