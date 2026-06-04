# Brain vs Helm

spartan has a single headless library, **Brain**. There is no choice between competing primitive
libraries and no per-variant API switch - every component has one API. Each spartan component is
built from **two layers**:

| Layer     | Package                    | Role                                                                           | Distribution                                              |
| --------- | -------------------------- | ------------------------------------------------------------------------------ | --------------------------------------------------------- |
| **Brain** | `@spartan-ng/brain/<name>` | Headless behavior + accessibility (Angular directives/components). No styling. | Installed from npm.                                       |
| **Helm**  | `@spartan-ng/helm/<name>`  | Tailwind styling layered on top of Brain.                                      | Copied into your project by the CLI; you own and edit it. |

## Which one do I use?

- **Use Helm by default.** It is the styled component. When you "add a dialog," you use
  `HlmDialogImports`, which already composes the Brain dialog internally.
- **Use Brain directly** only when you need fully custom styling and want the behavior/accessibility
  without spartan's look - i.e. you are building your own styled layer. Then import from
  `@spartan-ng/brain/<name>` and apply your own classes.
- **Never edit Brain.** It is an npm dependency. Customize by editing the copied Helm files or the
  theme variables.

## Composition uses directives

Composition is done with **directives applied to host elements** and **structural directives** for
portals/content - there is no wrapper prop that swaps the rendered element.

- Triggers are directives you put on your own element: `<button hlmDialogTrigger hlmBtn>` makes a
  styled button act as the dialog trigger.
- Content is projected into structural directives: `<hlm-dialog-content *hlmDialogPortal>`,
  `<hlm-select-content *hlmSelectPortal>`, `<hlm-sheet-content *hlmSheetPortal>`.
- To restyle a trigger or item, you change the classes/variant on your host element directly - no
  wrapper prop needed.

## Imports

Each component publishes an `*Imports` barrel (e.g. `HlmDialogImports`, `HlmSelectImports`,
`HlmCardImports`) plus the individual classes. Add the barrel to a standalone component's `imports`
array:

```ts
import { HlmDialogImports } from '@spartan-ng/helm/dialog';

@Component({
  imports: [HlmDialogImports],
  // ...
})
```

The entrypoint name matches the component name in kebab-case (e.g. `@spartan-ng/helm/alert-dialog`,
`@spartan-ng/brain/toggle-group`). When unsure, confirm the exact path from the component docs or
MCP rather than guessing.

## Per-component notes

- **select / toggle-group / radio-group / accordion / tabs**: the Brain layer owns
  keyboard/selection behavior; you compose Helm items inside the Helm group as shown in
  `rules/composition.md`.
- **dialog / sheet / popover / tooltip / menus**: rely on the Angular CDK overlay (a peer
  dependency). Do not manage z-index yourself (see `rules/styling.md`).
