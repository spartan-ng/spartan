import { type Primitive } from './primitives';

export interface HlmUIGeneratorSchema {
	name?: Primitive | 'all';
	directory?: string;
	rootProject?: boolean;
	tags?: string;
}
