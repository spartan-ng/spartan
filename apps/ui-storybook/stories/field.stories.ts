import { JsonPipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCheckbox } from '@spartan-ng/helm/checkbox';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmRadioGroupImports } from '@spartan-ng/helm/radio-group';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSwitch } from '@spartan-ng/helm/switch';
import { HlmTextarea } from '@spartan-ng/helm/textarea';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

const meta: Meta = {
	title: 'Field',
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [
				HlmFieldImports,
				HlmInputImports,
				HlmCheckbox,
				HlmSwitch,
				HlmTextarea,
				HlmButton,
				BrnSelectImports,
				HlmSelectImports,
				HlmRadioGroupImports,
				ReactiveFormsModule,
				JsonPipe,
			],
		}),
	],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () => ({
		template: `
			<div class="w-full max-w-md">
				<fieldset hlmFieldSet>
					<div hlmFieldGroup>
						<div hlmField>
							<label hlmFieldLabel for="field-fullname">Full name</label>
							<input hlmInput id="field-fullname" type="text" placeholder="John Doe" />
							<p hlmFieldDescription>This appears on invoices and emails.</p>
						</div>
						<div hlmField>
							<label hlmFieldLabel for="field-username">Username</label>
							<input hlmInput id="field-username" type="text" placeholder="john_doe_99" />
						</div>
					</div>
				</fieldset>
			</div>
		`,
	}),
};

export const WithInput: Story = {
	name: 'With Input',
	render: () => ({
		template: `
			<div class="w-full max-w-md">
				<fieldset hlmFieldSet>
					<div hlmFieldGroup>
						<div hlmField>
							<label hlmFieldLabel for="field-input-username">Username</label>
							<input hlmInput id="field-input-username" type="text" placeholder="Alex Cooper" />
							<p hlmFieldDescription>Choose a unique username for your account.</p>
						</div>
						<div hlmField>
							<label hlmFieldLabel for="field-input-password">Password</label>
							<p hlmFieldDescription>Must be at least 8 characters long.</p>
							<input hlmInput id="field-input-password" type="password" placeholder="••••••••" />
						</div>
					</div>
				</fieldset>
			</div>
		`,
	}),
};

export const WithCheckbox: Story = {
	name: 'With Checkbox',
	render: () => ({
		template: `
			<div class="w-full max-w-md">
				<div hlmFieldGroup>
					<fieldset hlmFieldSet>
						<legend hlmFieldLegend variant="label">Show these items on the desktop</legend>
						<p hlmFieldDescription>Select the items you want to show on the desktop.</p>
						<div hlmFieldGroup class="gap-3">
							<div hlmField orientation="horizontal">
								<hlm-checkbox id="field-hard-disks" />
								<label hlmFieldLabel for="field-hard-disks" class="font-normal">Hard disks</label>
							</div>
							<div hlmField orientation="horizontal">
								<hlm-checkbox id="field-external-disks" />
								<label hlmFieldLabel for="field-external-disks" class="font-normal">External disks</label>
							</div>
							<div hlmField orientation="horizontal">
								<hlm-checkbox id="field-cds-dvds-ipods" />
								<label hlmFieldLabel for="field-cds-dvds-ipods" class="font-normal">CDs, DVDs, and IPods</label>
							</div>
							<div hlmField orientation="horizontal">
								<hlm-checkbox id="field-connected-servers" />
								<label hlmFieldLabel for="field-connected-servers" class="font-normal">Connected servers</label>
							</div>
						</div>
					</fieldset>
					<hlm-field-separator />
					<div hlmField orientation="horizontal">
						<hlm-checkbox id="field-sync-desktop-documents" [checked]="true" />
						<div hlmFieldContent>
							<label hlmFieldLabel for="field-sync-desktop-documents">Sync Desktop & Documents folders</label>
							<p hlmFieldDescription>
								Your Desktop & Documents folders are being synced with iCloud Drive. You can access them from other
								devices.
							</p>
						</div>
					</div>
				</div>
			</div>
		`,
	}),
};

