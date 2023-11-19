import { Directive, Input, computed, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { VariantProps, cva } from 'class-variance-authority';
import { ClassValue } from 'clsx';

const cardFooterVariants = cva('flex p-6 pt-0', {
	variants: {
		direction: {
			row: 'flex-row items-center space-x-1.5',
			column: 'flex-col space-y-1.5',
		},
	},
	defaultVariants: {
		direction: 'row',
	},
});
export type CardFooterVariants = VariantProps<typeof cardFooterVariants>;

@Directive({
	selector: '[hlmCardFooter]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmCardFooterDirective {
	private _userCls = signal<ClassValue>('');
	private _direction = signal<CardFooterVariants['direction']>('row');

	protected _computedClass = computed(() => {
		return hlm(cardFooterVariants({ direction: this._direction() }), this._userCls());
	});

	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
	}
	@Input()
	set direction(direction: CardFooterVariants['direction']) {
		this._direction.set(direction);
	}
}
