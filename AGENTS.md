# AGENTS.md

Guidance for AI coding agents (and humans) working in this repository.
Scope and architecture decisions live in `docs/PLAN.md`.

## Project

SimpleCalculator: a React Native calculator app built with Expo (managed workflow) and TypeScript.
It is developed on a Windows PC and run on a single Android device, with Expo Go as the client.

## Commands

| Task             | Command                                                                            |
| ---------------- | ---------------------------------------------------------------------------------- |
| Install deps     | `npm install`                                                                      |
| Add a dependency | `npx expo install <pkg>` (never plain `npm i` for RN/Expo libs)                    |
| Start dev server | `npx expo start` → scan the QR code with Expo Go on the phone (same Wi-Fi)         |
| Type check       | `npx tsc --noEmit`                                                                 |
| Lint             | `npm run lint`                                                                     |
| Format           | `npm run format`                                                                   |
| Tests            | `npm test`                                                                         |
| All checks       | `npm run check` (lint + typecheck + tests). **Must pass before finishing a task.** |

No shared Wi-Fi? Use USB instead: `adb reverse tcp:8081 tcp:8081`, then `npx expo start --localhost`.

## Architecture rules

- `src/engine/` is **pure TypeScript**. It must never import `react`, `react-native` or `expo-*`.
  Everything there is a deterministic function with unit tests.
- **Never** use `eval`, `new Function`, or similar to compute results. Use the engine's tokenizer and parser.
- State changes go through `src/state/calculatorReducer.ts`, a pure reducer.
  Components do not hold calculator logic.
- Components in `src/components/` are presentational: data in through props, events out through callbacks.
- Route files in `src/app/` stay thin. They compose components and hooks only.
- Keypad layout is data-driven (`src/constants/keys.ts`), not hard-coded JSX per button.
- Colors, spacing and font sizes come from `src/theme/tokens.ts`. No magic values in components.
- Import with the `@/` alias (`@/engine/parser`) instead of deep relative paths.

## Code style

- TypeScript `strict`. Avoid `any`; prefer discriminated unions for actions and tokens.
- Use function components and hooks only. Use `StyleSheet.create` for styles.
- Use named exports. Use one component per file, with PascalCase filenames for components and camelCase for others.
- Keep functions small. Add comments for _why_, not _what_.
- Prettier formatting and ESLint (`eslint-config-expo`) are authoritative.

## UI and design

- Behaviour follows Android-style expression entry with a live result preview. The look and feel is a retro Casio calculator (see PLAN.md §3).
- Do not use Casio trademarks or logos. Use our own name ("SIMPLECALC").
- Bundle all fonts locally in `assets/fonts`. Do not fetch anything at runtime.
- Everything must work in Expo Go. Ask before adding anything that requires a development build.

## Testing

- New engine or reducer behaviour requires tests first or alongside the change (TDD encouraged).
- Cover edge cases: division by zero, repeated operators, leading decimals, very large and small numbers,
  float artifacts (`0.1 + 0.2`), and backspace on an empty input.
- Use `@testing-library/react-native` for components. Query by accessibility label or role, not by testID where avoidable.
- Do not delete or weaken tests to make them pass.

## Accessibility

- Every pressable key has an `accessibilityRole="button"` and a spoken `accessibilityLabel` (e.g. "divide", "decimal point").
- Respect system font scaling and maintain WCAG AA contrast (single classic theme, no dark-mode variant).

## Dependencies

- Keep the dependency footprint minimal. Ask before adding any new runtime dependency, and state why it's needed.
- No network access, analytics, or tracking libraries.

## Environment caveats

- Development happens on a Windows PC at `C:\MyFiles\Projects\AgenticProjects\SimpleCalculator`.
  The original plan targeted PRoot Ubuntu on the phone; this changed on 2026-10-16 (see `docs/PLAN.md` §1).
- There is no `/sdcard` mirror anymore: docs are read on the phone via GitHub, so push doc changes to `origin`.
- Keep one Metro server at a time. Stop it when done.
- Node: use Node 24 LTS, pinned in `.nvmrc`. This PC uses nvm-windows, which ignores `.nvmrc`:
  check `nvm list` and select the 24.x line with `nvm use <version>`.
- PowerShell runs `npm`/`npx` normally (execution policy for the current user is `RemoteSigned`).

## Workflow

- Do only what the task asks. Discuss scope changes before implementing them.
- Run `npm run check` before declaring a task done, and report failures honestly.
- Use Conventional Commits (`feat:`, `fix:`, `test:`, `refactor:`, `chore:`, `docs:`). Make small, focused commits.
- Push to `origin` (GitHub) when a task's commits are done, so the docs and code are readable on the phone.
- Update `docs/PLAN.md` or this file when an architectural decision changes.
