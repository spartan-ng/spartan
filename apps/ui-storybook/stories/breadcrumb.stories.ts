import { RouterTestingModule } from '@angular/router/testing';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSlash } from '@ng-icons/lucide';
import { HlmBreadCrumbImports, HlmBreadcrumb } from '@spartan-ng/helm/breadcrumb';
import { HlmIcon } from '@spartan-ng/helm/icon';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

const meta: Meta<HlmBreadcrumb> = {
	title: 'Breadcrumb',
	component: HlmBreadcrumb,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [HlmBreadCrumbImports, NgIcon, HlmIcon, RouterTestingModule],
			providers: [provideIcons({ lucideSlash })],
		}),
	],
};

export default meta;
type Story = StoryObj<HlmBreadcrumb>;

export const Default: Story = {
	render: () => ({
		template: /* HTML */ `
			<nav hlmBreadcrumb>
				<ol hlmBreadcrumbList>
					<li hlmBreadcrumbItem>
						<a hlmBreadcrumbLink link="/home">Home</a>
					</li>
					<li hlmBreadcrumbSeparator></li>
					<li hlmBreadcrumbItem>
						<hlm-breadcrumb-ellipsis />
					</li>
					<li hlmBreadcrumbSeparator></li>
					<li hlmBreadcrumbItem>
						<a hlmBreadcrumbLink link="/components">Components</a>
					</li>
					<li hlmBreadcrumbSeparator></li>
					<li hlmBreadcrumbItem>
						<span hlmBreadcrumbPage>Breadcrumb</span>
					</li>
				</ol>
			</nav>
		`,
	}),
};

export const Custom: Story = {
	render: () => ({
		template: /* HTML */ `
			<nav hlmBreadcrumb>
				<ol hlmBreadcrumbList>
					<li hlmBreadcrumbItem>
						<a hlmBreadcrumbLink href="/home">Home</a>
					</li>
					<li hlmBreadcrumbSeparator>
						<ng-icon hlm size="sm" name="lucideSlash" />
					</li>
					<li hlmBreadcrumbItem>
						<a hlmBreadcrumbLink href="/components">Components</a>
					</li>
					<li hlmBreadcrumbSeparator>
						<ng-icon hlm size="sm" name="lucideSlash" />
					</li>
					<li hlmBreadcrumbItem>
						<span hlmBreadcrumbPage>Breadcrumb</span>
					</li>
				</ol>
			</nav>
		`,
	}),
};
