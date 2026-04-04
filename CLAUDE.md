# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev          # start dev server (Vite)
yarn build        # tsc + vite build
yarn lint         # check formatting with Prettier
yarn lint:write   # auto-fix formatting with Prettier
yarn preview      # preview production build
```

No test suite exists in this project.

## Architecture

### Dual-mode rendering pattern

The central pattern in this codebase is that every UI component renders either as HTML (edit mode) or as a `@react-pdf/renderer` element (PDF mode), controlled by a `pdfMode?: boolean` prop.

The wrapper components — `Document`, `Page`, `View`, `Text` — switch between their HTML and react-pdf equivalents based on `pdfMode`. The `Editable*` input components (`EditableInput`, `EditableTextarea`, `EditableSelect`, `EditableCalendarInput`, `EditableFileImage`) render as interactive HTML inputs when `pdfMode=false` and as static `<Text>` PDF elements when `pdfMode=true`.

`InvoicePage` is the single component that drives both the live editor and the PDF output. When generating a PDF, `DownloadPDF` renders `<InvoicePage pdfMode={true} data={debounced} />` inside `PDFDownloadLink`'s `document` prop. The debounce (500ms) prevents re-rendering the PDF on every keystroke.

### Styling for PDF vs HTML

CSS utility classes (e.g. `"flex w-50 bold"`) serve double duty:
- In HTML mode: applied directly as `className` strings, resolved by SCSS in `src/scss/`
- In PDF mode: passed to `compose()` (`src/styles/compose.ts`), which maps class name strings to the `CSSProperties` objects defined in `src/styles/styles.ts`

When adding a new utility class, it must be added to **both** `src/scss/` (for HTML) and `src/styles/styles.ts` (for PDF) or it will only work in one mode.

### State and persistence

`App.tsx` owns localStorage persistence. `InvoicePage` manages its own `invoice` state internally and calls `onChange` on every change, which `App.tsx` uses to write to localStorage. The `Invoice` type (defined with a Zod schema in `src/data/types.ts`) is the single data model shared between the editor and the PDF renderer.

Tax rate is derived at runtime by parsing a `%` value out of the `taxLabel` string (e.g. `"Sale Tax (10%)"` → 10%). All field labels are user-editable, so label text and data values are stored together in the same `Invoice` object.

### Template save/load

`DownloadPDF` handles template export (JSON saved as `.template` file via `file-saver`) and import (`.json` or `.template` file read and validated through `TInvoice.parse()` Zod schema before being applied).