export const WithSwitch: Story = {
	name: 'With Switch',
	render: () => ({
		template: `
			<div class="w-full max-w-md">
				<div hlmField orientation="horizontal">
					<div hlmFieldContent>
						<label hlmFieldLabel for="field-2fa">Multi-factor authentication</label>
						<p hlmFieldDescription>
							Enable multi-factor authentication. If you do not have a two-factor device, you can use a one-time code
							sent to your email.
						</p>
					</div>
					<hlm-switch id="field-2fa" />
				</div>
			</div>
		`,
	}),
};

export const WithRadio: Story = {
	name: 'With Radio',
	render: () => ({
		template: `
			<div class="w-full max-w-md">
				<fieldset hlmFieldSet>
					<label hlmFieldLabel>Subscription Plan</label>
					<p hlmFieldDescription>Yearly and lifetime plans offer significant savings.</p>
					<hlm-radio-group data-slot="radio-group" value="monthly">
						<div hlmField orientation="horizontal">
							<hlm-radio value="monthly" id="plan-monthly">
								<hlm-radio-indicator indicator />
							</hlm-radio>
							<label hlmFieldLabel for="plan-monthly" class="font-normal">Monthly ($9.99/month)</label>
						</div>
						<div hlmField orientation="horizontal">
							<hlm-radio value="yearly" id="plan-yearly">
								<hlm-radio-indicator indicator />
							</hlm-radio>
							<label hlmFieldLabel for="plan-yearly" class="font-normal">Yearly ($99.99/year)</label>
						</div>
						<div hlmField orientation="horizontal">
							<hlm-radio value="lifetime" id="plan-lifetime">
								<hlm-radio-indicator indicator />
							</hlm-radio>
							<label hlmFieldLabel for="plan-lifetime" class="font-normal">Lifetime ($299.99/lifetime)</label>
						</div>
					</hlm-radio-group>
				</fieldset>
			</div>
		`,
	}),
};

export const WithSelect: Story = {
	name: 'With Select',
	render: () => ({
		template: `
			<div class="w-full max-w-md">
				<fieldset hlmFieldSet>
					<div hlmFieldGroup>
						<div hlmField>
							<label hlmFieldLabel for="field-select-country">Country</label>
							<brn-select class="inline-block" placeholder="Select a country">
								<hlm-select-trigger class="w-full" id="field-select-country">
									<hlm-select-value />
								</hlm-select-trigger>
								<hlm-select-content>
									<hlm-option value="us">United States</hlm-option>
									<hlm-option value="uk">United Kingdom</hlm-option>
									<hlm-option value="ca">Canada</hlm-option>
									<hlm-option value="au">Australia</hlm-option>
									<hlm-option value="de">Germany</hlm-option>
								</hlm-select-content>
							</brn-select>
							<p hlmFieldDescription>Select your country of residence.</p>
						</div>
					</div>
				</fieldset>
			</div>
		`,
	}),
};

export const WithTextarea: Story = {
	name: 'With Textarea',
	render: () => ({
		template: `
			<div class="w-full max-w-md">
				<fieldset hlmFieldSet>
					<div hlmFieldGroup>
						<div hlmField>
							<label hlmFieldLabel for="field-comments">Comments</label>
							<p hlmFieldDescription>Please provide any additional information.</p>
							<textarea hlmTextarea class="resize-none" id="field-comments" rows="4"></textarea>
						</div>
					</div>
				</fieldset>
			</div>
		`,
	}),
};

export const WithError: Story = {
	name: 'With Error',
	render: () => ({
		template: `
			<div class="w-full max-w-md">
				<fieldset hlmFieldSet>
					<div hlmFieldGroup>
						<div hlmField data-invalid="true">
							<label hlmFieldLabel for="field-email-error">Email</label>
							<input hlmInput id="field-email-error" type="email" aria-invalid="true" value="invalid-email" />
							<hlm-field-error>Enter a valid email address.</hlm-field-error>
						</div>
						<div hlmField data-invalid="true">
							<label hlmFieldLabel for="field-username-error">Username</label>
							<input hlmInput id="field-username-error" type="text" aria-invalid="true" value="ab" />
							<hlm-field-error>Username must be at least 3 characters.</hlm-field-error>
						</div>
					</div>
				</fieldset>
			</div>
		`,
	}),
};

