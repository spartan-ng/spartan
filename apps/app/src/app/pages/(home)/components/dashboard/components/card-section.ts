import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { tablerTrendingDown, tablerTrendingUp } from '@ng-icons/tabler-icons';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmIcon } from '@spartan-ng/helm/icon';

@Component({
	selector: 'spartan-dashboard-card-section',
	imports: [HlmCardImports, HlmBadge, HlmIcon, NgIcon],
	providers: [
		provideIcons({
			tablerTrendingUp,
			tablerTrendingDown,
		}),
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div
			class="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4"
		>
			<div class="@container/card" hlmCard>
				<div hlmCardHeader>
					<p hlmCardDescription>Total Revenue</p>
					<h3 hlmCardTitle class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">$1,250.00</h3>

					<div hlmCardAction>
						<span hlmBadge variant="outline">
							<ng-icon hlm name="tablerTrendingUp" size="xs" />
							+12.5%
						</span>
					</div>
				</div>
				<div hlmCardFooter class="flex-col items-start gap-1.5 text-sm">
					<div class="line-clamp-1 flex gap-2 font-medium">
						Trending up this month
						<ng-icon hlm name="tablerTrendingUp" size="sm" />
					</div>
					<div class="text-muted-foreground">Visitors for the last 6 months</div>
				</div>
			</div>
			<div class="@container/card" hlmCard>
				<div hlmCardHeader>
					<p hlmCardDescription>New Customers</p>
					<h3 hlmCardTitle class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">1,432</h3>

					<div hlmCardAction>
						<span hlmBadge variant="outline">
							<ng-icon hlm name="tablerTrendingDown" size="xs" />
							-20.4%
						</span>
					</div>
				</div>
				<div hlmCardFooter class="flex-col items-start gap-1.5 text-sm">
					<div class="line-clamp-1 flex gap-2 font-medium">
						Down 20.4% this month
						<ng-icon hlm name="tablerTrendingDown" size="sm" />
					</div>
					<div class="text-muted-foreground">Acquisition needs attention</div>
				</div>
			</div>
			<div class="@container/card" hlmCard>
				<div hlmCardHeader>
					<p hlmCardDescription>Active Accounts</p>
					<h3 hlmCardTitle class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">55,124</h3>

					<div hlmCardAction>
						<span hlmBadge variant="outline">
							<ng-icon hlm name="tablerTrendingUp" size="xs" />
							+12.5%
						</span>
					</div>
				</div>
				<div hlmCardFooter class="flex-col items-start gap-1.5 text-sm">
					<div class="line-clamp-1 flex gap-2 font-medium">
						Strong user retention
						<ng-icon hlm name="tablerTrendingUp" size="sm" />
					</div>
					<div class="text-muted-foreground">Engagement exceed targets</div>
				</div>
			</div>
			<div class="@container/card" hlmCard>
				<div hlmCardHeader>
					<p hlmCardDescription>Growth Rate</p>
					<h3 hlmCardTitle class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">+4.5%</h3>

					<div hlmCardAction>
						<span hlmBadge variant="outline">
							<ng-icon hlm name="tablerTrendingUp" size="xs" />
							4.5%
						</span>
					</div>
				</div>
				<div hlmCardFooter class="flex-col items-start gap-1.5 text-sm">
					<div class="line-clamp-1 flex gap-2 font-medium">
						Steady performance increase

						<ng-icon hlm name="tablerTrendingUp" size="sm" />
					</div>
					<div class="text-muted-foreground">Meets growth projections</div>
				</div>
			</div>
		</div>
	`,
})
export class DashboardCardSection {}
