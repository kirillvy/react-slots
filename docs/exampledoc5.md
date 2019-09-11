---
id: doc5
title: Filter Slot
sidebar_label: Filter Slot
---

Equivalent of `{children}` for non-slottable elements. Can include a whitelist (include) or blacklist(exclude),
otherwise filters out all slottable elements.

Name | Type | Description
--- | --- | ---
scope | `any` | Elements passed for filtering
exclude | `Array<SlotComponent>` | Array of slottable components for filtering out
include | `Array<SlotComponent>` | Array of slottable components whitelisted for not being filtered. Overrides 'exclude'
all | `boolean` | Automatically include all non-slottable elements when doing include (on true)
or automatically exclude when doing exclude (on false)
grouped? | `boolean` | Groups elements by component type

## FilterSlot.SubSlot

Same as FilterSlot, but consumes a context from a slot with `withContext` enabled.

Name | Type | Description
--- | --- | ---
scope | any | Elements passed for filtering