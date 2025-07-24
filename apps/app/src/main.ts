import { bootstrapApplication } from '@angular/platform-browser';
import 'zone.js';

import { appConfig } from './app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
