import {
	ApplicationRef,
	ChangeDetectionStrategy,
	Component,
	Directive,
	ElementRef,
	inject,
	input,
	signal,
	type Type,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { classes } from './hlm';

@Directive({ selector: '[hlmLine]' })
class LineDirective {
	public readonly line = input<'solid' | 'dotted'>('solid');

	constructor() {
		classes(() => (this.line() === 'solid' ? 'border-solid' : 'border-dotted'));
	}
}

async function setup<T>(component: Type<T>) {
	const fixture = TestBed.createComponent(component);
	fixture.autoDetectChanges();
	await settle();
	return { component: fixture.componentInstance, element: fixture.nativeElement.querySelector('span') as HTMLElement };
}

// lets effects, change detection and the MutationObserver run
async function settle() {
	await TestBed.inject(ApplicationRef).whenStable();
	await new Promise((resolve) => setTimeout(resolve, 0));
}

const classList = (element: HTMLElement) => element.className.split(' ').filter(Boolean).sort();

describe('classes() with external class bindings', () => {
	it('keeps a [class] change made in the same tick as a source change', async () => {
		@Component({
			imports: [LineDirective],
			changeDetection: ChangeDetectionStrategy.OnPush,
			template: `
				<span hlmLine [line]="line()" [class]="color()"></span>
			`,
		})
		class Host {
			public readonly line = signal<'solid' | 'dotted'>('solid');
			public readonly color = signal('text-red-500');
		}

		const { component, element } = await setup(Host);
		component.line.set('dotted');
		component.color.set('text-blue-500');
		await settle();

		expect(classList(element)).toEqual(['border-dotted', 'text-blue-500']);
	});

	it('lets a conflicting [class.x] binding override a static class while it is on', async () => {
		@Component({
			imports: [LineDirective],
			changeDetection: ChangeDetectionStrategy.OnPush,
			template: `
				<span hlmLine class="bg-red-500" [class.bg-blue-500]="active()"></span>
			`,
		})
		class Host {
			public readonly active = signal(false);
		}

		const { component, element } = await setup(Host);
		component.active.set(true);
		await settle();

		expect(classList(element)).toEqual(['bg-blue-500', 'border-solid']);
	});

	it('restores a static class once a conflicting [class.x] binding turns off', async () => {
		@Component({
			imports: [LineDirective],
			changeDetection: ChangeDetectionStrategy.OnPush,
			template: `
				<span hlmLine class="bg-red-500" [class.bg-blue-500]="active()"></span>
			`,
		})
		class Host {
			public readonly active = signal(true);
		}

		const { component, element } = await setup(Host);
		expect(classList(element)).toEqual(['bg-blue-500', 'border-solid']);

		component.active.set(false);
		await settle();
		expect(classList(element)).toEqual(['bg-red-500', 'border-solid']);

		component.active.set(true);
		await settle();
		expect(classList(element)).toEqual(['bg-blue-500', 'border-solid']);
	});

	it('restores a class from an object binding once a conflicting entry turns off', async () => {
		@Component({
			imports: [LineDirective],
			changeDetection: ChangeDetectionStrategy.OnPush,
			template: `
				<span hlmLine [class]="{ 'p-2': true, 'p-4': big() }"></span>
			`,
		})
		class Host {
			public readonly big = signal(true);
		}

		const { component, element } = await setup(Host);
		expect(classList(element)).toEqual(['border-solid', 'p-4']);

		component.big.set(false);
		await settle();

		expect(classList(element)).toEqual(['border-solid', 'p-2']);
	});

	it('restores a static class when the binding and a source change in the same tick', async () => {
		@Component({
			imports: [LineDirective],
			changeDetection: ChangeDetectionStrategy.OnPush,
			template: `
				<span hlmLine class="p-2" [line]="line()" [class.p-4]="big()"></span>
			`,
		})
		class Host {
			public readonly line = signal<'solid' | 'dotted'>('solid');
			public readonly big = signal(true);
		}

		const { component, element } = await setup(Host);
		component.line.set('dotted');
		component.big.set(false);
		await settle();

		expect(classList(element)).toEqual(['border-dotted', 'p-2']);
	});

	it('restores the native classList methods once the last source is destroyed', async () => {
		@Component({
			imports: [LineDirective],
			changeDetection: ChangeDetectionStrategy.OnPush,
			template: `
				@if (show()) {
					<span hlmLine></span>
				}
				<i></i>
			`,
		})
		class Host {
			public readonly show = signal(true);
		}

		const fixture = TestBed.createComponent(Host);
		fixture.autoDetectChanges();
		await settle();
		const element = fixture.nativeElement.querySelector('span') as HTMLElement;
		expect(Object.hasOwn(element.classList, 'add')).toBe(true);

		fixture.componentInstance.show.set(false);
		await settle();

		expect(Object.hasOwn(element.classList, 'add')).toBe(false);
		expect(element.classList.add).toBe(DOMTokenList.prototype.add);
	});

	it('drops conflicting classes of a [class] string once the binding clears', async () => {
		@Component({
			imports: [LineDirective],
			changeDetection: ChangeDetectionStrategy.OnPush,
			template: `
				<span hlmLine [class]="padding()"></span>
			`,
		})
		class Host {
			public readonly padding = signal('p-2 p-4');
		}

		const { component, element } = await setup(Host);
		component.padding.set('');
		await settle();

		expect(classList(element)).toEqual(['border-solid']);
	});

	it('drops conflicting static classes once className is replaced', async () => {
		@Component({
			imports: [LineDirective],
			changeDetection: ChangeDetectionStrategy.OnPush,
			template: `
				<span hlmLine class="p-2 p-4"></span>
			`,
		})
		class Host {}

		const { element } = await setup(Host);
		element.className = 'm-2';
		await settle();

		expect(classList(element)).toEqual(['border-solid', 'm-2']);
	});

	it('keeps an external class added before the first source update', async () => {
		const element = document.createElement('span');
		document.body.appendChild(element);

		TestBed.runInInjectionContext(() => {
			classes(() => 'border-solid', { elementRef: { nativeElement: element } });
		});
		element.classList.add('text-red-500');
		await new Promise((resolve) => setTimeout(resolve, 0));
		TestBed.tick();

		expect(classList(element)).toEqual(['border-solid', 'text-red-500']);
		element.remove();
	});

	it('drops a static class that was replaced before the first source update', async () => {
		@Directive({ selector: '[hlmReplaceClasses]' })
		class ReplaceClassesDirective {
			constructor() {
				classes(() => 'border-solid');
				inject<ElementRef<HTMLElement>>(ElementRef).nativeElement.className = 'm-2';
			}
		}

		@Component({
			imports: [ReplaceClassesDirective],
			changeDetection: ChangeDetectionStrategy.OnPush,
			template: `
				<span hlmReplaceClasses class="p-2"></span>
			`,
		})
		class Host {}

		const { element } = await setup(Host);

		expect(classList(element)).toEqual(['border-solid', 'm-2']);
	});

	it('tracks classList when its methods are read-only on the prototype, like Domino during SSR', async () => {
		const methods = ['add', 'remove', 'toggle', 'replace'] as const;
		const originals = methods.map((method) => Object.getOwnPropertyDescriptor(DOMTokenList.prototype, method)!);
		for (const [i, method] of methods.entries()) {
			Object.defineProperty(DOMTokenList.prototype, method, { ...originals[i], writable: false });
		}

		try {
			@Component({
				imports: [LineDirective],
				changeDetection: ChangeDetectionStrategy.OnPush,
				template: `
					<span hlmLine class="bg-red-500" [class.bg-blue-500]="active()"></span>
				`,
			})
			class Host {
				public readonly active = signal(true);
			}

			const { component, element } = await setup(Host);
			component.active.set(false);
			await settle();

			expect(classList(element)).toEqual(['bg-red-500', 'border-solid']);
		} finally {
			for (const [i, method] of methods.entries()) {
				Object.defineProperty(DOMTokenList.prototype, method, originals[i]);
			}
		}
	});
});
