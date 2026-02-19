import type { FocusMonitor } from '@angular/cdk/a11y';
import type { ElementRef, viewChild } from '@angular/core';

export interface FocusElementOptions {
	readonly focusMonitor: FocusMonitor;
	readonly monitoredInput: ReturnType<typeof viewChild.required<ElementRef<HTMLElement>>>;
}
