import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vitest } from 'vitest';
import { MainMenu } from './main-menu';

describe('MainMenu', () => {
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
			imports: [MainMenu],
		}).compileComponents();
	});

	it('should create the component', () => {
		const fixture = TestBed.createComponent(MainMenu);
		const component = fixture.componentInstance;
		expect(component).toBeTruthy();
	});

	it('should render the menu trigger button', () => {
		const fixture = TestBed.createComponent(MainMenu);
		fixture.detectChanges();
		const element = fixture.nativeElement as HTMLElement;
		const trigger = element.querySelector('button[title="Menu"]');
		expect(trigger).toBeTruthy();
	});

	it('should emit actionMenu when commands button is clicked', async () => {
		const fixture = TestBed.createComponent(MainMenu);
		fixture.detectChanges();
		const emitSpy = vitest.fn();
		fixture.componentInstance.actionMenu.subscribe(emitSpy);
		const trigger = (fixture.nativeElement as HTMLElement).querySelector('button[title="Menu"]') as HTMLElement;
		trigger?.click();
		fixture.detectChanges();
		await fixture.whenStable();
		const buttons = document.body.querySelectorAll('button');
		const commandsButton = Array.from(buttons).find((b) => b.textContent?.trim() === 'Commands');
		expect(commandsButton).toBeTruthy();
		commandsButton?.click();
		expect(emitSpy).toHaveBeenCalledTimes(1);
	});
});
