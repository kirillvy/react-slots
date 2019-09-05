# slottr

slottr (Slot Tooling for React) is a library for managing React components as slots, with scoped, conditional and
multiple rendering. It can be used for creating reusable components and UI kits.

To begin, install with

```
npm i slottr
```


## Component properties




## Changelog

- 0.1
  - Performance optimizations, optional pre-indexing by useScope function.
  - clarifications on flags for non-slotted elements.
  - clarifications on default, fallback and passed props.
- 0.2 (feature addition lock for 1.0)
  - Conditional rendering slots
  - Unordered and ordered group slots

## Roadmap to 1.0

- 0.3 (preparation for 1.0)
  - Complete test coverage and full examples
  - Package optimizations
  - Documentation
- 1.0
  - breaking changes 
    - Mandatory pre-indexing with useScope
- 1.1
  - Advanced filtering for conditional slots and non-slotted components.
  - NonSlotted (now FilterSlot) is deprecated

Plans:
- Full examples
- Test coverage for ordinary and edge cases
- Passing props other than children through Context API (unique global and component-level slots).
- Caching, priority and garbage collection for global slots.
- Package optimizations (tree-shaking)


## Branches

With the milestones defined, the branches to work on the project are the following:

M1/general

Milestone 1, general master branch for the group of improvements.

M1/14, milestone 1, issue 14 (issues based with this feature or group of features)

M0/15, no milestone, issue 15 (general issue with the work of the library not linked to any milestone).
