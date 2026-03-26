import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmSelectImports } from '../../index';

// Mock ResizeObserver for jsdom environment
global.ResizeObserver = class ResizeObserver {
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	observe() {}
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	unobserve() {}
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	disconnect() {}
};

@Component({
	selector: 'hlm-select-host',
	imports: [ReactiveFormsModule, HlmSelectImports, HlmFieldImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<form [formGroup]="form">
			<div hlmField>
				<!-- eslint-disable-next-line @angular-eslint/template/label-has-associated-control -->
				<label hlmFieldLabel>Fruit *</label>
				<hlm-select formControlName="fruit" class="w-56">
					<hlm-select-trigger>
						<hlm-select-value placeholder="Select a fruit" />
					</hlm-select-trigger>
					<hlm-select-content *hlmSelectPortal>
						<hlm-select-group>
							<hlm-select-label>Fruits</hlm-select-label>
							<hlm-select-item value="apple">Apple</hlm-select-item>
							<hlm-select-item value="banana">Banana</hlm-select-item>
						</hlm-select-group>
					</hlm-select-content>
				</hlm-select>
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
		const triggerButton: HTMLButtonElement | null = fixture.nativeElement.querySelector('hlm-select-trigger > button');

		expect(host.form.invalid).toBe(true);
		expect(description).toBeTruthy();
		expect(error).toBeTruthy();

		const describedBy = triggerButton?.getAttribute('aria-describedby') ?? '';
		console.log('describedBy', describedBy);
		expect(describedBy.split(' ')).toContain(description!.id);
		expect(describedBy.split(' ')).toContain(error!.id);
	});
});
