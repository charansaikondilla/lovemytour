I have a website with **3 rows of continuously/infinite-scrolling images**.

It works correctly on Android/Chrome, but on **iPhone Safari the 3 image-scrolling rows have errors, stuttering, jumping, freezing, clipping, or incorrect scrolling**.

I need you to FIX the existing implementation without changing the visual design.

### Requirements

1. Keep **3 separate image-scrolling rows**.
2. Each row must scroll continuously and infinitely.
3. It must work smoothly on:

   * iPhone Safari
   * iOS Chrome
   * Android Chrome
   * Desktop Chrome
   * Desktop Safari
4. No visible jump/reset when the animation loops.
5. No white/blank gaps.
6. No horizontal page overflow.
7. No image clipping.
8. Images must maintain their correct aspect ratio.
9. Do not depend on JavaScript scroll calculations if CSS animation can handle it.
10. Do not use `100vw` for the scrolling container. Prefer `width: 100%`.
11. Use `overflow: hidden` only on the correct row wrapper.
12. Use `display: flex` and `flex-shrink: 0` for scrolling items.
13. Give images stable dimensions using `width`, `height`, `aspect-ratio`, and `object-fit`.
14. Use `transform: translate3d(...)` for the animation where appropriate.
15. Add Safari-friendly rendering optimizations such as:

    * `-webkit-transform`
    * `-webkit-backface-visibility`
    * `backface-visibility`
    * `will-change: transform`
16. Do NOT animate `left`, `right`, `margin-left`, or `width`.
17. Do NOT continuously calculate `scrollWidth`, `offsetWidth`, or `getBoundingClientRect()` on every animation frame.
18. Do not use a JavaScript `setInterval` or `requestAnimationFrame` loop unless absolutely necessary.
19. Duplicate the image set so the second copy follows the first copy exactly.
20. Animate by exactly the width of one complete image set so that when the animation repeats, the second copy is visually identical to the first position.

### IMPORTANT INFINITE SCROLL LOGIC

Use this structure:

ROW
└── viewport
└── track
├── image set A
└── identical image set B

The track should move from:

translate3d(0, 0, 0)

to approximately:

translate3d(-50%, 0, 0)

ONLY if the track contains exactly two identical sets and the percentage corresponds correctly to one complete set.

Do not blindly use `-100%`.

### Different directions

Make the rows move in alternating directions, for example:

Row 1 → left
Row 2 → right
Row 3 → left

Keep the speeds slightly different if the existing design has that effect.

### Important Safari fix

Make sure the duplicated content has exactly the same:

* images
* image dimensions
* gap
* padding
* margins
* ordering

Do not allow the browser to calculate different widths between the two copies.

Use:

```css
flex: 0 0 auto;
```

for each image/card.

### Image loading

Make sure images cannot change the track width after animation starts.

Use fixed dimensions/aspect ratios and appropriate image loading behavior.

If necessary, preload critical images or ensure the animation starts only after the layout is stable.

### Mobile performance

Optimize for iPhone because this is where the current implementation fails.

Avoid:

* expensive filters
* huge box shadows
* excessive blur
* JavaScript animation loops
* layout-triggering properties
* continuously changing DOM
* continuously measuring element dimensions

Prefer GPU-friendly:

```css
transform: translate3d(...);
```

### Reduced motion

Add:

```css
@media (prefers-reduced-motion: reduce) {
  .image-track {
    animation: none !important;
    transform: none !important;
  }
}
```

### VERY IMPORTANT

Do not just give me suggestions.

First inspect my existing implementation and identify the exact reason why it works on Android but fails on iPhone Safari.

Then modify the existing code.

Do NOT redesign the section.

Do NOT remove the infinite scrolling.

Do NOT replace the images.

Do NOT change the desktop design.

Do NOT change the three-row layout.

After fixing it, provide the complete updated code for every file that needs modification.

Finally, check the implementation specifically for:

* iPhone Safari
* iOS Chrome
* Android Chrome
* desktop Safari
* desktop Chrome

and explain exactly what caused the original iPhone issue and what you changed to fix it.
