import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrnAutocomplete, BrnAutocompleteSearch } from '@spartan-ng/brain/autocomplete';
import { HlmAutocompleteImports } from '../../index';

@Component({
	imports: [HlmAutocompleteImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-autocomplete>
			<hlm-autocomplete-input autocomplete="postal-code" />
			<hlm-autocomplete-content *hlmAutocompletePortal>
				<div hlmAutocompleteList>
					<div hlmAutocompleteLabel id="autocomplete-label">Postal codes</div>
					<hlm-autocomplete-item value="1000">1000</hlm-autocomplete-item>
					<hlm-autocomplete-item value="2000">2000</hlm-autocomplete-item>
				</div>
			</hlm-autocomplete-content>
		</hlm-autocomplete>
	`,
})
class HlmAutocompleteAccessibilityHost {}

@Component({
	imports: [HlmAutocompleteImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-autocomplete-search>
			<hlm-autocomplete-input />
			<hlm-autocomplete-content *hlmAutocompletePortal>
				<div hlmAutocompleteList>
					<hlm-autocomplete-item value="1000">1000</hlm-autocomplete-item>
					<hlm-autocomplete-item value="2000">2000</hlm-autocomplete-item>
				</div>
			</hlm-autocomplete-content>
		</hlm-autocomplete-search>
	`,
})
class HlmAutocompleteSearchAccessibilityHost {}

describe('HlmAutocomplete accessibility', () => {
	it('exposes the active option and names the listbox', () => {
		const fixture = TestBed.createComponent(HlmAutocompleteAccessibilityHost);
		fixture.detectChanges();

		const autocomplete = fixture.debugElement.query(By.directive(BrnAutocomplete)).injector.get(BrnAutocomplete);
		autocomplete.open();
		autocomplete.keyManager.setActiveItem(0);
		fixture.detectChanges();

		const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
		const listbox: HTMLElement = document.querySelector('[role="listbox"]')!;
		const activeOption: HTMLElement = document.querySelector('[role="option"]')!;

		expect(input.autocomplete).toBe('postal-code');
		expect(input.getAttribute('aria-activedescendant')).toBe(activeOption.id);
		expect(listbox.getAttribute('aria-labelledby')).toBe('autocomplete-label');
		fixture.destroy();
	});

	it('exposes the active option for the search variant', () => {
		const fixture = TestBed.createComponent(HlmAutocompleteSearchAccessibilityHost);
		fixture.detectChanges();

		const autocomplete = fixture.debugElement
			.query(By.directive(BrnAutocompleteSearch))
			.injector.get(BrnAutocompleteSearch);
		autocomplete.open();
		autocomplete.keyManager.setActiveItem(0);
		fixture.detectChanges();

		const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
		const activeOption: HTMLElement = document.querySelector('[role="option"]')!;

		expect(input.getAttribute('aria-activedescendant')).toBe(activeOption.id);
		fixture.destroy();
	});
});
