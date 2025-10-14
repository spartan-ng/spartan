import { OverlayConfig } from '@angular/cdk/overlay';
import { ElementRef } from '@angular/core';

export type BrnNavigationMenuContentOptions = Partial<
	{
		attachTo: ElementRef;
	} & OverlayConfig
>;
