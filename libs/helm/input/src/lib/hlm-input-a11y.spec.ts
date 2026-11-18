import { ChangeDetectionStrategy, Component, Injectable } from '@angular/core';
import {
	type AbstractControl,
	FormControl,
	FormGroup,
	type FormGroupDirective,
	FormsModule,
	type NgForm,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { ErrorStateMatcher, provideErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@spartan-ng/brain/forms';
import { fireEvent, render } from '@testing-library/angular';
import { HlmInput } from './hlm-input';

@Component({
	selector: 'hlm-input-a11y-host',
	imports: [HlmInput, ReactiveFormsModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<input hlmInput [formControl]="control" />
	`,
})
class DefaultMatcherHost {
	public readonly control = new FormControl('', [Validators.required]);
}

@Component({
	selector: 'hlm-input-a11y-dirty-host',
	imports: [HlmInput, ReactiveFormsModule],
	providers: [provideErrorStateMatcher(ShowOnDirtyErrorStateMatcher)],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<input hlmInput [formControl]="control" />
	`,
})
class DirtyMatcherHost {
	public readonly control = new FormControl('', [Validators.required]);
}

@Component({
	selector: 'hlm-input-a11y-force-host',
	imports: [HlmInput],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<input hlmInput forceInvalid />
	`,
})
class ForceInvalidHost {}

@Component({
	selector: 'hlm-input-a11y-override-host',
	imports: [HlmInput, ReactiveFormsModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<input hlmInput [formControl]="control" aria-invalid="true" aria-describedby="server-error" />
		<p id="server-error">The server rejected this value.</p>
	`,
})
class OverrideHost {
	public readonly control = new FormControl('valid value');
}

@Component({
	selector: 'hlm-input-a11y-template-form-host',
	imports: [HlmInput, FormsModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<form>
			<input hlmInput name="email" ngModel required />
			<button type="submit">Save</button>
		</form>
	`,
})
class TemplateFormHost {}

/** Shows errors once the form (template-driven or reactive) has been submitted. */
@Injectable()
class ShowOnSubmitErrorStateMatcher implements ErrorStateMatcher {
	isInvalid(control: AbstractControl | null, form: FormGroupDirective | NgForm | null): boolean {
		return !!(control?.invalid && form?.submitted);
	}
}

@Component({
	selector: 'hlm-input-a11y-reactive-form-host',
	imports: [HlmInput, ReactiveFormsModule],
	providers: [provideErrorStateMatcher(ShowOnSubmitErrorStateMatcher)],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<form [formGroup]="form">
			<input hlmInput formControlName="email" />
		</form>
	`,
})
class ReactiveSubmitFormHost {
	public readonly form = new FormGroup({ email: new FormControl('', [Validators.required]) });
}

@Component({
	selector: 'hlm-input-a11y-standalone-model-host',
	imports: [HlmInput, FormsModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<form>
			<input hlmInput ngModel required [ngModelOptions]="{ standalone: true }" />
		</form>
	`,
})
class StandaloneModelInFormHost {}

describe('HlmInput accessibility', () => {
	describe('aria-invalid', () => {
		it('is not announced for an invalid but untouched field (default matcher)', async () => {
			const { container, fixture } = await render(DefaultMatcherHost);
			const input = container.querySelector('input')!;

			expect(fixture.componentInstance.control.invalid).toBe(true);
			expect(input).not.toHaveAttribute('aria-invalid');
			// raw validity remains available as a styling hook
			expect(input).toHaveAttribute('data-invalid', 'true');
		});

		it('is announced once the field is touched (default matcher)', async () => {
			const { container, fixture } = await render(DefaultMatcherHost);
			fixture.componentInstance.control.markAsTouched();
			fixture.detectChanges();

			expect(container.querySelector('input')).toHaveAttribute('aria-invalid', 'true');
		});

		it('follows a custom ErrorStateMatcher instead of the raw validity', async () => {
			const { container, fixture } = await render(DirtyMatcherHost);
			const input = container.querySelector('input')!;
			const control = fixture.componentInstance.control;

			control.markAsTouched();
			fixture.detectChanges();
			expect(input).not.toHaveAttribute('aria-invalid');

			control.markAsDirty();
			fixture.detectChanges();
			expect(input).toHaveAttribute('aria-invalid', 'true');
		});

		it('is announced once the template-driven form is submitted', async () => {
			const { container, fixture } = await render(TemplateFormHost);
			const input = container.querySelector('input')!;
			await fixture.whenStable();
			fixture.detectChanges();
			expect(input).not.toHaveAttribute('aria-invalid');

			fireEvent.submit(container.querySelector('form')!);
			fixture.detectChanges();

			expect(input).toHaveAttribute('aria-invalid', 'true');
			expect(input).toHaveAttribute('data-matches-spartan-invalid', 'true');
		});

		it('follows the submitted state of a reactive form through submit and reset', async () => {
			const { container, fixture } = await render(ReactiveSubmitFormHost);
			const form = container.querySelector('form')!;
			const input = container.querySelector('input')!;
			expect(input).not.toHaveAttribute('aria-invalid');

			fireEvent.submit(form);
			fixture.detectChanges();
			expect(input).toHaveAttribute('aria-invalid', 'true');

			fireEvent.reset(form);
			await fixture.whenStable();
			fixture.detectChanges();
			expect(input).not.toHaveAttribute('aria-invalid');
			expect(input).not.toHaveAttribute('data-matches-spartan-invalid');
		});

		it('is cleared on reset for a standalone ngModel inside a submitted form', async () => {
			const { container, fixture } = await render(StandaloneModelInFormHost);
			const form = container.querySelector('form')!;
			const input = container.querySelector('input')!;
			await fixture.whenStable();

			fireEvent.submit(form);
			fixture.detectChanges();
			expect(input).toHaveAttribute('aria-invalid', 'true');

			// the standalone control is not part of the form, so resetting it emits nothing on the control
			fireEvent.reset(form);
			await fixture.whenStable();
			fixture.detectChanges();
			expect(input).not.toHaveAttribute('aria-invalid');
		});

		it('is set when the field is forced invalid', async () => {
			const { container } = await render(ForceInvalidHost);
			expect(container.querySelector('input')).toHaveAttribute('aria-invalid', 'true');
		});

		it('can be set by the consumer, e.g. for server-side errors', async () => {
			const { container, fixture } = await render(OverrideHost);
			const input = container.querySelector('input')!;

			expect(fixture.componentInstance.control.valid).toBe(true);
			expect(input).toHaveAttribute('aria-invalid', 'true');
		});
	});

	describe('aria-describedby', () => {
		it('keeps the consumer provided ids', async () => {
			const { container } = await render(OverrideHost);
			expect(container.querySelector('input')).toHaveAttribute('aria-describedby', 'server-error');
		});
	});
});
