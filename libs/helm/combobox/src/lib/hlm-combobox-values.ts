import { Directive } from '@angular/core';
import { BrnComboboxValues } from '@spartan-ng/brain/combobox';

@Directive({ selector: '[hlmComboboxValues]', exportAs: 'hlmComboboxValues', hostDirectives: [BrnComboboxValues] })
export class HlmComboboxValues {}
