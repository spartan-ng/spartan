import { type ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideServerRendering } from '@angular/ssr';
import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
	providers: [provideServerRendering(), provideClientHydration()],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
