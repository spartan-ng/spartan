import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@spartan-ng/brain/forms';
import { render } from '@testing-library/angular';
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
