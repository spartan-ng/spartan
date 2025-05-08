import { NgModule } from '@angular/core';
import { HlmBreadcrumbEllipsisComponent } from './lib/hlm-breadcrumb-ellipsis.component';
import { HlmBreadcrumbItemDirective } from './lib/hlm-breadcrumb-item.directive';
import { HlmBreadcrumbLinkDirective } from './lib/hlm-breadcrumb-link.directive';
import { HlmBreadcrumbListDirective } from './lib/hlm-breadcrumb-list.directive';
import { HlmBreadcrumbPageDirective } from './lib/hlm-breadcrumb-page.directive';
import { HlmBreadcrumbSeparatorComponent } from './lib/hlm-breadcrumb-separator.component';
import { HlmBreadcrumbDirective } from './lib/hlm-breadcrumb.directive';

export * from './lib/hlm-breadcrumb-ellipsis.component';
export * from './lib/hlm-breadcrumb-item.directive';
export * from './lib/hlm-breadcrumb-link.directive';
export * from './lib/hlm-breadcrumb-list.directive';
export * from './lib/hlm-breadcrumb-page.directive';
export * from './lib/hlm-breadcrumb-separator.component';
export * from './lib/hlm-breadcrumb.directive';

export const HlmBreadCrumbImports = [
	HlmBreadcrumbDirective,
	HlmBreadcrumbEllipsisComponent,
	HlmBreadcrumbSeparatorComponent,
	HlmBreadcrumbItemDirective,
	HlmBreadcrumbLinkDirective,
	HlmBreadcrumbPageDirective,
	HlmBreadcrumbListDirective,
] as const;

@NgModule({
	imports: [...HlmBreadCrumbImports],
	exports: [...HlmBreadCrumbImports],
})
export class HlmBreadCrumbModule {}
