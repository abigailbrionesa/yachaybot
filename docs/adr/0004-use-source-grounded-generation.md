# ADR 0004: Use Source-Grounded Generation

## Status

Proposed

## Context

The project must avoid unsupported cultural authority and broad claims. Generated answers should stay within retrieved source context and cite evidence.

## Decision

Generate answers only from retrieved chunks and include citation markers that map back to source cards.

## Consequences

- Weak evidence can produce refusal or uncertainty behavior.
- Citations become testable output, not decorative UI.
- The system can discuss limitations honestly.
