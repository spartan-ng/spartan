import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { BrnAvatarFallbackDirective, BrnAvatarImageDirective } from '@spartan-ng/brain/avatar';
import { HlmAvatarComponent } from './hlm-avatar.component';

@Component({
	selector: 'hlm-mock',
	imports: [BrnAvatarImageDirective, BrnAvatarFallbackDirective, HlmAvatarComponent],
	template: `
		<hlm-avatar [class]="class" id="fallbackOnly">
			<span brnAvatarFallback>fallback</span>
		</hlm-avatar>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
class MockComponent {
	@Input() public class = '';
}

describe('HlmAvatarComponent', () => {
	let component: HlmAvatarComponent;
	let fixture: ComponentFixture<HlmAvatarComponent>;

	beforeEach(() => {
		fixture = TestBed.createComponent(HlmAvatarComponent);
		component = fixture.componentInstance;
	});

	it('should compile', () => {
		expect(component).toBeTruthy();
	});

	it('should add the default classes if no inputs are provided', () => {
		fixture.detectChanges();
		expect(fixture.nativeElement.className).toBe('flex overflow-hidden relative rounded-full shrink-0 size-8');
	});

	it('should add any user defined classes', () => {
		const mockFixture = TestBed.createComponent(MockComponent);
		mockFixture.componentRef.setInput('class', 'test-class');
		mockFixture.detectChanges();
		const avatar = mockFixture.nativeElement.querySelector('hlm-avatar');
		expect(avatar.className).toContain('test-class');
	});

	it('should support brn directives', () => {
		const mockFixture = TestBed.createComponent(MockComponent);
		mockFixture.detectChanges();
		expect(mockFixture.nativeElement.querySelector('span').textContent).toBe('fallback');
	});
});
