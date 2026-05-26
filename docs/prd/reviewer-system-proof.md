# PRD: Reviewer-Facing System Proof

## Summary

Add a reviewer-facing proof layer that makes YachayBot's current system behavior easy to inspect. The work should connect the README, architecture docs, demo evidence, validation commands, and API boundaries into a short review path for technical readers.

## Audit Basis

This PRD is based on a repository audit of the current Next.js public routes, shared retrieval and evaluation logic, FastAPI sidecar endpoints, data fixtures, validation scripts, architecture documentation, methodology documentation, limitation documentation, migration schema, and demo assets.

The audit confirms that the repository contains stronger implementation evidence than the current review navigation exposes. The product surface, service boundary, fallback behavior, experimental retrieval path, and validation commands should be connected through a concise review layer.

## Problem

YachayBot now includes deterministic retrieval, source-grounded answers, evals, FastAPI parity endpoints, fallback behavior, and an experimental pgvector comparison path. The implementation is stronger than the current review path. A technical reviewer can inspect the pieces, but the repository does not yet provide a concise, ordered way to verify the system.

## Goals

- Make the repository reviewable in under ten minutes.
- Show what is implemented now versus what is experimental.
- Point reviewers to the most important source files, docs, API routes, and validation commands.
- Preserve honest scope: deterministic retrieval is production-ready for the local MVP; pgvector is experimental.
- Make demo evidence easy to find and verify.

## Non-Goals

- Add broad product marketing copy.
- Claim production accuracy from the local corpus or eval set.
- Replace existing architecture, methodology, or limitation docs.
- Expand the corpus or change retrieval behavior.
- Add hosted deployment requirements.

## Audience

- Technical reviewers evaluating repository quality.
- Engineers inspecting AI/RAG architecture, validation, and migration design.
- Project maintainers checking the current system contract.

## Requirements

### Review Guide

- Add a concise system proof document that explains the implemented system, review order, API boundaries, validation commands, and known limitations.
- Link directly to the key implementation files and docs.
- State the distinction between deterministic baseline behavior and experimental pgvector comparison.

### Demo Evidence

- Add a demo evidence manifest that lists available demo artifacts, routes, smoke-test coverage, and expected review points.
- Make the existing public demo assets discoverable.
- Add a lightweight verification script that checks required demo artifacts and documentation references exist.

### README Navigation

- Add a "How to Review This Repo" section near the top of the README.
- Link to the system proof, demo evidence, architecture, backend migration, methodology, limitations, evals, and API docs.
- Include exact validation commands for both Next.js and FastAPI paths.

## Issue Breakdown

- Issue 45: add the reviewer-facing system proof guide.
- Issue 46: add the demo evidence manifest and verification script.
- Issue 47: add the README review path and validation index.

## Acceptance Criteria

- A reviewer can find the system proof path from the README without scrolling through the whole file.
- The system proof document identifies current, fallback, and experimental behavior.
- Demo evidence assets are documented and mechanically checked.
- Validation commands include `npm run validate`, FastAPI pytest, and the demo evidence check.
- Existing Next.js and FastAPI validations pass.
- GitHub issues created from this PRD are implemented, validated, commented, and closed.
