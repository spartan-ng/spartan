export type ToolCallState =
	| 'pending'
	| 'executing'
	| 'requires-approval'
	| 'approval-responded'
	| 'result'
	| 'error'
	| 'denied';
