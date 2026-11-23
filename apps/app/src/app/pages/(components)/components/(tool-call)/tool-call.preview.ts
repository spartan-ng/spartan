import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
	lucideBot,
	lucideCheck,
	lucideChevronDown,
	lucideChevronRight,
	lucideClock,
	lucideCopy,
	lucideDatabase,
	lucideRotateCw,
	lucideShieldAlert,
	lucideSparkles,
	lucideTerminal,
	lucideX,
} from '@ng-icons/lucide';
import { type ToolCallState } from '@spartan-ng/brain/tool-call';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCodeBlockImports } from '@spartan-ng/helm/code-block';
import { HlmToolCallImports } from '@spartan-ng/helm/tool-call';

interface ToolScenario {
	label: string;
	name: string;
	initialState: ToolCallState;
	duration?: string;
	description: string;
	args: Record<string, unknown>;
	result?: unknown;
	error?: string;
}

const TOOL_SCENARIOS: ToolScenario[] = [
	{
		label: 'Query Result',
		name: 'query_users_by_role',
		initialState: 'result',
		duration: '38ms',
		description: 'Read-only database query returning matching admin accounts.',
		args: { role: 'admin', limit: 5, includeProfiles: true },
		result: [
			{ id: 'usr_01', name: 'Alice Chen', role: 'admin', active: true },
			{ id: 'usr_02', name: 'Bob Smith', role: 'admin', active: false },
		],
	},
	{
		label: 'HITL Approval',
		name: 'delete_database_records',
		initialState: 'requires-approval',
		duration: 'Pending decision',
		description: 'Destructive action: delete 1,420 inactive user records from archive table.',
		args: { table: 'users_archive', criteria: 'inactive_gt_365d', dry_run: false },
		result: { deleted: 1420, table: 'users_archive', status: 'success' },
		error: 'Execution cancelled by user approval policy.',
	},
	{
		label: 'Executing State',
		name: 'generate_vector_embeddings',
		initialState: 'executing',
		duration: 'In progress...',
		description: 'Computing dense vector embeddings for 450 documentation chunks.',
		args: { model: 'text-embedding-3-small', chunks: 450, dimensions: 1536 },
	},
	{
		label: 'Error State',
		name: 'dispatch_external_webhook',
		initialState: 'error',
		duration: '5002ms',
		description: 'Failed API dispatch due to remote gateway connection timeout.',
		args: { endpoint: 'https://api.partner.corp/v1/sync', retryCount: 3 },
		error: 'Gateway Timeout (504): Remote endpoint did not acknowledge webhook within 5000ms.',
	},
];

