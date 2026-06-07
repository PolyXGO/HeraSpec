# Pre-Delivery Checklist for UI/UX

Before delivering UI code, verify these items:

## Visual Quality

- [ ] No emojis used as icons (use SVG instead - Heroicons, Lucide, Simple Icons)
- [ ] All icons from consistent icon set
- [ ] Brand logos are correct (verified from Simple Icons)
- [ ] Hover states don't cause layout shift (use color/opacity, not scale)

## Interaction

- [ ] All clickable elements have `cursor-pointer`
- [ ] Hover states provide clear visual feedback
- [ ] Transitions are smooth (150-300ms)
- [ ] Focus states visible for keyboard navigation

## Light/Dark Mode

- [ ] Light mode text has sufficient contrast (4.5:1 minimum)
- [ ] Glass/transparent elements visible in light mode (`bg-white/80` not `bg-white/10`)
- [ ] Borders visible in both modes (`border-gray-200` in light mode)
- [ ] Test both modes before delivery

## Layout

- [ ] Floating elements have proper spacing from edges
- [ ] No content hidden behind fixed navbars
- [ ] Responsive at 320px, 768px, 1024px, 1440px
- [ ] No horizontal scroll on mobile
- [ ] Consistent max-width (`max-w-6xl` or `max-w-7xl`)

## Accessibility

- [ ] All images have alt text
- [ ] Form inputs have labels
- [ ] Color is not the only indicator
- [ ] `prefers-reduced-motion` respected
- [ ] Keyboard navigation works
- [ ] Screen reader friendly

