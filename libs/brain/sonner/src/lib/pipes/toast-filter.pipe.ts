import { Pipe, PipeTransform } from '@angular/core';
import { Position, ToastT } from '../types';

@Pipe({ name: 'toastFilter' })
export class ToastFilterPipe implements PipeTransform {
	transform(toasts: ToastT[], index: number, position: Position): ToastT[] {
		return toasts.filter((toast) => (!toast.position && index === 0) || toast.position === position);
	}
}