@Component({
	selector: 'spartan-tool-call-preview',
	imports: [HlmToolCallImports, HlmButtonImports, HlmBadge, HlmCodeBlockImports, NgIcon, JsonPipe],
	providers: [
		provideIcons({
			lucideDatabase,
			lucideChevronDown,
			lucideChevronRight,
			lucideShieldAlert,
			lucideCheck,
			lucideX,
			lucideRotateCw,
			lucideBot,
			lucideSparkles,
			lucideTerminal,
			lucideClock,
			lucideCopy,
		}),
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex w-full max-w-xl flex-col gap-4 py-4',
	},
	template: `
		<!-- State Presets Selector -->
		<div class="flex flex-wrap items-center justify-between gap-2 px-1">
			<span class="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
				<ng-icon name="lucideTerminal" class="text-primary size-3.5" />
				Simulate Lifecycle State:
			</span>
			<div class="flex flex-wrap items-center gap-1.5">
				@for (scenario of _scenarios; track scenario.label; let i = $index) {
					<button
						hlmBtn
						[variant]="_activeScenarioIndex() === i ? 'secondary' : 'ghost'"
						size="sm"
						class="h-7 text-xs font-medium"
						(click)="_selectScenario(i)"
					>
						{{ scenario.label }}
					</button>
				}
			</div>
		</div>

		<!-- Conversational Agent Container -->
		<div class="border-border/60 bg-muted/20 flex flex-col gap-4 rounded-2xl border p-4 shadow-2xs">
			<!-- User Prompt Message -->
			<div class="flex items-start justify-end gap-3">
				<div
					class="bg-primary text-primary-foreground max-w-[85%] rounded-2xl rounded-tr-xs px-4 py-2.5 text-sm shadow-xs"
				>
					Run system inspection and manage user account records in our Postgres database.
				</div>
				<div
					class="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
				>
					ME
				</div>
			</div>

			<!-- Agent Turn -->
			<div class="flex items-start gap-3">
				<div
					class="border-border/60 bg-card text-primary flex size-8 shrink-0 items-center justify-center rounded-full border shadow-2xs"
				>
					<ng-icon name="lucideBot" class="size-4" />
				</div>

				<div class="flex flex-1 flex-col gap-3">
					<!-- Turn Subtitle & Reasoning -->
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-2">
							<span class="text-sm font-semibold">Spartan Agent</span>
							<span class="text-muted-foreground text-xs font-normal">Autonomous Execution</span>
						</div>
						<button
							hlmBtn
							variant="ghost"
							size="icon-sm"
							class="text-muted-foreground hover:text-foreground size-6"
							aria-label="Reset tool scenario"
							(click)="_resetCurrentScenario()"
						>
							<ng-icon name="lucideRotateCw" class="size-3" />
						</button>
					</div>

					<!-- Spartan Tool Call Primitive -->
					<div
						hlmToolCall
						[name]="_current().name"
						[state]="_liveState()"
						[expanded]="_isExpanded()"
						(approved)="_onApprove()"
						(rejected)="_onReject()"
						(retried)="_onRetry()"
						class="w-full"
					>
						<!-- Header -->
						<div hlmToolCallHeader>
							<div class="flex items-center gap-2">
								@if (_liveState() === 'requires-approval') {
									<ng-icon name="lucideShieldAlert" class="size-4 text-amber-500" />
								} @else if (_liveState() === 'executing') {
									<ng-icon name="lucideRotateCw" class="text-primary size-4 animate-spin" />
								} @else {
									<ng-icon name="lucideDatabase" class="text-primary size-4" />
								}
								<span class="font-mono text-xs font-semibold sm:text-sm">{{ _current().name }}</span>

								<!-- Status Badge -->
								@switch (_liveState()) {
									@case ('result') {
										<span hlmBadge variant="default" class="h-5 px-1.5 text-[10px] font-medium">
											<ng-icon name="lucideCheck" class="mr-1 size-3" />
											Completed
										</span>
									}
									@case ('requires-approval') {
										<span
											hlmBadge
											variant="outline"
											class="h-5 border-amber-500/50 bg-amber-500/10 px-1.5 text-[10px] font-medium text-amber-600 dark:text-amber-400"
										>
											Requires Approval
										</span>
									}
									@case ('executing') {
										<span
											hlmBadge
											variant="outline"
											class="border-primary/50 bg-primary/5 text-primary h-5 animate-pulse px-1.5 text-[10px] font-medium"
										>
											Executing
										</span>
									}
									@case ('error') {
										<span hlmBadge variant="destructive" class="h-5 px-1.5 text-[10px] font-medium">
											<ng-icon name="lucideX" class="mr-1 size-3" />
											Failed
										</span>
									}
									@default {
										<span hlmBadge variant="secondary" class="h-5 px-1.5 text-[10px] font-normal">Pending</span>
									}
								}
							</div>

							<!-- Right controls: duration & trigger -->
							<div class="flex items-center gap-2">
								@if (_current().duration) {
									<span class="text-muted-foreground hidden items-center gap-1 text-[11px] sm:inline-flex">
										<ng-icon name="lucideClock" class="size-3" />
										{{ _current().duration }}
									</span>
								}
								<button hlmToolCallTrigger (click)="_toggleExpanded()">
									@if (_isExpanded()) {
										<ng-icon name="lucideChevronDown" />
									} @else {
										<ng-icon name="lucideChevronRight" />
									}
									<span>{{ _isExpanded() ? 'Hide' : 'Details' }}</span>
								</button>
							</div>
						</div>

						<!-- Tool Description / Rationale -->
						<div class="text-muted-foreground border-border/50 border-b p-3 text-xs leading-relaxed">
							{{ _current().description }}
						</div>

						<!-- Parameters (Collapsible with _isExpanded) -->
						@if (_isExpanded()) {
							<div hlmToolCallArgs>
								<div class="text-muted-foreground mb-1.5 flex items-center justify-between text-[11px] font-medium">
									<span>Input Arguments:</span>
									<span class="font-mono text-[10px]">JSON</span>
								</div>
								<div class="bg-muted/50 rounded-lg p-2.5 font-mono text-xs">
									{{ _current().args | json }}
								</div>
							</div>
						}

						<!-- Return Result State -->
						@if (_liveState() === 'result' && _current().result) {
							<div hlmToolCallResult>
								<div class="text-muted-foreground mb-1.5 flex items-center justify-between text-[11px] font-medium">
									<span>Execution Return Value:</span>
									<span class="font-mono text-[10px]">Output</span>
								</div>
								<hlm-code-block size="sm" class="rounded-lg">
									<pre hlmCodeBlockContent [code]="_formattedResult()"></pre>
								</hlm-code-block>
							</div>
						}

						<!-- Error Output State -->
						@if (_liveState() === 'error' && _current().error) {
							<div class="border-destructive/30 bg-destructive/5 text-destructive border-t p-3 text-xs">
								<div class="mb-1 flex items-center gap-1 font-semibold">
									<ng-icon name="lucideX" class="size-3.5" />
									Execution Error:
								</div>
								<p class="font-mono text-xs opacity-90">{{ _current().error }}</p>
							</div>
						}

						<!-- Human In The Loop Actions -->
						@if (_liveState() === 'requires-approval') {
							<div hlmToolCallActions>
								<button hlmBtn hlmToolCallReject variant="outline" size="sm" class="h-8 text-xs font-medium">
									<ng-icon name="lucideX" class="text-muted-foreground mr-1.5 size-3.5" />
									Reject Action
								</button>
								<button hlmBtn hlmToolCallApprove variant="default" size="sm" class="h-8 text-xs font-medium">
									<ng-icon name="lucideCheck" class="mr-1.5 size-3.5" />
									Approve Execution
								</button>
							</div>
						}
					</div>

					<!-- Bottom Footnote -->
					<div class="text-muted-foreground flex items-center justify-between px-1 text-[11px]">
						<span class="flex items-center gap-1">
							<ng-icon name="lucideSparkles" class="text-primary size-3" />
							Supports approval lifecycle, argument serialization & retry events
						</span>
					</div>
				</div>
			</div>
		</div>
	`,
})
export class ToolCallPreview {
	protected readonly _scenarios = TOOL_SCENARIOS;
	protected readonly _activeScenarioIndex = signal<number>(0);
	protected readonly _current = computed(() => this._scenarios[this._activeScenarioIndex()]);

