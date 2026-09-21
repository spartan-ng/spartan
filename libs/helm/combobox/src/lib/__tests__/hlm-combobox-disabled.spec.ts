import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrnCombobox, BrnComboboxMultiple } from '@spartan-ng/brain/combobox';
import { HlmComboboxImports } from '../../index';

// Lets the popover open transition settle.
const flush = async () => {
	await new Promise((resolve) => setTimeout(resolve, 0));
	await new Promise((resolve) => setTimeout(resolve, 0));
};

@Component({
	selector: 'hlm-combobox-disabled-host',
	imports: [HlmComboboxImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-combobox [(value)]="value">
			<hlm-combobox-input />
			<hlm-combobox-content *hlmComboboxPortal>
				<div hlmComboboxList>
					<hlm-combobox-item value="locked" disabled>Locked</hlm-combobox-item>
					<hlm-combobox-item value="open">Open</hlm-combobox-item>
				</div>
			</hlm-combobox-content>
		</hlm-combobox>
	`,
})
class HlmComboboxDisabledHost {
	public readonly value = signal<string | null>(null);
}

@Component({
	selector: 'hlm-combobox-multiple-disabled-host',
	imports: [HlmComboboxImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-combobox-multiple [(value)]="selected">
			<hlm-combobox-chips>
				<input hlmComboboxChipInput />
			</hlm-combobox-chips>
			<hlm-combobox-content *hlmComboboxPortal>
				<div hlmComboboxList>
					<hlm-combobox-item value="anna" disabled>Anna</hlm-combobox-item>
					<hlm-combobox-item value="ben">Ben</hlm-combobox-item>
				</div>
			</hlm-combobox-content>
		</hlm-combobox-multiple>
	`,
})
class HlmComboboxMultipleDisabledHost {
	public readonly selected = signal<string[] | null>(['anna']);
}

describe('HlmCombobox disabled active item', () => {
	afterEach(() => {
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	// Regression (#1747): setActiveItem() ignores skipPredicate, so a disabled option can be the
	// active item and committing it on Enter must be a no-op.
	it('does not commit a disabled active option on Enter', async () => {
		const fixture = TestBed.createComponent(HlmComboboxDisabledHost);
		fixture.detectChanges();

		const combobox = fixture.debugElement.query(By.directive(BrnCombobox)).injector.get(BrnCombobox);
		combobox.open();
		combobox.keyManager.setActiveItem(0);
		fixture.detectChanges();
		await flush();

		const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
		input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
		fixture.detectChanges();
		await flush();

		expect(combobox.value()).toBeNull();
		fixture.destroy();
	});

	it('does not toggle a disabled active option on Enter when multiple', async () => {
		const fixture = TestBed.createComponent(HlmComboboxMultipleDisabledHost);
		fixture.detectChanges();

		const combobox = fixture.debugElement.query(By.directive(BrnComboboxMultiple)).injector.get(BrnComboboxMultiple);
		combobox.open();
		combobox.keyManager.setActiveItem(0);
		fixture.detectChanges();
		await flush();

		const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
		input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
		fixture.detectChanges();
		await flush();

		expect(combobox.value()).toEqual(['anna']);
		fixture.destroy();
	});
});
