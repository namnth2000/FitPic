# FitPic Design

## Direction

FitPic is a compact image utility, not a full editor.

```text
Minimal
Calm
Functional
Image-first
Readable
```

The UI should make this loop obvious without adding editor chrome:

`Upload -> Ratio -> Background -> Preview -> Download`

For multiple images, the same controls apply to the whole batch and the preview stays focused on the first image.

## Visual system

### Color

Light theme:

- Page: `#fbfcfb`
- Surface: `#ffffff`
- Canvas: `#f3f6f5`
- Text: `#17212b`
- Muted text: `#536474`
- Border: `#d9e0e4`
- Accent: `#047857`
- Accent dark: `#065f46`

Dark theme:

- Page: `#0d1513`
- Surface: `#16211e`
- Canvas: `#101916`
- Text: `#edf5f1`
- Muted text: `#b4c5bd`
- Border: `#34433e`
- Accent: `#34d399`
- Accent dark: `#6ee7b7`

The emerald accent is a signal color. Do not flood large surfaces with it.

### Typography

- Font: system sans-serif stack
- Body is compact and readable
- Avoid oversized headings and decorative typography
- Use a small number of weights
- Normal text uses `text-wrap: wrap`

### Shape and surface

- Main panels: 18px radius desktop, 14px mobile
- Controls: about 10px radius
- Borders are subtle but visible
- Shadows stay soft and secondary
- Do not turn every element into a card

## Controls

### Ratio selector

The ratio selector follows the compact CapCut-like pattern requested for FitPic:

- Social-network icon sits inside a small framed tile
- Ratio sits directly below the tile
- Network name does not need to be repeated visually when the icon is clear
- `aria-label` must still expose the full placement name and ratio
- Keep all choices visible in a compact responsive grid instead of creating a full editor toolbar

Supported visual groups include Instagram, TikTok, Facebook and YouTube.

### Background selector

Keep the four choices together:

- Blur Original
- White
- Black
- Custom

When Custom is selected, reveal the palette inline below the choices. Do not open a large modal.

The custom palette reuses the base color set from StyleSpec but is intentionally more compact for FitPic. Keep the native color input and HEX input available for colors outside the preset palette.

### Batch behavior

Batch processing should not turn the page into an asset manager.

- User can select multiple files in the existing upload control
- Preview the first valid image only
- Clearly state that ratio/background apply to all selected images
- Download button shows the batch count
- Do not add thumbnails, reordering, per-image settings or ZIP UI in this pass

## Interaction

- Hover uses border/background/color changes, not scale or bounce
- Motion is short and functional
- Focus states must remain visible
- Mobile touch targets should be comfortably tappable
- Disabled states stay readable
- Theme switching preserves the current light/dark behavior

## Responsive

- Desktop keeps the two-column workbench
- At narrow widths, controls and preview stack vertically
- Ratio tiles use 5 columns on desktop and 4 on small mobile screens
- Background choices use 2 columns on small mobile screens
- Custom palette compresses from 8 to 6 columns on small screens
- Simplify layout before shrinking text or touch targets

## Do

- Keep the image and resulting composition as the visual focus
- Preserve the existing single-page flow
- Reuse current spacing, borders and emerald accent
- Keep controls compact and obvious
- Maintain both light and dark themes

## Do not

- Add crop, drag-to-position, filters, stickers, text tools or editor timelines
- Add a backend or upload user images to a server
- Add large section headings only to explain obvious controls
- Copy the full CapCut editor or full StyleSpec color dialog
- Add dependencies for visual polish that plain HTML/CSS/JS already handles
