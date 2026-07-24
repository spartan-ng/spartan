import { provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import 'zone.js';

import { appConfig } from './app.config';
import { App } from './app/app';

bootstrapApplication(App, { ...appConfig, providers: [provideZoneChangeDetection(), ...appConfig.providers] }).catch(
	(err) => console.error(err),
);
