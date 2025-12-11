const { nxE2EStorybookPreset } = require('@nx/storybook/presets/cypress');
const { defineConfig } = require('cypress');

module.exports = defineConfig({
	e2e: {
		...nxE2EStorybookPreset(__dirname),
		// Please ensure you use `cy.origin()` when navigating between domains and remove this option.
		// See https://docs.cypress.io/app/references/migration-guide#Changes-to-cyorigin
		injectDocumentDomain: true,
		experimentalRunAllSpecs: true,
	},
});
