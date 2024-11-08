import { Component } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import { HlmButtonDirective, buttonVariants } from './hlm-button.directive';

// Create a mock component to use the directive in the test
@Component({
	template: `<button hlmBtn [variant]="variant" [size]="size" [class]="userClass">Test Button</button>`,
})
class TestComponent {
	variant = 'default';
	size = 'default';
	userClass = '';
}

describe('HlmButtonDirective', () => {
	it('should apply the default variant and size classes by default', async () => {
		await render(TestComponent, {
			imports: [HlmButtonDirective],
		});

		const button = screen.getByText('Test Button');
		const expectedClass = buttonVariants({ variant: 'default', size: 'default' });
		shouldHaveClasses(button, expectedClass);
	});

	it('should apply the "destructive" variant and "lg" size classes when inputs are set', async () => {
		await render(TestComponent, {
			componentProperties: { variant: 'destructive', size: 'lg' },
			imports: [HlmButtonDirective],
		});

		const button = screen.getByText('Test Button');
		const expectedClass = buttonVariants({ variant: 'destructive', size: 'lg' });
		shouldHaveClasses(button, expectedClass);
	});

	it('should apply user-defined class along with variant and size classes', async () => {
		await render(TestComponent, {
			componentProperties: { userClass: 'custom-class' },
			imports: [HlmButtonDirective],
		});

		const button = screen.getByText('Test Button');
		const expectedClass = buttonVariants({ variant: 'default', size: 'default' });
		shouldHaveClasses(button, expectedClass);
		expect(button.className).toContain('custom-class');
	});

	it('should update classes when variant or size inputs change', async () => {
		const { fixture } = await render(TestComponent, {
			componentProperties: { variant: 'outline', size: 'sm' },
			imports: [HlmButtonDirective],
		});

		const button = screen.getByText('Test Button');
		shouldHaveClasses(button, buttonVariants({ variant: 'outline', size: 'sm' }));

		// Update variant and size
		fixture.componentInstance.variant = 'ghost';
		fixture.componentInstance.size = 'icon';
		fixture.detectChanges();

		shouldHaveClasses(button, buttonVariants({ variant: 'ghost', size: 'icon' }));
	});
});

function shouldHaveClasses(element: Element, className: string) {
	const classes = className.split(' ');

	for (const cls of classes) {
		expect(element.classList).toContain(cls);
	}
}
