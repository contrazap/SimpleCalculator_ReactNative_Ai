# SimpleCalculator

A React Native calculator app built with Expo (managed workflow) and TypeScript,
with the look and feel of a retro calculator.

## Status

v1 is feature-complete: expression entry with a live preview, precedence and parentheses,
Casio-style `%`, a retro LCD look, history (last 100), haptics, copy-on-long-press and a
landscape layout. See [`docs/PLAN.md`](docs/PLAN.md) for details.

## Documentation

- [`docs/PLAN.md`](docs/PLAN.md) — scope, decisions, architecture and milestones
- [`AGENTS.md`](AGENTS.md) — guidance for AI coding agents (and humans)

## Requirements

- Node 24 LTS (pinned in `.nvmrc`)
  - Windows note: nvm-windows ignores `.nvmrc`. Check `nvm list` and run `nvm use <24.x>`.
- npm (comes with Node)
- An Android phone with [Expo Go](https://expo.dev/go) installed
- The phone and this PC on the same Wi-Fi network

## Setup

```sh
npm install
```

## Run on the phone (Expo Go)

1. Start the dev server:

   ```sh
   npm start        # same as: npx expo start
   ```

2. Open Expo Go on the phone and scan the QR code shown in the terminal.
   The app loads over the LAN and hot-reloads whenever a file under `src/` changes.

3. Stop the server with `Ctrl+C` when done.

If the LAN connection is blocked (firewall, VPN, or the phone is on another network),
connect the phone over USB instead:

```sh
adb reverse tcp:8081 tcp:8081
npx expo start --localhost
```

This needs Android platform-tools with USB debugging enabled.

## Checks

```sh
npm run check      # lint + typecheck + tests
```

Also available: `npm run lint`, `npm run typecheck`, `npm test`, `npm run format`
(writes formatting) and `npm run format:check`.

## Build an APK and install it on the phone

Builds use [EAS Build](https://docs.expo.dev/build/introduction/) (a cloud build; no Android
SDK needed on this PC). `eas.json` and the app id (`com.contrazap.simplecalc`) are already
configured; bump `android.versionCode` in `app.json` before each release build.

1. Create a free Expo account at https://expo.dev/signup.
2. Log in: `npx eas-cli@latest login`
3. Run the build: `npx eas-cli@latest build -p android --profile preview`
   - The first run creates `eas.json` and asks for anything missing (for example the
     Android app id, such as `com.contrazap.simplecalculator`).
4. When the build finishes, EAS prints a download URL. Open it on the phone, download
   the `.apk`, and install it (allow "install unknown apps" for the browser or file
   manager when Android asks).
   - Alternative: download the APK on the PC and transfer it to the phone by USB or
     cloud storage.

Notes:

- Cloud builds need network access and a logged-in Expo account (the free tier is enough).
- Expo Go is still the fastest way to iterate; build an APK only when you want to use
  the app away from the dev server or share it.
