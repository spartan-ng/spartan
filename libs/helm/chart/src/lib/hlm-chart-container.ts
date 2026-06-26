import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';
import type { ChartConfig } from './chart-config';

@Component({
	selector: 'hlm-chart-container, [hlmChartContainer]',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'data-slot': 'chart-container',
		'[attr.data-chart]': 'chartId()',
	},
	template: `
		<ng-content />
	`,
})
export class HlmChartContainer {
	public readonly id = input<string>();
	public readonly config = input.required<ChartConfig>();
	public readonly aspect = input<'video' | 'square' | 'auto'>('video');

	private readonly _fallbackId = Math.random().toString(36).substring(2, 9);

	public readonly chartId = computed(() => `chart-${this.id() ?? this._fallbackId}`);

	constructor() {
		classes(
			() =>
				'flex h-full w-full flex-col justify-center text-xs' +
				(this.aspect() === 'video' ? ' aspect-video' : '') +
				(this.aspect() === 'square' ? ' aspect-square' : ''),
		);
	}
}
