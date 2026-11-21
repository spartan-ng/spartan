// Adapted from Sonner (https://github.com/emilkowalski/sonner), MIT License, Copyright (c) 2023 Emil Kowalski,
// via ngx-sonner (https://github.com/tutkli/ngx-sonner), MIT License, Copyright (c) 2024 Clara Castillo.
import { Pipe, PipeTransform, Type } from '@angular/core';

@Pipe({ name: 'asComponent' })
export class AsComponentPipe implements PipeTransform {
	transform(value: unknown): Type<unknown> {
		return value as Type<unknown>;
	}
}
