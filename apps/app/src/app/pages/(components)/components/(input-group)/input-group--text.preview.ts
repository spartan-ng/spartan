import { Component } from '@angular/core';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';

@Component({
	selector: 'spartan-input-group-text-preview',
	imports: [HlmInputGroupImports],
	host: {
		class: 'grid w-full max-w-sm gap-6',
	},
	template: `
		<div hlmInputGroup>
			<div hlmInputGroupAddon>
				<span hlmInputGroupText>$</span>
			</div>
			<input hlmInputGroupInput placeholder="0.00" />
			<div hlmInputGroupAddon align="inline-end">
				<span hlmInputGroupText>USD</span>
			</div>
		</div>
		<div hlmInputGroup>
			<div hlmInputGroupAddon>
				<span hlmInputGroupText>https://</span>
			</div>
			<input hlmInputGroupInput placeholder="example.com" class="!pl-0.5" />
			<div hlmInputGroupAddon align="inline-end">
				<span hlmInputGroupText>.com</span>
			</div>
		</div>
		<div hlmInputGroup>
			<input hlmInputGroupInput placeholder="Enter your username" />
			<div hlmInputGroupAddon align="inline-end">
				<span hlmInputGroupText>&#64;company.com</span>
			</div>
		</div>
		<div hlmInputGroup>
			<textarea hlmInputGroupTextarea placeholder="Enter your message"></textarea>
			<div hlmInputGroupAddon align="block-end">
				<span hlmInputGroupText class="text-muted-foreground text-xs">120 characters left</span>
			</div>
		</div>
	`,
})
export class InputGroupTextPreview {}
