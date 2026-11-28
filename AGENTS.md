# isTrust

isTrust verifies the trustworthiness of any website. It ships as a browser extension (Chrome, Edge, Firefox, Safari) and a website ([istrust.org](https://www.istrust.org/)). The checks behind it (DNSSEC, certificates, whois/RDAP, blacklists, platform detection) live in a shared package.

## Workspace map

npm workspaces orchestrated by Turborepo. Node `>=24` (see `.nvmrc`), npm 11.

| Path                | Package             | What it is                                                                                                                                                       |
| ------------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apps/webextension` | `webextension`      | Browser extension, built with [WXT](https://wxt.dev/) and Solid. Entrypoints in `src/entrypoints/` (`background`, `popup`).                                      |
| `apps/website`      | `website`           | Marketing/app website, built with Astro and Solid. Pages under `src/pages/[lang]/`.                                                                              |
| `apps/e2e`          | `e2e`               | Playwright E2E tests of the website and the Chrome extension, against their builds.                                                                              |
| `packages/common`   | `@istrust/common`   | Trust checks: `dnssec`, `certificate`, `whois` (RDAP + `.be` API), `whois_privacy`, `whois_proxy`, `blacklist`, `psl`, `platform`. Unit and live tests (vitest). |
| `packages/ui`       | `@istrust/ui`       | Shared Solid components and Tailwind styles.                                                                                                                     |
| `packages/i18n`     | `@istrust/i18n`     | Translations (`en` source strings, `fr`, `nl`).                                                                                                                  |
| `configs/*`         | `@istrust/*-config` | Shared ESLint, Prettier, Tailwind, and TypeScript configs.                                                                                                       |

Apps consume packages through their built `dist/`, not their `src/`. Each workspace's own `turbo.json` makes `lint`, `check-types`, `build`, and `bundle` build the packages they depend on first, so run checks through Turbo (`npm run …` or `npx turbo …`). Running `eslint` or `tsc` directly inside an app uses whatever `dist/` is already there, which may be stale.

## Commands

Run from the repo root.

- Install: `npm ci`
- Develop: `npm run dev:webextension` or `npm run dev:website` (also watches `packages/*`)
- **Verify a change: `npm run verify`.** It runs the format check, lint, type checks, and tests, and keeps going after a failure. Exit code 0 means everything passed. Only failing tasks print their output, with the locations: unformatted files (`[warn] <file>`), lint and type errors with line and column, and failing tests (vitest lines starting with `FAIL`, such as `FAIL  unit  src/psl/index.test.ts > <describe> > <test>`). The closing `Failed:` line lists the failed tasks. Tasks that depend on a failed one are skipped, so rerun after fixing. Add `-- --affected` to limit it to what changed, or `-- --filter=<workspace>`.
- `npm run verify:force`: the same without Turbo's cache.
- `npm run verify:e2e`: `verify` plus the E2E tests (`test:e2e`). Run it when a change touches the apps, `packages/ui`, or what the checks show. Failing E2E tests print as `✘ [website] › tests/website.spec.ts:20:5 › en › <test>`. Add `--force` to skip the cache.
- Individually: `npm run lint`, `npm run check-types`, `npm run test`, `npm run format:check`
- Fix formatting: `npm run format`
- Build release bundles: `npm run bundle`

Scope any Turbo task to one workspace with a filter, e.g. `npx turbo test --filter=@istrust/common` or `npx turbo lint --filter=website`.

Before finishing a change, run `npm run verify`. It must pass.

## Tests

Unit tests live in `packages/common` (vitest), E2E tests in `apps/e2e` (Playwright, see [E2E tests](#e2e-tests)). The unit tests come in two kinds:

- **`*.test.ts`: offline tests.** They don't touch the network, give the same result every time, and are what `npm test`, `npm run verify`, and CI run.
- **`*.live.test.ts`: live tests.** They call the real services the checks use (DNS-over-HTTPS, RDAP, the `.be` whois API, Certspotter, Quad9, the public lists). Run them with `npm run test:live`. They need network access, and can fail because of a transient network error or because upstream data changed. Rerun before suspecting your change, and compare against the real response before changing a parser or an expectation.

Name a new test `*.live.test.ts` if it reaches the network, and `*.test.ts` otherwise. The two kinds are separate vitest projects (`unit` and `live`, see `packages/common/vitest.config.js`). In the `unit` project, `vitest.offline.ts` blocks `fetch`, `WebSocket`, TCP and UDP sockets, and every `node:dns` query, and fails the test even if the code catches the error. Stub the call, or move the test to a `*.live.test.ts` file. The guard records calls per test, so a call made with `test.concurrent` can be blamed on the wrong test, and a call made after the file's last hook (for example from a retry timer) is not reported.

### Which commands need the network

| Command                                               | Network | Deterministic |
| ----------------------------------------------------- | ------- | ------------- |
| `npm run verify`, `npm run verify:force`              | No      | Yes           |
| `npm run test`, `lint`, `check-types`, `format:check` | No      | Yes           |
| `npm run verify:e2e`, `npm run test:e2e`              | No      | Yes           |
| `npm run test:live`, `npm run test:e2e:live`          | Yes     | No            |
| `npm run record -w e2e`                               | Yes     | No            |

Apart from these, only `npm ci` and `npx -w e2e playwright install chromium` need the network, to install dependencies and the browser.

### When a live test fails

1. Rerun it alone: `npx vitest run --project live <path>` in `packages/common`. Timeouts, DNS errors, HTTP 429 or 5xx, and a failure that passes on rerun are the network or the service, not your change.
2. If it fails the same way twice, fetch the real response (`curl` the URL the check calls) and compare it with what the test expects. When the data changed upstream (for example, a registrar now redacts the registrant), update the expectation. When the format changed, fix the parser.
3. A live failure only points to your change if it involves the code you touched. Confirm that by running the same test on `v2`, in a separate worktree: `git fetch && git worktree add ../isTrust-v2 origin/v2`, then `npm ci` and the same `vitest` command there.

### E2E tests

`apps/e2e` runs the built website and the built Chrome extension (MV3, which also covers Edge) in Chromium. Turbo builds both first. Firefox and Safari aren't covered.

- Once per machine: `npx -w e2e playwright install chromium`.
- `npm run test:e2e`: offline. `tests/*.spec.ts` check `istrust.org` in the website (`en`, `fr`, `nl`) and in the extension popup, for the active tab and for a domain from the context menu.
- `npm run test:e2e:live`: `tests/*.live.spec.ts`, against the real services, with loose assertions. Treat a failure like a [failing live test](#when-a-live-test-fails).
- After a failure: `npx -w e2e playwright show-report`, or open the trace it lists (`npx -w e2e playwright show-trace <trace.zip>`).

How the offline run works (`apps/e2e/fixtures/`):

- Every request goes through `network.ts`. DoH queries get an answer built from the scenario (`doh.ts`). Other requests replay `scenarios/istrust.org.json`. Anything else is aborted, and the test fails with the list of unexpected requests. A new endpoint in a check therefore fails the E2E tests until the scenario is recorded again.
- The browser clock is frozen to the recording date, and `Math.random` is seeded (`random.ts`), so the checks shuffle their sources the same way in every run.
- `npm run record -w e2e` rewrites the scenario from the real services. Review the diff, and update the test expectations if the data changed. Don't edit the scenario by hand: for a state `istrust.org` doesn't have (DNSSEC, a blocked domain), add a variant in `fixtures/variants.ts` and select it with `test.use({ variant: "…" })`.
- Tests find elements by `data-testid` (`header-domain`, `alert-banner`, and the result items such as `dnssec` and `registration`) and `data-state` (`loading`, `unavailable`, `empty`, `error`, `ready`, `not-available`), set in `packages/ui`. They compare text through `@istrust/i18n`, so the same assertion works in every language.

### Check caveats

- An app `lint` or `check-types` failure that `verify` reports but that passes when rerun alone (for example `npx turbo lint --filter=webextension --force`) can come from the apps' tasks regenerating build files at the same time. Rerun before chasing it.
- Turbo caches task results. The `Cached:` line at the end of `verify` says how many tasks came from cache. To confirm a check really passes, run `npm run verify:force`, or add `--force` to a single Turbo task.

## Generated files

- **i18n types** (`packages/i18n/src/types.ts`, committed): generated by `generate:types`, which scans the apps and packages for `i18n("<English text>", …)` calls. To add a user-facing string, write the English text in an `i18n(...)` call, then add the same key to `packages/i18n/src/translations/fr.ts` and `nl.ts`. Type checks fail if a translation is missing.
- **Extension locales** (`apps/webextension/public/_locales/`, ignored): generated by `generate:locales`, which runs automatically before extension `dev`, `lint`, `check-types`, and `bundle`.
- **Website manifests** (`apps/website/public/manifest/*.webmanifest`, committed): generated by `generate:manifest` during the website build. Commit the regenerated files when translations they use change.
- **`dist/`, `.wxt/`, `.astro/`, `.turbo/`**: build output. Never edit by hand.

## Conventions

- Branch from `v2` and open pull requests against `v2`. Don't commit directly to `v2`.
- Commits follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat(website): …`, `fix(webextension): …`). `npm run commit` opens the commitizen prompt. The changelog and releases are generated from these messages.
- Formatting is Prettier. CI auto-commits formatting fixes, but run `npm run format` locally to keep diffs clean.
- ESLint runs with `--max-warnings 0`, so warnings fail the check.
- Releases are cut by the manual `CD` workflow (`release-it`). Don't bump versions by hand.

## Agent skills

### Issue tracker

GitHub Issues in `Internet-Society-Belgium/isTrust`, via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Triage labels live in the `triage:` family: `triage:needs-triage`, `triage:needs-info`, `triage:ready-for-agent`, `triage:ready-for-human`, `triage:wontfix`. Issue types use the `type:` family (`type:bug`, `type:enhancement`, `type:question`, `type:docs`, `type:dependencies`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.