export const FieldGroup: Story = {
	name: 'Field Group',
	render: () => ({
		template: `
			<div class="w-full max-w-md">
				<div hlmFieldGroup>
					<fieldset hlmFieldSet>
						<label hlmFieldLabel>Response</label>
						<p hlmFieldDescription>
							Get notified when ChatGPT responds to requests that take time, like research or image generation.
						</p>
						<div hlmFieldGroup data-slot="checkbox-group">
							<div hlmField orientation="horizontal">
								<hlm-checkbox id="field-group-push-notifications" disabled [checked]="true" />
								<label hlmFieldLabel for="field-group-push-notifications" class="font-normal">Push notifications</label>
							</div>
						</div>
					</fieldset>
					<hlm-field-separator />
					<fieldset hlmFieldSet>
						<label hlmFieldLabel>Tasks</label>
						<p hlmFieldDescription>
							Get notified when tasks you've created have updates.
							<a href="#">Manage tasks</a>
						</p>
						<div hlmFieldGroup class="gap-3" data-slot="checkbox-group">
							<div hlmField orientation="horizontal">
								<hlm-checkbox id="field-group-push-task" />
								<label hlmFieldLabel for="field-group-push-task" class="font-normal">Push notifications</label>
							</div>
							<div hlmField orientation="horizontal">
								<hlm-checkbox id="field-group-email-task" />
								<label hlmFieldLabel for="field-group-email-task" class="font-normal">Email notifications</label>
							</div>
						</div>
					</fieldset>
				</div>
			</div>
		`,
	}),
};

export const ComplexForm: Story = {
	name: 'Complex Form',
	render: () => ({
		template: `
			<div class="w-full max-w-md">
				<form>
					<div hlmFieldGroup>
						<fieldset hlmFieldSet>
							<legend hlmFieldLegend>Payment Method</legend>
							<p hlmFieldDescription>All transactions are secure and encrypted</p>

							<div hlmFieldGroup>
								<div hlmField>
									<label hlmFieldLabel for="field-complex-name-on-card">Name on card</label>
									<input hlmInput placeholder="John Doe" id="field-complex-name-on-card" />
								</div>
								<div hlmField class="col-span-2">
									<label hlmFieldLabel for="field-complex-card-number">Card number</label>
									<input hlmInput placeholder="1234 1234 1234 1234" id="field-complex-card-number" />
									<p hlmFieldDescription>Enter your 16-digit card number without spaces or dashes.</p>
								</div>
								<div class="grid grid-cols-3 gap-4">
									<div hlmField>
										<label hlmFieldLabel for="field-complex-expiration-month">Month</label>
										<brn-select class="inline-block" placeholder="MM">
											<hlm-select-trigger class="w-full" id="field-complex-expiration-month">
												<hlm-select-value />
											</hlm-select-trigger>
											<hlm-select-content>
												<hlm-option value="01">01</hlm-option>
												<hlm-option value="02">02</hlm-option>
												<hlm-option value="03">03</hlm-option>
												<hlm-option value="04">04</hlm-option>
												<hlm-option value="05">05</hlm-option>
												<hlm-option value="06">06</hlm-option>
												<hlm-option value="07">07</hlm-option>
												<hlm-option value="08">08</hlm-option>
												<hlm-option value="09">09</hlm-option>
												<hlm-option value="10">10</hlm-option>
												<hlm-option value="11">11</hlm-option>
												<hlm-option value="12">12</hlm-option>
											</hlm-select-content>
										</brn-select>
									</div>
									<div hlmField>
										<label hlmFieldLabel for="field-complex-expiration-year">Year</label>
										<brn-select class="inline-block" placeholder="YYYY">
											<hlm-select-trigger class="w-full" id="field-complex-expiration-year">
												<hlm-select-value />
											</hlm-select-trigger>
											<hlm-select-content>
												<hlm-option value="2024">2024</hlm-option>
												<hlm-option value="2025">2025</hlm-option>
												<hlm-option value="2026">2026</hlm-option>
												<hlm-option value="2027">2027</hlm-option>
												<hlm-option value="2028">2028</hlm-option>
												<hlm-option value="2029">2029</hlm-option>
											</hlm-select-content>
										</brn-select>
									</div>
									<div hlmField>
										<label hlmFieldLabel for="field-complex-cvv">CVV</label>
										<input hlmInput placeholder="123" id="field-complex-cvv" />
									</div>
								</div>
							</div>
						</fieldset>
						<hlm-field-separator />
						<fieldset hlmFieldSet>
							<legend hlmFieldLegend>Billing Address</legend>
							<p hlmFieldDescription>The billing address associated with your payment method</p>
							<div hlmFieldGroup>
								<div hlmField orientation="horizontal">
									<hlm-checkbox id="field-complex-billing-address" [checked]="true" />
									<label hlmFieldLabel for="field-complex-billing-address">Same as shipping address.</label>
								</div>
							</div>
						</fieldset>
						<fieldset hlmFieldSet>
							<div hlmFieldGroup>
								<div hlmField>
									<label hlmFieldLabel for="field-complex-comments">Comments</label>
									<textarea hlmTextarea class="resize-none" id="field-complex-comments" rows="4"></textarea>
								</div>
							</div>
						</fieldset>
						<div hlmField orientation="horizontal">
							<button hlmBtn type="button">Submit</button>
							<button hlmBtn variant="outline" type="button">Cancel</button>
						</div>
					</div>
				</form>
			</div>
		`,
	}),
};

