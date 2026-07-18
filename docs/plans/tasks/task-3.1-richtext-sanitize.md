# Task 3.1 — Harden RichText + XSS/regression fixtures (GATE B)

**Phase**: 3 (render safety) · **Depends on**: 0.1 (vitest) · **Type**: Implementation + Quality GATE

## Goal
Harden the single shared `SOURCE/components/shared/RichText.tsx` for untrusted text. Add `rehype-sanitize` (pinned to a version compatible with react-markdown@10's `unified`) with `SANITIZE_SCHEMA` (extend `defaultSchema` to admit KaTeX HTML+MathML output while excluding raw HTML/`script`/`iframe`/`style`/`on*`/unsafe protocols); pin `KATEX_SAFE_OPTIONS` (`trust:false`, `throwOnError:false`, `maxExpand:100`, `maxSize:50`, `strict:false`). Pipeline order `rehypeKatex` → `rehypeSanitize`. Standing invariants: never add `rehype-raw`, never override `urlTransform`, never set KaTeX `trust:true`. Public `RichTextProps` unchanged.

## Files
`components/shared/RichText.tsx` (edit), `package.json` (add `rehype-sanitize`); new `components/shared/__tests__/RichText.xss.test.tsx`, `RichText.regression.test.tsx`.

## ACs / metrics
AC-022; ADR-0002 Gate B (text). PRD Security NFR.

## Verification / Acceptance
`npx vitest run components/shared` green. Each XSS vector (Design Doc §Rendering fixtures) rendered in a stem and an inline choice → DOM has no `<script>`, no `on*`, no `javascript:`/non-image `data:` URL, no throw. Seeded-regression snapshots (math `$…$`, `\\`, fractions, `ℝ \\ {2}` from `lib/fake-data/exams.ts`) identical before vs after hardening. Confirm `rehype-raw` absent from the pipeline/deps.

## References
Design Doc §Rendering & Sanitization; ADR-0002 (Decision, sanitization layer, fixture mandate).
