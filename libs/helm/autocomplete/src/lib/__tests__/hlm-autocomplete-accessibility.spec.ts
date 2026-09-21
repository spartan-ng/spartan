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

@Component({
	imports: [HlmAutocompleteImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-autocomplete>
			<hlm-autocomplete-input />
			<hlm-autocomplete-content *hlmAutocompletePortal>
				<div hlmAutocompleteList>
					<hlm-autocomplete-item value="locked" disabled>Locked</hlm-autocomplete-item>
					<hlm-autocomplete-item value="open">Open</hlm-autocomplete-item>
				</div>
			</hlm-autocomplete-content>
		</hlm-autocomplete>
	`,
})
class HlmAutocompleteDisabledHost {}

@Component({
	imports: [HlmAutocompleteImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-autocomplete-search>
			<hlm-autocomplete-input />
			<hlm-autocomplete-content *hlmAutocompletePortal>
				<div hlmAutocompleteList>
					<hlm-autocomplete-item value="locked" disabled>Locked</hlm-autocomplete-item>
					<hlm-autocomplete-item value="open">Open</hlm-autocomplete-item>
				</div>
			</hlm-autocomplete-content>
		</hlm-autocomplete-search>
	`,
})
class HlmAutocompleteSearchDisabledHost {}

// Lets the popover open/close transition settle.
const flush = async () => {
	await new Promise((resolve) => setTimeout(resolve, 0));
	await new Promise((resolve) => setTimeout(resolve, 0));
};

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

	// Tab moves focus on to the next control; it must close the listbox without committing the
	// highlighted option into the input.
	it('closes the listbox without committing the active option on Tab', async () => {
		const fixture = TestBed.createComponent(HlmAutocompleteAccessibilityHost);
		fixture.detectChanges();

		const autocomplete = fixture.debugElement.query(By.directive(BrnAutocomplete)).injector.get(BrnAutocomplete);
		autocomplete.open();
		autocomplete.keyManager.setActiveItem(0);
		fixture.detectChanges();
		await flush();
		expect(autocomplete.isExpanded()).toBe(true);

		const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
		input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }));
		fixture.detectChanges();
		await flush();

		expect(autocomplete.isExpanded()).toBe(false);
		expect(autocomplete.value()).toBeNull();
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

	// Regression (#1747): setActiveItem() ignores skipPredicate, so a disabled option can be the
	// active item and committing it on Enter must be a no-op.
	it('does not commit a disabled active option on Enter', async () => {
		const fixture = TestBed.createComponent(HlmAutocompleteDisabledHost);
		fixture.detectChanges();

		const autocomplete = fixture.debugElement.query(By.directive(BrnAutocomplete)).injector.get(BrnAutocomplete);
		autocomplete.open();
		autocomplete.keyManager.setActiveItem(0);
		fixture.detectChanges();
		await flush();

		const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
		input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
		fixture.detectChanges();
		await flush();

		expect(autocomplete.value()).toBeNull();
		fixture.destroy();
	});

	it('does not commit a disabled active option on Enter for the search variant', async () => {
		const fixture = TestBed.createComponent(HlmAutocompleteSearchDisabledHost);
		fixture.detectChanges();

		const autocomplete = fixture.debugElement
			.query(By.directive(BrnAutocompleteSearch))
			.injector.get(BrnAutocompleteSearch);
		autocomplete.open();
		autocomplete.keyManager.setActiveItem(0);
		fixture.detectChanges();
		await flush();

		const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
		input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
		fixture.detectChanges();
		await flush();

		expect(autocomplete.value()).toBeNull();
		fixture.destroy();
	});
});
