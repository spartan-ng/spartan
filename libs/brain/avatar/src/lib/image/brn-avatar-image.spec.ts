import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { BrnAvatar } from '../brn-avatar';
import { BrnAvatarImage } from './brn-avatar-image';

const IMAGE =
	'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=';

@Component({
	selector: 'brn-mock',
	imports: [BrnAvatar, BrnAvatarImage],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<brn-avatar id="bad">
			<img brnAvatarImage #bad="brnAvatarImage" alt="Avatar image" />
			<span>{{ bad.canShow() }}</span>
		</brn-avatar>
		<brn-avatar id="loaded">
			<img [src]="_image" brnAvatarImage alt="Avatar image" #loaded="brnAvatarImage" />
			<span>{{ loaded.canShow() }}</span>
		</brn-avatar>
		<brn-avatar id="unloaded">
			<img [src]="laterSrc()" brnAvatarImage alt="Avatar image" #unloaded="brnAvatarImage" />
			<span>{{ unloaded.canShow() }}</span>
		</brn-avatar>
	`,
})
class BrnMock {
	protected readonly _image = IMAGE;
	public readonly laterSrc = signal('');
}

describe('BrnAvatarImageDirective', () => {
	let component: BrnMock;
	let fixture: ComponentFixture<BrnMock>;

	beforeEach(() => {
		fixture = TestBed.createComponent(BrnMock);
		component = fixture.componentInstance;
	});

	it('should compile', () => {
		expect(component).toBeTruthy();
	});

	it('should return false when image has no src', () => {
		fixture.detectChanges();
		const bad = fixture.nativeElement.querySelector('#bad');
		expect(bad.querySelector('span').textContent).toEqual('false');
		expect(getComputedStyle(bad.querySelector('img')).visibility).toEqual('hidden');
	});

	it('should return false while the image is waiting for a src', () => {
		fixture.detectChanges();
		const unloaded = fixture.nativeElement.querySelector('#unloaded');
		expect(unloaded.querySelector('span').textContent).toEqual('false');
	});

	it('should return true when the image is loaded without error', async () => {
		fixture.detectChanges();
		await vi.waitFor(() => {
			fixture.detectChanges();
			const loaded = fixture.nativeElement.querySelector('#loaded');
			expect(loaded.querySelector('span').textContent).toEqual('true');
			expect(getComputedStyle(loaded.querySelector('img')).visibility).not.toEqual('hidden');
		});
	});

	it('should return true when a src is added after creation', async () => {
		fixture.detectChanges();
		const unloaded = fixture.nativeElement.querySelector('#unloaded');
		expect(unloaded.querySelector('span').textContent).toEqual('false');

		// The directive instance is not recreated when src changes later.
		component.laterSrc.set(IMAGE);
		await vi.waitFor(() => {
			fixture.detectChanges();
			expect(unloaded.querySelector('span').textContent).toEqual('true');
		});
	});
});
