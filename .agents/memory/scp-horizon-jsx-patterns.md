---
name: SCP Horizon JSX template literal patterns
description: AI subagents corrupt backtick template literals in .tsx files; safe patterns to use instead
---

## The rule
In JSX/TSX files, **do not use backtick template literals inside className attributes or other JSX props** when delegating to AI subagents. Subagents write `\`` (backslash-backtick) instead of a real backtick, causing Vite/Babel parse errors.

## Safe patterns

Instead of:
```tsx
<div className={`base-class ${condition ? 'a' : 'b'}`}>
```

Use:
```tsx
<div className={'base-class ' + (condition ? 'a' : 'b')}>
```
or:
```tsx
<div className={['base-class', condition ? 'a' : 'b'].join(' ')}>
```

For keys:
```tsx
// Bad: key={`${nodeId}-${idx}`}
// Good:
key={nodeId + '-' + idx}
```

## Why
Subagents (DESIGN subagents in particular) receive the code via tool calls and may escape special characters. The backtick (`` ` ``) gets written as `\`` in the output file, which is a syntax error in JSX because Babel/esbuild sees a literal backslash before the backtick.

Template literals in `.ts` (non-JSX) files work fine — the issue is specific to JSX attribute positions.

## How to apply
Any time a DESIGN subagent builds or edits `.tsx` files with dynamic classNames, check for `\`` in the output and fix with string concatenation. Add a note to the subagent brief to use string concatenation in JSX.
