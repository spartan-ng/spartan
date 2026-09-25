import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vitest } from 'vitest';
import { ActionMenu } from './action-menu';

describe('ActionMenu', () => {
	let originalMatchMedia: PropertyDescriptor | undefined;
	let originalScrollIntoView: typeof Element.prototype.scrollIntoView | undefined;
	let originalLocalStorage: PropertyDescriptor | undefined;

	beforeAll(() => {
		originalMatchMedia = Object.getOwnPropertyDescriptor(window, 'matchMedia');
		originalScrollIntoView = Element.prototype.scrollIntoView;
		originalLocalStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
	});

	afterAll(() => {
		if (originalMatchMedia) {
			Object.defineProperty(window, 'matchMedia', originalMatchMedia);
		}
		if (originalScrollIntoView) {
			Element.prototype.scrollIntoView = originalScrollIntoView;
		}
		if (originalLocalStorage) {
			Object.defineProperty(globalThis, 'localStorage', originalLocalStorage);
		}
	});

	beforeEach(async () => {
		Object.defineProperty(window, 'matchMedia', {
			writable: true,
			value: vitest.fn().mockImplementation((query: string) => ({
				matches: false,
				media: query,
				addEventListener: vitest.fn(),
				removeEventListener: vitest.fn(),
				dispatchEvent: vitest.fn(),
			})),
		});
		Element.prototype.scrollIntoView = vitest.fn();
		Object.defineProperty(globalThis, 'localStorage', {
			writable: true,
			value: {
				getItem: vitest.fn(),
				setItem: vitest.fn(),
				removeItem: vitest.fn(),
			},
		});

		await TestBed.configureTestingModule({
			providers: [provideRouter([]), provideHttpClient()],
			imports: [ActionMenu],
		}).compileComponents();
	});

	it('should create the component', () => {
		const fixture = TestBed.createComponent(ActionMenu);
		const component = fixture.componentInstance;
		expect(component).toBeTruthy();
	});

	it('should render command items when open', async () => {
		const fixture = TestBed.createComponent(ActionMenu);
		fixture.componentRef.setInput('open', 'open');
		fixture.detectChanges();
		await fixture.whenStable();
		const buttons = document.body.querySelectorAll('[hlm-command-item]');
		const buttonTexts = Array.from(buttons).map((b) => b.textContent?.trim());
		expect(buttonTexts).toContain('Randomize (R)');
		expect(buttonTexts).toContain('Reset to Defaults (Shift+R)');
		expect(buttonTexts).toContain('Toggle Dark Mode (D)');
		expect(buttonTexts).toContain('Undo (Ctrl+Z)');
		expect(buttonTexts).toContain('Redo (Ctrl+Shift+Z)');
	});
});
