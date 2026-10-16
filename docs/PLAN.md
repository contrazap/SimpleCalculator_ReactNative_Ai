# SimpleCalculator: Project Plan (v4, approved, Windows dev PC)

Status: **v1 feature-complete** (2026-10-16). Milestones 1–7 are done; the APK is built with EAS (`preview` profile).

## 1. Decisions so far (2026-10-15)

| Topic         | Decision                                                                                   |
| ------------- | ------------------------------------------------------------------------------------------ |
| Location      | `C:\MyFiles\Projects\AgenticProjects\SimpleCalculator` on a Windows PC (v4)                |
| Docs access   | Read on the phone via GitHub; no local mirror script                                       |
| Node          | **Node 24 LTS**, pinned in `.nvmrc`; on the PC via nvm-windows (which ignores `.nvmrc`)    |
| Routing       | Expo Router                                                                                |
| Input model   | Android style: you type an expression, the result preview updates live, and `=` commits it |
| Look and feel | Retro Casio desk or pocket calculator (see §3)                                             |
| Scope         | Everything proposed earlier except scientific mode (see §2)                                |
| Delivery      | Expo Go during development. Later, an APK via EAS Build. Loop: change → Expo Go → APK      |
| Theme         | Classic look only. No night variant, no light/dark switching                               |
| History       | Capped at the 100 most recent entries; the oldest are dropped first                        |
| `%`           | Casio semantics (see §2)                                                                   |
| Remote        | GitHub: `contrazap/SimpleCalculator_ReactNative_Ai` (added 2026-10-16)                     |

**Why Node 24:** It is the active LTS line, which Expo and React Native target and test against.
The installed Node 26 is "Current" and only enters LTS later. Native and tooling dependencies can lag behind it.

**v4 (2026-10-16):** Development moved from PRoot Linux on the phone to a Windows PC.
The `/sdcard` docs mirror and the `--localhost` Metro loop were specific to that setup.
Expo Go now connects over the local network (or USB with `adb reverse`), and the GitHub remote was added at the same time.

## 2. Scope (v1)

Core:

- Digits, decimal point, `+ − × ÷`, `%`, `±`, parentheses `( )`
- `%` follows Casio semantics, where the percentage is relative to the left operand:
  `200 + 10% = 220`, `200 − 10% = 180`, `200 × 10% = 20`, `200 ÷ 10% = 2000`, and a standalone `50% = 0.5`.
  The exact rules will be pinned down in engine tests before implementation.
- `AC` (all clear) and backspace (⌫)
- Two-line display: the expression on top, a live result preview below it, and `=` commits the result
- Operator precedence (`2 + 3 × 4 = 14`). Use our own parser; **no `eval`**
- Floating-point hygiene (`0.1 + 0.2 = 0.3`), and errors are handled: `÷0` and malformed input show `E` in Casio style
- A display length limit, with exponent notation for very large or small results

Extras:

- **History**: past calculations, persisted with AsyncStorage (max 100 entries, oldest dropped first), shown on a second route.
  Tap an entry to reuse it.
- **Haptics** on key press (`expo-haptics`), with a toggle in Settings
- **Copy the result** to the clipboard (`expo-clipboard`) by long-pressing the display
- **Landscape**: a wider layout of the same keys (no scientific functions)

Out of scope: scientific functions, memory keys (`M+`/`MR`, maybe later), accounts, network, ads, analytics.

## 3. Visual design: "old Casio"

- **Body**: dark charcoal or graphite plastic, with a subtle bevel and shadow
- **Display**: a grey-green LCD panel with an inset shadow and dark segment digits.
  An optional faint "ghost" `8888…` sits behind the digits, like real LCD segments.
- **Font**: a seven-segment font (DSEG7, under the SIL Open Font License) for the display, and a condensed sans font for key labels.
  Fonts are bundled locally with `expo-font`; nothing is fetched over the network.
- **Keys**: rubber-dome look with rounded rectangles, a pressed-state offset and a darker shade.
  - Digits use dark grey keys.
  - Operators use lighter grey keys.
  - `AC` and `⌫` use orange or red keys, like the Casio `AC/ON`.
  - `=` uses a wide key or an accent colour.
- **Details**: a "CASIO-style" brand strip with our own name (e.g. "SIMPLECALC"), not the Casio trademark,
  and a decorative solar-panel strip above the LCD.
- **Theme**: a single classic look that is independent of the system's light/dark setting.
  The status bar is styled to match the body.

## 4. Architecture

Principle: **pure logic is separate from the UI.**

```
app/ (routes)  →  components (presentational)  →  hooks  →  state (reducer)  →  engine (pure TS)
```

- **Engine** (`src/engine`): `tokenize → parse (recursive descent, which handles parentheses) → evaluate → format`
- **State** (`src/state`): `calculatorReducer` with discriminated-union actions. It is pure and fully tested.
- **Hooks**: `useCalculator` (reducer and haptics), `useHistory` (AsyncStorage), `useSettings`
- **Storage** (`src/storage`): a thin, typed wrapper around AsyncStorage, so it is easy to mock in tests
- **UI**: `Display`, `Keypad`, `Key`, `HistoryList`. The keypad is driven by data in `constants/keys.ts`.
- **Theme** (`src/theme`): Casio palette tokens, spacing, typography and key variants

