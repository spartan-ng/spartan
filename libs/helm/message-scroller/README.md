# @spartan-ng/helm/message-scroller

Styled chat transcript scroller for spartan/ui. Wraps `@spartan-ng/brain/message-scroller` with Tailwind classes.

## Usage

```ts
import { HlmMessageScrollerImports } from '@spartan-ng/helm/message-scroller';
```

```html
<!-- Provider owns DI/config so siblings can injectBrnMessageScroller(); Root is the scroll frame. -->
<div hlmMessageScrollerProvider [autoScroll]="true">
	<div hlmMessageScroller class="h-96">
		<div hlmMessageScrollerViewport>
			<div hlmMessageScrollerContent>
				@for (message of messages; track message.id) {
				<div hlmMessageScrollerItem [messageId]="message.id" [scrollAnchor]="message.role === 'user'">
					<!-- message UI -->
				</div>
				}
			</div>
		</div>
		<button hlmMessageScrollerButton></button>
	</div>
</div>
```
