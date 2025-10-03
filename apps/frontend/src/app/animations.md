# Animation Rules for React (Motion)

## General Principles
- Use [Motion for React](https://www.framer.com/motion/) for all UI animations.
- Prefer declarative animation via the `motion` component and hooks.
- Keep animations subtle and purposeful; avoid distracting or excessive motion.
- Respect user preferences for reduced motion (use `useReducedMotion`).

## Best Practices
- Use `AnimatePresence` for exit/enter animations.
- Use `LayoutGroup` for shared layout transitions.
- Use `motion.div` (or other elements) for animating DOM nodes.
- Use `transition` props to control duration, easing, and type (spring, tween, etc).
- Use `whileHover`, `whileTap`, and gesture props for interactive animations.
- Use `useAnimation` or `useAnimate` for imperative control when needed.
- Use `useInView` for scroll-triggered animations.
- Use `MotionConfig` to set global animation settings.

## Accessibility
- Always check `useReducedMotion` and provide static alternatives if needed.
- Avoid animating large blocks of text or essential content.

## Performance
- Prefer animating transform and opacity for best performance.
- Avoid animating expensive properties (e.g., box-shadow, width/height if possible).
- Use `LazyMotion` to reduce bundle size if many animations are used.

## References
- [Motion for React Docs](https://www.framer.com/motion/)
- [React Animation Guide](/docs/react-animation.md)
- [Accessibility](/docs/react-accessibility.md)
