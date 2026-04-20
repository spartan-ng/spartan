export const demoCode = `
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { form, FormField, FormRoot, maxLength, minLength, required } from '@angular/forms/signals';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';

@Component({
  selector: 'spartan-bug-report-form',
  imports: [
    FormRoot,
    FormField,
    HlmCardImports,
    HlmFieldImports,
    HlmButtonImports,
    HlmInputImports,
    HlmInputGroupImports,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <hlm-card>
      <hlm-card-header>
        <h3 hlmCardTitle>Bug Report</h3>
        <p hlmCardDescription>Help us improve by reporting bugs you encounter.</p>
      </hlm-card-header>
      <div hlmCardContent>
        <!-- formRoot sets novalidate and handles form submission -->
        <form [formRoot]="form" id="form-bug-report">
          <hlm-field-group>
            <hlm-field>
              <label hlmFieldLabel for="title">Bug Title</label>
              <input
                id="title"
                hlmInput
                placeholder="Login button not working on mobile"
                autoComplete="off"
                [formField]="form.title"
              />

              @for (error of form.title().errors(); track error) {
                <hlm-field-error [validator]="error.kind">
                  {{ error.message }}
                </hlm-field-error>
              }
            </hlm-field>
            <hlm-field>
              <label hlmFieldLabel for="description">Description</label>
              <hlm-input-group>
                <textarea
                  hlmInputGroupTextarea
                  id="description"
                  class="min-h-24"
                  placeholder="I'm having an issue with the login button on mobile."
                  rows="6"
                  [formField]="form.description"
                ></textarea>
                <hlm-input-group-addon align="block-end">
                  <span hlmInputGroupText> {{ descriptionLength() }}/100 characters </span>
                </hlm-input-group-addon>
              </hlm-input-group>
              <hlm-field-description>
                Include steps to reproduce, expected behavior, and what actually happened.
              </hlm-field-description>

              @for (error of form.description().errors(); track error) {
                <hlm-field-error [validator]="error.kind">
                  {{ error.message }}
                </hlm-field-error>
              }
            </hlm-field>
          </hlm-field-group>
        </form>
      </div>
      <hlm-card-footer>
        <hlm-field orientation="horizontal">
          <button hlmBtn variant="outline" type="button" (click)="reset()">Reset</button>
          <button hlmBtn type="submit" form="form-bug-report">Submit</button>
        </hlm-field>
      </hlm-card-footer>
    </hlm-card>
  \`,
})
export class BugFormsDemo {
  protected readonly _model = signal({
    title: '',
    description: '',
  });

  public readonly form = form(
    this._model,
    (schemaPath) => {
      required(schemaPath.title, { message: 'Title must be entered.' });
      minLength(schemaPath.title, 5, { message: 'Title must be at least 5 characters.' });
      maxLength(schemaPath.title, 100, { message: 'Title cannot exceed 32 characters.' });

      required(schemaPath.description, { message: 'Description must be entered.' });
      minLength(schemaPath.description, 20, {
        message: 'Description must be at least 20 characters.',
      });
      maxLength(schemaPath.description, 100, {
        message: 'Description must be at most 100 characters',
      });
    },
    {
      // triggers the submission flow by calling \`submit()\` - marks all fields as touched, revealing validation errors
      submission: {
        action: async () => {
          const model = this._model();

          console.log('You submitted the following values:', JSON.stringify(model, null, 2));

          // submit to api
        },
      },
    },
  );

  descriptionLength = computed(() => this.form.description().value().length);

  reset() {
    this.form().reset({
      title: '',
      description: '',
    });
  }
}
`;

export const demoAnatomyCode = `
<hlm-field>
	<label hlmFieldLabel>Bug Title</label>
	<input
		hlmInput
		id="title"
		placeholder="Login button not working on mobile"
		autocomplete="off"
		[formField]="form.title"
	/>
	@for (error of form.title().errors(); track error) {
		<hlm-field-error [validator]="error.kind">{{ error.message }}</hlm-field-error>
	}
</hlm-field>
`;