## 5. Project structure

```
C:\MyFiles\Projects\AgenticProjects\SimpleCalculator\
├── AGENTS.md
├── README.md
├── docs/
│   └── PLAN.md
├── .gitattributes              # LF everywhere
├── .gitignore
├── .nvmrc                      # 24
├── app.json
├── package.json                # scripts and Jest config
├── tsconfig.json               # strict, "@/*" → "src/*"
├── eslint.config.js
├── .prettierrc
├── .prettierignore
├── assets/
│   ├── fonts/                  # DSEG7, key-label font
│   └── images/                 # icon, splash
└── src/
    ├── app/                    # Expo Router routes (thin)
    │   ├── _layout.tsx
    │   ├── index.tsx           # Calculator
    │   ├── history.tsx
    │   └── settings.tsx
    ├── engine/                 # PURE TS, no react imports
    │   ├── tokenizer.ts
    │   ├── parser.ts
    │   ├── evaluate.ts
    │   ├── format.ts
    │   ├── types.ts
    │   └── __tests__/
    ├── state/
    │   ├── calculatorReducer.ts
    │   ├── actions.ts
    │   └── __tests__/
    ├── hooks/
    │   ├── useCalculator.ts
    │   ├── useHistory.ts
    │   └── useSettings.ts
    ├── storage/
    │   └── storage.ts
    ├── components/
    │   ├── Display.tsx
    │   ├── Keypad.tsx
    │   ├── Key.tsx
    │   ├── HistoryList.tsx
    │   └── __tests__/
    ├── theme/
    │   ├── tokens.ts
    │   └── useTheme.ts
    └── constants/
        └── keys.ts
```

## 6. Dependencies (expected, all installed via `npx expo install`)

| Package                                                                                           | Why                              |
| ------------------------------------------------------------------------------------------------- | -------------------------------- |
| `expo`, `expo-router` and its peer dependencies                                                   | Framework and routing            |
| `expo-font`                                                                                       | Bundles the LCD font             |
| `expo-haptics`                                                                                    | Key-press feedback               |
| `expo-clipboard`                                                                                  | Copying the result               |
| `@react-native-async-storage/async-storage`                                                       | History and settings persistence |
| dev: `jest-expo`, `@testing-library/react-native`, `eslint-config-expo`, `prettier`, `typescript` | Quality checks                   |

All of these work in Expo Go, so no development build is needed until we build the APK.

## 7. Workflow and best practices

- Use git from the first commit with Conventional Commits, and push to `origin` (GitHub).
- Use test-driven development (TDD) for the engine and reducer. `npm run check` must pass before each commit.
- Dev loop: `npx expo start`, then scan the QR code with Expo Go (same Wi-Fi; or USB with `adb reverse`).
- Release loop (later): `eas build -p android --profile preview` produces an installable APK.
  This needs a free Expo account. The build runs in the cloud, so the phone doesn't have to compile Android natively.

## 8. Open questions

None. All decisions are recorded in §1.

## 9. Milestones

1. Environment: Node 24 via nvm-windows, `create-expo-app` (TypeScript and Router), tooling, git — **done 2026-10-16**
2. Engine and tests — **done 2026-10-16**
3. Reducer, hooks and tests — **done 2026-10-16**
4. Casio UI: display, keypad, fonts and theme — **done 2026-10-16**
5. History, settings, haptics and clipboard — **done 2026-10-16**
6. Landscape, accessibility and polish — **done 2026-10-16**
7. First APK with EAS Build — **done 2026-10-16**

## 10. Implementation notes (v1)

- **State lives above the router.** `CalculatorProvider`, `HistoryProvider` and `SettingsProvider` (in `src/hooks/`)
  wrap the `Stack`, so the calculator keeps its expression while History or Settings is open,
  and tapping a history entry loads it straight into the calculator.
- **Display model.** `src/state/selectors.ts` derives the two LCD lines from reducer state:
  the literal number while it is typed, a live preview once there is an operator,
  and `E` for any error (`÷0`, overflow, malformed input). `⌫` after `E` returns to the expression.
- **Numbers.** Intermediate results are rounded to 15 significant digits to hide float noise.
  The LCD shows 12 digits (the leading `0` counts, like a Casio) and switches to `1.5E-7` style outside `1E-6 … 1E12`.
- **Percent.** `a ± b%` means `a ± a·b/100`; elsewhere `b%` is `b/100` (so `200 × 10% = 20`, `200 ÷ 10% = 2000`).
- **Sign toggle (`±`)** wraps the last number as `(−n`, Android style; open groups are closed automatically on `=`.
- **Landscape** uses a 6-column layout of the same keys and hides the brand strip to save height.
