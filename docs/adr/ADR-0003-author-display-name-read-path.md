# ADR-0003 Author display_name Read Path (Denormalization vs. Widened RLS)

## Status

Proposed — 2026-07-15. **Revised for the v2.0 redesign.** The core decision (denormalize the name onto the owning rows; keep `profiles_select_own` owner-only) is unchanged and is in fact simpler in v2.0: with admin removed there is **no review-queue and no admin-visible reports surface**, so the only cross-user name is the public author byline; the reporter name is captured but read out-of-band by the site owner (and by the reporter for their own rows).

- PRD: `docs/prd/ugc-exam-upload-prd.md` (v2.0) — R10 (author attribution), R13 (reports), Constraints ("profiles_select_own is owner-only … exposing author names requires a deliberate new read path").
- UI Spec: `docs/ui-spec/ugc-exam-upload-ui-spec.md` (v2.0) — AuthorByline (card + detail).
- Sibling ADRs: ADR-0001 (owns the `exams`/`exam_reports` tables these names attach to; admin removed).

## Context

`user_profiles` select policy is owner-only: `profiles_select_own` = `for select using (id = auth.uid())` (`schema.sql:141-143`). Today the only reader of a display name is the owner themselves (`getCurrentUserProfile`, `SOURCE/lib/auth/getCurrentUser.ts:26`). This feature needs **other** users' display names in one public place, plus a reporter name that is captured for out-of-band owner review:

1. **AuthorByline** on the public catalog card and exam detail page (R10, AC-021) — visible to any catalog viewer.
2. **Reporter name on reports** — captured at report time. In v2.0 there is no admin UI; the site owner reads reports out-of-band (service-role / direct DB, ADR-0001), and the reporter can read their own report rows. Either way the name must already be on the report row.

Under the current owner-only profile policy, neither of these can read the needed name from `user_profiles` at read time. The PRD guarantees `display_name` is always populated (signup trigger fallback chain, `schema.sql:36-45`), so the value always exists; the problem is purely the read path. The PRD names the two candidate mechanisms and their tradeoff: a widened/select-specific RLS policy (no staleness, but loosens RLS) vs. denormalizing `author_display_name` onto published rows (no RLS loosening, but goes stale on profile rename).

## Decision

**Denormalize the display name onto the rows that need it**: `exams.author_display_name` (captured when the UGC exam is created) and `exam_reports.reporter_display_name` (captured when the report is filed). Do **not** widen the `user_profiles` select policy.

### Decision Details

| Item | Content |
|------|---------|
| **Decision** | Store a denormalized `author_display_name` on `exams` and `reporter_display_name` on `exam_reports`, populated at write time from the writer's own (readable) profile; keep `profiles_select_own` owner-only. |
| **Why now** | Three MVP surfaces need cross-user names; the read path must be chosen before the Design Doc writes queries and RLS. |
| **Why this** | Least privilege: names are exposed exactly where the requirement needs them (published exams; admin-only queue/reports) and nowhere else. A widened profile-select policy would expose **every** user's display name to **every** authenticated user, which the current requirements do not need. |
| **Known unknowns** | Whether profile-rename staleness is ever user-visibly wrong enough to warrant a propagation trigger. Left as a documented tradeoff with a fast-follow option. |
| **Kill criteria** | If product later requires bylines to always reflect the current profile name in real time (rename must propagate instantly), denormalization is insufficient and this should be revisited (add a rename-propagation trigger or switch to an admin-scoped read). |

### How each surface is served

- **AuthorByline (card + detail)**: `author_display_name` rides along on the `exams` row already fetched by `listExams`/`getExam` — no extra join, no policy change. `null` `author_id` ⇒ no name ⇒ byline omitted (UI Spec byline-omission rule).
- **Reports**: `exam_reports.reporter_display_name` — read by the site owner out-of-band (service-role / direct DB), and by the reporter for their own rows (report select is own-row-only, ADR-0001). No admin surface reads it.

