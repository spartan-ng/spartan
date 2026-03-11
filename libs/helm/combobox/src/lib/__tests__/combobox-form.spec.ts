import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideIcons } from '@ng-icons/core';
import * as lucide from '@ng-icons/lucide';
import { BrnCommandImports } from '@spartan-ng/brain/command';
import { BrnPopoverImports } from '@spartan-ng/brain/popover';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCommandImports } from '@spartan-ng/helm/command';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';

type Framework = { label: string; value: string };

const frameworks: Framework[] = [
	{ label: 'AnalogJs', value: 'analogjs' },
	{ label: 'Angular', value: 'angular' },
	{ label: 'Vue', value: 'vue' },
	{ label: 'Nuxt', value: 'nuxt' },
	{ label: 'React', value: 'react' },
	{ label: 'NextJs', value: 'nextjs' },
];

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'combobox-field-test',
	imports: [
		ReactiveFormsModule,
		HlmFieldImports,
		HlmButtonImports,
		HlmCommandImports,
		HlmIconImports,
		HlmPopoverImports,
		BrnCommandImports,
		BrnPopoverImports,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<form [formGroup]="form">
			<div hlmField [attr.data-invalid]="showError ? 'true' : null">
				<!-- eslint-disable-next-line @angular-eslint/template/label-has-associated-control -->
				<label hlmFieldLabel>Framework *</label>
				<hlm-popover [state]="state()" (stateChanged)="stateChanged($event)" sideOffset="5">
					<button
						class="w-[200px] justify-between"
						id="edit-profile"
						variant="outline"
						hlmPopoverTrigger
						(click)="state.set('open')"
						hlmBtn
						hlmFieldControlDescribedBy
						[attr.aria-invalid]="showError ? 'true' : null"
					>
						{{ currentFramework()?.label ?? 'Select framework...' }}
						<ng-icon hlm size="sm" name="lucideChevronsUpDown" />
					</button>
					<hlm-command *brnPopoverContent="let ctx" hlmPopoverContent class="w-[200px] p-0">
						<hlm-command-search>
							<ng-icon hlm name="lucideSearch" />
							<input placeholder="Search framework..." hlm-command-search-input />
						</hlm-command-search>
						<div *brnCommandEmpty hlmCommandEmpty>No results found.</div>
						<hlm-command-list>
							<hlm-command-group>
								@for (framework of frameworks; track framework) {
									<button hlm-command-item [value]="framework.value" (selected)="commandSelected(framework)">
										<ng-icon
											hlm
											[class.opacity-0]="currentFramework()?.value !== framework.value"
											name="lucideCheck"
											hlmCommandIcon
										/>
										{{ framework.label }}
									</button>
								}
							</hlm-command-group>
						</hlm-command-list>
					</hlm-command>
				</hlm-popover>
				<p hlmFieldDescription>Pick the framework you rely on most.</p>
				@if (showError) {
					<hlm-field-error>Choose a framework to continue.</hlm-field-error>
				}
			</div>
		</form>
	`,
})
class ComboboxFieldTest {
	public readonly form = new FormGroup({
		framework: new FormControl('', { validators: [Validators.required] }),
	});

	public readonly frameworks = frameworks;
	public readonly currentFramework = signal<Framework | undefined>(undefined);
	public readonly state = signal<'closed' | 'open'>('closed');

	public get showError() {
		const control = this.form.get('framework');
		return !!control && control.invalid && (control.touched || control.dirty);
	}

	stateChanged(state: 'open' | 'closed') {
		this.state.set(state);
	}

	commandSelected(framework: Framework) {
		this.state.set('closed');
		if (this.currentFramework()?.value === framework.value) {
			this.currentFramework.set(undefined);
		} else {
			this.currentFramework.set(framework);
		}
		this.form.get('framework')?.setValue(framework.value);
	}
}

describe('Combobox hint/error wiring', () => {
	let fixture: ReturnType<typeof TestBed.createComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ComboboxFieldTest],
			providers: [provideIcons(lucide)],
		});
		fixture = TestBed.createComponent(ComboboxFieldTest);
		const component = fixture.componentInstance as ComboboxFieldTest;
		component.form.markAllAsTouched();
		component.form.get('framework')?.updateValueAndValidity();
		fixture.detectChanges();
	});

	it('renders description/error ids on the button', () => {
		const description = fixture.nativeElement.querySelector('[data-slot="field-description"]');
		const error = fixture.nativeElement.querySelector('[data-slot="field-error"]');
		const button: HTMLButtonElement | null = fixture.nativeElement.querySelector('button[hlmPopoverTrigger]');

		expect(description).toBeTruthy();
		expect(error).toBeTruthy();

		const describedBy = button?.getAttribute('aria-describedby') ?? '';
		expect(describedBy.split(' ')).toContain(description!.id);
		expect(describedBy.split(' ')).toContain(error!.id);
	});

	it('sets aria-invalid on the button when form is invalid and touched', () => {
		const button: HTMLButtonElement | null = fixture.nativeElement.querySelector('button[hlmPopoverTrigger]');

		expect(button?.getAttribute('aria-invalid')).toBe('true');
	});

	it('button should have error border styling via aria-invalid', () => {
		const button: HTMLButtonElement | null = fixture.nativeElement.querySelector('button[hlmPopoverTrigger]');

		// The hlmBtn directive includes aria-invalid:border-destructive styling
		// When aria-invalid is true, the button should visually show the error state
		expect(button?.getAttribute('aria-invalid')).toBe('true');
	});
});
