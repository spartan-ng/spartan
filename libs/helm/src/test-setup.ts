import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv({
	errorOnUnknownElements: true,
	errorOnUnknownProperties: true,
});

// Suppress CSS parsing errors for @layer and other modern CSS
const originalConsoleError = console.error;
console.error = (...args: any[]) => {
	if (args[0]?.includes?.('Could not parse CSS stylesheet')) {
		return; // Suppress CSS parsing warnings
	}
	originalConsoleError.apply(console, args);
};