export const demoFormModelCode = `
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, maxLength, minLength, required } from '@angular/forms/signals';

@Component({
  selector: 'spartan-bug-report-form',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`...\`,
})
export class BugFormsDemo {
  protected readonly _model = signal({
    title: '',
    description: '',
  });

  public readonly form = form(this._model, (schemaPath) => {
    required(schemaPath.title, { message: 'Title must be entered.' });
    minLength(schemaPath.title, 5, { message: 'Title must be at least 5 characters.' });
    maxLength(schemaPath.title, 100, { message: 'Title cannot exceed 32 characters.' });

    required(schemaPath.description, { message: 'Description must be entered.' });
    minLength(schemaPath.description, 20, {
      message: 'Description must be at least 20 characters.',
    });
    maxLength(schemaPath.description, 100, {
      message: 'Description must be at most 100 characters',
    });
  });
}
`;

export const demoSetupFormWithFormRoot = `
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormRoot, maxLength, minLength, required } from '@angular/forms/signals';

@Component({
  selector: 'spartan-bug-report-form',
  imports: [FormRoot],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <!-- formRoot sets novalidate and handles form submission -->
    <form [formRoot]="form">
      <!-- Build the form here -->
    </form>
  \`,
})
export class BugFormsDemo {
  protected readonly _model = signal({
    title: '',
    description: '',
  });

  public readonly form = form(
    this._model,
    (schemaPath) => {
      required(schemaPath.title, { message: 'Title must be entered.' });
      minLength(schemaPath.title, 5, { message: 'Title must be at least 5 characters.' });
      maxLength(schemaPath.title, 100, { message: 'Title cannot exceed 32 characters.' });

      required(schemaPath.description, { message: 'Description must be entered.' });
      minLength(schemaPath.description, 20, {
        message: 'Description must be at least 20 characters.',
      });
      maxLength(schemaPath.description, 100, {
        message: 'Description must be at most 100 characters',
      });
    },
    {
      // triggers the submission flow by calling \`submit()\` - marks all fields as touched, revealing validation errors
      submission: {
        action: async () => {
          // submit to api
          const model = this._model();
        },
      },
    },
  );
}
`;

export const demoSetupFormWithSubmit = `
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, maxLength, minLength, required, submit } from '@angular/forms/signals';

@Component({
  selector: 'spartan-bug-report-form',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <!-- novalidate - disables browser built-in validation -->
    <form novalidate (submit)="submitBug($event)">
      <!-- Build the form here -->
    </form>
  \`,
})
export class BugFormsDemo {
  protected readonly _model = signal({
    title: '',
    description: '',
  });

  public readonly form = form(this._model, (schemaPath) => {
    required(schemaPath.title, { message: 'Title must be entered.' });
    minLength(schemaPath.title, 5, { message: 'Title must be at least 5 characters.' });
    maxLength(schemaPath.title, 32, { message: 'Title cannot exceed 32 characters.' });

    required(schemaPath.description, { message: 'Description must be entered.' });
    minLength(schemaPath.description, 20, {
      message: 'Description must be at least 20 characters.',
    });
    maxLength(schemaPath.description, 100, {
      message: 'Description must be at most 100 characters',
    });
  });

  async submitBug(event: Event) {
    // stop browser from navigating on form submission
    event.preventDefault();

    // marks all fields as touched, revealing validation errors
    const success = await submit(this.form, async () => {
      // submit to api
      const model = this._model();
    });
  }
}
`;

export const demoForceShowCode = `
<hlm-field>
	<label hlmFieldLabel for="title">Bug Title</label>
	<input hlmInput id="title" [formField]="form.title" />
	<hlm-field-error forceShow>This error is always visible.</hlm-field-error>
</hlm-field>`;

export const demoSubmittingState = `
<button hlmBtn type="submit" [disabled]="form().submitting()">
  @if (form().submitting()) {
    <hlm-spinner />
  }
  Submit
</button>
`;

export const demoResetForm = `
<button hlmBtn variant="outline" type="button" (click)="reset()">
	Reset
</button>

reset() {
  this.form().reset({
    // provide default values
    responses: true,
    tasks: [],
  });
}
`;
