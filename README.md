# mud-test-lab

A controlled mock URL test site for validating MUD v6.2 detection scenarios.

This project provides safe and reproducible test pages for URL analysis, file download detection, 2-depth traversal, favicon impersonation, PII form detection, and double-archive file scanning.

> This repository does not contain real malware.  
> Test files are generated using the EICAR test string for security product validation.

<br>

## Test Scenarios

### 1. Double Archive Download

Tests whether MUD can detect and analyze a downloaded archive that contains another archive.

```text
double_archive.zip
└── inner.zip
    └── eicar.com
````

Test URL:

```text
http://localhost:18080/files/double_archive.zip
```

---

### 2. Non-download URL with 2-depth Traversal

Tests whether MUD can follow links from an initial web page up to depth 2.

```text
/landing.html
→ /depth1.html
→ /depth2-login.html
```

Test URL:

```text
http://localhost:18080/landing.html
```

---

### 3. Favicon Impersonation + PII Form + File Download

Tests a combined scenario with:

* favicon collection
* brand favicon matching
* login form detection
* email/password/phone input fields
* POST request detection
* file download link detection

Test URL:

```text
http://localhost:18080/fake-brand-login-download.html
```

<br>

## Project Structure

```text
mud-url-test-lab/
├── server.py
└── site/
    ├── index.html
    ├── landing.html
    ├── depth1.html
    ├── depth2-login.html
    ├── fake-brand-login-download.html
    ├── favicon.svg
    └── files/
        └── double_archive.zip
```
<br>
## Run

Start the test server:

```bash
python3 server.py
```

Open:

```text
http://localhost:18080
```

<br>

## Docker Access Note

If MUD is running inside a Docker container, `localhost` points to the container itself.

Use one of the following instead:

```text
http://host.docker.internal:18080
```

or, if both services are in the same Docker network:

```text
http://mud-url-test-lab:18080
```
<br>

## Safety Notes

* Do not store real malware in this repository.
* Do not copy real phishing pages.
* Do not use real brand logos or favicons.
* Do not collect real personal information.
* The POST endpoint only accepts test requests and does not store submitted data.

<br>

## Purpose

This project is intended to provide a safe, repeatable test environment before running MUD v6.2 against real-world malicious URL samples.
