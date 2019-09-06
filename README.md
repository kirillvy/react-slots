# slottr

slottr (Slot Tooling for React) is a library for managing React components as slots, with scoped, conditional and
multiple rendering. It can be used for creating reusable components and UI kits.

To begin, install with

```
npm i slottr
```

Read the docs at https://kirillvy.github.io/react-slots/


## Changelog

- 0.1
  - Performance optimizations, optional pre-indexing by useScope function.
  - clarifications on flags for non-slotted elements.
  - clarifications on default, fallback and passed props.
- 0.2 (feature addition lock for 1.0)
  - Conditional rendering slots
  - Unordered and ordered group slots
- 0.3 (preparation for 1.0)
  - Complete test coverage and full examples
  - Package optimizations
  - Documentation

## Roadmap to 1.0

- 1.0
  - breaking changes 
    - Mandatory pre-indexing with useScope

Plans:
- Full examples
- Test coverage for ordinary and edge cases
- Passing props other than children through Context API (unique global and component-level slots).
- Caching, priority and garbage collection for global slots.
- Package optimizations (tree-shaking)