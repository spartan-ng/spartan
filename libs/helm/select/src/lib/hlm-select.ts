import { CdkListboxModule } from '@angular/cdk/listbox';
import { OverlayModule } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { BrnSelect } from '@spartan-ng/brain/select';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-select',
	imports: [OverlayModule, CdkListboxModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [
		{
			directive: BrnSelect,
			inputs: [
				'id',
				'multiple',
				'placeholder',
				'disabled',
				'readonly',
				'displayWith',
				'closeDelay',
				'compareWith',
				'open',
				'value',
			],
			outputs: ['openChange', 'valueChange'],
		},
	],
	host: {
		'[class]': '_computedClass()',
	},
	template: `
		@if (!brnSelect.selectLabel() && brnSelect.placeholder()) {
			<label style="display: none;" [attr.id]="brnSelect.labelId()">{{ brnSelect.placeholder() }}</label>
		} @else {
			<ng-content select="label[hlmLabel],label[brnLabel]" />
		}

		<div cdk-overlay-origin (click)="brnSelect.toggle()" #trigger="cdkOverlayOrigin">
			<ng-content select="hlm-select-trigger,[brnSelectTrigger]" />
		</div>

		<ng-template
			cdk-connected-overlay
			cdkConnectedOverlayLockPosition
			cdkConnectedOverlayHasBackdrop
			cdkConnectedOverlayBackdropClass="cdk-overlay-transparent-backdrop"
			[cdkConnectedOverlayOrigin]="trigger"
			[cdkConnectedOverlayOpen]="brnSelect.delayedExpanded()"
			[cdkConnectedOverlayPositions]="brnSelect.positions"
			[cdkConnectedOverlayWidth]="brnSelect.triggerWidth() > 0 ? brnSelect.triggerWidth() : 'auto'"
			(backdropClick)="brnSelect.hide()"
			(detach)="brnSelect.hide()"
			(positionChange)="brnSelect.positionChanges$.next($event)"
		>
			<ng-content />
		</ng-template>
	`,
})
export class HlmSelect {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm('contents space-y-2', this.userClass()));
	public readonly brnSelect = inject(BrnSelect, { host: true });
}
