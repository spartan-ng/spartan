import { ChangeDetectionStrategy, Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { HlmAvatarImageDirective } from './hlm-avatar-image.directive';

@Component({
	selector: 'hlm-mock',
	imports: [HlmAvatarImageDirective],
	template: `
		<img hlmAvatarImage alt="Avatar image" [class]="userCls" />
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
class HlmMockComponent {
	public userCls = '';
}

describe('HlmAvatarImageDirective', () => {
	let component: HlmMockComponent;
	let fixture: ComponentFixture<HlmMockComponent>;

	beforeEach(() => {
		fixture = TestBed.createComponent(HlmMockComponent);
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
