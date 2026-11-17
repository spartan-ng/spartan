import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';
import { HlmSidebarService } from './hlm-sidebar.service';

@Component({
	selector: 'hlm-sidebar-service-host',
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<button type="button">Action</button>
		<input aria-label="Name" />
		<textarea aria-label="Notes"></textarea>
		<div contenteditable="true" aria-label="Editor" role="textbox"></div>
	`,
})
class SidebarServiceHost {
	public readonly sidebar = inject(HlmSidebarService);
}

function pressShortcut(target: Element): KeyboardEvent {
	const event = new KeyboardEvent('keydown', { key: 'b', ctrlKey: true, bubbles: true, cancelable: true });
	target.dispatchEvent(event);
	return event;
}

describe('HlmSidebarService keyboard shortcut', () => {
	let sidebar: HlmSidebarService;
	// the test viewport may be below the mobile breakpoint, where the shortcut toggles the mobile sheet
	const isExpanded = () => (sidebar.isMobile() ? sidebar.openMobile() : sidebar.open());

	beforeEach(async () => {
		const { fixture } = await render(SidebarServiceHost);
		// the shortcut listener is registered after the first render
		TestBed.tick();
		await fixture.whenStable();
		sidebar = fixture.componentInstance.sidebar;
		sidebar.setOpen(true);
		sidebar.setOpenMobile(false);
	});

	afterEach(() => sidebar.setOpen(true));

	it('toggles the sidebar outside of editable elements', () => {
		const before = isExpanded();
		const event = pressShortcut(screen.getByRole('button', { name: 'Action' }));

		expect(isExpanded()).toBe(!before);
		expect(event.defaultPrevented).toBe(true);
	});

	it.each(['Name', 'Notes', 'Editor'])('leaves the shortcut to the %s field', (name) => {
		const before = isExpanded();
		const event = pressShortcut(screen.getByRole('textbox', { name }));

		expect(isExpanded()).toBe(before);
		expect(event.defaultPrevented).toBe(false);
	});
});
