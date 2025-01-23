import { computed, contentChildren, Directive, input } from '@angular/core';
import { BrnCommandItemToken } from './brn-command-item.token';

@Directive({
	selector: '[brnCommandGroup]',
	standalone: true,
	host: {
		role: 'group',
		'[attr.data-hidden]': '!visible() ? "" : null',
		'[id]': 'id()',
	},
})
export class BrnCommandGroupDirective {
	private static _id = 0;

	/** The id of the command list */
	public readonly id = input<string>(`brn-command-group-${BrnCommandGroupDirective._id++}`);

	/** Get the items in the group */
	private readonly _items = contentChildren(BrnCommandItemToken, {
		descendants: true,
	});

	/** Determine if there are any visible items in the group */
	protected readonly visible = computed(() => this._items().some((item) => item.visible()));
}
