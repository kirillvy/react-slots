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
- 0.2
  - Conditional rendering slots
  - Unordered and ordered group slots
- 0.3 (preparation for 1.0)
  - Complete test coverage and full examples
  - Package optimizations
  - Documentation
- 0.4
  - Composition slots
  - Improved performance of filter slots (O(n))
  - createConditionalSlot
  - other API changes
  - breaking changes 
    - Mandatory pre-indexing with useScope
- 0.4.2
  - Elimination of createElement calls after initialization
  -

## Roadmap to 1.0

- 1.0
  - Full examples
  - Test coverage for ordinary and edge cases
  - Modules for assistive slots
  - Passing props other than children through Context API (unique global and component-level slots).
  - Caching, priority and garbage collection for global slots.
  - Package optimizatio ns (tree-shaking)