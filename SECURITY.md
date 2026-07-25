# Security Policy

## Supported versions

Security fixes are applied on the latest published release line on npm. Pre-1.0 versions may receive fixes on a best-effort basis.

## Reporting a vulnerability

Please **do not** open a public GitHub issue for security vulnerabilities.

Email the maintainers with:

- A description of the issue and impact
- Steps to reproduce or a proof of concept (if available)
- Affected package version(s)

We aim to acknowledge reports within 7 days and will coordinate a fix and disclosure timeline.

## Scope notes

This library renders precomputed series in SVG. It does not fetch market data or execute remote code from series payloads. Still report XSS or prototype-pollution risks if untrusted strings are rendered unsafely.
