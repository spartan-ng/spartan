import { ToastClassnames } from '../types';

// Visible toasts amount
export const VISIBLE_TOASTS_AMOUNT = 3;

// Viewport padding
export const VIEWPORT_OFFSET = '32px';

// Default lifetime of a toasts (in ms)
export const TOAST_LIFETIME = 4000;

// Default toast width
export const TOAST_WIDTH = 356;

// Default gap between toasts
export const GAP = 14;

// Threshold to dismiss a toast
export const SWIPE_THRESHOLD = 20;

// Equal to exit animation duration
export const TIME_BEFORE_UNMOUNT = 200;

export const defaultClasses: ToastClassnames = {
	toast: '',
	title: '',
	description: '',
	loader: '',
	closeButton: '',
	cancelButton: '',
	actionButton: '',
	action: '',
	warning: '',
	error: '',
	success: '',
	default: '',
	info: '',
	loading: '',
};
