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

`Upload -> Ratio -> Background / Crop -> Preview -> Save / Download`

For multiple images, the same ratio and background mode apply to the batch. Preview navigation lets users inspect each image without adding thumbnails or asset-manager UI.

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

- Social-network icon sits inside a small framed tile
- Ratio sits directly below the tile
- Network name does not need to be repeated visually when the icon is clear
- `aria-label` still exposes the full placement name and ratio
- Keep all choices visible in a compact responsive grid

### Background / fill selector

Keep the modes in this order:

1. Blur Original
2. White
3. Black
4. Custom
5. Image-based
6. Crop

The order matters. Image-based is a background treatment like Custom, while Crop changes how the foreground fills the canvas.

#### Custom

When Custom is selected, reveal the palette inline below the choices. Do not open a large modal.

The custom palette contains 24 commonly useful colors arranged as three visually coherent rows:

- Soft / light: Ivory, Sand, Peach, Coral, Rose, Lavender, Sky, Mint
- Vivid spectrum: Red, Orange, Amber, Lime, Emerald, Cyan, Blue, Violet
- Rich / deep: Burgundy, Magenta, Purple, Indigo, Navy, Teal, Olive, Charcoal

Keep the native color input and HEX input available for colors outside the preset palette.

#### Image-based

Image-based should stay simple and inline:

- Reveal one compact local-file picker after the main background choices
- Show the selected background filename
- Allow replacing or clearing the selected background image
- Use one selected background image for the whole batch
- Background image is centered and cover-fitted to the target ratio
- Foreground source image stays center + contain, so no source content is cropped
- Do not add blur amount, opacity, background reposition, per-image background, filters or a second editor
- Saving is unavailable until a valid background image has been selected

#### Crop

- Crop fills the target canvas using cover
- Default position is centered
- Drag directly on the preview to reposition
- Show a subtle rule-of-thirds grid only while dragging
- `Đặt lại` returns the current image to center
- Store crop position independently per source image
- Do not add zoom, rotate or freeform crop handles in this scope

### Batch preview

- Previous / Next arrows inspect each source image
- Show `current / total`
- Hide navigation when there is only one image
- Keep ratio and background mode shared across the batch
- Crop position remains per-image

## Interaction

- Hover uses border/background/color changes, not scale or bounce
- Motion is short and functional
- Focus states remain visible
- Mobile touch targets should be comfortably tappable
- Disabled states stay readable
- Theme switching preserves current light/dark behavior

## Responsive

- Desktop keeps the two-column workbench
- At narrow widths, controls and preview stack vertically
- Ratio tiles use 5 columns on desktop and 4 on small mobile screens
- Background choices use 2 columns on small mobile screens
- Custom palette compresses from 8 to 6 columns on small screens
- Image-based file actions wrap or collapse cleanly on small screens
- Simplify layout before shrinking text or touch targets

## Do

- Keep the image and resulting composition as the visual focus
- Preserve the existing single-page flow
- Reuse current spacing, borders and emerald accent
- Keep controls compact and obvious
- Maintain both light and dark themes
- Keep source and background images local to the device

## Do not

- Turn Image-based into a layered editor
- Add per-image background selection in this pass
- Add zoom, filters, stickers, text tools or editor timelines
- Add a backend or upload user images to a server
- Add large section headings only to explain obvious controls
- Add dependencies for visual polish that plain HTML/CSS/JS already handles
