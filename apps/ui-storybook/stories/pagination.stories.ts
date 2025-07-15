import { RouterTestingModule } from '@angular/router/testing';
import { HlmPagination, HlmPaginationImports } from '@spartan-ng/helm/pagination';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

const meta: Meta<HlmPagination> = {
	title: 'Pagination',
	component: HlmPagination,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [HlmPaginationImports, RouterTestingModule],
		}),
	],
};

export default meta;
type Story = StoryObj<HlmPagination>;

export const Default: Story = {
	render: () => ({
		template: `
    <nav hlmPagination>
			<ul hlmPaginationContent>
				<li hlmPaginationItem>
					<hlm-pagination-previous link="#" />
				</li>
				<li hlmPaginationItem>
					<a hlmPaginationLink link="#">1</a>
				</li>
				<li hlmPaginationItem>
					<a hlmPaginationLink link="#" isActive>2</a>
				</li>
				<li hlmPaginationItem>
					<a hlmPaginationLink link="#">3</a>
				</li>
				<li hlmPaginationItem>
					<hlm-pagination-ellipsis />
				</li>
				<li hlmPaginationItem>
					<hlm-pagination-next link="#" />
				</li>
			</ul>
		</nav>
    `,
	}),
};
