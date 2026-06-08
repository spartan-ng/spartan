const { nxE2EStorybookPreset } = require('@nx/storybook/presets/cypress');
const { defineConfig } = require('cypress');

const preset = nxE2EStorybookPreset(__dirname);
const presetSetupNodeEvents = preset.setupNodeEvents;

module.exports = defineConfig({
	e2e: {
		...preset,
		// Please ensure you use `cy.origin()` when navigating between domains and remove this option.
		// See https://docs.cypress.io/app/references/migration-guide#Changes-to-cyorigin
		injectDocumentDomain: true,
		experimentalRunAllSpecs: true,
		// Keep Chromium memory in check across the long single-process spec run. Needed together with
		// the anti-throttling launch flags below; without it the menubar spec flakes deep in the run.
		experimentalMemoryManagement: true,
		setupNodeEvents(on, config) {
			// Disable Chromium background/timer throttling. Deep into the long single-process run the
			// renderer starts throttling timers/rAF, which makes CDK's afterNextRender-based focus and
			// menu work lag enough to drop the menubar spec's rapid keyboard navigation.
			on('before:browser:launch', (browser, launchOptions) => {
				if (browser.family === 'chromium' && browser.name !== 'electron') {
					launchOptions.args.push('--disable-background-timer-throttling');
					launchOptions.args.push('--disable-backgrounding-occluded-windows');
					launchOptions.args.push('--disable-renderer-backgrounding');
				}
				return launchOptions;
			});

			return presetSetupNodeEvents ? presetSetupNodeEvents(on, config) : config;
		},
	},
});
