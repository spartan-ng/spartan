export type Link = {
	label: string;
	url: string;
	wip?: boolean;
	new?: boolean;
};
type NavItem = {
	label: string;
	url: string;
	links: Link[];
};

export const pageNavs: Link[] = [
	{ label: 'Home', url: '/' },
	{ label: 'Docs', url: '/documentation' },
	{ label: 'Stack', url: '/stack' },
	{ label: 'Components', url: '/components' },
	{ label: 'Blocks', url: '/blocks', new: true },
	{ label: 'Colors', url: '/colors' },
];

export const components: Link[] = [
	{ label: 'Accordion', url: '/accordion' },
	{ label: 'Alert', url: '/alert' },
	{ label: 'Alert Dialog', url: '/alert-dialog' },
	{ label: 'Aspect Ratio', url: '/aspect-ratio' },
	{ label: 'Autocomplete', url: '/autocomplete' },
	{ label: 'Avatar', url: '/avatar' },
	{ label: 'Badge', url: '/badge' },
	{ label: 'Breadcrumb', url: '/breadcrumb' },
	{ label: 'Button', url: '/button' },
	{ label: 'Button Group', url: '/button-group', new: true },
	{ label: 'Calendar', url: '/calendar' },
	{ label: 'Card', url: '/card' },
	{ label: 'Carousel', url: '/carousel' },
	{ label: 'Checkbox', url: '/checkbox' },
	{ label: 'Collapsible', url: '/collapsible' },
	{ label: 'Combobox', url: '/combobox' },
	{ label: 'Command', url: '/command' },
	{ label: 'Context Menu', url: '/context-menu', new: true },
	{ label: 'Data Table', url: '/data-table' },
	{ label: 'Date Picker', url: '/date-picker' },
	{ label: 'Dialog', url: '/dialog' },
	{ label: 'Dropdown Menu', url: '/dropdown-menu', new: true },
	{ label: 'Empty', url: '/empty', new: true },
	{ label: 'Field', url: '/field', new: true },
	{ label: 'Form', url: '/form', wip: true },
	{ label: 'Form Field', url: '/form-field' },
	{ label: 'Hover Card', url: '/hover-card' },
	{ label: 'Icon', url: '/icon' },
	{ label: 'Input Group', url: '/input-group', new: true },
	{ label: 'Input OTP', url: '/input-otp' },
	{ label: 'Input', url: '/input' },
	{ label: 'Item', url: '/item', new: true },
	{ label: 'Kbd', url: '/kbd', new: true },
	{ label: 'Label', url: '/label' },
	{ label: 'Menubar', url: '/menubar', new: true },
	{ label: 'Navigation Menu', url: '/navigation-menu', new: true },
	{ label: 'Pagination', url: '/pagination' },
	{ label: 'Popover', url: '/popover' },
	{ label: 'Progress', url: '/progress' },
	{ label: 'Radio Group', url: '/radio-group' },
	{ label: 'Resizable', url: '/resizable', new: true },
	{ label: 'Scroll Area', url: '/scroll-area' },
	{ label: 'Select', url: '/select' },
	{ label: 'Separator', url: '/separator' },
	{ label: 'Sheet', url: '/sheet' },
	{ label: 'Sidebar', url: '/sidebar', new: true },
	{ label: 'Skeleton', url: '/skeleton' },
	{ label: 'Slider', url: '/slider' },
	{ label: 'Sonner (Toast)', url: '/sonner' },
	{ label: 'Spinner', url: '/spinner' },
	{ label: 'Switch', url: '/switch' },
	{ label: 'Table', url: '/table' },
	{ label: 'Tabs', url: '/tabs' },
	{ label: 'Textarea', url: '/textarea', new: true },
	{ label: 'Toggle', url: '/toggle' },
	{ label: 'Toggle Group', url: '/toggle-group' },
	{ label: 'Tooltip', url: '/tooltip' },
];

export const sidenavItems: NavItem[] = [
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
		label: 'UI',
		url: '/documentation',
		links: [
			{ label: 'Installation', url: '/installation' },
			{ label: 'Theming', url: '/theming' },
			{ label: 'Dark Mode', url: '/dark-mode' },
			{ label: 'Typography', url: '/typography' },
			{ label: 'Figma', url: '/figma' },
			{ label: 'Version Support', url: '/version-support' },
			{ label: 'Health Checks', url: '/health-checks' },
			{ label: 'Update Guide', url: '/update-guide' },
		],
	},
	{
		label: 'Components',
		url: '/components',
		links: components,
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
];
