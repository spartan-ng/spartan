module.exports = {
	extends: ['@commitlint/config-conventional'],
	rules: {
		'body-leading-blank': [2, 'always'],
		'footer-leading-blank': [2, 'always'],
		'scope-enum': [
			2,
			'always',
			[
				'accordion',
				'alert',
				'alert-dialog',
				'aspect-ratio',
				'avatar',
				'badge',
				'button',
				'breadcrumb',
				'calendar',
				'card',
				'carousel',
				'checkbox',
				'collapsible',
				'combobox',
				'command',
				'context-menu',
				'data-table',
				'date-picker',
				'dialog',
				'dropdown-menu',
				'form-field',
				'hover-card',
				'icon',
				'input',
				'label',
				'menubar',
				'navigation-menu',
				'pagination',
				'popover',
				'progress',
				'radio-group',
				'scroll-area',
				'select',
				'separator',
				'sheet',
				'skeleton',
				'slider',
				'sonner',
				'spinner',
				'switch',
				'table',
				'tabs',
				'textarea',
				'toast',
				'toggle',
				'tooltip',
				'trpc',
				'typography',
				'nx',
				'repo',
			],
		],
	},
};
