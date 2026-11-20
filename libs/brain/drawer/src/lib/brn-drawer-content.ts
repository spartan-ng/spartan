// Adapted from Base UI (https://github.com/mui/base-ui), MIT License, Copyright (c) 2019 Material-UI SAS.
import { Directive } from '@angular/core';

/**
 * The drawer content area. Pointer presses inside it don't start a swipe, so text can be
 * selected and controls used; touch swipes still work.
 */
@Directive({
	selector: '[brnDrawerContent],brn-drawer-content',
	exportAs: 'brnDrawerContent',
	host: { 'data-drawer-content': '' },
})
export class BrnDrawerContent {}
