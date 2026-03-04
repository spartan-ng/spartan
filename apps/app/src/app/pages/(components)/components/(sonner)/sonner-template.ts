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
