import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import { Subject } from 'rxjs';
import { BrnSelectTrigger } from './brn-select-trigger';
import { BrnSelectBaseToken } from './brn-select.token';

function selectStub() {
	const value = signal<string | null>(null);
	return {
		value,
		isExpanded: signal(false),
		disabledState: signal(false),
		itemToString: signal(undefined),
		listId: signal<string | undefined>(undefined),
		hasValue: computed(() => value() !== null),
		controlState: signal(null),
		keyManager: { change: new Subject<void>(), activeItem: undefined, activeItemIndex: -1, onKeydown: vi.fn() },
		toggle: vi.fn(),
		open: vi.fn(),
		close: vi.fn(),
		selectActiveItem: vi.fn(),
		registerSelectTrigger: vi.fn(),
		updateTriggerWidth: vi.fn(),
	};
}

@Component({
	selector: 'brn-select-trigger-host',
	imports: [BrnSelectTrigger],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<button aria-label="Test" brnSelectTrigger></button>
	`,
})
class SelectTriggerHost {}

describe('BrnSelectTrigger', () => {
	it('focuses itself when clicked, so keyboard navigation reaches it', async () => {
		const select = selectStub();
		await render(SelectTriggerHost, { providers: [{ provide: BrnSelectBaseToken, useValue: select }] });
		const trigger = screen.getByLabelText('Test');

		// a synthetic click doesn't move focus, like a real click in Safari
		trigger.click();

		expect(document.activeElement).toBe(trigger);
		expect(select.toggle).toHaveBeenCalledTimes(1);
	});
});
