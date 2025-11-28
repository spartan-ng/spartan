import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmSelectImports } from '../../index';

// Mock ResizeObserver for jsdom environment
global.ResizeObserver = class ResizeObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
};

@Component({
	selector: 'hlm-select-host',
	imports: [ReactiveFormsModule, BrnSelectImports, HlmSelectImports, HlmFieldImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<form [formGroup]="form">
			<div hlmField>
				<!-- eslint-disable-next-line @angular-eslint/template/label-has-associated-control -->
				<label hlmFieldLabel>Fruit *</label>
				<brn-select formControlName="fruit" class="w-56">
					<hlm-select-trigger>
						<brn-select-value hlm />
					</hlm-select-trigger>
					<hlm-select-content>
						<hlm-select-label>Fruits</hlm-select-label>
						<hlm-option value="apple">Apple</hlm-option>
						<hlm-option value="banana">Banana</hlm-option>
					</hlm-select-content>
				</brn-select>
				<p hlmFieldDescription>Choose your favorite fruit.</p>
				<hlm-field-error>Pick a fruit to continue.</hlm-field-error>
			</div>
		</form>
	`,
})
class HlmSelectHost {
	public readonly form = new FormGroup({
		fruit: new FormControl('', { validators: [Validators.required] }),
	});
}

describe('HlmSelect form integration', () => {
	let fixture: ReturnType<typeof TestBed.createComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HlmSelectHost],
		});
		fixture = TestBed.createComponent(HlmSelectHost);
		fixture.detectChanges();
	});

	it('assigns description/error ids to the trigger', () => {
		const host = fixture.componentInstance as HlmSelectHost;
		host.form.markAllAsTouched();
		host.form.get('fruit')?.updateValueAndValidity();
		fixture.detectChanges();

		const description = fixture.nativeElement.querySelector('[data-slot="field-description"]');
		const error = fixture.nativeElement.querySelector('[data-slot="field-error"]');
		const triggerButton: HTMLButtonElement | null = fixture.nativeElement.querySelector('hlm-select-trigger button');

		expect(host.form.invalid).toBe(true);
		expect(description).toBeTruthy();
		expect(error).toBeTruthy();

		const describedBy = triggerButton?.getAttribute('aria-describedby') ?? '';
		expect(describedBy.split(' ')).toContain(description!.id);
		expect(describedBy.split(' ')).toContain(error!.id);
	});
});
