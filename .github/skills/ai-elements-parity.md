# Skill: AI Elements parity (React -> Angular)

## Purpose
Implement Spartan Angular components/patterns with parity to AI Elements React behavior/spec.

## References
- https://elements.ai-sdk.dev
- https://elements.ai-sdk.dev/components/attachments

## Inputs needed
- Target component/pattern.
- Story/screen where change is required.
- Current Spartan primitives available.

## Procedure
1. Read React reference for structure, states, and interactions.
2. Map requested behavior to existing Spartan primitives first.
3. Compose pattern from existing primitives; avoid bespoke markup/styles.
4. Preserve semantic token usage and state hierarchy.
5. Validate parity in light/dark and interactive states.

## Divergence protocol
If exact parity is not feasible in Angular, document:
- what differs,
- why it differs,
- UX impact,
- implementation path.

## Output checklist
- Parity status clearly stated (full/partial + reason).
- No hardcoded visual hacks.
- Changed stories/screens demonstrate behavior.