export const HorizontalOrientation: Story = {
	name: 'Horizontal Orientation',
	render: () => ({
		template: `
			<div class="w-full max-w-md">
				<div hlmFieldGroup>
					<div hlmField orientation="horizontal">
						<hlm-switch id="field-horizontal-notifications" />
						<label hlmFieldLabel for="field-horizontal-notifications">Enable notifications</label>
					</div>
					<div hlmField orientation="horizontal">
						<hlm-checkbox id="field-horizontal-marketing" />
						<label hlmFieldLabel for="field-horizontal-marketing" class="font-normal">Receive marketing emails</label>
					</div>
					<div hlmField orientation="horizontal">
						<hlm-checkbox id="field-horizontal-updates" />
						<label hlmFieldLabel for="field-horizontal-updates" class="font-normal">Product updates</label>
					</div>
				</div>
			</div>
		`,
	}),
};

export const WithFieldContent: Story = {
	name: 'With Field Content',
	render: () => ({
		template: `
			<div class="w-full max-w-md">
				<div hlmFieldGroup class="gap-4">
					<div hlmField orientation="horizontal">
						<hlm-checkbox id="field-content-security-updates" [checked]="true" />
						<div hlmFieldContent>
							<label hlmFieldLabel for="field-content-security-updates">Security Updates</label>
							<p hlmFieldDescription>Receive emails about your account security and important updates.</p>
						</div>
					</div>
					<div hlmField orientation="horizontal">
						<hlm-switch id="field-content-two-factor" />
						<div hlmFieldContent>
							<label hlmFieldLabel for="field-content-two-factor">Two-Factor Authentication</label>
							<p hlmFieldDescription>
								Add an extra layer of security to your account. You'll need to enter a code from your phone in addition
								to your password.
							</p>
						</div>
					</div>
				</div>
			</div>
		`,
	}),
};

export const WithFieldTitle: Story = {
	name: 'With Field Title',
	render: () => ({
		template: `
			<div class="w-full max-w-md">
				<fieldset hlmFieldSet>
					<div hlmFieldTitle>Account Settings</div>
					<p hlmFieldDescription>Manage your account preferences and security settings.</p>
					<div hlmFieldGroup>
						<div hlmField>
							<label hlmFieldLabel for="field-title-username">Username</label>
							<input hlmInput id="field-title-username" type="text" placeholder="johndoe" />
						</div>
						<div hlmField>
							<label hlmFieldLabel for="field-title-email">Email</label>
							<input hlmInput id="field-title-email" type="email" placeholder="john@example.com" />
						</div>
					</div>
				</fieldset>
			</div>
		`,
	}),
};
