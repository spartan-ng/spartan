import { Component } from '@angular/core';

import { AnalogWelcomeComponent } from './analog-welcome.component';

@Component({
	selector: 'spartan-installation-home',
	standalone: true,
	imports: [AnalogWelcomeComponent],
	template: `
		<spartan-installation-analog-welcome />
	`,
})
export default class HomeComponent {}
