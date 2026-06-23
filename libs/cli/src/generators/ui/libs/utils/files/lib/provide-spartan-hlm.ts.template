import { OVERLAY_DEFAULT_CONFIG } from '@angular/cdk/overlay';
import { type EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

/**
 * Provides default configuration for Spartan Helm components.
 *
 * This utility configures the Angular CDK overlay to disable the `usePopover`
 * behavior introduced in Angular 21, which causes CDK overlay-based components
 * (sheets, dialogs, tooltips, etc.) to render above `position: fixed` elements
 * like `<hlm-toaster>`.
 *
 * @returns {EnvironmentProviders} Environment providers to be added to the application config.
 *
 * @example
 * ```ts
 * // app.config.ts
 * import { provideSpartanHlm } from '@spartan-ng/helm/utils';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideSpartanHlm(),
 *     // ... other providers
 *   ],
 * };
 * ```
 */
export function provideSpartanHlm(): EnvironmentProviders {
	return makeEnvironmentProviders([
		{
			provide: OVERLAY_DEFAULT_CONFIG,
			useValue: { usePopover: false },
		},
	]);
}
