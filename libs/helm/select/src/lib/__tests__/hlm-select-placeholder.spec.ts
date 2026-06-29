import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { form, FormField } from '@angular/forms/signals';
import { HlmSelectImports } from '../../index';

@Component({
	selector: 'hlm-select-placeholder-host',
	imports: [FormField, HlmSelectImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-select [formField]="form.fruit" class="w-56">
			<hlm-select-trigger>
				<hlm-select-value [placeholder]="placeholder()" />
			</hlm-select-trigger>
			<hlm-select-content *hlmSelectPortal>
				<hlm-select-item value="apple">Apple</hlm-select-item>
				<hlm-select-item value="banana">Banana</hlm-select-item>
			</hlm-select-content>
		</hlm-select>
	`,
})
class HlmSelectPlaceholderHost {
	protected readonly placeholder = signal('Select a fruit');
	protected readonly _model = signal({ fruit: '' });
	readonly form = form(this._model);
}

describe('HlmSelect placeholder with signal forms', () => {
	let fixture: ReturnType<typeof TestBed.createComponent>;

	function valueElement(): HTMLElement {
		return fixture.nativeElement.querySelector('hlm-select-value');
	}

	beforeEach(() => {
		TestBed.configureTestingModule({ imports: [HlmSelectPlaceholderHost] });
		fixture = TestBed.createComponent(HlmSelectPlaceholderHost);
		fixture.detectChanges();
	});

	it('shows the placeholder when the signal form value is an empty string', () => {
		const value = valueElement();
		expect(value.getAttribute('data-placeholder')).toBe('');
		expect(value.textContent?.trim()).toBe('Select a fruit');
	});

	it('hides the placeholder once a value is selected', () => {
		const host = fixture.componentInstance as HlmSelectPlaceholderHost;
		host.form.fruit().value.set('apple');
		fixture.detectChanges();

		const value = valueElement();
		expect(value.getAttribute('data-placeholder')).toBeNull();
		expect(value.textContent?.trim()).toBe('apple');
	});
});
