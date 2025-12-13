import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

// avoid static ESM import of BrnAvatar to break circular initialization (IIC)
declare const require: any;
const BrnAvatar = (require('@spartan-ng/brain/avatar') as any).BrnAvatar;

@Component({
	selector: 'hlm-avatar',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[class]': '_computedClass()',
	},
	template: `
		<ng-container *ngIf="_image()?.canShow(); else fallback">
			<ng-content select="[hlmAvatarImage],[brnAvatarImage]"></ng-content>
		</ng-container>

		<ng-template #fallback>
			<ng-content select="[hlmAvatarFallback],[brnAvatarFallback]"></ng-content>
		</ng-template>
	`,
})
export class HlmAvatar extends BrnAvatar {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() =>
		hlm('relative flex size-8 shrink-0 overflow-hidden rounded-full', this.userClass()),
	);
}