Population points (write time, from the writer's own profile — always self-readable under the existing policy):

- On UGC exam insert: set `author_display_name` from the author's `user_profiles.display_name`.
- On report insert: set `reporter_display_name` from the reporter's own `user_profiles.display_name`.

Because the writer reads only their **own** profile, no cross-user profile read is ever required — the owner-only policy stays intact.

## Rationale

### Options Considered

1. **Widened / select-specific RLS on `user_profiles`** — a policy (or a `(id, display_name)`-only view, since RLS is row- not column-scoped) letting any authenticated user read any profile's display name.
   - Pros: single source of truth; zero staleness — a rename shows everywhere immediately; no denormalized columns.
   - Cons: **rejected** — exposes the display name of **every** user (including users who never published anything and never will) to **every** authenticated user. That is a broader exposure than any current requirement needs (least-privilege violation). Column-scoping requires an extra view/function since RLS cannot restrict columns, adding its own surface. Widening the profile table's read policy also enlarges the blast radius of any future profile column added without re-checking the policy.

2. **SECURITY DEFINER RPC returning `(id, display_name)` for requested ids**
   - Pros: column-limited by construction; no denormalized columns; no staleness.
   - Cons: **rejected for MVP** — effectively the same exposure as option 1 (any authenticated caller can resolve any user id to a name), just gated behind a function; turns simple row reads into RPC calls, complicating the catalog/queue/report queries; adds a `SECURITY DEFINER` surface to audit for little gain over denormalization.

3. **Denormalize `author_display_name` / `reporter_display_name` onto the owning rows (Selected)**
   - Pros: least privilege — names appear only on published exams (public by design) and admin-only reports/queue; read path is trivial (the name is already on the row being fetched, no join, no policy change); `profiles_select_own` stays owner-only, so its blast radius is unchanged. Populated from self-readable data only.
   - Cons: staleness — a byline reflects the name at write time; a later profile rename does not propagate. Two extra columns (new persistent state). Accepted for MVP: renames are rare, low-impact, and a snapshot of the author's name at publication is a defensible attribution semantics.

### Minimal-surface note

The subtractive alternatives (options 1/2) add no persistent state, so by raw surface count they look smaller. They are rejected because they fail an **accepted security constraint** of the current requirements — least privilege / "return only information necessary" — by exposing all users' names site-wide. Denormalization is the smallest surface that covers the requirements **including** that constraint. The extra two columns are justified by the least-privilege requirement that the subtractive options do not satisfy.

## Consequences

### Positive

- `user_profiles` RLS is untouched; no cross-user profile exposure is introduced.
- Byline/queue/report reads need no joins or policy changes — the name is on the row.
- Attribution is a stable snapshot; deleting/renaming a profile does not orphan or blank a published byline.

### Negative

- Profile rename does not propagate to existing bylines (staleness). Documented tradeoff; a rename-propagation trigger is a fast-follow if it ever matters.
- Two denormalized columns must be populated at every write path that creates an exam or a report (a Field Propagation concern the Design Doc must map).

### Neutral

- `getCurrentUserProfile` (own-name read) is unchanged.
- Seeded exams have `null` `author_id` and `null` `author_display_name` — the byline-omission path (the UI Spec byline-omission rule) already handles this.

## Architecture Impact

- **Changes**: `public.exams` gains `author_display_name text`; `public.exam_reports` gains `reporter_display_name text` (both defined in ADR-0001's schema work). Write paths (submit-exam action; file-report action) must populate them from the writer's own profile.
- **New dependencies**: none.
- **Constraint added**: whenever a new author- or reporter-facing surface needs a name, it reads the denormalized column, not `user_profiles` — the owner-only profile policy is a deliberate boundary, not an oversight to route around.

## Implementation Guidance

- Populate denormalized names at write time from `auth.uid()`'s own profile only; never read another user's profile row.
- Treat `author_display_name`/`reporter_display_name` as write-once snapshots for MVP; do not add update triggers unless the rename-propagation requirement materializes.
- Keep the byline-omission rule keyed on `author_id is null` (the seeded/UGC discriminator), consistent with the UI Spec byline-omission rule.

## Related Information

- PRD `docs/prd/ugc-exam-upload-prd.md` (R10, R13, Constraints, Undetermined Items — display_name read path).
- UI Spec `docs/ui-spec/ugc-exam-upload-ui-spec.md` (AuthorByline components — card + detail).
- ADR-0001 (defines `exams`/`exam_reports` and their RLS; these columns live there).
- Code: `SOURCE/lib/auth/getCurrentUser.ts:26` (own-name read), `schema.sql:141-143` (owner-only policy), `schema.sql:36-45` (display_name fallback chain guaranteeing the value exists).
