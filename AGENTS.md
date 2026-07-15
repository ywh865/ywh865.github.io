# AGENTS.md — Strict Repository Contract

**Contract version:** 2.0  
**Last reviewed:** 2026-07-16  
**Scope:** repository root and every descendant directory

This file is normative. `MUST`, `MUST NOT`, `REQUIRED`, `SHOULD`, and `MAY` have their RFC 2119 meanings. If a user instruction conflicts with this file, the explicit user instruction wins unless it would violate security, privacy, or platform policy. A task is not complete until every applicable gate in this document passes.

## 1. Repository purpose and invariants

This repository builds the Hexo 8 static site and the custom Phantom theme. Every change MUST preserve these invariants:

1. `npm ci` installs from `package-lock.json` without dependency drift.
2. `npm run check` exits successfully.
3. `npm audit --audit-level=low` reports zero known vulnerabilities before a dependency change is considered complete.
4. Homepage, post, page, archive, category, tag, search, static assets, and configured comments MUST continue to render.
5. Root-path and sub-path deployments MUST use Hexo URL helpers rather than hard-coded deployment paths.
6. No secret, generated output, local cache, or deployment checkout may enter version control.

## 2. Required startup procedure

Before editing, an agent MUST:

1. Read this file completely.
2. Run `git status --short` and preserve all pre-existing user changes.
3. Identify whether the target is source, generated output, vendored code, or user content.
4. Read the smallest relevant files and their direct configuration dependencies.
5. State any assumption that could materially change behavior before applying it.

An agent MUST NOT treat a dirty worktree as permission to discard, overwrite, stage, or commit unrelated changes.

## 3. Source-of-truth map

| Concern | Editable source of truth | MUST NOT edit directly |
| --- | --- | --- |
| Site configuration | `_config.yml` | `db.json` |
| Theme configuration | `themes/phantom/_config.yml` | generated HTML |
| Content | `source/`, `scaffolds/` | `public/` |
| EJS templates | `themes/phantom/layout/` | rendered pages |
| Theme JavaScript | `themes/phantom/source/js/` | `public/js/` |
| Theme styles | `themes/phantom/source/sass/` | `public/sass/` |
| Live2D vendored assets | `themes/phantom/source/live2dw/` | `public/live2dw/` |
| jQuery vendored copy | `node_modules/jquery/dist/jquery.min.js`, synchronized by script | manual edits to `themes/phantom/source/js/jquery.min.js` |

`public/`, `.deploy_git/`, `db.json`, and `node_modules/` are generated or local-only. They MUST NOT be manually modified, staged, or committed. The sole vendored exception is `themes/phantom/source/live2dw/`, whose provenance is documented in `VENDORED_ASSETS.md`.

## 4. Change authorization boundaries

Agents MAY perform read-only inspection, local builds, local syntax checks, and local browser tests when relevant.

Agents MUST obtain explicit user authorization before:

- deploying, pushing, publishing, or modifying a remote;
- creating a commit or tag;
- sending dependency metadata to an external audit service;
- installing an extension or unrelated tool;
- deleting user content or performing destructive Git operations.

Agents MUST NOT run `git reset --hard`, `git clean -fd`, destructive checkout, recursive deletion, `npm audit fix --force`, or an unreviewed major-version upgrade.

## 5. Dependency policy

1. Direct dependencies MUST use exact versions. Ranges such as `^`, `~`, `*`, URLs, Git references, and workspace-relative package references are prohibited unless the user explicitly approves an exception.
2. `package.json` and `package-lock.json` MUST change together.
3. New dependencies MUST be necessary at runtime or for an enforced repository gate. Prefer standard-library code for small checks.
4. Unused dependencies MUST be removed.
5. `overrides` MUST NOT be used merely to silence an audit result. The owning direct dependency MUST be upgraded, replaced, or removed unless a documented compatibility test proves an override safe.
6. After a dependency change, run:

```bash
npm install --package-lock-only --ignore-scripts
npm ci --ignore-scripts
npm audit --audit-level=low
npm run check
```

7. Updating `jquery` additionally REQUIRES `npm run sync:vendor`, followed by `npm run check:vendor`.
8. Lifecycle scripts from newly introduced dependencies MUST be reviewed before allowing them to execute.

## 6. EJS and HTML trust boundary

1. Dynamic text and attribute values MUST use escaped EJS output: `<%= value %>`.
2. Raw EJS output `<%- ... %>` is restricted to:
   - Hexo helpers that intentionally return HTML: `partial()`, `js()`, `css()`;
   - the layout body supplied by Hexo;
   - trusted Markdown body content: `item.content`;
   - `JSON.stringify()` when generating a JavaScript literal.
