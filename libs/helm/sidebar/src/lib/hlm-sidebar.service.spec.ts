import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';
import { HlmSidebarService } from './hlm-sidebar.service';
import { provideHlmSidebarConfig } from './hlm-sidebar.token';

@Component({
	selector: 'hlm-sidebar-service-host',
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<button type="button">Action</button>
		<input aria-label="Name" />
		<textarea aria-label="Notes"></textarea>
		<div contenteditable="true" aria-label="Editor" role="textbox"></div>
		<div data-testid="shadow-host"></div>
		<div contenteditable="true" aria-label="Rich editor">
			<svg data-testid="svg-in-editor" width="10" height="10"><circle cx="5" cy="5" r="4" /></svg>
			<input type="checkbox" aria-label="Task in editor" />
			<span contenteditable="false">
				<svg data-testid="svg-in-locked-island" width="10" height="10"><circle cx="5" cy="5" r="4" /></svg>
			</span>
		</div>
		<input type="checkbox" aria-label="Agree" />
		<input type="radio" aria-label="Choice" />
		<input type="range" aria-label="Volume" />
		<input type="email" aria-label="Email" />
		<input type="search" aria-label="Search" />
		<input type="number" aria-label="Quantity" />
	`,
})
class SidebarServiceHost {
	public readonly sidebar = inject(HlmSidebarService);
}

function pressShortcut(target: Element): KeyboardEvent {
	const event = new KeyboardEvent('keydown', {
		key: 'b',
		ctrlKey: true,
		bubbles: true,
		cancelable: true,
		composed: true,
	});
	target.dispatchEvent(event);
	return event;
}

// A dedicated cookie name keeps the suite away from the real `sidebar_state` cookie, which other
// suites in the same browser (and the developer's own sessions) may rely on.
const TEST_COOKIE_NAME = 'sidebar_state_service_spec';

describe('HlmSidebarService keyboard shortcut', () => {
	let sidebar: HlmSidebarService;
	// the test viewport may be below the mobile breakpoint, where the shortcut toggles the mobile sheet
	const isExpanded = () => (sidebar.isMobile() ? sidebar.openMobile() : sidebar.open());

	beforeEach(async () => {
		const { fixture } = await render(SidebarServiceHost, {
			providers: [provideHlmSidebarConfig({ sidebarCookieName: TEST_COOKIE_NAME })],
		});
		// the shortcut listener is registered after the first render
		TestBed.tick();
		await fixture.whenStable();
		sidebar = fixture.componentInstance.sidebar;
		sidebar.setOpen(true);
		sidebar.setOpenMobile(false);
	});

	afterEach(() => {
		document.cookie = `${TEST_COOKIE_NAME}=; path=/; max-age=0`;
	});

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

	it('leaves the shortcut to a field inside an open shadow root', () => {
		const shadowRoot = screen.getByTestId('shadow-host').attachShadow({ mode: 'open' });
		const input = document.createElement('input');
		shadowRoot.appendChild(input);

		const before = isExpanded();
		const event = pressShortcut(input);

		expect(isExpanded()).toBe(before);
		expect(event.defaultPrevented).toBe(false);
	});

	it.each([
		['checkbox', 'Agree'],
		['radio', 'Choice'],
		['range', 'Volume'],
	])('still toggles the sidebar from a %s input, which has no use for the shortcut', (_type, name) => {
		const before = isExpanded();
		const event = pressShortcut(screen.getByLabelText(name));

		expect(isExpanded()).toBe(!before);
		expect(event.defaultPrevented).toBe(true);
	});

	it.each([
		['email', 'Email'],
		['search', 'Search'],
		['number', 'Quantity'],
	])('leaves the shortcut to a text-like %s input', (_type, name) => {
		const before = isExpanded();
		const event = pressShortcut(screen.getByLabelText(name));

		expect(isExpanded()).toBe(before);
		expect(event.defaultPrevented).toBe(false);
	});

	it('leaves the shortcut to a focusable svg inside an editor', () => {
		const before = isExpanded();
		const event = pressShortcut(screen.getByTestId('svg-in-editor'));

		expect(isExpanded()).toBe(before);
		expect(event.defaultPrevented).toBe(false);
	});

	it('toggles the sidebar from an svg inside a non-editable island within an editor', () => {
		const before = isExpanded();
		const event = pressShortcut(screen.getByTestId('svg-in-locked-island'));

		expect(isExpanded()).toBe(!before);
		expect(event.defaultPrevented).toBe(true);
	});

	it('toggles the sidebar from a checkbox that sits inside an editor', () => {
		const before = isExpanded();
		const event = pressShortcut(screen.getByLabelText('Task in editor'));

		expect(isExpanded()).toBe(!before);
		expect(event.defaultPrevented).toBe(true);
	});
});
