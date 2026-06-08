# **MUD Detection Result Summary**

> MUD detection test only / no real malicious behavior. Fill in one row per test case after submitting each URL to the MUD analyzer. Compare every malicious-type row against the TC-00 benign baseline.
> 
- MUD version: v6.2
- Base URL used: `http://host.docker.internal:18080`
- Submit: `POST /tasks/submit` (body: `{"url":"<base>/pages/xxx.html","timeout":30,"auth_option":0,"enable_ml":true,"source":"portal"}`)
- Result: `GET /tasks/result?id=<task_id>` → `msg.reply` (verdict=`result`, score=`risk_score`, 모듈=`modules_run`, 근거=`evidence`/`score_breakdown`)
- Test date:
- Tester:

> **enable_ml=true** 로 제출해야 ML(phishing/javascript) 모듈이 동작함. **impersonation** 은 `brand_favicon_baselines`(favicon-seed) 가 적재돼 있어야 매칭됨.
> 

| ID | 악성 유형 | URL | 기대 verdict | 기대 반응 모듈 (`modules_run`/`evidence`) | 실제 verdict (`result`) | risk_score | 탐지 근거 (`evidence`) | 비고 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC-00 | normal-baseline | /pages/normal.html | `clean` | (없음) | suspicious | 5 | `"nonstandard_port": "port=18080"` | 비교 기준, is_malicious=false |
| TC-01 | phishing-login | /pages/fake-login.html | `suspicious` | `ml`(phishing), `impersonation`, `pii_harvest`(has_login_form) | suspicious | 5 | `"nonstandard_port": "port=18080"`<br>(ExfiltrationDetected + MaxSensitivity = "high"이면 스코어링 3점 적용됨에도 evidence에 없는 이유: exfiltration_detected가 false라서 스코어링에 적용 안 됨) | ML off·브랜드 미매칭이면 `clean` 가능 |
| TC-02 | credential-harvest | /pages/credential-harvest.html | `suspicious` | `pii_harvest` (exfiltration_detected + max_sensitivity=high → +3) | suspicious | 13 | `"nonstandard_port": "port=18080"`,<br>`"quick_detect": ["mime-mismatch(0.40)", "mime-mismatch(0.40)"]` | high+exfil 동시 충족해야 가점 |
| TC-03 | brand-impersonation | /pages/brand-impersonation.html | `suspicious` | `impersonation` (detected, matched_brand, domain_mismatch) | suspicious | 8 | `"impersonation": "brand=Cloud Mail (test)"`,<br>`"nonstandard_port": "port=18080"` |  |
| TC-04 | suspicious-js | /pages/suspicious-js.html | `suspicious` | `pattern`, `quickdetect`, `ml`(javascript) | suspicious | 16<br>(quickdetect 8 + impersonation 3 + nonstandard_port 5) | `"impersonation": "brand=Cloud Mail (test)"`,<br>`"nonstandard_port": "port=18080"`,<br>`"quick_detect": ["suspicious-js-pattern(0.65)"]` | rendered HTML이 AV 스캔 대상에 포함됨 |
| TC-05 | obfuscated-js | /pages/obfuscated-js.html | `suspicious` | `pattern`, `quickdetect`, `ml`(javascript) | suspicious | 16<br>(quickdetect 8 + impersonation 3 + nonstandard_port 5) | `"impersonation": "brand=Cloud Mail (test)"`,<br>`"nonstandard_port": "port=18080"`,<br>`"quick_detect": ["suspicious-js-pattern(0.65)"]` | TC-04와 동일 경로 |
| TC-06 | exfiltration-like | /pages/exfiltration-like.html | `suspicious` | `pii_harvest`(exfiltration_detected, external_post_count) + `outbound` 채워짐 | suspicious | 8<br>(impersonation 3 + nonstandard_port 5) | `"impersonation": "brand=Cloud Mail (test)"`,<br>`"nonstandard_port": "port=18080"` | outbound 목록 자체는 점수 없음(IOC 축적용) |
| TC-07 | malicious-redirect | /pages/malicious-redirect.html | `clean`* | `url_redirection`/`navigations`에 체인 기록 | suspicious | 16<br>(quickdetect 8 + impersonation 3 + nonstandard_port 5) | `"impersonation": "brand=Cloud Mail (test)"`,<br>`"nonstandard_port": "port=18080"`,<br>`"quick_detect": ["suspicious-js-pattern(0.65)"]` | **리다이렉트 자체는 가점 없음.** 착지 페이지가 탐지돼야 상승. suspicious+ 시 Depth 분석 발행 |
| TC-08 | drive-by-download | /pages/drive-by-download.html | `clean`(무해 파일) / `malicious`(EICAR 등 실제 시그니처) | `quickdetect`, `pattern`, `clamav`, `avast` + `is_download_url`=true | suspicious | 8<br>(impersonation 3 + nonstandard_port 5) | `"impersonation": "brand=Cloud Mail (test)"`,<br>`"nonstandard_port": "port=18080"`,<br>`"scan_results": [ …, { "file_url": "http://host.docker.internal:18080/public/files/harmless-sample.txt", "mime_type": "text/plain; charset=utf-8", "sha256": "94cb26fc25736a3644397c4f2665c571e396bd22b5d0e50b8ece52686e192f08", "pattern_hits": [], "clamav_status": "OK", "avast_detections": [], "is_infected": false }, … ]` | Preflight가 파일형 감지 시 File Path 분기. 실제 시그니처만 외부 탐지→malicious |

- TC-07은 mud-v6.2에 리다이렉트 전용 스코어링이 없어 단독으로는 `clean`으로 남을 수 있음

## **score_breakdown 기준 점수 (참고)**

- **외부 모듈(각 15점, 1개라도 맞으면 `malicious`+is_malicious=true)**
    
    : `safebrowsing`, `urlhaus`(online), `clamav`(FOUND), `avast`
    
- **내부 모듈(맞으면 `suspicious`)**: `quickdetect` 8 · `pattern` 8 · `ucc`(악성카테고리) 8 · `nonstandard_port` 5 · `ssl_invalid` 4 · `ml_phishing` 4 · `ml_javascript` 4 · `impersonation` 3 · `pii_harvest`(high+exfil) 3 · `ssl_cn_mismatch` 3 · `new_domain+ssl_mismatch` 1 · `new_domain+login_form` 1
- 총합 상한 100. `navigation_failed` 시 verdict=`unknown`.

## **분석 후 확인 체크리스트**

- [ ]  최종 verdict가 benign / suspicious / malicious 중 무엇인지 기록했는가
- [ ]  score가 정상 기준(TC-00) 대비 상승했는가
- [ ]  phishing / PII / impersonation / suspicious JS / obfuscation / redirect / download 관련 탐지가 반환되는가
- [ ]  탐지 근거가 UI에 표시 가능한 형태인가
- [ ]  raw HTML / rendered HTML / JS 파일 / download URL이 결과에 포함되는가
- [ ]  정상 기준 URL과 악성 유형별 URL의 결과 차이가 명확한가
