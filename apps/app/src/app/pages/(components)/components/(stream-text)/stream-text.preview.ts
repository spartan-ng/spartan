import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
	lucideBot,
	lucideCheck,
	lucideCopy,
	lucidePlay,
	lucideRotateCw,
	lucideSparkles,
	lucideSquare,
} from '@ng-icons/lucide';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmStreamTextImports } from '@spartan-ng/helm/stream-text';

interface DemoPreset {
	label: string;
	prompt: string;
	response: string;
}

const DEMO_PRESETS: DemoPreset[] = [
	{
		label: 'TypeScript Example',
		prompt: 'Can you show me a typed greeting function in TypeScript?',
		response: `Here is a clean TypeScript example for a greeting helper:

\`\`\`typescript
export interface UserGreeting {
  name: string;
  role?: 'admin' | 'user' | 'agent';
}

export function createGreeting(user: UserGreeting): string {
  const prefix = user.role === 'agent' ? '🤖 Autonomous' : '👋 Welcome';
  return \`\${prefix}, \${user.name}!\`;
}
\`\`\`

You can call this function anywhere in your Angular components or services.`,
	},
	{
		label: 'Agent Task Plan',
		prompt: 'What are the execution steps for refactoring this database schema?',
		response: `### 📋 Planned Execution Steps:

1. **Schema Inspection**: Verify foreign keys and nullability constraints.
2. **Expand Phase**: Add new nullable \`tenant_id\` column and deploy.
3. **Dual-write**: Enable application layer dual-writing for new records.
4. **Backfill**: Migrate historical records in batches of 5,000 rows.
5. **Contract Phase**: Apply \`NOT NULL\` constraint and drop legacy column.

All steps are reversible and support zero-downtime rolling updates.`,
	},
];

@Component({
	selector: 'spartan-stream-text-preview',
	imports: [HlmStreamTextImports, HlmButtonImports, HlmBadge, NgIcon],
	providers: [
		provideIcons({
			lucidePlay,
			lucideSquare,
			lucideRotateCw,
			lucideSparkles,
			lucideBot,
			lucideCopy,
			lucideCheck,
		}),
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex w-full max-w-xl flex-col gap-4 py-4',
	},
	template: `
		<!-- Prompt Presets Selector -->
		<div class="flex flex-wrap items-center justify-between gap-2 px-1">
			<span class="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
				<ng-icon name="lucideSparkles" class="text-primary size-3.5" />
				Preset Prompts:
			</span>
			<div class="flex items-center gap-1.5">
				@for (preset of _presets; track preset.label; let i = $index) {
					<button
						hlmBtn
						[variant]="_selectedPresetIndex() === i ? 'secondary' : 'ghost'"
						size="sm"
						class="h-7 text-xs font-medium"
						[disabled]="_isStreaming()"
						(click)="_selectPreset(i)"
					>
						{{ preset.label }}
					</button>
				}
			</div>
		</div>

		<!-- Chat Turn Wrapper -->
		<div class="border-border/60 bg-muted/20 flex flex-col gap-4 rounded-2xl border p-4 shadow-2xs">
			<!-- User Prompt Message -->
			<div class="flex items-start justify-end gap-3">
				<div
					class="bg-primary text-primary-foreground max-w-[85%] rounded-2xl rounded-tr-xs px-4 py-2.5 text-sm shadow-xs"
				>
					{{ _activePreset().prompt }}
				</div>
				<div
					class="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
				>
					ME
				</div>
			</div>

			<!-- Assistant Response Turn -->
			<div class="flex items-start gap-3">
				<div
					class="border-border/60 bg-card text-primary flex size-8 shrink-0 items-center justify-center rounded-full border shadow-2xs"
				>
					<ng-icon name="lucideBot" class="size-4" />
				</div>

				<div class="flex flex-1 flex-col gap-2">
					<!-- Assistant Header & Action Toolbar -->
					<div class="flex flex-wrap items-center justify-between gap-2">
						<div class="flex items-center gap-2">
							<span class="text-sm font-semibold">Spartan Assistant</span>
							@if (_isStreaming()) {
								<span
									hlmBadge
									variant="outline"
									class="border-primary/30 bg-primary/5 text-primary h-5 animate-pulse gap-1 px-1.5 text-[10px] font-medium"
								>
									<span class="bg-primary size-1.5 animate-ping rounded-full"></span>
									Streaming...
								</span>
							} @else {
								<span hlmBadge variant="secondary" class="text-muted-foreground h-5 px-1.5 text-[10px] font-normal">
									Ready
								</span>
							}
						</div>

						<!-- Action Buttons -->
						<div class="flex items-center gap-1">
							@if (_isStreaming()) {
								<button
									hlmBtn
									variant="destructive"
									size="sm"
									class="h-7 px-2.5 text-xs font-medium"
									(click)="_stopStreaming()"
								>
									<ng-icon name="lucideSquare" class="mr-1 size-3" />
									Stop
								</button>
							} @else {
								<button
									hlmBtn
									variant="outline"
									size="sm"
									class="h-7 px-2.5 text-xs font-medium"
									(click)="_startStreaming()"
								>
									<ng-icon name="lucidePlay" class="text-primary mr-1 size-3" />
									Re-stream
								</button>
							}
							<button hlmBtn variant="ghost" size="icon-sm" class="size-7" aria-label="Reset text" (click)="_reset()">
								<ng-icon name="lucideRotateCw" class="size-3.5" />
							</button>
						</div>
					</div>

					<!-- Stream Text Bubble Container -->
					<div class="border-border/60 bg-card relative min-h-[9rem] rounded-2xl rounded-tl-xs border p-4 shadow-2xs">
						@if (_displayedText()) {
							<hlm-stream-text
								[content]="_displayedText()"
								[streaming]="_isStreaming()"
								class="text-sm leading-relaxed"
							/>
						} @else {
							<div class="text-muted-foreground flex h-32 items-center justify-center text-xs">
								Click "Re-stream" to observe real-time token rendering with animated pulse cursor.
							</div>
						}
					</div>

					<!-- Assistant Footer Info & Copy -->
					<div class="text-muted-foreground flex items-center justify-between px-1 text-xs">
						<span class="flex items-center gap-1 text-[11px]">
							<ng-icon name="lucideSparkles" class="text-primary size-3" />
							Automatic Markdown token balancing enabled
						</span>
						<button
							hlmBtn
							variant="ghost"
							size="icon-sm"
							class="text-muted-foreground hover:text-foreground size-6"
							aria-label="Copy response"
							(click)="_copy()"
						>
							<ng-icon [name]="_copied() ? 'lucideCheck' : 'lucideCopy'" class="size-3" />
						</button>
					</div>
				</div>
			</div>
		</div>
	`,
})
export class StreamTextPreview {
	protected readonly _presets = DEMO_PRESETS;
	protected readonly _selectedPresetIndex = signal<number>(0);
	protected readonly _activePreset = computed(() => this._presets[this._selectedPresetIndex()]);

