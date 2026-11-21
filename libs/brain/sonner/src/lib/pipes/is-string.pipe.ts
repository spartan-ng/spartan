// Adapted from Sonner (https://github.com/emilkowalski/sonner), MIT License, Copyright (c) 2023 Emil Kowalski,
// via ngx-sonner (https://github.com/tutkli/ngx-sonner), MIT License, Copyright (c) 2024 Clara Castillo.
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'isString' })
export class IsStringPipe implements PipeTransform {
	transform(value: unknown): boolean {
		return typeof value === 'string';
	}
}
