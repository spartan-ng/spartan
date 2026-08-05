import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vitest } from 'vitest';
import { ProjectForm } from './project-form';

describe('ProjectForm', () => {
	let originalMatchMedia: PropertyDescriptor | undefined;
	let originalScrollIntoView: typeof Element.prototype.scrollIntoView | undefined;
	let originalLocalStorage: PropertyDescriptor | undefined;
	let originalClipboard: PropertyDescriptor | undefined;

	beforeAll(() => {
		originalMatchMedia = Object.getOwnPropertyDescriptor(window, 'matchMedia');
		originalScrollIntoView = Element.prototype.scrollIntoView;
		originalLocalStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
		originalClipboard = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
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
		if (originalClipboard) {
			Object.defineProperty(navigator, 'clipboard', originalClipboard);
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
		Object.defineProperty(navigator, 'clipboard', {
			writable: true,
			value: { writeText: vitest.fn() },
		});

		await TestBed.configureTestingModule({
			providers: [provideRouter([]), provideHttpClient()],
			imports: [ProjectForm],
		}).compileComponents();
	});

	it('should create the component', () => {
		const fixture = TestBed.createComponent(ProjectForm);
		const component = fixture.componentInstance;
		expect(component).toBeTruthy();
	});

	it('should render the dialog when open', async () => {
		const fixture = TestBed.createComponent(ProjectForm);
		fixture.componentRef.setInput('open', 'open');
		fixture.detectChanges();
		await fixture.whenStable();
		const title = document.body.querySelector('h3');
		expect(title?.textContent?.trim()).toBe('Get Code');
	});

	it('should render tab buttons', async () => {
		const fixture = TestBed.createComponent(ProjectForm);
		fixture.componentRef.setInput('open', 'open');
		fixture.detectChanges();
		await fixture.whenStable();
		const tabs = document.body.querySelectorAll('button[hlmTabsTrigger]');
		const tabTexts = Array.from(tabs).map((t) => t.textContent?.trim());
		expect(tabTexts).toContain('New Project');
		expect(tabTexts).toContain('Existing');
		expect(tabTexts).toContain('Theme');
	});

	it('should render template toggle, RTL switch, and Pointer switch', async () => {
		const fixture = TestBed.createComponent(ProjectForm);
		fixture.componentRef.setInput('open', 'open');
		fixture.detectChanges();
		await fixture.whenStable();
		const angularBtn = Array.from(document.body.querySelectorAll('button')).find((b) =>
			b.textContent?.trim().includes('Angular'),
		);
		expect(angularBtn).toBeTruthy();
		const labels = document.body.querySelectorAll('label');
		const labelTexts = Array.from(labels).map((l) => l.textContent?.trim());
		expect(labelTexts).toContain('RTL');
		expect(labelTexts).toContain('Pointer');
	});

	it('should copy command to clipboard', async () => {
		const fixture = TestBed.createComponent(ProjectForm);
		fixture.componentRef.setInput('open', 'open');
		fixture.detectChanges();
		const component = fixture.componentInstance;
		const command = component['_initCommand']();
		await component['_copy'](command);
		expect(navigator.clipboard.writeText).toHaveBeenCalledWith(command);
		expect(component['_copied']()).toBe(true);
	});
});
