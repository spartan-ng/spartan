import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmTextarea } from '../../index';

@Component({
	selector: 'hlm-textarea-host',
	imports: [ReactiveFormsModule, HlmFieldImports, HlmTextarea],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<form [formGroup]="form">
			<div hlmField>
				<label hlmFieldLabel for="message">Message *</label>
				<textarea hlmTextarea id="message" rows="3" class="w-full" formControlName="message"></textarea>
				<p hlmFieldDescription>Tell us what's on your mind.</p>
				<hlm-field-error>Message is required.</hlm-field-error>
			</div>
		</form>
	`,
})
class HlmTextareaHost {
	public readonly form = new FormGroup({
		message: new FormControl('', { validators: [Validators.required] }),
	});
}

describe('HlmTextarea form integration', () => {
	let fixture: ReturnType<typeof TestBed.createComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HlmTextareaHost],
		});
		fixture = TestBed.createComponent(HlmTextareaHost);
		fixture.detectChanges();
	});

	it('attaches description and error ids to the textarea', () => {
		const host = fixture.componentInstance as HlmTextareaHost;
		host.form.markAllAsTouched();
		host.form.get('message')?.updateValueAndValidity();
		fixture.detectChanges();

		const description = fixture.nativeElement.querySelector('[data-slot="field-description"]');
		const error = fixture.nativeElement.querySelector('[data-slot="field-error"]');
		const textarea = fixture.nativeElement.querySelector('textarea[hlmTextarea]');

		expect(host.form.invalid).toBe(true);
		expect(description).toBeTruthy();
		expect(error).toBeTruthy();

		const describedBy = textarea.getAttribute('aria-describedby') ?? '';
		expect(describedBy.split(' ')).toContain(description!.id);
		expect(describedBy.split(' ')).toContain(error!.id);
	});
});
