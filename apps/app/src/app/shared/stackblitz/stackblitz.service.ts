import { Injectable } from '@angular/core';
import type { StackBlitzProject } from './stackblitz-project-builder.service';

@Injectable({ providedIn: 'root' })
export class StackBlitzService {
	/**
	 * Open an assembled project in a new StackBlitz tab. The SDK is imported dynamically
	 * so it is only pulled into the browser bundle (it touches `window` and must not run
	 * during Analog's SSR pass).
	 */
	async open(project: StackBlitzProject): Promise<void> {
		const sdk = (await import('@stackblitz/sdk')).default;
		sdk.openProject(
			{
				title: project.title,
				description: project.description,
				template: 'node',
				files: project.files,
			},
			{ newWindow: true, openFile: project.openFile },
		);
	}
}
