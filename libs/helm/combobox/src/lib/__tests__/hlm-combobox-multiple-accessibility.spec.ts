import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrnComboboxMultiple } from '@spartan-ng/brain/combobox';
import { HlmComboboxImports } from '../../index';

// Lets the popover open/close transition settle.
const flush = async () => {
	await new Promise((resolve) => setTimeout(resolve, 0));
	await new Promise((resolve) => setTimeout(resolve, 0));
};

@Component({
	selector: 'hlm-combobox-multiple-accessibility-host',
	imports: [HlmComboboxImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-combobox-multiple [(value)]="selected">
			<hlm-combobox-chips>
				<input hlmComboboxChipInput />
			</hlm-combobox-chips>
			<hlm-combobox-content *hlmComboboxPortal>
				<div hlmComboboxList>
					<hlm-combobox-item value="anna">Anna</hlm-combobox-item>
					<hlm-combobox-item value="ben">Ben</hlm-combobox-item>
				</div>
			</hlm-combobox-content>
		</hlm-combobox-multiple>
	`,
})
class HlmComboboxMultipleAccessibilityHost {
	public readonly selected = signal<string[] | null>(null);
}

describe('HlmComboboxMultiple accessibility', () => {
	afterEach(() => {
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	// Regression (#1789): the chip input must expose the highlighted option and link the listbox,
	// so screen readers announce each option while navigating the multiple combobox.
	it('links the chip input to the listbox and exposes the active option', async () => {
		const fixture = TestBed.createComponent(HlmComboboxMultipleAccessibilityHost);
		fixture.detectChanges();

		const combobox = fixture.debugElement.query(By.directive(BrnComboboxMultiple)).injector.get(BrnComboboxMultiple);
		combobox.open();
		combobox.keyManager.setActiveItem(0);
		fixture.detectChanges();
		await flush();

		const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
		const listbox: HTMLElement = document.querySelector('[role="listbox"]')!;
		const activeOption: HTMLElement = document.querySelector('[role="option"]')!;

		expect(input.getAttribute('aria-controls')).toBe(listbox.id);
		expect(input.getAttribute('aria-activedescendant')).toBe(activeOption.id);
		fixture.destroy();
	});

	it('updates aria-activedescendant as the highlight moves', async () => {
		const fixture = TestBed.createComponent(HlmComboboxMultipleAccessibilityHost);
		fixture.detectChanges();

		const combobox = fixture.debugElement.query(By.directive(BrnComboboxMultiple)).injector.get(BrnComboboxMultiple);
		combobox.open();
		combobox.keyManager.setActiveItem(0);
		fixture.detectChanges();
		await flush();

		const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
		const options = document.querySelectorAll<HTMLElement>('[role="option"]');
		expect(input.getAttribute('aria-activedescendant')).toBe(options[0].id);

		combobox.keyManager.setActiveItem(1);
		fixture.detectChanges();

		expect(input.getAttribute('aria-activedescendant')).toBe(options[1].id);
		fixture.destroy();
	});
});
