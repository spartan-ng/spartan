# @spartan-ng/brain/message-scroller

Headless chat transcript scroller (Brain). Ports shadcn's `@shadcn/react/message-scroller`
behavior: follow-bottom auto-scroll, prepend preservation, scroll-anchor turns, and
start/end overflow signals — with no styles.

## Parts

| Directive / service          | Role                                                                                                                                          |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `brnMessageScrollerProvider` | Provides `BrnMessageScroller`; inputs: `autoScroll`, `defaultScrollPosition`, `scrollEdgeThreshold`, `scrollPreviousItemPeek`, `scrollMargin` |
| `brnMessageScroller`         | Root frame; mirrors `data-scrollable` / `data-autoscrolling`                                                                                  |
| `brnMessageScrollerViewport` | Scroll container (`role="region"`); wheel/touch/keydown intent; resize                                                                        |
| `brnMessageScrollerContent`  | Log region; MutationObserver + tail spacer                                                                                                    |
| `brnMessageScrollerItem`     | Row with `messageId` / `scrollAnchor`                                                                                                         |
| `brnMessageScrollerButton`   | Scroll-to-start/end control (`data-active`, `data-direction`; hidden until first frame; inert when inactive)                                  |

## Provider vs Root

Unlike most Brain primitives (where Root owns DI), message-scroller splits
`brnMessageScrollerProvider` from `brnMessageScroller`:

- **Provider** creates `BrnMessageScroller` and accepts configuration inputs. It
  can wrap a larger UI tree than the scroll frame so siblings (header actions,
  jump menus) can `injectBrnMessageScroller()`. Helm uses `display: contents` so
  the provider is not a layout box.
- **Root** is the sized frame that receives `data-scrollable` /
  `data-autoscrolling`.

Keeping DI on Provider (not Root) is intentional: Root-as-provider would force
every injector consumer to live inside the scroll frame.

## Public API

Inject the controller with `injectBrnMessageScroller()` for:

- Commands: `scrollToMessage`, `scrollToEnd`, `scrollToStart`
- Signals: `scrollable`, `visibility`
- Lazy visibility: `observeVisibility()` / `unobserveVisibility()`

Element registration, content/resize handlers, and geometry helpers are internal
wiring for the part directives — not a consumer contract.

```ts
import { BrnMessageScrollerImports } from '@spartan-ng/brain/message-scroller';
```
