# MUD-test-lab

A controlled, **inert** test bed for validating **MUD v6.2 malicious-URL detection**.

The goal is **not** to confirm that MUD merely collects HTML/JS/redirects/downloads.
The goal is to verify that, for each malicious-URL category, MUD's analyzer returns a
**suspicious / malicious** (or otherwise category-specific) verdict based on the
detection triggers embedded in each page — while the benign baseline stays benign.

> **MUD detection test only / no real malicious behavior.**
> No real malware, mining, PII theft, external exfiltration, or C2 is implemented.
> Every "malicious" element is an inert / simulated trigger. All inputs go to a
> local mock endpoint (`/api/mock-collect`) or the console only — never to an
> external server.

<br>

## Project structure

```text
MUD-test-lab/
├─ package.json
├─ server.js                # Express server (PORT env || 18080, binds 0.0.0.0)
├─ Dockerfile
├─ README.md
├─ pages/
│  ├─ index.html            # landing: list of all cases + expected detection
│  ├─ normal.html           # TC-00 benign baseline
│  ├─ fake-login.html       # TC-01 phishing login
│  ├─ credential-harvest.html  # TC-02 PII/credential harvest
│  ├─ brand-impersonation.html # TC-03 fictional-brand impersonation
│  ├─ suspicious-js.html    # TC-04 suspicious JS
│  ├─ obfuscated-js.html    # TC-05 obfuscated JS
│  ├─ exfiltration-like.html   # TC-06 exfiltration-like (local-only)
│  ├─ malicious-redirect.html  # TC-07 redirect
│  └─ drive-by-download.html   # TC-08 download behavior
├─ public/
│  ├─ css/style.css
│  ├─ js/{suspicious,obfuscated,exfiltration-like,redirect}.js
│  ├─ files/harmless-sample.txt
│  └─ favicon.svg
├─ api/
│  └─ mock-collect.js       # local mock handler (logs only, never stores/forwards)
├─ requests/
│  └─ mud-test-urls.json    # URL list to submit to MUD (edit baseUrl)
└─ results/
   └─ mud-detection-summary-template.md
```

<br>

## Run (local)

```bash
npm install
npm start
```

Then open: `http://localhost:18080` (redirects to `/pages/index.html`).

- Health check: `http://localhost:18080/health` → `{"status":"ok"}`
- `PORT` is configurable via the `PORT` env var (default `18080`).

<br>

## Run (Docker)

```bash
docker build -t mud-test-lab .
docker run -p 18080:18080 mud-test-lab
```

### Docker access note

If MUD runs inside its own container, `localhost` points to that container, not this server.
Use one of:

```text
http://host.docker.internal:18080      # MUD container -> host
http://mud-test-lab:18080              # same Docker network (by service/container name)
```

<br>

## Test URL list

Set `baseUrl` in [`requests/mud-test-urls.json`](requests/mud-test-urls.json), then submit each path:

| ID | Type | Path | Expected detection |
|------|------|------|--------------------|
| TC-00 | normal-baseline | `/pages/normal.html` | benign |
| TC-01 | phishing-login | `/pages/fake-login.html` | phishing / credential input |
| TC-02 | credential-harvest | `/pages/credential-harvest.html` | PII / credential harvest |
| TC-03 | brand-impersonation | `/pages/brand-impersonation.html` | impersonation-like / phishing-like |
| TC-04 | suspicious-js | `/pages/suspicious-js.html` | suspicious JS / pattern / ML |
| TC-05 | obfuscated-js | `/pages/obfuscated-js.html` | obfuscation / suspicious JS |
| TC-06 | exfiltration-like | `/pages/exfiltration-like.html` | exfiltration-like / outbound-like |
| TC-07 | malicious-redirect | `/pages/malicious-redirect.html` | redirect risk / suspicious navigation |
| TC-08 | drive-by-download | `/pages/drive-by-download.html` | download URL / download behavior |

<br>

## Test case descriptions

- **TC-00 normal** — Ordinary company info/notice page. No forms, scripts, redirects, or downloads. Benign baseline.
- **TC-01 fake-login** — Generic "Secure Portal / Account Verification" page with ID + password fields. Submit posts only to the local mock endpoint.
- **TC-02 credential-harvest** — Collects email / password / phone / verification code with "account/security re-verification" wording.
- **TC-03 brand-impersonation** — Fictional "Cloud Mail / Secure Drive / Payment Center" brand with favicon, title, header, and login UI. No real logo/trademark.
- **TC-04 suspicious-js** — Loads `suspicious.js` containing flagged identifiers/patterns (`collectCredentialsMock`, `simulatedBeacon`, `suspiciousEvalPattern`, …). Inert.
- **TC-05 obfuscated-js** — Loads `obfuscated.js` (base64-like blobs, eval-like wrapper, mangled names). Nothing is decoded-and-executed.
- **TC-06 exfiltration-like** — Loads `exfiltration-like.js` that gathers inputs and beacons them **only** to local `/api/mock-collect`.
- **TC-07 malicious-redirect** — `location.href` / `window.open` / commented meta refresh; auto + click redirects to safe targets (`/pages/normal.html`, `example.invalid`).
- **TC-08 drive-by-download** — Button download + script-triggered download simulation of the harmless `harmless-sample.txt`.

<br>

## What to verify after MUD analysis

Record results in [`results/mud-detection-summary-template.md`](results/mud-detection-summary-template.md):

- Whether the final verdict is **benign / suspicious / malicious**
- Whether the **score** rose relative to the normal baseline (TC-00)
- Whether **phishing / PII / impersonation / suspicious JS / obfuscation / redirect / download** detections are returned
- Whether the **detection rationale** is presented in a UI-displayable form
- Whether **raw HTML, rendered HTML, JS files, and the download URL** are included in the results
- Whether the **difference between the benign baseline and each malicious-type URL** is clear

<br>

## Safety notes

- No real malware is stored in this repository.
- No real phishing pages are copied; no real brand logos/favicons are used.
- No real personal information is collected.
- `/api/mock-collect` logs only a field-name summary; it does not store or forward submitted data.

<br>

## Purpose

A safe, repeatable environment to validate MUD v6.2 detection behavior per malicious-URL
category before running against real-world samples. Every detection trigger is implemented
as inert / simulated code; nothing here can cause real harm.
