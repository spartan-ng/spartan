import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { BrnAvatarFallback } from '@spartan-ng/brain/avatar';
import { HlmAvatar } from './hlm-avatar';
import { HlmAvatarImage } from './hlm-avatar-image';

const IMAGE =
	'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=';

@Component({
	selector: 'hlm-mock',
	imports: [BrnAvatarFallback, HlmAvatar, HlmAvatarImage],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-avatar [class]="class()" id="fallbackOnly">
			<span brnAvatarFallback>fallback</span>
		</hlm-avatar>
		<hlm-avatar size="lg" id="sized">
			<span brnAvatarFallback>fallback</span>
		</hlm-avatar>
		<hlm-avatar id="withImage">
			<img hlmAvatarImage [src]="_image" alt="Avatar image" />
			<span brnAvatarFallback>fallback</span>
		</hlm-avatar>
	`,
})
class Mock {
	public readonly class = input<string>();
	protected readonly _image = IMAGE;
}

describe('HlmAvatarDirective', () => {
	let component: Mock;
	let fixture: ComponentFixture<Mock>;

	beforeEach(() => {
		fixture = TestBed.createComponent(Mock);
		component = fixture.componentInstance;
	});

	it('should compile', () => {
		expect(component).toBeTruthy();
	});

	it('should add the default classes if no inputs are provided', () => {
		fixture.detectChanges();
		expect(fixture.nativeElement.querySelector('#fallbackOnly').className).toBe(
			'spartan-avatar group/avatar after:border-border relative flex shrink-0 select-none after:absolute after:inset-0 after:border after:mix-blend-darken dark:after:mix-blend-lighten',
		);
	});

	it('should not set a display style on the host so caller classes can control visibility', () => {
		fixture.componentRef.setInput('class', 'hidden sm:flex');
		fixture.detectChanges();
		const avatar = fixture.nativeElement.querySelector('#fallbackOnly');
		expect(avatar.className).toContain('hidden');
		expect(avatar.className).toContain('sm:flex');
		expect(avatar.style.position).toEqual('relative');
		expect(avatar.style.display).toEqual('');
	});

	it('should add any user defined classes', () => {
		fixture.componentRef.setInput('class', 'test-class');
		fixture.detectChanges();
		const avatar = fixture.nativeElement.querySelector('#fallbackOnly');
		expect(avatar.className).toContain('test-class');
	});

	it('should support the size input', () => {
		fixture.detectChanges();
		expect(fixture.nativeElement.querySelector('#sized').getAttribute('data-size')).toBe('lg');
	});

	it('should support brn directives', () => {
		fixture.detectChanges();
		expect(fixture.nativeElement.querySelector('span').textContent).toBe('fallback');
	});

	it('should hide the fallback when the image loads', async () => {
		fixture.detectChanges();
		const avatar = fixture.nativeElement.querySelector('#withImage');

		await vi.waitFor(() => {
			fixture.detectChanges();
			expect(avatar.getAttribute('data-status')).toBe('loaded');
			expect(getComputedStyle(avatar.querySelector('span')).visibility).toBe('hidden');
		});
	});
});
