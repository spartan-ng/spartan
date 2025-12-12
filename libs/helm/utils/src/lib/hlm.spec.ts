import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	Injector,
	runInInjectionContext,
	signal,
	viewChild,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { render } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { classes } from './hlm';

describe('classes', () => {
	it('should work when called within injection context', async () => {
		await TestBed.configureTestingModule({}).compileComponents();

		const element = document.createElement('div');
		element.className = 'existing-class';

		const elementRef = new ElementRef(element);
		const computedClasses = () => ['bg-red-500', 'text-white'];

		TestBed.runInInjectionContext(() => {
			classes(computedClasses, { elementRef });
		});

		// Wait for afterRenderEffect to run
		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(element.className).toBe('existing-class bg-red-500 text-white');
	});

	it('should handle class merging and deduplication', async () => {
		await TestBed.configureTestingModule({}).compileComponents();

		const element = document.createElement('div');
		element.className = 'bg-blue-500 p-2';

		const elementRef = new ElementRef(element);
		const computedClasses = () => ['bg-red-500', 'text-white'];

		TestBed.runInInjectionContext(() => {
			classes(computedClasses, { elementRef });
		});

		// Wait for afterRenderEffect to run
		await new Promise((resolve) => setTimeout(resolve, 0));

		// twMerge should resolve bg conflict, keeping the last one (bg-red-500)
		expect(element.className).toBe('p-2 bg-red-500 text-white');
	});

	it('should handle transition class ordering', async () => {
		await TestBed.configureTestingModule({}).compileComponents();

		const element = document.createElement('div');
		element.className = '';

		const elementRef = new ElementRef(element);
		// Use transition classes that don't conflict with each other
		const computedClasses = () => ['transition-transform', 'bg-red-500', 'transition-duration-300', 'text-white'];

		TestBed.runInInjectionContext(() => {
			classes(computedClasses, { elementRef });
		});

		// Wait for afterRenderEffect to run
		await new Promise((resolve) => setTimeout(resolve, 0));

		const result = element.className;
		const classNames = result.split(' ').filter((c) => c.length > 0);

		// Check that transition classes are at the end
		const transitionIndices = classNames
			.map((className, index) => (className.startsWith('transition') ? index : -1))
			.filter((index) => index !== -1);
		const nonTransitionIndices = classNames
			.map((className, index) => (!className.startsWith('transition') ? index : -1))
			.filter((index) => index !== -1);

		// All transition classes should come after all non-transition classes
		if (transitionIndices.length > 0 && nonTransitionIndices.length > 0) {
			expect(Math.min(...transitionIndices)).toBeGreaterThan(Math.max(...nonTransitionIndices));
		}
	});

	it('should handle computed classes updates with change detection', async () => {
		@Component({
			changeDetection: ChangeDetectionStrategy.OnPush,
			template: `
				<div #testElement class="static-class">Test Element</div>
				<button (click)="toggleState()" data-testid="toggle-button">Toggle</button>
			`,
		})
		class TestComponent implements AfterViewInit {
			public readonly elementRef = viewChild.required('testElement', { read: ElementRef });

			public readonly state = signal<'red' | 'blue'>('red');

			ngAfterViewInit() {
				// Use runInInjectionContext to properly set up the injection context
				const injector = TestBed.inject(Injector);
				runInInjectionContext(injector, () => {
					classes(
						() => {
							const currentState = this.state();
							return currentState === 'red' ? ['bg-red-500', 'text-white'] : ['bg-blue-500', 'text-black'];
						},
						{ elementRef: this.elementRef() },
					);
				});
			}

			toggleState() {
				this.state.set(this.state() === 'red' ? 'blue' : 'red');
			}
		}

		const { getByTestId, fixture } = await render(TestComponent);
		const toggleButton = getByTestId('toggle-button');
		const testElement = fixture.componentInstance.elementRef().nativeElement;
		const user = userEvent.setup();

		// Initial state should have red classes
		expect(testElement.className).toBe('static-class bg-red-500 text-white');

		// Click to toggle state
		await user.click(toggleButton);

		// Should now have blue classes after change detection
		expect(testElement.className).toBe('static-class bg-blue-500 text-black');

		// Click again to toggle back
		await user.click(toggleButton);

		// Should be back to red classes
		expect(testElement.className).toBe('static-class bg-red-500 text-white');
	});

	it('should handle empty computed classes', async () => {
		await TestBed.configureTestingModule({}).compileComponents();

		const element = document.createElement('div');
		element.className = 'existing-class';

		const elementRef = new ElementRef(element);
		const computedClasses = () => [];

		TestBed.runInInjectionContext(() => {
			classes(computedClasses, { elementRef });
		});

		// Wait for afterRenderEffect to run
		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(element.className).toBe('existing-class');
	});

	it('should handle complex class types', async () => {
		await TestBed.configureTestingModule({}).compileComponents();

		const element = document.createElement('div');
		element.className = '';

		const elementRef = new ElementRef(element);
		const computedClasses = () => [
			'bg-red-500',
			{ 'text-white': true, hidden: false },
			['p-4', 'm-2'],
			null,
			undefined,
			'',
		];

		TestBed.runInInjectionContext(() => {
			classes(computedClasses, { elementRef });
		});

		// Wait for afterRenderEffect to run
		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(element.className).toBe('bg-red-500 text-white p-4 m-2');
	});

	it('should handle special character classes', async () => {
		await TestBed.configureTestingModule({}).compileComponents();

		const element = document.createElement('div');
		element.className = '';

		const elementRef = new ElementRef(element);
		const computedClasses = () => ['bg-red-500/50', '[&>*]:text-white', 'hover:bg-blue-500'];

		TestBed.runInInjectionContext(() => {
			classes(computedClasses, { elementRef });
		});

		// Wait for afterRenderEffect to run
		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(element.className).toBe('bg-red-500/50 [&>*]:text-white hover:bg-blue-500');
	});
});
