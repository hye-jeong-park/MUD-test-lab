# Todo test pages - additional MUD detection cases

New **inert / simulated** detection-trigger pages, staged here for review before being
promoted to `pages/complete/` and wired into `server.js`, `pages/complete/index.html`,
and `requests/mud-test-urls.json`.

Same rules as the rest of the lab apply to every page here:

> **MUD detection test only / no real malicious behavior.**
> No real malware, mining, PII theft, external exfiltration, or C2. Every "malicious"
> element is an inert / simulated trigger. All inputs go to the local mock endpoint
> (`/api/mock-collect`) or the console only 커밋  never to an external server. All outbound
> links use the non-routable `example.invalid` domain or a local safe path.

The next free ID after the existing `TC-08` is `TC-09`. Proposed assignments:

| ID | Type | File | Expected detection |
|------|------|------|--------------------|
| TC-09 | fake-update | `fake-update.html` | social engineering / forced download / drive-by |
| TC-10 | tech-support-scam | `tech-support-scam.html` | scareware / fake-alert / tech-support scam |
| TC-11 | cryptojacking | `cryptojacking.html` | cryptojacking / in-browser miner pattern |
| TC-12 | clickfix-captcha | `clickfix-captcha.html` | ClickFix fake-CAPTCHA / paste-to-run lure |
| TC-13 | clipboard-hijack | `clipboard-hijack.html` | clipboard hijack ("clipper") pattern |
| TC-14 | homograph-typosquat | `homograph-typosquat.html` | lookalike domain / IDN homograph / typosquat |
| TC-15 | gift-card-scam | `gift-card-scam.html` | prize / lottery / advance-fee scam |
| TC-16 | fake-invoice | `fake-invoice.html` | invoice / billing phishing |
| TC-17 | hidden-iframe | `hidden-iframe.html` | hidden-iframe injection / malvertising pattern |
| TC-18 | browser-fingerprint | `browser-fingerprint.html` | device fingerprinting / stealth tracking |
| TC-19 | data-uri-download | `data-uri-download.html` | fileless / data-URI / Blob download |
| TC-20 | otp-phishing | `otp-phishing.html` | OTP / 2FA-interception phishing |
| TC-21 | seo-poisoning | `seo-poisoning.html` | SEO poisoning / cloaking / keyword stuffing |
| TC-22 | push-notification-scam | `push-notification-scam.html` | notification-permission abuse / "click Allow" lure |

## Case notes

- **TC-09 fake-update** - Fictional "SwiftView Player" out-of-date page; urgency + forced
  download that auto-fires a harmless local `harmless-sample.txt` (renamed `*-Update.txt`).
- **TC-10 tech-support-scam** - Scareware "your PC is blocked" page with fake threat names and a
  reserved 555 support number. No dialer, no `beforeunload` trap, no transfer.
- **TC-11 cryptojacking** - Miner-shaped script (`CoinMinerLite`, `startMining`, `stratumPoolUrl`).
  No WebAssembly, no Web Worker, no pool connection, no CPU loop - hash rate is a fixed `0`.
- **TC-12 clickfix-captcha** - "ClickFix" fake CAPTCHA with Win+R / Ctrl+V / Enter steps. The
  Clipboard API is never called; the "command" is a labelled placeholder; nothing executes.
- **TC-13 clipboard-hijack** - Crypto-clipper shape with legit/attacker placeholder wallets. No
  `copy` listener overwrites the clipboard; `writeText`/`execCommand('copy')` are never called.
- **TC-14 homograph-typosquat** - Lookalike-domain list (digit swaps, `l`→`1`, Cyrillic homoglyph
  / punycode, keyword padding). All links resolve to `example.invalid` (non-routable).
- **TC-15 gift-card-scam** - Prize / advance-fee lure with countdown + "processing fee" card field.
  Posts field names to the local mock only; no charge, no storage.
- **TC-16 fake-invoice** - Overdue-invoice billing phishing (fictional "GlobalPay"). "Download
  invoice" serves the harmless sample; pay form posts field names to the local mock only.
- **TC-17 hidden-iframe** - Benign visible article hiding zero-size / `display:none` / dynamically
  injected iframes. Targets are `/pages/normal.html` or `example.invalid` only.
- **TC-18 browser-fingerprint** - Fingerprinting-shaped collection (UA, platform, screen, timezone,
  canvas, WebGL). Reads coarse non-PII signals; beacons only signal **names** to the local mock.
- **TC-19 data-uri-download** - Client-side downloads via `data:` URI and `Blob` /
  `URL.createObjectURL`. Harmless plain text only; no server-hosted file, no executable.
- **TC-20 otp-phishing** - Two-step verification page capturing OTP + backup code. No real OTP is
  sent/relayed/intercepted; posts field names to the local mock only.
- **TC-21 seo-poisoning** - Keyword-stuffed `<meta>` tags, hidden keyword blocks, and off-screen
  cloaked links. Inert; all links are non-routable `example.invalid`.
- **TC-22 push-notification-scam** - "Click Allow to continue" notification-permission lure.
  `Notification.requestPermission()` only fires on explicit click; no service worker / push
  subscription is ever created.

## Promote a case to the lab

When a page is approved:

1. Move it from `pages/todo/` to `pages/complete/`.
2. Add a row to `TEST_PAGES` in `server.js`.
3. Add a `<li class="card">` entry to `pages/complete/index.html`.
4. Add a case object to `requests/mud-test-urls.json`.
5. Add the row + description to the tables in `README.md`.
6. Record the verdict in `results/`.
