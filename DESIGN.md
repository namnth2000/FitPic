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

`Upload -> Ratio -> Fill mode -> Preview -> Save / Download`

For multiple images, ratio and fill mode apply to the whole batch. The user can move through individual previews, and Crop position can be adjusted per image.

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

### Fill mode selector

Keep these five choices together:

- Blur Original
- White
- Black
- Custom
- Crop

Blur, White, Black and Custom preserve the full foreground image. Crop is intentionally different: it fills the whole selected ratio and allows repositioning the covered image.

When Custom is selected, reveal the palette inline below the choices. Do not open a large modal.

The custom palette contains 24 commonly useful colors arranged as three visually coherent rows:

- Soft / light: Ivory, Sand, Peach, Coral, Rose, Lavender, Sky, Mint
- Vivid spectrum: Red, Orange, Amber, Lime, Emerald, Cyan, Blue, Violet
- Rich / deep: Burgundy, Magenta, Purple, Indigo, Navy, Teal, Olive, Charcoal

Keep the native color input and HEX input available for colors outside the preset palette.

### Crop interaction

Crop should feel like the simple Facebook-style crop reference, not a full editor:

- Start centered horizontally and vertically
- Scale the image only enough to cover the selected output ratio
- Drag directly on the preview with mouse or touch to choose the kept region
- Clamp movement so empty canvas can never be exposed
- Show a subtle rule-of-thirds grid while dragging
- Show `Đặt lại` while Crop is active
- Reset returns the current image to centered `0.5 / 0.5`
- Do not add zoom, rotation, crop handles or numeric position controls in this version

### Batch preview

Batch processing should not turn the page into an asset manager.

- User can select multiple files in the existing upload control
- Previous / Next arrow buttons move through previews
- Show a compact `current / total` counter
- Hide navigation when there is only one image
- Ratio and fill mode apply to all images
- Crop position is stored per image because different photos need different framing
- Do not add thumbnails, reordering, per-image ratio/background controls or ZIP UI

## Interaction

- Hover uses border/background/color changes, not scale or bounce
- Motion is short and functional
- Focus states must remain visible
- Mobile touch targets should be comfortably tappable
- Disabled states stay readable
- Theme switching preserves the current light/dark behavior
- `ArrowLeft` / `ArrowRight` can navigate a batch when focus is not inside an interactive form control

## Responsive

- Desktop keeps the two-column workbench
- At narrow widths, controls and preview stack vertically
- Ratio tiles use 5 columns on desktop and 4 on small mobile screens
- Fill mode choices use 2 columns on small mobile screens
- Custom palette compresses from 8 to 6 columns on small screens
- Preview navigation stays compact and touchable
- Simplify layout before shrinking text or touch targets

## Do

- Keep the image and resulting composition as the visual focus
- Preserve the existing single-page flow
- Reuse current spacing, borders and emerald accent
- Keep controls compact and obvious
- Maintain both light and dark themes
- Keep Crop limited to repositioning a cover image

## Do not

- Turn Crop into a full photo editor
- Add zoom, freeform crop rectangles, filters, stickers, text tools or editor timelines
- Add a backend or upload user images to a server
- Add large section headings only to explain obvious controls
- Copy the full Facebook or CapCut editor
- Add dependencies for visual polish that plain HTML/CSS/JS already handles
