export interface PropertyMetadata {
	name: string;
	type: string;
	description: string;
}
export interface ComponentMetadata {
	file: string;
	inputs: PropertyMetadata[];
	outputs: PropertyMetadata[];
	selector: string | null;
	exportAs: string | null;
}

export type PrimitveComponent = Record<string, ComponentMetadata>;

export type SubTypeRecord = 'brain' | 'helm';

// Represents the subtype (e.g., "brain", "helm") containing components/directives
export type PrimitiveSubTypes = Record<SubTypeRecord, PrimitveComponent>;

export type Primitives =
	| 'accordion'
	| 'alert'
	| 'alert-dialog'
	| 'aspect-ratio'
	| 'avatar'
	| 'badge'
	| 'breadcrumb'
	| 'button'
	| 'calendar'
	| 'card'
	| 'carousel'
	| 'checkbox'
	| 'collapsible'
	| 'combobox'
	| 'command'
	| 'context-menu'
	| 'data-table'
	| 'date-picker'
	| 'dialog'
	| 'dropdown-menu'
	| 'form-field'
	| 'hover-card'
	| 'icon'
	| 'input'
	| 'label'
	| 'menubar'
	| 'navigation-menu'
	| 'pagination'
	| 'popover'
	| 'progress'
	| 'radio-group'
	| 'scroll-area'
	| 'select'
	| 'separator'
	| 'sheet'
	| 'skeleton'
	| 'slider'
	| 'sonner'
	| 'spinner'
	| 'switch'
	| 'table'
	| 'tabs'
	| 'textarea'
	| 'toast'
	| 'toggle'
	| 'tooltip'
	| 'typography';

// The root structure containing all components and subtypes
export type ComponentApiData = Record<Primitives, PrimitiveSubTypes>;
