import { ClassValue } from 'class-variance-authority/dist/types';

import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideGripVertical } from '@ng-icons/lucide';
import { BrnResizableHandle } from '@spartan-ng/brain/resizable';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { hlm } from '@spartan-ng/helm/utils';

@Component({
	selector: 'hlm-resizable-handle',
	exportAs: 'hlmResizableHandle',
	hostDirectives: [{ directive: BrnResizableHandle, inputs: ['withHandle', 'disabled'] }],
	providers: [provideIcons({ lucideGripVertical })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		@if (_brnResizableHandle.withHandle()) {
			<div class="bg-border z-10 flex h-4 w-3 items-center justify-center rounded-sm border">
				<ng-icon hlm name="lucideGripVertical" size="10px" />
			</div>
		}
	`,
	host: {
		'[class]': '_computedClass()',
	},
	imports: [NgIcon, HlmIcon],
})
export class HlmResizableHandle {
	protected readonly _brnResizableHandle = inject(BrnResizableHandle);

	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() =>
		hlm(
			'bg-border focus-visible:ring-ring relative flex w-px items-center justify-center after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-none data-[panel-group-direction=horizontal]:hover:cursor-ew-resize data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:translate-x-0 data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:hover:cursor-ns-resize [&[data-panel-group-direction=vertical]>div]:rotate-90',
			this.userClass(),
		),
	);
}