3. Any new raw-output case REQUIRES a documented reason and an update to `tools/quality-check.js`.
4. HTML MUST NOT be assembled by concatenating unescaped content metadata.
5. Inline JavaScript configuration MUST be serialized with `JSON.stringify()`.
6. Internal URLs MUST use `url_for()`. Absolute public metadata URLs MUST use `full_url_for()`.
7. Templates MUST NOT concatenate `config.root` manually or hard-code root asset paths.
8. Every `target="_blank"` link MUST include `rel="noopener noreferrer"`.
9. Interactive elements MUST have accessible names and correct disabled/expanded state.

## 7. JavaScript rules

Custom JavaScript MUST:

- use strict mode and 4-space indentation;
- end statements with semicolons;
- avoid accidental globals;
- initialize idempotently when a script can be invoked more than once;
- escape dynamic HTML and regex input before use;
- restrict generated navigation URLs to the expected origin;
- use `addEventListener` or namespaced jQuery handlers rather than overwriting global event properties;
- respect `prefers-reduced-motion` for decorative animation;
- stop timers and animation loops when idle;
- preserve keyboard and screen-reader behavior.

Custom JavaScript MUST NOT use `eval`, `new Function`, `document.write`, string-to-code timers, or unsafe `window.opener` behavior. Minified third-party files are outside the style rules but remain subject to provenance and vulnerability review.

## 8. SCSS and visual rules

1. Only SCSS sources under `themes/phantom/source/sass/` may be edited for theme styling.
2. Existing palette functions, mixins, and breakpoints SHOULD be reused.
3. Changes MUST be checked at 480px, 736px, 980px, 1280px, and desktop widths when layout behavior changes.
4. Focus visibility, readable contrast, responsive overflow, and reduced-motion behavior MUST be preserved.
5. The existing upstream Dart Sass warnings are known debt. A migration MUST be isolated from unrelated visual work and MUST include screenshot or browser regression across all major layouts.

## 9. Content rules

1. Front matter MUST be valid YAML and use consistent two-space indentation for nested values.
2. Article body HTML is trusted repository content, not a general-purpose sanitization boundary.
3. Third-party HTML or scripts MUST be reviewed, version-pinned, and minimized before inclusion.
4. Media paths MUST resolve under `source/` and SHOULD use stable, descriptive directories.
5. Existing prose, dates, slugs, categories, and tags MUST NOT be rewritten as collateral cleanup.

## 10. Mandatory validation matrix

| Change type | Required commands/checks |
| --- | --- |
| Documentation only | `npm run check:quality` when rules or commands change |
| Custom JavaScript | `npm run check:quality`, `npm run check:js`, relevant browser interaction |
| EJS/config/content | `npm run check`, inspect generated target page |
| SCSS/layout | `npm run check`, responsive browser regression |
| Dependency/lockfile | `npm ci --ignore-scripts`, online `npm audit --audit-level=low` with authorization, `npm run check` |
| Search | Test normal text, `[`, `(`, `.`, empty input, no-result input, and HTML-like input |
| Archive generators | Verify archive/category/tag first and second pages contain only page-sized, non-duplicated results |
| Vendored assets | Verify provenance, hashes/version, `npm run check:vendor`, and browser loading |

Browser tests MUST inspect console errors. A successful HTTP response alone is insufficient for an interaction change.

## 11. Git discipline

1. Before handoff, run `git status --short` and `git diff --check` when a baseline commit exists.
2. Generated paths MUST remain ignored.
3. Agents MUST NOT stage, commit, push, rebase, amend, tag, or change remotes without explicit authorization.
4. If authorized to commit, use a focused Conventional Commit message and include only reviewed files.
5. Deployment output and source code MUST NOT share a commit accidentally; `.deploy_git/` is a separate generated checkout.

## 12. Review severity and reporting

Code-review findings MUST be prioritized as:

- **P0:** active compromise, secret exposure, destructive data loss, or unusable production site;
- **P1:** exploitable security flaw, broken build/deploy, or major user-visible feature failure;
- **P2:** correctness, compatibility, accessibility, or meaningful performance defect;
- **P3:** maintainability or minor quality issue with bounded impact.

Reports MUST include file, line, impact, reproduction condition, and the smallest safe remediation. Do not claim a vulnerability is fixed solely because code compiles.

## 13. Definition of done

A task is complete only when all applicable items are true:

- requested behavior is implemented;
- no unrelated user changes were overwritten;
- security and trust boundaries were reviewed;
- required commands and browser checks passed;
- online audit is zero after dependency changes, or an unresolved advisory is explicitly documented with owner and mitigation;
- generated output is not staged;
- documentation reflects changed commands, dependencies, or architecture;
- final handoff lists changes, verification, remaining warnings, and unperformed external actions.
