import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { NavMainFlat } from '../../shared/sidebar/nav-main-flat';

@Component({
	selector: 'spartan-sidebar-14',
	imports: [HlmSidebarImports, NavMainFlat],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'block',
	},
	styleUrl: '../../blocks-preview-default.css',
	template: `
		<hlm-sidebar side="right">
			<hlm-sidebar-content>
				<spartan-nav-main-flat groupLabel="Table of Contents" [items]="flatNavItems" />
			</hlm-sidebar-content>
			<hlm-sidebar-rail />
		</hlm-sidebar>
	`,
})
export class AppSidebar14 {
	public readonly flatNavItems = [
		{
			title: 'Getting Started',
			url: '.',
			items: [
				{ title: 'Installation', url: '.' },
				{ title: 'Project Structure', url: '.' },
			],
		},
		{
			title: 'Build Your Application',
			url: '.',
			items: [
				{ title: 'Routing', url: '.' },
				{ title: 'Data Fetching', url: '.', isActive: true },
				{ title: 'Rendering', url: '.' },
				{ title: 'Caching', url: '.' },
				{ title: 'Styling', url: '.' },
				{ title: 'Optimizing', url: '.' },
				{ title: 'Configuring', url: '.' },
				{ title: 'Testing', url: '.' },
				{ title: 'Authentication', url: '.' },
				{ title: 'Deploying', url: '.' },
				{ title: 'Upgrading', url: '.' },
				{ title: 'Examples', url: '.' },
			],
		},
		{
			title: 'API Reference',
			url: '.',
			items: [
				{ title: 'Components', url: '.' },
				{ title: 'File Conventions', url: '.' },
				{ title: 'Functions', url: '.' },
				{ title: 'next.config.js Options', url: '.' },
				{ title: 'CLI', url: '.' },
				{ title: 'Edge Runtime', url: '.' },
			],
		},
		{
			title: 'Community',
			url: '.',
			items: [{ title: 'Contribution Guide', url: '.' }],
		},
	];
}
