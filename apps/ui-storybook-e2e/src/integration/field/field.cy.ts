describe('field', () => {
	describe('default', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=field--default');
			cy.injectAxe();
		});

		it('should render field with label, input, and description', () => {
			// Verify field structure
			cy.get('[hlmfield]').should('exist');
			cy.get('[hlmfieldlabel]').should('exist');
			cy.get('[hlminput]').should('exist');
			cy.get('[hlmfielddescription]').should('exist');

			// Verify label text
			cy.findByLabelText('Full name').should('exist');
			cy.findByLabelText('Username').should('exist');

			// Verify inputs are accessible
			cy.findByLabelText('Full name').should('have.attr', 'id', 'field-fullname');
			cy.findByLabelText('Username').should('have.attr', 'id', 'field-username');

			// Verify description is visible
			cy.contains('This appears on invoices and emails.').should('be.visible');
		});

		it('should allow typing in inputs', () => {
			cy.findByLabelText('Full name').type('John Doe');
			cy.findByLabelText('Full name').should('have.value', 'John Doe');

			cy.findByLabelText('Username').type('john_doe_99');
			cy.findByLabelText('Username').should('have.value', 'john_doe_99');
		});

		it('should support keyboard navigation', () => {
			cy.findByLabelText('Full name').focus();
			cy.findByLabelText('Full name').should('have.focus');

			cy.realPress('Tab');
			cy.findByLabelText('Username').should('have.focus');
		});
	});

	describe('with input', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=field--with-input');
			cy.injectAxe();
		});

		it('should render multiple fields with descriptions', () => {
			cy.findByLabelText('Username').should('exist');
			cy.findByLabelText('Password').should('exist');

			cy.contains('Choose a unique username for your account.').should('be.visible');
			cy.contains('Must be at least 8 characters long.').should('be.visible');
		});

		it('should allow input in password field', () => {
			cy.findByLabelText('Password').type('secretpassword123');
			cy.findByLabelText('Password').should('have.value', 'secretpassword123');
			cy.findByLabelText('Password').should('have.attr', 'type', 'password');
		});
	});

	describe('with checkbox', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=field--with-checkbox');
			cy.injectAxe();
		});

		it('should render fieldset with legend and checkboxes', () => {
			// Verify fieldset structure
			cy.get('[hlmfieldset]').should('exist');
			cy.get('[hlmfieldlegend]').should('contain.text', 'Show these items on the desktop');
			cy.get('[hlmfielddescription]').should('contain.text', 'Select the items you want to show on the desktop.');

			// Verify all checkboxes are rendered with horizontal orientation
			cy.findByLabelText('Hard disks').should('exist');
			cy.findByLabelText('External disks').should('exist');
			cy.findByLabelText('CDs, DVDs, and IPods').should('exist');
			cy.findByLabelText('Connected servers').should('exist');
		});

		it('should allow checking and unchecking checkboxes', () => {
			cy.findByLabelText('Hard disks').click();
			cy.findByLabelText('Hard disks').should('have.attr', 'aria-checked', 'true');

			cy.findByLabelText('Hard disks').click();
			cy.findByLabelText('Hard disks').should('have.attr', 'aria-checked', 'false');
		});

		it('should render checkbox with field content', () => {
			cy.get('[hlmfieldcontent]').should('exist');
			cy.contains('Sync Desktop & Documents folders').should('be.visible');
			cy.contains('Your Desktop & Documents folders are being synced with iCloud Drive').should('be.visible');
		});

		it('should have separator between field groups', () => {
			cy.get('hlm-field-separator').should('exist');
		});
	});

	describe('with switch', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=field--with-switch');
			cy.injectAxe();
		});

		it('should render field with switch in horizontal orientation', () => {
			cy.findByLabelText('Multi-factor authentication').should('exist');
			cy.findByRole('switch', { name: /multi-factor authentication/i }).should('exist');

			// Verify description is visible
			cy.contains('Enable multi-factor authentication').should('be.visible');
			cy.contains('If you do not have a two-factor device').should('be.visible');
		});

		it('should toggle switch', () => {
			cy.findByRole('switch', { name: /multi-factor authentication/i }).should('have.attr', 'aria-checked', 'false');
			cy.findByRole('switch', { name: /multi-factor authentication/i }).click();
			cy.findByRole('switch', { name: /multi-factor authentication/i }).should('have.attr', 'aria-checked', 'true');
		});
	});

	describe('with radio', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=field--with-radio');
			cy.injectAxe();
		});

		it('should render fieldset with radio group', () => {
			cy.get('[hlmfieldset]').should('exist');
			cy.get('[hlmfieldlabel]').should('contain.text', 'Subscription Plan');
			cy.contains('Yearly and lifetime plans offer significant savings').should('be.visible');

			// Verify all radio options
			cy.findByLabelText(/Monthly/i).should('exist');
			cy.findByLabelText(/Yearly/i).should('exist');
			cy.findByLabelText(/Lifetime/i).should('exist');
		});
	});

	describe('with select', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=field--with-select');
			cy.injectAxe();
		});

		it('should allow selecting an option', () => {
			cy.get('[brnselecttrigger]').click();
			cy.contains('United States').click();
			cy.get('[brnselecttrigger]').should('contain.text', 'United States');
		});
	});

	describe('with textarea', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=field--with-textarea');
			cy.injectAxe();
		});

		it('should render field with textarea', () => {
			cy.findByLabelText('Comments').should('exist');
			cy.findByLabelText('Comments').should('have.attr', 'id', 'field-comments');
			cy.contains('Please provide any additional information.').should('be.visible');
		});

		it('should allow typing in textarea', () => {
			const testText = 'This is a test comment with multiple lines.\nSecond line here.';
			cy.findByLabelText('Comments').type(testText);
			cy.findByLabelText('Comments').should('contain.value', 'This is a test comment');
		});
	});

	describe('with error', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=field--with-error');
			cy.injectAxe();
		});

		it('should render fields with error states', () => {
			// Note: We need to disable color-contrast check as error states might affect contrast
			cy.checkA11y('#storybook-root', {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
					'color-contrast': { enabled: false },
				},
			});

			// Verify error messages are displayed
			cy.contains('Enter a valid email address.').should('be.visible');
			cy.contains('Username must be at least 3 characters.').should('be.visible');

			// Verify fields have error attributes
			cy.findByLabelText('Email').should('have.attr', 'aria-invalid', 'true');
			cy.findByLabelText('Username').should('have.attr', 'aria-invalid', 'true');

			// Verify error component exists
			cy.get('hlm-field-error').should('have.length', 2);
		});

		it('should have data-invalid attribute on field wrapper', () => {
			cy.get('[hlmfield][data-invalid="true"]').should('have.length', 2);
		});
	});

	describe('field group', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=field--field-group');
			cy.injectAxe();
		});

		it('should handle disabled checkbox in first group', () => {
			cy.get('[hlmfield]').first().find('hlm-checkbox').should('have.attr', 'disabled');
		});
	});

	describe('complex form', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=field--complex-form');
			cy.injectAxe();
		});
	});

	describe('horizontal orientation', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=field--horizontal-orientation');
			cy.injectAxe();
		});

		it('should render fields with horizontal layout', () => {
			// All fields should have horizontal orientation
			cy.get('[hlmfield][orientation="horizontal"]').should('have.length', 3);

			// Verify switch
			cy.findByRole('switch', { name: /Enable notifications/i }).should('exist');

			// Verify checkboxes
			cy.findByLabelText(/Receive marketing emails/i).should('exist');
			cy.findByLabelText(/Product updates/i).should('exist');
		});

		it('should allow interaction with horizontal fields', () => {
			cy.findByRole('switch', { name: /Enable notifications/i }).click();
			cy.findByRole('switch', { name: /Enable notifications/i }).should('have.attr', 'aria-checked', 'true');

			cy.findByLabelText(/Receive marketing emails/i).click();
			cy.findByLabelText(/Receive marketing emails/i).should('have.attr', 'aria-checked', 'true');
		});
	});

	describe('with field content', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=field--with-field-content');
			cy.injectAxe();
		});

		it('should render field content with label and description', () => {
			// Verify field content elements exist
			cy.get('[hlmfieldcontent]').should('have.length', 2);

			// Verify first field content
			cy.contains('Security Updates').should('be.visible');
			cy.contains('Receive emails about your account security').should('be.visible');

			// Verify second field content
			cy.contains('Two-Factor Authentication').should('be.visible');
			cy.contains('Add an extra layer of security to your account').should('be.visible');
		});

		it('should have checkbox checked by default', () => {
			cy.findByLabelText('Security Updates').should('have.attr', 'aria-checked', 'true');
		});
	});

	describe('with field title', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=field--with-field-title');
			cy.injectAxe();
		});

		it('should render field title above fieldset', () => {
			// Verify field title exists
			cy.get('[hlmfieldtitle]').should('exist');
			cy.get('[hlmfieldtitle]').should('contain.text', 'Account Settings');

			// Verify description
			cy.contains('Manage your account preferences and security settings').should('be.visible');

			// Verify fields
			cy.findByLabelText('Username').should('exist');
			cy.findByLabelText('Email').should('exist');
		});

		it('should allow input in fields under title', () => {
			cy.findByLabelText('Username').type('johndoe');
			cy.findByLabelText('Email').type('john@example.com');

			cy.findByLabelText('Username').should('have.value', 'johndoe');
			cy.findByLabelText('Email').should('have.value', 'john@example.com');
		});
	});
});
