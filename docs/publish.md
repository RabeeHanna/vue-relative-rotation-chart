# Publishing to npm (manual)

npm publish for this package is **manual only**. GitHub Actions publish / OIDC provenance is not used (npm is deprecating that path for many accounts).

**A failing CI run does not publish or unpublish npm.** CI is a preflight check. If the registry still shows an old version, complete the manual publish steps below.

## Before you publish

On `develop`, with a clean tree:

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm test -- tests/pack/packConsumer.test.ts
```

CI on `master` / `develop` runs the same pack-consumer gate after build.

## Version and git

1. Bump `package.json` version and `CHANGELOG.md` on `develop`.
2. Commit, merge `develop` → `master`.
3. Tag `master`: `git tag -a vX.Y.Z -m "Release X.Y.Z"`
4. Push `develop`, `master`, and the tag.
5. Create a GitHub Release from the tag.

## npm login (interactive)

Publishing requires an interactive npm login with **2FA / passkey**:

```bash
npm login
```

Typical flow:

1. CLI opens the npm website in your browser (or shows a URL).
2. Complete sign-in on the web (QR code → phone → Face ID / passkey, or email OTP).
3. Return to the terminal when login succeeds.

Verify:

```bash
npm whoami
```

## Publish

From `master` after `npm run build`:

```bash
npm publish --access public
```

If the CLI asks for a one-time password from your authenticator app:

```bash
npm publish --access public --otp=123456
```

`prepack` runs automatically and fails if `dist/` is missing or incomplete.

## After publish

```bash
npm view vue-relative-rotation-chart version
```

Update host applications to `^X.Y.Z` when appropriate.

## Do not

- Rely on `NPM_TOKEN` in GitHub Actions for publish (workflow removed).
- Publish without running the pack-consumer test locally or on CI.
- Commit `dist/` — only the tarball from `npm pack` / publish includes build output.
