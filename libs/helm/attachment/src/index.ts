import { HlmAttachment } from './lib/hlm-attachment';
import { HlmAttachmentAction } from './lib/hlm-attachment-action';
import { HlmAttachmentActions } from './lib/hlm-attachment-actions';
import { HlmAttachmentContent } from './lib/hlm-attachment-content';
import { HlmAttachmentDescription } from './lib/hlm-attachment-description';
import { HlmAttachmentGroup } from './lib/hlm-attachment-group';
import { HlmAttachmentMedia } from './lib/hlm-attachment-media';
import { HlmAttachmentTitle } from './lib/hlm-attachment-title';
import { HlmAttachmentTrigger } from './lib/hlm-attachment-trigger';

export * from './lib/hlm-attachment';
export * from './lib/hlm-attachment-action';
export * from './lib/hlm-attachment-actions';
export * from './lib/hlm-attachment-content';
export * from './lib/hlm-attachment-description';
export * from './lib/hlm-attachment-group';
export * from './lib/hlm-attachment-media';
export * from './lib/hlm-attachment-title';
export * from './lib/hlm-attachment-trigger';

export const HlmAttachmentImports = [
	HlmAttachment,
	HlmAttachmentAction,
	HlmAttachmentActions,
	HlmAttachmentContent,
	HlmAttachmentDescription,
	HlmAttachmentGroup,
	HlmAttachmentMedia,
	HlmAttachmentTitle,
	HlmAttachmentTrigger,
] as const;
