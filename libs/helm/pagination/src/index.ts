import { NgModule } from '@angular/core';

import { HlmNumberedPaginationComponent } from './lib/hlm-numbered-pagination.component';
import { HlmPaginationContentDirective } from './lib/hlm-pagination-content.directive';
import { HlmPaginationEllipsisComponent } from './lib/hlm-pagination-ellipsis.component';
import { HlmPaginationItemDirective } from './lib/hlm-pagination-item.directive';
import { HlmPaginationLinkDirective } from './lib/hlm-pagination-link.directive';
import { HlmPaginationNextComponent } from './lib/hlm-pagination-next.component';
import { HlmPaginationPreviousComponent } from './lib/hlm-pagination-previous.component';
import { HlmPaginationDirective } from './lib/hlm-pagination.directive';

export * from './lib/hlm-numbered-pagination.component';
export * from './lib/hlm-pagination-content.directive';
export * from './lib/hlm-pagination-ellipsis.component';
export * from './lib/hlm-pagination-item.directive';
export * from './lib/hlm-pagination-link.directive';
export * from './lib/hlm-pagination-next.component';
export * from './lib/hlm-pagination-previous.component';
export * from './lib/hlm-pagination.directive';

export const HlmPaginationImports = [
	HlmPaginationDirective,
	HlmPaginationContentDirective,
	HlmPaginationItemDirective,
	HlmPaginationLinkDirective,
	HlmPaginationPreviousComponent,
	HlmPaginationNextComponent,
	HlmPaginationEllipsisComponent,
	HlmNumberedPaginationComponent,
] as const;

@NgModule({
	imports: [...HlmPaginationImports],
	exports: [...HlmPaginationImports],
})
export class HlmPaginationModule {}
