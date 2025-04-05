import { provideFileRouter } from '@analogjs/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import type { ApplicationConfig } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { PreloadAllModules, withInMemoryScrolling, withNavigationErrorHandler, withPreloading } from '@angular/router';
import { provideTrpcClient } from './trpc-client';

export const appConfig: ApplicationConfig = {
	providers: [
		provideFileRouter(
			withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
			withNavigationErrorHandler(console.log),
			withPreloading(PreloadAllModules),
		),
		provideClientHydration(),
		provideTrpcClient(),
		provideHttpClient(withFetch()),
	],
};
