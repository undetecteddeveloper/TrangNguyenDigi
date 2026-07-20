# Import Exam Document — Hidden Behaviors & Transitions

Screenshots are static, so the following interactive/animated behaviors are **not visible in the images** but exist in the live page (`Trang Nhap Tai Lieu De Thi.dc.html`).

## Screenshot index
- `01-default-state.png` — page on load: Import Instructions expanded, Entry Mode = Automatic.
- `02-instructions-collapsed.png` — Import Instructions panel collapsed.
- `03-validation-errors.png` — result of clicking Start with required fields empty.
- `04-manual-mode-filled.png` — Manual mode with Title/Class/School/Duration filled in.
  (Note: the native `<select>` control's displayed label may not repaint correctly in this synthetic capture — in the live app it correctly shows "Manual" once selected.)
- `06-success-state-transition.png` — captured mid-fade-in of the success confirmation card (see Fade-in transitions below); in the live app it settles at full opacity.

## Transitions & animations (not visible in stills)
1. **Import Instructions toggle** — expand/collapse animates over 0.3s via `grid-template-rows` (0fr ↔ 1fr), and the ▾ chevron rotates 180° in sync.
2. **Entry Mode dropdown** — same visual shell as Import Instructions; its ▾ chevron rotates 180° with a 0.3s transition while the field is focused/open.
3. **Mode switch (Automatic ↔ Manual)** — the note paragraph / manual form fades and slides in (`fadeIn`, 0.25s: opacity 0→1 + translateY -4px→0) whenever the mode changes.
4. **Input focus** — every text/number field's border animates from neutral (#D8C9A8) to accent gold (#B8863B) over 0.2s on focus.
5. **Field error state** — border animates to red (#A62C2B) over 0.2s, and the error message fades in (`fadeIn`, 0.2s) the moment validation fails.
6. **Upload boxes (Exam Paper / Answer Key)** — idle state shows only a centered "+" glyph. On mouse hover, the "+" crossfades out and the "Drag & drop…" copy / filename crossfades in, both over 0.3s opacity transitions layered on the same grid cell. Border color also animates (neutral → gold) on hover, drag-over, or once a file is attached.
7. **Submit button** — background darkens (#A62C2B → #8F2523) over 0.2s on hover; label swaps to "Processing…" and background dims to gray while submitting (simulated 1.2s delay) before the success card fades in.
8. **Success card** — fades and slides in (`fadeIn`, 0.3s) once submission completes; "Import Another Document" resets the entire form back to its initial state (Automatic mode, Instructions expanded, all fields cleared).

## Design system
Colors, type (Source Serif 4 / Be Vietnam Pro) and spacing follow the "Mực & Sơn Mài" (Ink & Lacquer) system: parchment background `#EDE1C8`, ink text `#1B1512`, lacquer red accent `#A62C2B`, gold accent `#B8863B`.
