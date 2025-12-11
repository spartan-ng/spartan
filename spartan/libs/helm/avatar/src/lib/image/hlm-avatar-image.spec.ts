import { ChangeDetectionStrategy, Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { HlmAvatarImage } from './hlm-avatar-image';

@Component({
	selector: 'hlm-mock',
	imports: [HlmAvatarImage],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<img hlmAvatarImage alt="Avatar image" [class]="userCls" />
	`,
})
class HlmMock {
	public userCls = '';
}

describe('HlmAvatarImageDirective', () => {
	let component: HlmMock;
	let fixture: ComponentFixture<HlmMock>;

	beforeEach(() => {
		fixture = TestBed.createComponent(HlmMock);
		component = fixture.componentInstance;
	});

	it('should compile', () => {
		expect(component).toBeTruthy();
	});

	it('should add the default classes if no inputs are provided', () => {
		fixture.detectChanges();
		expect(fixture.nativeElement.querySelector('img').className).toBe('aspect-square size-full');
	});

	it('should add any user defined classes', async () => {
		component.userCls = 'test-class';
		fixture.detectChanges();

		// fallback uses Promise.resolve().then() so we need to wait for the next tick
		setTimeout(() => {
			expect(fixture.nativeElement.querySelector('img').className).toContain('test-class');
		});
	});
});
