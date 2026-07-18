# Task 3.2 — QuestionFigure origin allowlist + image fixtures (GATE B)

**Phase**: 3 (render safety) · **Depends on**: 0.1 (vitest) · **Type**: Implementation + Quality GATE

## Goal
Add `SOURCE/components/shared/QuestionFigure.tsx`: renders a question's `image_url` as an `<img>` **only if** the URL's origin is on a fixed allowlist of the site's Supabase Storage origin(s) (from env); otherwise renders nothing (**fail closed**). Always sets non-empty `alt` (default `Figure for Câu {n}`). Constrained to content width (`max-w-full h-auto`, hairline border). Export `isAllowedImageUrl(url)` for reuse. This is the render-side enforcement of AC-023 (the Storage read policy from Task 1.1 is the data side).

## Files
New: `components/shared/QuestionFigure.tsx`, `components/shared/__tests__/QuestionFigure.test.tsx`.

## ACs / metrics
AC-011/023; ADR-0002 Gate B (image).

## Verification / Acceptance
`npx vitest run components/shared` green: a storage-origin URL renders an `<img>` with the given `alt`; a non-allowlisted origin, a `javascript:` URL, and a `data:` URL each render **no** image element; a null `image_url` renders nothing; every rendered figure has non-empty `alt`.

## References
Design Doc §Rendering → QuestionFigure; ADR-0002 (Question images, image-origin fixtures).
