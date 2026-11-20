// Adapted from Sonner (https://github.com/emilkowalski/sonner), MIT License, Copyright (c) 2023 Emil Kowalski,
// via ngx-sonner (https://github.com/tutkli/ngx-sonner), MIT License, Copyright (c) 2024 Clara Castillo.
import { Pipe, PipeTransform } from '@angular/core';
import { Position, ToastT } from '../types';

@Pipe({ name: 'toastFilter' })
export class ToastFilterPipe implements PipeTransform {
	transform(toasts: ToastT[], index: number, position: Position): ToastT[] {
		return toasts.filter((toast) => (!toast.position && index === 0) || toast.position === position);
	}
}