	protected readonly _liveState = signal<ToolCallState>(TOOL_SCENARIOS[0].initialState);
	protected readonly _isExpanded = signal<boolean>(true);

	protected readonly _formattedResult = computed(() => {
		const res = this._current().result;
		return res ? JSON.stringify(res, null, 2) : '';
	});

	protected _selectScenario(index: number): void {
		this._activeScenarioIndex.set(index);
		this._liveState.set(this._scenarios[index].initialState);
		this._isExpanded.set(true);
	}

	protected _resetCurrentScenario(): void {
		this._liveState.set(this._current().initialState);
	}

	protected _toggleExpanded(): void {
		this._isExpanded.update((v) => !v);
	}

	protected _onApprove(): void {
		this._liveState.set('result');
	}

	protected _onReject(): void {
		this._liveState.set('error');
	}

	protected _onRetry(): void {
		this._liveState.set('executing');
		setTimeout(() => {
			this._liveState.set('result');
		}, 1200);
	}
}

export const defaultImports = `
import { HlmToolCallImports } from '@spartan-ng/helm/tool-call';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmBadge } from '@spartan-ng/helm/badge';
`;

export const defaultSkeleton = `
<div hlmToolCall [name]="tool.name" [state]="tool.state">
  <div hlmToolCallHeader>
    <span>{{ tool.name }}</span>
    <button hlmToolCallTrigger>Details</button>
  </div>
  <div hlmToolCallArgs>{{ tool.args | json }}</div>
  @if (tool.state === 'requires-approval') {
    <div hlmToolCallActions>
      <button hlmBtn hlmToolCallReject variant="outline">Reject</button>
      <button hlmBtn hlmToolCallApprove variant="default">Approve</button>
    </div>
  }
</div>
`;
