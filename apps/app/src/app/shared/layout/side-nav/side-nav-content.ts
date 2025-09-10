import { Component, output } from '@angular/core';
import { SideNav } from './side-nav-coming-soon';
import { SideNavHeading } from './side-nav-heading';
import { SideNavLink } from './side-nav-link';
import { SideNavLinks } from './side-nav-links';

@Component({
	selector: 'spartan-side-nav-content',
	imports: [SideNavLink, SideNavLinks, SideNavHeading, SideNav],
	host: {
		class: 'block px-1',
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
			links: [
				{ label: 'Accordion', url: '/accordion' },
				{ label: 'Alert', url: '/alert' },
				{ label: 'Alert Dialog', url: '/alert-dialog' },
				{ label: 'Aspect Ratio', url: '/aspect-ratio' },
				{ label: 'Autocomplete', url: '/autocomplete' },
				{ label: 'Avatar', url: '/avatar' },
				{ label: 'Badge', url: '/badge' },
				{ label: 'Breadcrumb', url: '/breadcrumb' },
				{ label: 'Button', url: '/button' },
				{ label: 'Calendar', url: '/calendar' },
				{ label: 'Card', url: '/card' },
				{ label: 'Carousel', url: '/carousel' },
				{ label: 'Checkbox', url: '/checkbox' },
				{ label: 'Collapsible', url: '/collapsible' },
				{ label: 'Combobox', url: '/combobox' },
				{ label: 'Command', url: '/command' },
				{ label: 'Context Menu', url: '/context-menu' },
				{ label: 'Data Table', url: '/data-table' },
				{ label: 'Date Picker', url: '/date-picker' },
				{ label: 'Dialog', url: '/dialog' },
				{ label: 'Dropdown Menu', url: '/dropdown-menu' },
				{ label: 'Form', url: '/form', wip: true },
				{ label: 'Form Field', url: '/form-field' },
				{ label: 'Hover Card', url: '/hover-card' },
				{ label: 'Icon', url: '/icon' },
				{ label: 'Input', url: '/input' },
				{ label: 'Input OTP', url: '/input-otp' },
				{ label: 'Label', url: '/label' },
				{ label: 'Menubar', url: '/menubar' },
				{ label: 'Navigation Menu', url: '/navigation-menu', wip: true },
				{ label: 'Pagination', url: '/pagination' },
				{ label: 'Popover', url: '/popover' },
				{ label: 'Progress', url: '/progress' },
				{ label: 'Radio Group', url: '/radio-group' },
				{ label: 'Resizable', url: '/resizable' },
				{ label: 'Scroll Area', url: '/scroll-area' },
				{ label: 'Select', url: '/select' },
				{ label: 'Separator', url: '/separator' },
				{ label: 'Sheet', url: '/sheet' },
				{ label: 'Skeleton', url: '/skeleton' },
				{ label: 'Slider', url: '/slider' },
				{ label: 'Sonner (Toast)', url: '/sonner' },
				{ label: 'Spinner', url: '/spinner' },
				{ label: 'Switch', url: '/switch' },
				{ label: 'Table', url: '/table' },
				{ label: 'Tabs', url: '/tabs' },
				{ label: 'Textarea', url: '/textarea' },
				{ label: 'Toggle', url: '/toggle' },
				{ label: 'Toggle Group', url: '/toggle-group' },
				{ label: 'Tooltip', url: '/tooltip' },
			],
		},
	];
}
