# Agent Instructions & Project Constraints

## 1. Hero Aeroplane Animation (Removed per User Request)
- The hero aeroplane animation and related DOM elements/styles/scripts have been removed per explicit user instruction.
- Do NOT re-introduce aeroplane elements or keyframes unless explicitly requested by the user.

## 2. Scroll Animation & Motion Protection (EXPLICIT PERMISSION REQUIRED)
- **DO NOT INTERRUPT** or break the smooth page scrolling animation or scroll-driven background canvas video playback.
- **USER PERMISSION REQUIRED**: Before making any modification, alteration, refactoring, or removal related to scroll behaviors, scroll listeners, scroll position calculations, or smooth scrolling effects, you **MUST explicitly ask for user permission first**.

## 3. Mobile-First Scoping Constraint (DESKTOP IS READ-ONLY BY DEFAULT)
- **MOBILE-ONLY SCOPE**: Unless the user explicitly requests desktop changes, all design, layout, typography, and spacing modifications MUST be strictly scoped inside mobile media queries (`@media (max-width: 900px)` or `@media (max-width: 768px)`).
- **DESKTOP PROTECTION**: Do NOT alter, overwrite, or degrade desktop CSS/HTML structure unless explicitly asked.

## 4. Senior UI/UX Engineering & Code Integrity Standards (5+ Years Experience Level)
- **ZERO CODE REGRESSIONS**: Every code modification must preserve valid DOM hierarchy, clean CSS specificity, and JavaScript execution without breaking page flows, event listeners, or component rendering.
- **EXPERT AESTHETICS & PERFORMANCE**: Ensure pixel-perfect visual polish, modern typography, glassmorphism, responsive alignment, smooth 60fps transitions, and flawless performance on all devices.
- **EMPIRICAL VERIFICATION**: Verify every change against code standards before presenting completion.
