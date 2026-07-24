export const defaultTemplate = `
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HlmToasterImports } from '@spartan-ng/helm/sonner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HlmToasterImports],
  template: \`
    <router-outlet />

    <hlm-toaster />
  \`,
})
export class App {}
`;

export const appConfigCode = `
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideSpartanHlm } from '@spartan-ng/helm/utils';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideSpartanHlm(),
    // ... other providers
  ],
};
`;
