import { ChangeDetectionStrategy, Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrnAvatar } from './brn-avatar';
import { BrnAvatarFallback } from './fallback/brn-avatar-fallback';
import { BrnAvatarImage } from './image/brn-avatar-image';

@Component({
	selector: 'brn-mock',
	imports: [BrnAvatarImage, BrnAvatarFallback, BrnAvatar],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<brn-avatar id="empty">
			<p>empty</p>
		</brn-avatar>
		<brn-avatar id="fallbackOnly">
			<span brnAvatarFallback>fallback</span>
		</brn-avatar>
		<brn-avatar id="noSrc">
			<img brnAvatarImage alt="Avatar image" />
			<span brnAvatarFallback>fallback</span>
		</brn-avatar>
		<brn-avatar id="good">
			<img
				brnAvatarImage
				alt="Avatar image"
				src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII="
			/>
			<span brnAvatarFallback>fallback</span>
		</brn-avatar>
	`,
})
class Mock {}

describe('BrnAvatarComponent', () => {
	let component: Mock;
	let fixture: ComponentFixture<Mock>;

	beforeEach(() => {
		fixture = TestBed.createComponent(Mock);
		component = fixture.componentInstance;
		fixture.autoDetectChanges();
	});
	it('should compile', () => {
		expect(component).toBeTruthy();
	});

	it('should render the fallback when no image is provided', () => {
		const fallback = fixture.nativeElement.querySelector('#fallbackOnly span');
		expect(fallback.textContent).toEqual('fallback');
	});

	it('should not render anything when no image or fallback is provided', () => {
		const empty = fixture.nativeElement.querySelector('#empty p');
		expect(empty).toBeFalsy();
	});

	it('should render the fallback when provided and image with no src', () => {
		const fallback = fixture.nativeElement.querySelector('#noSrc span');
		expect(fallback.textContent).toEqual('fallback');
	});

	it('should not render the fallback, but rather the image when provided with a valid src', () => {
		// delay test to allow for image to resolve
		setTimeout(() => {
			const img = fixture.debugElement.query(By.css('#good img'));
			expect(img).toBeTruthy();
			const fallback = fixture.nativeElement.querySelector('#good span');
			expect(fallback).toBeFalsy();
		});
	});
});
