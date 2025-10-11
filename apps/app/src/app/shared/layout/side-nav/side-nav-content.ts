import { Component, output } from '@angular/core';
import { components } from '@spartan-ng/app/app/shared/components/navigation-items';
import { SideNav } from './side-nav-coming-soon';
import { SideNavHeading } from './side-nav-heading';
import { SideNavLink } from './side-nav-link';
import { SideNavLinks } from './side-nav-links';

@Component({
	selector: 'spartan-side-nav-content',
	imports: [SideNavLink, SideNavLinks, SideNavHeading, SideNav],
	host: {
		class: 'block',
	},
	template: `
		@for (section of _sections; track section.label) {
			<div class="pb-4">
				<h4 spartanSideNavHeading>{{ section.label }}</h4>
				<spartan-side-nav-links>
					@for (link of section.links; track link.label) {
						@let url = section.url + link.url;
						@if (link.wip) {
							<a disabled [spartanSideNavLink]="url">
								{{ link.label }}
								<spartan-side-nav-cs />
							</a>
						} @else {
							<a (click)="linkClicked.emit()" [spartanSideNavLink]="url">{{ link.label }}</a>
						}
					}
				</spartan-side-nav-links>
			</div>
		}
	`,
})
export class SideNavContent {
	public readonly linkClicked = output();

	protected readonly _sections = [
		{
			label: 'Getting Started',
			url: '/documentation',
			links: [
				{ label: 'Introduction', url: '/introduction' },
				{ label: 'CLI', url: '/cli' },
				{ label: 'components.json', url: '/components-json' },
				{ label: 'Changelog', url: '/changelog' },
				{ label: 'About & Credits', url: '/about' },
			],
		},
		{
			label: 'Stack',
			url: '/stack',
			links: [
				{ label: 'Overview', url: '/overview' },
				{ label: 'Technologies', url: '/technologies' },
				{ label: 'Installation', url: '/installation' },
			],
		},
		{
			label: 'UI',
			url: '/documentation',
			links: [
				{ label: 'Installation', url: '/installation' },
				{ label: 'Theming', url: '/theming' },
				{ label: 'Dark Mode', url: '/dark-mode' },
				{ label: 'Typography', url: '/typography' },
				{ label: 'Figma', url: '/figma' },
				{ label: 'Health Checks', url: '/health-checks' },
				{ label: 'Update Guide', url: '/update-guide' },
			],
		},
		{
			label: 'Components',
			url: '/components',
			links: components,
		},
	];
}