	protected readonly _displayedText = signal<string>(DEMO_PRESETS[0].response);
	protected readonly _isStreaming = signal<boolean>(false);
	protected readonly _copied = signal<boolean>(false);

	private _timer: ReturnType<typeof setInterval> | null = null;

	protected _selectPreset(index: number): void {
		this._reset();
		this._selectedPresetIndex.set(index);
		this._displayedText.set(this._presets[index].response);
	}

	protected _startStreaming(): void {
		this._reset();
		this._isStreaming.set(true);

		const fullText = this._activePreset().response;
		let index = 0;
		const chunkSize = 3;

		this._timer = setInterval(() => {
			index += chunkSize;
			if (index >= fullText.length) {
				this._displayedText.set(fullText);
				this._isStreaming.set(false);
				if (this._timer) {
					clearInterval(this._timer);
					this._timer = null;
				}
			} else {
				this._displayedText.set(fullText.slice(0, index));
			}
		}, 30);
	}

	protected _stopStreaming(): void {
		if (this._timer) {
			clearInterval(this._timer);
			this._timer = null;
		}
		this._isStreaming.set(false);
	}

	protected _reset(): void {
		if (this._timer) {
			clearInterval(this._timer);
			this._timer = null;
		}
		this._isStreaming.set(false);
		this._displayedText.set('');
		this._copied.set(false);
	}

	protected _copy(): void {
		if (typeof navigator !== 'undefined' && navigator.clipboard) {
			navigator.clipboard.writeText(this._displayedText());
			this._copied.set(true);
			setTimeout(() => this._copied.set(false), 2000);
		}
	}
}

export const defaultImports = `
import { HlmStreamTextImports } from '@spartan-ng/helm/stream-text';
`;

export const defaultSkeleton = `
<hlm-stream-text
  [content]="responseContent()"
  [streaming]="isStreaming()"
/>
`;
