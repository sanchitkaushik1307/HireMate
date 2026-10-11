# HIREMATE — JOB DISCOVERY ENGINE
## Phase 1: Source Research, Validation Strategy & Architecture Report

> **Document Type:** System Architecture & Feasibility Report  
> **Status:** Research & Analysis Complete (Phase 1 — No Code or Database Changes Made)  
> **Audience:** Core Engineering & Product Teams  
> **Target Audience:** Indian College Students, Freshers & Early-Career Tech Candidates  

---

## 1. Executive Summary

HireMate is building a high-trust, personalized job-discovery engine tailored for Indian college students and early-career job seekers. The core market problem is clear: students are overwhelmed by fragmented job portals, ghost postings, expired links, US-only remote jobs mislabelled as global, senior roles masquerading as entry-level, and recruiter consultancies demanding fees or redirecting through ad-heavy referral chains.

Unlike generic aggregators that scrape indiscriminately, HireMate's engine is designed around **authoritative source verification, strict eligibility filtering, and direct-application fidelity**.

### Key Findings & Architectural Pillars
1. **Authoritative Keyless ATS APIs Are the Foundation:**  
   Applicant Tracking Systems (**Greenhouse Job Board API**, **Lever Postings API**, **Ashby Posting API**, and **SmartRecruiters Posting API**) offer publicly documented, keyless, read-only GET endpoints that represent the single source of truth for hundreds of top technology companies and Indian startups. These endpoints return active job requisitions, job descriptions, office locations, and direct application links directly from the employer's applicant pool.
2. **Major Tech Portal Realities (Google, Microsoft, Amazon):**  
   None of the Big Tech firms (Google, Microsoft, Amazon, Qualcomm, Apple) offer public, authorized developer APIs for their job boards. Their career sites use proprietary single-page apps protected by Cloudflare/Akamai/PerimeterX bot detection. However, they publish machine-readable XML sitemaps and Schema.org `JobPosting` JSON-LD microdata for search indexation. For Phase 1 & 2, attempting direct scraping of closed portals carries high legal and maintenance fragility; instead, ATS-hosted boards provide hundreds of verified opportunities with zero scraping risk.
3. **Existing HireMate Codebase Status:**  
   The existing application features a clean React 18 + Vite frontend and an Express + Drizzle ORM + PostgreSQL backend with Google OAuth and email/password authentication. The `career_profiles` table already persists rich student data: target roles, opportunity type (`internship`, `full-time`, `both`), work arrangement, preferred locations, skills, education, experience level, and projects. However, **zero job-related tables, ingestion workers, queues, or job search endpoints currently exist**. The dashboard controller currently returns `recommendedJobs: []`.
4. **Validation-First Philosophy:**  
   A 200 HTTP OK response is **not** evidence that a job is active. The engine introduces a multi-state validation lifecycle (`newly_discovered`, `pending_validation`, `verified_active`, `needs_recheck`, `closed`, `invalid`, `quarantined`) with exponential rechecking and multi-sync confirmation before marking a vacancy closed.
5. **India-First Eligibility Engine:**  
   A deterministic, rule-based filtering layer executes prior to ranking. It validates location boundaries (Indian cities, explicitly global/India-eligible remote), employment type (internships vs. fresher vs. trainee), experience constraints (0–1 years max for fresher tiers), and strict negative regex filters (e.g., rejecting US work authorization requirements such as "US Citizen / Green Card / W2 / C2C").
6. **Safety & Zero-Impact Confirmation:**  
   This entire report is research and architecture only. **No application code, database records, schema migrations, environment variables, or authentication workflows were touched or altered.**

---

## 2. Actual Existing Architecture Findings

*All findings in this section are **Verified from Existing Code**.*

### 2.1 Frontend Framework & Navigation
- **Framework & Bundler:** React 18.3.1 with Vite 5.4.5, TypeScript 5.6.2, Tailwind CSS 3.4.11, Lucide React icons, and GSAP 3.15.0 (`client/package.json`).
- **Routing Configuration (`client/src/App.tsx`):**
  - `/` &rarr; `LandingPage`
  - `/login` &rarr; `LoginPage`
  - `/signup` &rarr; `SignupPage`
  - `/dashboard` &rarr; `DashboardPage` (Protected via `ProtectedRoute`)
  - `/onboarding` &rarr; `OnboardingPage` (Protected)
  - `/profile` &rarr; `OnboardingPage` (Protected)
  - `/design-system` &rarr; `DesignSystemPlayground` (Dev/Preview only)
  - `*` &rarr; Redirects unconditionally to `/`
- **Navigation Disconnects Identified:**
  - The `Sidebar` component (`client/src/components/dashboard/Sidebar.tsx`) renders navigation links for:
    - `Dashboard` (`/dashboard`)
    - `Jobs` (`/jobs`)
    - `Applications` (`/applications`)
    - `Resume` (`/resume`)
    - `Hackathons` (`/hackathons`)
    - `AI Assistant` (`/assistant`, badged "Soon")
    - `Saved` (`/saved`)
    - `Settings` (`/settings`)
  - **Critical Finding:** There is **no route for `/jobs`, `/applications`, `/resume`, `/hackathons`, or `/saved`** in `App.tsx`. Clicking `/jobs` in the sidebar falls through to the catch-all redirect to `/`.
- **Existing Jobs Presentation:**
  - On the `DashboardPage` (`client/src/pages/Dashboard.tsx`), the dashboard renders `<RecommendedJobs>` (`client/src/components/dashboard/RecommendedJobs.tsx`).
  - `<RecommendedJobs>` renders `<JobPreview>` cards (`client/src/components/dashboard/JobPreview.tsx`) displaying: title, company, location, jobType, matchPercentage, skills badges, salaryRange, bookmark button, and a "View job" CTA button.
  - However, the component is passed `data.recommendedJobs` from `/api/dashboard/overview`, which is currently hardcoded to an empty array.

### 2.2 Backend Framework, API Conventions & Middleware
- **Framework:** Node.js with Express 4.21.0 and TypeScript, executed in development via `tsx watch src/app.ts` (`server/package.json`).
- **API Conventions:** RESTful JSON APIs mounted under `/api/*`.
- **CORS & Credentials:** Configured with `credentials: true` and `origin: env.CLIENT_URL` (`http://localhost:3000`).
- **Session & Authentication:**
  - Uses `express-session` backed by PostgreSQL via `connect-pg-simple` writing to a `user_sessions` table (`server/src/config/session.ts`).
  - Passport.js initialized with Local Strategy (`email` + `bcrypt` password hash) and Google OAuth 2.0 Strategy (`passport-google-oauth20`).
  - Authentication guard: `requireAuth` middleware (`server/src/middleware/requireAuth.ts`) checks `req.isAuthenticated()` or `req.session.userId`.
- **Background Jobs, Workers & Queues:**
  - **Critical Finding:** **Zero background worker or queue infrastructure exists.** There is no Redis, BullMQ, Agenda, Bree, or Node-cron installed in `server/package.json`.
  - All current backend operations run synchronously inside Express HTTP request-response cycles.
- **Database Connection & Drizzle ORM:**
  - PostgreSQL connection pooled via `pg` (`pg.Pool`), configured in `server/src/config/database.ts`.
  - ORM: Drizzle ORM 0.33.0 with Drizzle Kit 0.24.0.
  - Setup script: `server/src/scripts/setup-db.ts` uses raw SQL queries to ensure idempotent table creation (`CREATE TABLE IF NOT EXISTS`).

### 2.3 Existing Database Tables & Schema Findings
The database currently contains exactly four tables in the `public` schema (verified via PostgreSQL query):
1. `users` (`server/src/models/schema.ts`):
   - `id`: UUID (Primary Key, `gen_random_uuid()`)
   - `name`: VARCHAR(255)
   - `email`: VARCHAR(255) UNIQUE
   - `password_hash`: TEXT (nullable for Google-only users)
   - `google_id`: VARCHAR(255) UNIQUE
   - `avatar_url`: TEXT
   - `email_verified`: BOOLEAN DEFAULT false
   - `created_at`: TIMESTAMPTZ DEFAULT NOW()
   - `updated_at`: TIMESTAMPTZ DEFAULT NOW()
2. `user_sessions`:
   - `sid`: VARCHAR PRIMARY KEY
   - `sess`: JSON
   - `expire`: TIMESTAMPTZ (Indexed via `idx_session_expire`)
3. `career_profiles` (`server/src/models/schema.ts`):
   - `id`: UUID PRIMARY KEY
   - `user_id`: UUID UNIQUE REFERENCES `users(id)` ON DELETE CASCADE
   - `target_roles`: JSONB (`string[]`, e.g., `["Software Development Engineer", "Backend Developer"]`)
   - `opportunity_type`: VARCHAR(50) (`'internship' | 'full-time' | 'both'`)
   - `preferred_locations`: JSONB (`string[]`, e.g., `["Bengaluru", "Remote", "Hyderabad"]`)
   - `work_arrangement`: VARCHAR(50) (`'on-site' | 'hybrid' | 'remote' | 'flexible'`)
   - `skills`: JSONB (`string[]`, e.g., `["TypeScript", "React", "Node.js", "PostgreSQL"]`)
   - `education`: JSONB (`EducationData`, storing `{ degree, institution, fieldOfStudy, gradYear }`)
   - `experience_level`: VARCHAR(50) (`'student' | 'fresher' | 'internship' | 'entry-level' | 'experienced'`)
   - `projects`: JSONB (`ProjectData[]`, storing `[{ title, organization, description, startDate, endDate }]`)
   - `onboarding_step`: INTEGER DEFAULT 1
   - `onboarding_completed`: BOOLEAN DEFAULT false
   - `created_at`, `updated_at`: TIMESTAMPTZ
4. `resumes` (`server/src/models/schema.ts`):
   - `id`: UUID PRIMARY KEY
   - `user_id`: UUID REFERENCES `users(id)` ON DELETE CASCADE
   - `file_name`: VARCHAR(255)
   - `storage_key`: VARCHAR(255) UNIQUE (stored locally on disk in `uploads/resumes/`)
   - `mime_type`: VARCHAR(100)
   - `file_size`: INTEGER
   - `created_at`, `updated_at`: TIMESTAMPTZ

### 2.4 Existing Job-Related Artifacts & Gaps
- **Job Tables:** None. No table exists for jobs, job sources, sync history, bookmarks, or applications.
- **Job Endpoints:** None. `server/src/controllers/dashboard.controller.ts` line 90 hardcodes:
  ```typescript
  recommendedJobs: [],
  applications: { applied: 0, interview: 0, offer: 0 },
  ```
- **Client Types:** `client/src/lib/api.ts` defines interface `JobItem` (`id`, `title`, `company`, `location`, `jobType`, `matchPercentage`, `skills`, `salaryRange`, `isSaved`), which matches the UI expectation in `JobPreview.tsx`.
- **Missing Profile Attributes:**
  - The current `career_profiles` table does **not** store graduation CGPA/percentage, minimum expected stipend/salary, or citizenship/work authorization status.
  - The `education` object stores `gradYear` as a free string (e.g., `"2025"` or `"2026"`).

---

## 3. Research Real Job Data Sources

*Citations and endpoints in this section are **Verified from Official Documentation** or **Verified by Technical Inspection**.*

To build an ethical, resilient, and high-precision job discovery engine, we evaluated four distinct tiers of potential data sources:

```
┌────────────────────────────────────────────────────────────────────────┐
│                      HIREMATE INGESTION TIERS                          │
├────────────────────────────────────────────────────────────────────────┤
│  TIER 1 (Authoritative ATS APIs)                                       │
│  Greenhouse • Lever • Ashby • SmartRecruiters                          │
│  [Keyless, Public GET APIs • 100% Direct Application Fidelity]         │
├────────────────────────────────────────────────────────────────────────┤
│  TIER 2 (Curated Tech Company Registries & Sitemaps)                   │
│  Schema.org JobPosting Microdata • Authorized XML Sitemaps             │
│  [Employer-Hosted Pages • Clean Canonical URLs]                        │
├────────────────────────────────────────────────────────────────────────┤
│  TIER 3 (India Startup Registries & Ecosystem Feeds)                   │
│  YC Work at a Startup • GitHub Verified Fresh Graduate Curations       │
│  [High Signal for College Students • Source-Verification Required]     │
├────────────────────────────────────────────────────────────────────────┤
│  TIER 4 (Restricted / Unusable Aggregators - EXCLUDED)                 │
│  LinkedIn • Indeed • Naukri • Unofficial Private Endpoints            │
│  [Strict ToS Prohibitions • Anti-Bot Defense • Ghost Listings]         │
└────────────────────────────────────────────────────────────────────────┘
```

### 3.1 Category A: Official Company Career Sites (Big Tech)

| Company | Official Career Portal | Public Developer API Available? | Documented Access Mechanism | Reliability & Freshness | Direct Apply URL Available? | Feasibility for V1 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Google** | `careers.google.com` | **No** (Internal GraphQL/REST only) | Public HTML pages emit Schema.org `JobPosting` JSON-LD microdata. Sitemaps located at `/jobs/sitemap.xml`. | Moderate. Client-side Angular/Polymer app; direct HTTP requests receive empty shells unless rendered. | Yes (to Google careers portal). | **Deferred** (High maintenance; anti-bot challenges). |
| **Microsoft** | `careers.microsoft.com` | **No** (Internal `/services/query/search` endpoint) | Unofficial reverse-engineered JSON endpoint. Not documented for external access. | Low stability. Internal schema changes frequently. | Yes. | **Deferred** (ToS risks; fragile). |
| **Amazon** | `amazon.jobs` | **No** (No public API; `search.json` is internal) | Internal JSON endpoint used by frontend (`search.json?country=IND`). Blocked by Akamai/Cloudflare bot detection. | Moderate. Reverse-engineered scraping violates Amazon ToS. | Yes. | **Deferred** (ToS risks; bot blocks). |
| **Atlassian** | `atlassian.com/company/careers` | **Partial** (Underlying ATS is Lever/Workday) | Can be tracked directly via ATS adapter rather than scraping frontend. | Very high via ATS. | Yes. | **Recommended via ATS Adapter**. |
| **Qualcomm** | `qualcomm.wd5.myworkdayjobs.com` | **No** (Uses Workday internal `/wday/cxs` endpoint) | Workday Career Site JSON endpoint (`/wday/cxs/qualcomm/External/jobs`). Undocumented internal endpoint. | Moderate stability; pagination required; rate-limited. | Yes. | **Phase 2 Experimental** (Workday adapter). |

#### Critical Finding for Big Tech:
Major technology companies do not provide open developer APIs for job postings. Their public sites are designed for browser sessions. Scraping them directly creates severe brittle-path dependencies. **However**, many high-paying global and Indian unicorns use dedicated ATS platforms whose APIs are open and standard.

---

### 3.2 Category B: Applicant Tracking Systems (ATS)

ATS platforms represent the highest-quality, most authoritative source of job postings. When a company posts a role in their ATS, it immediately appears on their public job board API; when they close or fill the vacancy, it disappears from the API.

#### 1. Greenhouse Job Board API
- **Official Documentation:** [Greenhouse Job Board API Documentation](https://developers.greenhouse.io/job-board.html)
- **Base Endpoint:** `GET https://boards-api.greenhouse.io/v1/boards/{board_token}/jobs`
- **Single Job Endpoint:** `GET https://boards-api.greenhouse.io/v1/boards/{board_token}/jobs/{job_id}?questions=true`
- **Authentication:** **None required for GET requests.** Public read-only access.
- **Parameters:** `content=true` (returns full HTML job description), `questions=true` (returns application form metadata).
- **Returned Data Fields:**
  - `id`: Unique integer requisition ID (e.g., `4291823004`).
  - `title`: Job title string (e.g., `"Software Engineer Intern - Summer 2025"`).
  - `location`: Object `{ name: "Bengaluru, India" }` or `{ name: "Remote, India" }`.
  - `updated_at`: ISO 8601 timestamp of last requisition update.
  - `absolute_url`: Direct public job details URL (`https://boards.greenhouse.io/{board_token}/jobs/{id}`).
  - `content`: Unescaped HTML job description.
  - `departments`, `offices`: Categorization arrays.
- **Direct Application URL:** The apply form is located directly at `{absolute_url}#app`.
- **Status Determination:** 100% authoritative. If a job is removed from Greenhouse, it ceases to appear in the `/jobs` array and the single-job endpoint returns HTTP 404 (`{"error": "Job not found"}`).
- **Known Indian Employers using Greenhouse:** Razorpay (`razorpay`), Postman (`postman`), BrowserStack (`browserstack`), Meesho (`meesho`), Urban Company (`urbancompany`), CRED (engineering team transitions), Dunzo, BharatPe.

#### 2. Lever Postings API
- **Official Documentation:** [Lever Postings API Reference](https://github.com/lever/postings-api) / [Lever Developers](https://hire.lever.co/developer/documentation)
- **Base Endpoint:** `GET https://api.lever.co/v0/postings/{account_name}?mode=json`
- **Single Job Endpoint:** `GET https://api.lever.co/v0/postings/{account_name}/{posting_id}`
- **Authentication:** **None required.** Public keyless read endpoint.
- **Parameters:** `mode=json` (default), `commitment` (`Full-time`, `Intern`), `location` (filter by city).
- **Returned Data Fields:**
  - `id`: UUID string (e.g., `a7c3e562-b132-4d56-82bb-856c9d123456`).
  - `text`: Job title.
  - `categories`: `{ commitment: "Full-time", department: "Engineering", location: "Bengaluru", team: "Core Platform" }`.
  - `createdAt`: Unix timestamp (milliseconds).
  - `hostedUrl`: Canonical job details page on Lever (`https://jobs.lever.co/{account_name}/{id}`).
  - `applyUrl`: **Dedicated direct application URL** (`https://jobs.lever.co/{account_name}/{id}/apply`).
  - `descriptionPlain`, `description`: Text and HTML formatted role requirements.
  - `workplaceType`: `'remote' | 'hybrid' | 'onsite'`.
- **Status Determination:** Authoritative. Closed postings return HTTP 404 or empty results.
- **Known Employers using Lever:** CRED (`cred`), InMobi (`inmobi`), Zeta (`zeta`), Clevertap, Hotstar (historical/regional), Figma, Atlassian.

#### 3. Ashby Job Board API
- **Official Documentation:** [Ashby Job Postings API](https://developers.ashbyhq.com/)
- **Base Endpoint:** `GET https://api.ashbyhq.com/posting-api/job-board/{organization_name}?includeCompensation=true`
- **Authentication:** **None required.** Public read endpoint.
- **Parameters:** `includeCompensation=true` (exposes salary tiers/stipend ranges).
- **Returned Data Fields:**
  - `id`: Job identifier.
  - `title`: Requisition title.
  - `department`, `team`: Department metadata.
  - `location`: Primary location string.
  - `secondaryLocations`: Array of additional permitted locations.
  - `isRemote`: Boolean flag.
  - `workplaceType`: `'Remote' | 'Hybrid' | 'InOffice'`.
  - `employmentType`: `'FullTime' | 'Intern' | 'Contract'`.
  - `jobUrl`: Requisition details URL.
  - `applyUrl`: **Direct apply form URL**.
  - `compensationTierSummary`: String (e.g., `"₹12,00,000 - ₹18,00,000 / year"` or `"$100,000 - $130,000"`).
- **Status Determination:** 100% authoritative. Unlisted jobs omit the entry immediately.
- **Known Employers using Ashby:** High-growth global and Indian startups: Linear, Retool, Supabase, Vercel, Glean, Cursor/Anysphere, various YC W24/S24/W25 Indian founders.

#### 4. SmartRecruiters Postings API
- **Official Documentation:** [SmartRecruiters Posting API](https://developers.smartrecruiters.com/)
- **Base Endpoint:** `GET https://api.smartrecruiters.com/v1/companies/{company_identifier}/postings`
- **Single Job Endpoint:** `GET https://api.smartrecruiters.com/v1/companies/{company_identifier}/postings/{posting_id}`
- **Authentication:** **Keyless public access** for published postings.
- **Parameters:** `country=in`, `locationType=REMOTE`, `q=intern`, `limit=100`, `offset=0`.
- **Returned Data Fields:**
  - `id`: Posting ID.
  - `name`: Role name.
  - `location`: `{ city: "Bengaluru", region: "Karnataka", country: "in", remote: true }`.
  - `typeOfEmployment`: `{ id: "internship", label: "Internship" }` or `{ id: "full_time", label: "Full-Time" }`.
  - `experienceLevel`: `{ id: "entry_level", label: "Entry Level" }`.
  - `refNumber`: Job requisition tracking code.
  - `releasedDate`: ISO timestamp.
- **Status Determination:** Authoritative. Inactive listings return HTTP 404 or omit from response.

---

### 3.3 Category C: Indian Startups & Lesser-Known Employers

Emerging Indian startups and seed-stage/Series-A companies often hire without listing on legacy boards like Naukri. We investigated four legitimate discovery mechanisms:

1. **Y Combinator "Work at a Startup" (Indian Filter):**
   - **Source URL:** `https://www.workatastartup.com/companies?locations=India`
   - **Access Mechanism:** Semi-structured public catalog with individual company profile links.
   - **Discovery Pattern:** Extract the company's career page URL or ATS identifier (almost all YC companies use Ashby, Lever, or Greenhouse). Add the discovered ATS handle into HireMate's Source Registry.
2. **GitHub Verified Fresh Graduate & Internship Curation Repositories:**
   - **Sources:** Repositories maintained by active student communities (e.g., `prakharjoshi/Jobs-and-Internships-for-Freshers`, `SimplifyJobs/Summer2025-Internships`).
   - **Format:** Structured Markdown tables containing Company Name, Role, Location, Graduation Batch (e.g., "2025 / 2026"), and Direct Application URL.
   - **Ingestion Rule:** **Never ingest these links directly into the active feed.** Use them solely as *discovery leads*. The engine extracts the application URL, identifies the destination ATS board, validates that the job is currently active via HTTP HEAD/GET, and only then registers the listing.
3. **Company Sitemap & Schema.org Discovery:**
   - Indian startups using Next.js/Webflow career pages publish standard `sitemap.xml` feeds.
   - Crawling `https://{startup-domain}/sitemap.xml` for `/careers/*` or `/jobs/*` paths allows automated discovery of new postings.
   - The job page is inspected for `schema.org/JobPosting` structured JSON-LD microdata, which defines `title`, `datePosted`, `validThrough`, `employmentType`, `jobLocation`, and `hiringOrganization`.

---

### 3.4 Category D: Third-Party Job Platforms (Legal & Technical Evaluation)

| Platform | Official API Status | Terms of Service & Authorization | India Coverage | Freshness & Link Quality | Recommendation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **LinkedIn** | Restricted. Partner API only ($10,000+/yr). Consumer API deprecated. | **Strictly Prohibited.** Automated scraping violates Section 8.2 of LinkedIn User Agreement. Aggressive bot detection (Akamai/PerimeterX) and IP blocking. | High | High volume, but plagued by closed jobs remaining visible ("Promoted" ghost ads). Links often internal redirects. | **EXCLUDED** (High legal risk; unauthorized scraping forbidden). |
| **Indeed** | Deprecated. Publisher XML feed deprecated in 2021; replaced by employer-only APIs. | **Prohibited.** Scraping violates Indeed Terms of Service; Cloudflare challenge pages intercept automated clients. | High | Many recruiter agencies and ghost listings. | **EXCLUDED** (No public API; scraping violates ToS). |
| **Naukri / Instahyre** | Enterprise recruiter API only. No public developer access. | **Prohibited.** Terms of Service forbid scraping or third-party syndication. Walled gardens. | High | Contains significant consultant spam and re-posts. | **EXCLUDED**. |
| **Remotive** | Public API available (`https://remotive.com/api/remote-jobs`). | **Permitted** with attribution. Read-only JSON feed. | Low (US/EU remote focus; <5% India eligible). | High quality for tech roles, but low India fresher density. | **Secondary Feed** (Strict location filter required). |
| **Arbeitnow** | Public API available (`https://www.arbeitnow.com/api/job-board-api`). | **Permitted** under open developer terms. | Very Low (European focus; minimal India entry-level). | Good for EU, not applicable for Indian college students. | **Excluded for V1**. |
| **Adzuna India** | Public API with developer key (`api.adzuna.com/v1/api/jobs/in/search`). | **Permitted** within API rate limits (Free tier: 250 calls/month). | Moderate | Poor link quality. Returns `redirect_url` pointing to Adzuna referral trackers rather than direct employer forms. | **Excluded for V1** (Violates direct apply requirement). |

---

### 3.5 Comprehensive Source Comparison Table

| Source / Provider | Source Category | Official Documentation / Source URL | Access Method | Authorization / Restrictions | India Coverage | Fresher & Intern Coverage | Job-Status Reliability | Direct Apply URL Available? | Refresh Feasibility | Key Limitations | Recommended Priority |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Greenhouse** | Public ATS | `https://developers.greenhouse.io/job-board.html` | REST GET JSON | Public, keyless, read-only | Very High (100+ top Indian tech employers) | High (Standard tags for Intern, Trainee, New Grad) | **100% Authoritative** (Real-time ATS state) | **Yes** (`#app` anchor on official board) | High (1 req per company; ~2s) | Requires knowing company `board_token` | **P0 (Day 1 Core)** |
| **Lever** | Public ATS | `https://github.com/lever/postings-api` | REST GET JSON | Public, keyless, read-only | Very High (80+ Indian startups & MNCs) | High (`commitment` field distinguishes Intern/FT) | **100% Authoritative** | **Yes** (`applyUrl` explicitly returned) | High (Single JSON payload per company) | Must maintain list of `account_name` handles | **P0 (Day 1 Core)** |
| **Ashby** | Public ATS | `https://developers.ashbyhq.com/` | REST GET JSON | Public, keyless, read-only | High (Fastest-growing ATS among YC/modern tech) | High (`employmentType` filter, explicit salary data) | **100% Authoritative** | **Yes** (`applyUrl` explicitly returned) | High (Fast JSON response) | Company slug list needed | **P0 (Day 1 Core)** |
| **SmartRecruiters** | Public ATS | `https://developers.smartrecruiters.com/` | REST GET JSON | Public, keyless, read-only | Moderate (Enterprise MNCs in India) | Moderate (`entry_level` & `internship` filters) | **100% Authoritative** | **Yes** (Direct job posting application link) | High (Built-in location query `country=in`) | Less common among early-stage startups | **P1 (High Priority)** |
| **Remotive** | Authorized Aggregator | `https://remotive.com/api/remote-jobs` | REST GET JSON | Permitted with attribution | Low (<5% accept Indian remote applicants) | Moderate | Moderate (Updated daily) | Partial (Some redirect to employer, some to Remotive) | High (Single batch feed) | 95% of roles are US/EU only; requires strict eligibility parser | **P2 (Selective Filtered)** |
| **Company Sitemaps & Schema.org** | Direct Employer Sites | `https://schema.org/JobPosting` | HTTP GET + JSON-LD Parser | Publicly permitted (Sitemaps are public index guides) | High (Covers bespoke startup careers pages) | Variable (Depends on employer markup) | High if page returns 200 and schema is fresh | **Yes** (`url` or `directApply` property) | Moderate (Rate limits: max 1 req/sec per domain) | Markup inconsistent; requires headless/HTML parser | **P1 (Expansion Tier)** |
| **Workday (CXS)** | Proprietary ATS | `https://{tenant}.wd5.myworkdayjobs.com/wday/cxs/...` | Reverse-engineered POST JSON | Undocumented internal endpoint; potential ToS friction | Very High (Amazon, Qualcomm, Walmart, TCS, Infosys) | High | High (Live database), but pagination required | Yes (Workday candidate login portal) | Medium (Prone to rate limiting & schema changes) | Not a public API; requires complex reverse-engineering | **P2 (Phase 2 Investigation)** |
| **LinkedIn** | Commercial Board | `https://www.linkedin.com/jobs` | Web Scraping | **Forbidden by ToS** (Legal C&D / Akamai blocks) | High | High | Low (Ghost postings, sponsored spam) | No (Internal redirect links) | Infeasible | High risk of IP blocking, legal liability | **P3 (DO NOT USE)** |
| **Indeed** | Commercial Board | `https://www.indeed.com` | Web Scraping | **Forbidden by ToS** (Cloudflare blocks) | High | Moderate | Low (Consultant re-posts) | No (Internal tracker URLs) | Infeasible | Infeasible without commercial syndication contract | **P3 (DO NOT USE)** |

---

## 4. Design a Source Registry

To support hundreds of employers across multiple ATS platforms and custom careers sites without touching core pipeline logic, we design a modular, adapter-based **Source Registry**.

### 4.1 Adapter Interface Contract
Every source provider is encapsulated within an adapter implementing a strict TypeScript contract:

```typescript
export interface IngestionSourceMetadata {
  id: string;                      // e.g. "ats_greenhouse_razorpay"
  slug: string;                    // e.g. "razorpay"
  companyName: string;             // e.g. "Razorpay"
  companyWebsite: string;          // e.g. "https://razorpay.com"
  adapterType: 'greenhouse' | 'lever' | 'ashby' | 'smartrecruiters' | 'schema_sitemap';
  endpointUrl: string;             // e.g. "https://boards-api.greenhouse.io/v1/boards/razorpay/jobs"
  sourceCategory: 'ats' | 'direct_employer' | 'curated_feed';
  geographicCoverage: string[];    // e.g. ["India", "Remote"]
  syncIntervalMinutes: number;     // e.g. 180 (3 hours)
  rateLimitPerMinute: number;      // e.g. 30
  enabled: boolean;
  consecutiveFailures: number;
  lastSuccessfulSyncAt: Date | null;
  lastAttemptedSyncAt: Date | null;
  lastError: string | null;
}

export interface RawJobPayload {
  externalId: string;
  sourceId: string;
  title: string;
  companyName: string;
  rawLocation: string;
  rawContent: string;
  detailsUrl: string;
  directApplyUrl: string | null;
  publishedAt: Date | null;
  rawPayload: Record<string, unknown>;
}

export interface JobSourceAdapter {
  readonly adapterType: string;
  fetchPublishedJobs(source: IngestionSourceMetadata): Promise<RawJobPayload[]>;
  verifySingleJobStatus(source: IngestionSourceMetadata, externalId: string): Promise<JobStatusCheckResult>;
}

export interface JobStatusCheckResult {
  isActive: boolean;
  httpStatus: number;
  confirmedClosed: boolean;
  reason?: string;
}
```

### 4.2 Seed Registry for Indian Tech Employers
A static or database-driven seed registry immediately activates coverage for top tier employers using zero-credential, authorized public ATS APIs:

| Company | Adapter Type | Identifier / Token | Target Geo |
| :--- | :--- | :--- | :--- |
| **Razorpay** | Greenhouse | `razorpay` | India (Bengaluru) |
| **Postman** | Greenhouse | `postman` | India (Bengaluru, Hybrid) |
| **BrowserStack** | Greenhouse | `browserstack` | India (Mumbai, Remote) |
| **Meesho** | Greenhouse | `meesho` | India (Bengaluru) |
| **Urban Company** | Greenhouse | `urbancompany` | India (Gurugram) |
| **CRED** | Lever | `cred` | India (Bengaluru) |
| **InMobi** | Lever | `inmobi` | India (Bengaluru) |
| **Zeta** | Lever | `zeta` | India (Bengaluru, Mumbai) |
| **Linear** | Ashby | `linear` | Remote (Global) |
| **Supabase** | Ashby | `supabase` | Remote (Global) |
| **Retool** | Ashby | `retool` | Remote / India |

### 4.3 Extensibility: Adding New Employers Without Code Changes
To add a newly discovered employer (e.g., if a student reports an opening at a new startup using Ashby):
1. An administrator or automated discovery worker identifies the company's ATS board URL (`jobs.ashbyhq.com/newstartup`).
2. A single row is inserted into the `job_sources` table:
   `{ slug: "newstartup", adapterType: "ashby", endpointUrl: "https://api.ashbyhq.com/posting-api/job-board/newstartup" }`.
3. The next scheduled sync cycle automatically executes the `AshbyAdapter` on the new row. Zero code deployment or pipeline rewrite is needed.

---

## 5. Design the Job Discovery Pipeline

The ingestion architecture follows a 12-stage staged processing pipeline. Ingestion is decoupled from real-time user requests.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                           HIREMATE INGESTION PIPELINE                            │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  [1. Source Scheduler] ──> [2. Rate-Limited Fetch] ──> [3. Parsing & Normalizer] │
│                                                                 │                │
│                                                                 ▼                │
│  [6. Deduplication Engine] <── [5. Eligibility Extractor] <── [4. Location &     │
│             │                                                  Role Classifier]  │
│             ▼                                                                    │
│  [7. Apply Link Validator] ──> [8. DB Upsert / State Machine] ──> [9. Audit Log] │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### Stage Breakdown

#### 1. Source Discovery & Scheduling
- Scheduled tasks run periodically (e.g., every 3 to 6 hours).
- Sources whose `next_sync_due_at <= NOW()` are queued with strict concurrency limits (max 3 concurrent HTTP requests per destination domain).

#### 2. Scheduled Retrieval of Published Openings
- The adapter issues an HTTP GET to the source's authoritative endpoint with custom `User-Agent: HireMateBot/1.0 (+https://hiremate.dev/bot-info)` and `Accept: application/json`.
- Responses are checked for HTTP status, JSON schema validity, and empty-payload anomalies.

#### 3. Parsing and Normalization
- Extracts raw fields into a standardized intermediate representation: title, raw location string, raw HTML/text description, publication timestamp, and URLs.

#### 4. Company Name & Job Identity Normalization
- Normalizes company naming: trims legal suffixes (e.g., "Razorpay Software Pvt. Ltd." &rarr; "Razorpay").
- Extracts a normalized role identity hash: `SHA256(canonical_company + "|" + lowercase_normalized_title + "|" + normalized_city)`.

#### 5. Location and Employment-Type Normalization
- Evaluates the raw location string:
  - If raw contains `"Bengaluru"`, `"Bangalore"`, `"Hyderabad"`, `"Pune"`, `"Delhi"`, `"Noida"`, `"Gurugram"`, `"Gurgaon"`, `"Mumbai"`, `"Chennai"` &rarr; `country: "India"`, `city: "<CityName>"`.
  - If raw contains `"Remote"` &rarr; inspects text for geographic residency requirements (see Section 7).
- Evaluates employment type:
  - `"intern"`, `"internship"`, `"summer intern"` &rarr; `opportunity_type: "internship"`.
  - `"graduate trainee"`, `"GET"`, `"fresher"`, `"associate"`, `"entry-level"`, `"software engineer 1"`, `"SDE 1"` &rarr; `opportunity_type: "full-time"`, `experience_level: "fresher"`.

#### 6. Candidate Eligibility Extraction
- Analyzes job description text for:
  - Graduation Batch Regex: `/(batch of|passing out in|graduating in|class of)\s*(2024|2025|2026|2027)/i`.
  - Degree Regex: `/(B\.?Tech|B\.?E\.?|BCA|MCA|B\.?Sc|M\.?Tech|Bachelor|Master)/i`.
  - Experience Bounds: extracts years of experience (e.g., `"0-1 years"`, `"freshers may apply"`). If requirements state `3+ years` or `5+ years`, flags as `senior_ineligible`.

#### 7. Direct Application URL Extraction
- Captures separate `details_url` and `direct_apply_url`.
- For Greenhouse: `direct_apply_url = details_url + "#app"`.
- For Lever: captures explicit `applyUrl`.
- For Ashby: captures explicit `applyUrl`.

#### 8. Duplicate Detection Across Sources
- If an employer posts on both Lever and a community repository, or re-lists a position under a slightly altered title:
  - The engine checks for existing active postings matching the same company and a Levenshtein similarity > 0.85 on title and location.
  - If a duplicate is detected, the engine links the records via a canonical `parent_job_id` and retains the link with the highest direct-application fidelity (preferring the direct ATS URL).

#### 9. Job-Status Validation & State Transitions
- Newly discovered jobs enter `newly_discovered`.
- Once verified by link reachability and eligibility classification, they transition to `verified_active`.

#### 10. Database Upsert & Provenance Tracking
- Implements PostgreSQL `INSERT ... ON CONFLICT (source_id, external_id) DO UPDATE`:
  - Updates `last_seen_active_at = NOW()`.
  - Preserves user bookmarks and applications.
  - Updates description or salary if revised by employer.

#### 11. Rechecking & Closure Detection
- Asynchronous recheck worker periodically verifies that known active jobs still exist in their upstream source.
- Details in Section 6.

#### 12. Error Logging, Backoff & Rate Limiting
- Any HTTP 429 (Rate Limit) triggers an exponential backoff (`2^n * 60` seconds) and automatically throttles that adapter.
- Network timeouts (HTTP 500/502/504) record an incremented `consecutive_failures` count on the source without mutating job status.

---

## 6. Design a Job-Validation System

Displaying closed, expired, or dead links destroys user trust. The validation system enforces a strict finite state machine (FSM).

### 6.1 State Machine Lifecycle

```
             ┌─────────────────────────┐
             │    newly_discovered     │
             └────────────┬────────────┘
                          │ (Parsed & Initial Validation)
                          ▼
             ┌─────────────────────────┐
             │   verified_active       │ ◄──────────┐
             └────────────┬────────────┘            │
                          │                         │
     (Time > RecheckThresh)│                         │ (Recheck Confirmed Active)
                          ▼                         │
             ┌─────────────────────────┐            │
             │    needs_recheck        │ ───────────┘
             └────────────┬────────────┘
                          │
         (Source Missing 1x)
                          ▼
             ┌─────────────────────────┐
             │  quarantined_pending    │
             └────────────┬────────────┘
                          │
       ┌──────────────────┴──────────────────┐
       │ (Missing 2x or 404 Confirmed)       │ (Employer Deadline Reached)
       ▼                                     ▼
┌──────────────┐                      ┌──────────────┐
│    closed    │                      │   expired    │
└──────────────┘                      └──────────────┘
```

### 6.2 Definitive vs. Warning Signals

| Condition / Signal | Signal Severity | Engine Action |
| :--- | :--- | :--- |
| **Employer ATS endpoint returns HTTP 404 for Requisition ID** | **Definitive** | Immediately transition state to `closed`. Record `closed_reason = "ats_404_not_found"`. Remove from active user feeds. |
| **Job requisition ID omitted from full ATS board list** | **Warning (First Occurrence)** | Transition to `quarantined_pending`. Schedule priority recheck in 6 hours. Do not mark closed yet (prevents transient network or caching blips from dropping active jobs). |
| **Job requisition ID missing across 2 consecutive syncs** | **Definitive** | Transition to `closed`. Record `closed_reason = "absent_from_feed_2x"`. |
| **Application link returns HTTP 410 (Gone)** | **Definitive** | Transition to `closed`. |
| **Application link returns HTTP 200, but HTML body contains "This position has been filled" or "No longer accepting applications"** | **Definitive** | Transition to `closed`. Record `closed_reason = "closed_phrase_detected"`. |
| **Job's stated application deadline timestamp is in the past** | **Definitive** | Transition to `expired`. |
| **Source server returns HTTP 500 / 502 / 503 / 504** | **Warning / Non-Definitive** | Source outage. **Zero job states are modified.** Source failure counter incremented. |
| **Application link returns HTTP 301/302 redirecting to generic homepage or `/careers` root** | **Definitive Invalid Link** | Mark `direct_apply_url = null`. Revert to `details_url` or flag for quarantine. |

### 6.3 Link Validation Without Form Submissions
To validate application links safely:
1. Issue an `HTTP GET` request with `Range: bytes=0-4096` or lightweight `GET` following redirects (max 3 redirects).
2. Inspect the final response URL:
   - Does it still point to the specific job requisition (e.g., contains job ID in URL)?
   - If it redirects to `company.com` or `company.com/careers` (home redirect), the role is closed or link is dead.
3. Check HTML content snippet for closure keywords:
   - Phrases: `"no longer accepting applications"`, `"this role has closed"`, `"this posting is no longer available"`, `"job expired"`.
4. **Strict Safety Rule:** Never send `POST` requests to application submission endpoints. Never trigger CAPTCHA challenges or submit mock candidate data.

### 6.4 Freshness Calculation and Display
- **Publication Date vs. Verification Date:**
  - `original_published_at`: When the employer posted the role (e.g., "Posted 3 days ago").
  - `last_verified_active_at`: The exact timestamp when HireMate confirmed the opening is live (e.g., "Verified 2 hours ago").
- **User-Facing Trust Badges:**
  - `Verified Active (< 6h)`: Green pulse dot &rarr; "Verified active today".
  - `Recently Checked (< 24h)`: Neutral dot &rarr; "Active yesterday".
  - `Pending Recheck (> 48h)`: Orange dot &rarr; "Rechecking status".
  - **Unverified jobs are NEVER labeled "Verified Active".**

---

## 7. India-First Eligibility Filtering

The engine executes deterministic, rule-based filtering *before* any ranking or personalization runs.

```
┌────────────────────────────────────────────────────────────────────────┐
│                   DETERMINISTIC ELIGIBILITY PIPELINE                   │
├────────────────────────────────────────────────────────────────────────┤
│  Incoming Normalized Job Requisition                                   │
│    │                                                                   │
│    ├── 1. Geographic Boundary Check (India Cities / Permitted Remote)  │
│    │     FAIL ──> Reject: "Non-Indian Location"                        │
│    │                                                                   │
│    ├── 2. Negative Work Authorization Regex Check                      │
│    │     (US Citizen, Green Card, Security Clearance, W2, C2C)         │
│    │     FAIL ──> Reject: "Explicit Foreign Work Authorization"        │
│    │                                                                   │
│    ├── 3. Experience Ceiling Check (Reject Senior / Staff / 3+ Years)  │
│    │     FAIL ──> Reject: "Senior Position"                            │
│    │                                                                   │
│    ├── 4. Degree & Batch Requirements Match                            │
│    │     PASS / UNKNOWN ──> Proceed to Personalization Engine          │
└────┴───────────────────────────────────────────────────────────────────┘
```

### 7.1 Location Filtering Rules
1. **Explicit Indian On-Site / Hybrid:**
   - Permitted locations must match known Indian tier-1 and tech hubs: Bengaluru, Hyderabad, Pune, Delhi NCR (Noida, Gurugram, Delhi, Faridabad), Mumbai, Chennai, Kolkata, Ahmedabad, Kochi, Trivandrum, Chandigarh, Indore, Coimbatore, Jaipur.
2. **Remote Classification:**
   - If a job title/location says "Remote", it is **NOT** automatically assumed to be available to Indian residents.
   - The engine parses the job description for negative residency constraints:
     - `/(must be located in|residents of|authorized to work in|only open to)\s*(the\s*)?(US|United States|USA|North America|EMEA|UK|Canada|EU)/i` &rarr; **Immediate Exclusion**.
   - A remote job is accepted only if:
     - It explicitly specifies: `"Anywhere"`, `"Global"`, `"Worldwide"`, `"Remote - India"`, or `"APAC"`.
     - Or the employer's hiring entity explicitly accepts Indian contractor/full-time remote workers.

### 7.2 Experience Ceiling (Protecting Students from Senior Traps)
- Indian college students and freshers are repeatedly frustrated by job boards recommending "Senior Software Engineer" or "Tech Lead" positions simply because the job description mentions "React" or "Python".
- The engine applies a hard ceiling:
  - If title contains: `"Senior"`, `"Sr."`, `"Staff"`, `"Principal"`, `"Lead"`, `"Manager"`, `"Architect"`, `"Director"` &rarr; **Hard Exclusion** (unless profile indicates experienced level).
  - If text specifies: `"Requires 3+ years"`, `"minimum 4 years of experience"`, `"5-8 years of experience"` &rarr; **Hard Exclusion**.

### 7.3 Batch & Degree Eligibility Parsing
- **Graduation Batch Matching:**
  - Extracted batches (e.g., "2024", "2025", "2026") are compared against the student's `education.gradYear`.
  - If an employer explicitly states: `"Only for 2025 graduates"` and the student is graduating in 2026, the job is labeled `not_eligible_batch`.
- **Eligibility Confidence States:**
  - `Eligible (Evidence confirmed)`: Job explicitly matches student's location, batch, and degree.
  - `Potentially Eligible`: Job matches location and title; batch/degree criteria unspecified by employer.
  - `Ineligible (Explicit)`: Job explicitly requires criteria the student does not meet.
  - `Unknown`: Insufficient description metadata.

---

## 8. Personalization and Ranking

### 8.1 Inspection of Available Profile Fields
Based on our verification of the existing `career_profiles` table (`server/src/models/schema.ts`) and onboarding flow (`client/src/pages/Onboarding.tsx`):

| Available Profile Field | Data Type | Source in Codebase | Usability in Ranking |
| :--- | :--- | :--- | :--- |
| `targetRoles` | `string[]` | `careerProfiles.targetRoles` | **Primary Filter & Relevance Anchor** |
| `opportunityType` | `'internship' \| 'full-time' \| 'both'` | `careerProfiles.opportunityType` | **Hard Exclusion & Fit Multiplier** |
| `preferredLocations` | `string[]` | `careerProfiles.preferredLocations` | **Location Affinity Scoring** |
| `workArrangement` | `'on-site' \| 'hybrid' \| 'remote' \| 'flexible'` | `careerProfiles.workArrangement` | **Arrangement Affinity Scoring** |
| `skills` | `string[]` | `careerProfiles.skills` | **Jaccard Skill Overlap Scoring** |
| `education` | `{ degree, institution, fieldOfStudy, gradYear }` | `careerProfiles.education` | **Batch & Degree Alignment** |
| `experienceLevel` | `'student' \| 'fresher' \| 'entry-level' \| ...` | `careerProfiles.experienceLevel` | **Seniority Guardrail** |
| `projects` | `ProjectData[]` | `careerProfiles.projects` | **Secondary Keyword Matching** |

### 8.2 Transparent, Explainable Scoring Algorithm
No black-box machine learning or hallucinated percentages. A deterministic formula calculates a composite relevance score $S \in [0, 100]$:

$$S = S_{\text{role}} \times 0.35 + S_{\text{skill}} \times 0.25 + S_{\text{location}} \times 0.15 + S_{\text{type}} \times 0.15 + S_{\text{freshness}} \times 0.10$$

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SCORING BREAKDOWN (0-100)                       │
├────────────────────────────────────────────────────────────────────────┤
│  Target Role Alignment (35%): Exact title match or semantic variant     │
│  Skill Overlap (25%): % of student's skills mentioned in job desc       │
│  Location & Arrangement (15%): Preferred city or arrangement match     │
│  Opportunity Type (15%): Match on Internship vs Full-Time preference   │
│  Verification Freshness (10%): Verified in last 24h vs older           │
└────────────────────────────────────────────────────────────────────────┘
```

#### Factor Details:
1. **Target Role Alignment ($S_{\text{role}}$, Weight: 35%):**
   - Exact or normalized match between student's `targetRoles` (e.g., "Backend Developer") and job title &rarr; 100 pts.
   - Partial match (e.g., "Software Engineer" for "Backend Developer") &rarr; 70 pts.
   - Unrelated role &rarr; 0 pts (Hard filtered if student specified strict target roles).
2. **Skill Overlap ($S_{\text{skill}}$, Weight: 25%):**
   - Computes weighted overlap between student's `skills` and skills extracted from the job description:
     $$\text{Overlap} = \frac{|\text{UserSkills} \cap \text{JobSkills}|}{\min(|\text{UserSkills}|, 5)} \times 100$$
3. **Location & Work Arrangement ($S_{\text{location}}$, Weight: 15%):**
   - Matches `preferredLocations` (e.g., "Bengaluru", "Remote"):
     - Exact preferred city match &rarr; 100 pts.
     - Remote match when user prefers Remote/Flexible &rarr; 100 pts.
     - Non-preferred Indian city &rarr; 40 pts.
4. **Opportunity Type Fit ($S_{\text{type}}$, Weight: 15%):**
   - If user wants `internship` and job is an `internship` &rarr; 100 pts.
   - If user wants `full-time` and job is `fresher / full-time` &rarr; 100 pts.
   - If user selected `both` &rarr; 100 pts for either.
   - Mismatch (e.g., user wants full-time only, job is a 3-month summer intern) &rarr; 10 pts.
5. **Freshness & Validation Confidence ($S_{\text{freshness}}$, Weight: 10%):**
   - Verified active within 12 hours &rarr; 100 pts.
   - Verified active within 48 hours &rarr; 70 pts.
   - Older than 5 days &rarr; 30 pts.

### 8.3 Explainable Recommendations UI
Instead of arbitrary "94% match", the interface displays concrete reasons derived directly from verified data:
- *"Matches your target role: Full Stack Developer"*
- *"3 of your skills match: React, TypeScript, PostgreSQL"*
- *"Matches your preferred location: Bengaluru (Hybrid)"*
- *"Accepts 2025/2026 graduation batch"*

---

## 9. Direct Application Links Strategy

Providing fake or broken application links frustrates users. HireMate differentiates between **Requisition Details** and **Application Submission Routes**.

### 9.1 Link Precedence Rules

```
┌────────────────────────────────────────────────────────────────────────┐
│                        APPLICATION LINK FALLBACK                       │
├────────────────────────────────────────────────────────────────────────┤
│  PRIORITY 1: Verified Direct Apply URL                                 │
│  (Direct ATS form URL: Lever /apply, Ashby /apply, Greenhouse #app)    │
│  Badge: "Direct Apply Available"                                       │
│                                                                        │
│  PRIORITY 2: Official Requisition Details Page                         │
│  (Canonical job posting on company's verified domain/ATS)              │
│  Badge: "Apply on Company Site"                                        │
│                                                                        │
│  PRIORITY 3 (EXCLUDED - NEVER SHOWN):                                  │
│  Generic company homepage, careers root, or third-party redirect       │
│  Action: Excluded from direct-apply category; quarantined              │
└────────────────────────────────────────────────────────────────────────┘
```

### 9.2 Validation Rules for Application Links
1. **Domain Verification:** The hostname of the `direct_apply_url` must match either:
   - The verified company domain (e.g., `careers.razorpay.com`).
   - Or an authorized ATS host (e.g., `boards.greenhouse.io`, `jobs.lever.co`, `jobs.ashbyhq.com`, `smartrecruiters.com`).
2. **Requisition Token Integrity:** The URL path must contain the specific requisition identifier. URLs pointing to `/jobs` or `/careers` without a specific job identifier are rejected.
3. **Redirect Audit:** Automated link validation tests follow HTTP redirects:
   - If the link redirects to an ad tracker, an affiliate URL, or an unrelated job portal, it is immediately discarded.

---

## 10. Data Model and Architecture Proposal

*No migrations or schema changes are made during Phase 1. This section specifies the target schema for Phase 2 implementation.*

### 10.1 Schema Proposal (Drizzle ORM Definition)

```typescript
// Proposed additions for server/src/models/schema.ts in Phase 2

import { pgTable, uuid, varchar, text, boolean, timestamp, integer, jsonb, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { users } from './schema'; // Reuses existing users table

/**
 * 1. Job Sources Registry Table
 * Tracks company job boards, ATS configurations, and health status.
 */
export const jobSources = pgTable('job_sources', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: varchar('slug', { length: 100 }).notNull().unique(), // e.g., "razorpay"
  companyName: varchar('company_name', { length: 255 }).notNull(),
  companyWebsite: text('company_website'),
  adapterType: varchar('adapter_type', { length: 50 }).notNull(), // 'greenhouse' | 'lever' | 'ashby' | 'smartrecruiters' | 'schema_sitemap'
  endpointUrl: text('endpoint_url').notNull(),
  sourceCategory: varchar('source_category', { length: 50 }).notNull().default('ats'),
  geographicCoverage: jsonb('geographic_coverage').$type<string[]>().notNull().default(['India']),
  syncIntervalMinutes: integer('sync_interval_minutes').notNull().default(180),
  rateLimitPerMinute: integer('rate_limit_per_minute').notNull().default(30),
  enabled: boolean('enabled').notNull().default(true),
  consecutiveFailures: integer('consecutive_failures').notNull().default(0),
  lastSuccessfulSyncAt: timestamp('last_successful_sync_at', { withTimezone: true }),
  lastAttemptedSyncAt: timestamp('last_attempted_sync_at', { withTimezone: true }),
  lastError: text('last_error'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

/**
 * 2. Job Listings Table
 * Core normalized storage for active and historical job requisitions.
 */
export const jobListings = pgTable('job_listings', {
  id: uuid('id').defaultRandom().primaryKey(),
  sourceId: uuid('source_id').notNull().references(() => jobSources.id, { onDelete: 'cascade' }),
  externalId: varchar('external_id', { length: 255 }).notNull(), // ATS Requisition ID
  title: varchar('title', { length: 500 }).notNull(),
  companyName: varchar('company_name', { length: 255 }).notNull(),
  normalizedRole: varchar('normalized_role', { length: 100 }), // e.g. "Software Engineer"
  roleCategory: varchar('role_category', { length: 100 }), // 'software' | 'data' | 'product' | 'design' | 'other'
  
  // Location & Arrangement
  locationRaw: text('location_raw'),
  city: varchar('city', { length: 100 }),
  country: varchar('country', { length: 100 }).notNull().default('India'),
  workArrangement: varchar('work_arrangement', { length: 50 }), // 'on-site' | 'hybrid' | 'remote' | 'flexible'
  isIndiaEligible: boolean('is_india_eligible').notNull().default(true),

  // Employment & Eligibility
  opportunityType: varchar('opportunity_type', { length: 50 }), // 'internship' | 'full-time' | 'both'
  experienceLevel: varchar('experience_level', { length: 50 }), // 'student' | 'fresher' | 'entry-level'
  minExperienceYears: integer('min_experience_years').default(0),
  maxExperienceYears: integer('max_experience_years').default(2),
  eligibleBatches: jsonb('eligible_batches').$type<string[]>().default([]), // ['2025', '2026']
  eligibleDegrees: jsonb('eligible_degrees').$type<string[]>().default([]), // ['B.Tech', 'BCA', 'MCA']
  extractedSkills: jsonb('extracted_skills').$type<string[]>().notNull().default([]),

  // Compensation
  salaryRangeRaw: varchar('salary_range_raw', { length: 255 }),
  minSalaryAnnual: integer('min_salary_annual'),
  maxSalaryAnnual: integer('max_salary_annual'),
  stipendMonthly: integer('stipend_monthly'),
  currency: varchar('currency', { length: 10 }).default('INR'),

  // URLs
  detailsUrl: text('details_url').notNull(),
  directApplyUrl: text('direct_apply_url'),
  hasDirectApply: boolean('has_direct_apply').notNull().default(false),

  // Status & Lifecycle
  status: varchar('status', { length: 50 }).notNull().default('newly_discovered'), 
  // 'newly_discovered' | 'verified_active' | 'needs_recheck' | 'quarantined' | 'closed' | 'expired' | 'invalid'
  statusReason: text('status_reason'),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  lastSeenActiveAt: timestamp('last_seen_active_at', { withTimezone: true }).notNull().defaultNow(),
  lastVerifiedAt: timestamp('last_verified_at', { withTimezone: true }).notNull().defaultNow(),
  recheckDueAt: timestamp('recheck_due_at', { withTimezone: true }).notNull().defaultNow(),

  // Content
  descriptionHtml: text('description_html'),
  descriptionPlain: text('description_plain'),

  // Deduplication Identity
  identityHash: varchar('identity_hash', { length: 64 }).notNull(),
  parentJobId: uuid('parent_job_id'), // Self-reference if duplicate

  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  sourceExternalIdx: uniqueIndex('idx_job_source_external').on(table.sourceId, table.externalId),
  statusIdx: index('idx_job_status').on(table.status),
  identityHashIdx: index('idx_job_identity_hash').on(table.identityHash),
  recheckDueIdx: index('idx_job_recheck_due').on(table.recheckDueAt),
  indiaEligibleIdx: index('idx_job_india_eligible').on(table.isIndiaEligible),
}));

/**
 * 3. Saved Jobs Table (Bookmarks)
 * Links existing users to saved job listings.
 */
export const userSavedJobs = pgTable('user_saved_jobs', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  jobId: uuid('job_id').notNull().references(() => jobListings.id, { onDelete: 'cascade' }),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  userJobIdx: uniqueIndex('idx_user_saved_job').on(table.userId, table.jobId),
}));

/**
 * 4. User Job Applications Tracker Table
 * Tracks when a student clicks out or reports applying.
 */
export const userJobInteractions = pgTable('user_job_interactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  jobId: uuid('job_id').notNull().references(() => jobListings.id, { onDelete: 'cascade' }),
  interactionType: varchar('interaction_type', { length: 50 }).notNull(), // 'clicked_apply' | 'dismissed' | 'reported_closed'
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

/**
 * 5. Sync Runs Audit Log Table
 * Provides operational observability for source sync health.
 */
export const sourceSyncRuns = pgTable('source_sync_runs', {
  id: uuid('id').defaultRandom().primaryKey(),
  sourceId: uuid('source_id').notNull().references(() => jobSources.id, { onDelete: 'cascade' }),
  startedAt: timestamp('started_at', { withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  jobsDiscovered: integer('jobs_discovered').notNull().default(0),
  jobsInserted: integer('jobs_inserted').notNull().default(0),
  jobsUpdated: integer('jobs_updated').notNull().default(0),
  jobsClosed: integer('jobs_closed').notNull().default(0),
  status: varchar('status', { length: 50 }).notNull(), // 'success' | 'partial' | 'failed'
  errorMessage: text('error_message'),
});
```

### 10.2 Proposed API Boundaries

| Method & Route | Auth Required | Purpose |
| :--- | :--- | :--- |
| `GET /api/jobs` | Optional (Enhanced with Auth) | Paginated, filtered feed of verified active jobs. When authenticated, applies user's personalization score. |
| `GET /api/jobs/:id` | No | Detailed view for a single job with eligibility breakdown. |
| `POST /api/jobs/:id/save` | Yes (`requireAuth`) | Toggles bookmark for the authenticated user. |
| `GET /api/jobs/saved` | Yes (`requireAuth`) | Returns all jobs saved by the user. |
| `POST /api/jobs/:id/track-click` | Yes (`requireAuth`) | Increments application click count and registers interaction. |
| `POST /api/jobs/:id/report` | Yes (`requireAuth`) | Allows students to flag closed or broken postings for rapid recheck. |
| `GET /api/dashboard/overview` | Yes (`requireAuth`) | Existing endpoint: updated to return top 5 personalized jobs matching student profile. |

---

## 11. Operational Requirements

### 11.1 Concurrency & Rate Limiting Strategy
- External ATS public APIs are keyless, but aggressive concurrency can trigger IP rate-limiting (HTTP 429).
- **Rules:**
  - Max **1 concurrent request per target employer domain**.
  - Minimum **1,500ms jitter delay** between consecutive requests to the same ATS provider.
  - Backoff policy: on receiving HTTP 429, set `recheck_due_at = NOW() + 1 hour` and back off exponentially ($2^n \times 15$ minutes).

### 11.2 Scheduling Architecture for V1
- Rather than requiring Redis or heavy external broker infrastructure in early development:
  - Phase 2 can use a lightweight, in-process polling worker or PostgreSQL-backed task queue (`pg-boss` or timer-driven worker inside the Express server).
  - Sync tasks run every 3 hours across sources in batches of 5 companies at a time.
  - Verification runs check jobs nearing `recheck_due_at` continuously at a slow, polite rate (1 request every 5 seconds).

### 11.3 Data Retention & Archival
- Jobs marked `closed` or `expired` are retained in the database for 90 days with `status = 'closed'`.
- Closed jobs are excluded from the active discovery index, but remain queryable if a user previously saved or applied to them (displaying an "Employer has closed this role" banner).
- After 90 days, closed job descriptions are purged to minimize database footprint, preserving only header metadata for deduplication.

---

## 12. Testing and Measurable Quality

### 12.1 Concrete Test Matrix

| Test Case Scenario | Input / Fixture | Expected Pipeline Behavior |
| :--- | :--- | :--- |
| **1. Active Opening** | Greenhouse job returns HTTP 200, published yesterday, location: Bengaluru. | Parsed, normalized, transitions to `verified_active`. Displayed in India feed with green verified badge. |
| **2. Confirmed Closed Opening** | Lever job returns HTTP 404 for Requisition ID. | Transitions to `closed`. Removed from feed. Bookmarked users see "Closed" badge. |
| **3. Transient Disappearance** | Job absent from ATS board list on 1st sync run; returns HTTP 200 on direct check. | Transitions to `quarantined_pending`. Remains in feed temporarily. Verified on 2nd sync. |
| **4. Dead Application URL** | Requisition page returns HTTP 410 or redirects to `careers.company.com/` root. | Marked `direct_apply_url = null`. Flagged for manual audit or set to `quarantined`. |
| **5. 200 OK with Closed Text** | HTML contains: *"Thank you for your interest. This position has been filled."* | Parser detects closure phrase &rarr; transitions to `closed`. |
| **6. Foreign Location** | SmartRecruiters role with location: `"Austin, TX, United States"`. | Fails India geographic filter &rarr; rejected during ingestion. |
| **7. Fake Global Remote (US Only)** | Description: *"Remote role. Must reside in US and possess Green Card or US Citizenship."* | Fails negative authorization regex &rarr; rejected from India feed. |
| **8. Multi-Source Duplicate** | Job posted on both Greenhouse board and a community markdown table. | Identity hash match &rarr; linked to primary Greenhouse record; no duplicate card shown. |
| **9. Missing Location** | Location string is blank or `null`. | Classified as `location_unknown` &rarr; excluded from primary active feed until verified. |
| **10. Expired Deadline** | Stated deadline: `2024-12-31T23:59:59Z` (past date). | Transitions to `expired`. |
| **11. Source Outage** | ATS host returns HTTP 503 Service Unavailable. | Source marked error; `consecutive_failures` incremented; existing job statuses unchanged. |
| **12. Incomplete Student Profile** | User onboarding has target roles, but empty skills array. | Personalization fallback ranks by target role and freshness without skill penalty. |
| **13. Non-Software Candidate** | Student selects `targetRoles: ["Product Design Intern", "UI/UX Designer"]`. | Engine filters for design category; zero software engineering roles recommended. |
| **14. Direct Apply Available** | Lever posting exposes explicit `applyUrl`. | Direct apply button links straight to application form; badge: "Direct Apply". |
| **15. Detail Page Only** | Company career page exposes only job description without separate form link. | Primary CTA links to canonical detail page; badge: "Apply on Company Site". |

### 12.2 Measurable Quality Metrics & Baselines

| Quality Metric | Definition / Calculation | Target V1 Benchmark |
| :--- | :--- | :--- |
| **Active-Job Precision** | Manual sample audit of 100 randomly selected live listings. | $\ge 95\%$ confirmed active and accepting applicants. |
| **Stale / Ghost Listing Rate** | % of listings in active feed found to be closed or dead upon click. | $\le 5\%$. |
| **Direct Application Fidelity** | % of active jobs with verified link pointing directly to application form. | $\ge 80\%$. |
| **Zero-Duplicate Precision** | Number of identical requisitions displayed multiple times to a user. | $\le 1\%$. |
| **Closure Detection Latency** | Elapsed time between employer closing job in ATS and HireMate marking it closed. | $< 6\text{ hours}$. |
| **India Eligibility Accuracy** | % of recommended jobs genuinely open to Indian students without US/foreign restriction. | $\ge 98\%$. |
| **Source Sync Success Rate** | % of scheduled source syncs completing without fatal adapter crashes. | $\ge 99\%$. |

---

## 13. Known Limitations and Unresolved Questions

### 13.1 Technical & Operational Limitations
1. **Workday & Custom Portal Reverse-Engineering:**  
   Companies on Workday (e.g., Qualcomm, Walmart Global Tech, Adobe) do not offer open public APIs. Interacting with Workday's client-side `/wday/cxs` endpoint carries maintenance overhead and requires careful session handling.
2. **Dynamic Client-Side Rendered Single-Page Apps:**  
   Startups using client-only React/Vue career pages without an open ATS or Schema.org microdata cannot be ingested via simple HTTP GET requests without headless browser rendering (e.g., Playwright/Puppeteer), which increases resource consumption.
3. **Campus-Specific / TPO Hiring Drives:**  
   Many top fresher roles in India are restricted to specific on-campus placement drives (TPO) and cannot be applied to off-campus. The engine must distinguish off-campus open requisitions from campus-exclusive codes.

### 13.2 Open Decisions for Phase 2
- **Decision 1: Worker Architecture**  
  Should the background sync worker run inside the primary Express process on a scheduled timer, or be separated into a standalone Node.js process using a PostgreSQL-backed job queue (e.g., `pg-boss`)?  
  *Recommendation:* Use a modular worker module inside the backend that can run either in-process or as an independent background process.
- **Decision 2: Student Profile Additions**  
  Should the `career_profiles` table be extended in Phase 2 to store minimum expected stipend and graduation batch explicitly?  
  *Recommendation:* Yes. Adding `grad_batch` and `min_stipend` to `career_profiles` will improve filter accuracy.

---

## 14. Recommended Implementation Sequence for Phase 2

```
┌────────────────────────────────────────────────────────────────────────┐
│                      PHASE 2 IMPLEMENTATION ROADMAP                    │
├────────────────────────────────────────────────────────────────────────┤
│  STEP 1: Schema Migration & Database Foundation                        │
│  Add job_sources, job_listings, user_saved_jobs, source_sync_runs       │
│                                                                        │
│  STEP 2: Core ATS Adapters Implementation                              │
│  Build Greenhouse, Lever, and Ashby adapters with unit test fixtures   │
│                                                                        │
│  STEP 3: Seed Registry & Ingestion Pipeline                            │
│  Seed 50+ verified Indian tech employers; run initial ingestion        │
│                                                                        │
│  STEP 4: Eligibility & Rule-Based Matcher Engine                       │
│  Implement deterministic location, batch, and skill match scoring      │
│                                                                        │
│  STEP 5: Backend API Routes & Dashboard Integration                    │
│  Expose /api/jobs, /api/jobs/:id, connect to /api/dashboard/overview   │
│                                                                        │
│  STEP 6: Frontend Jobs Page & Navigation Route                         │
│  Add /jobs route in App.tsx, build search, filter, and saved job views │
│                                                                        │
│  STEP 7: Automated Recheck Worker & Health Observability               │
│  Deploy scheduled verification daemon and telemetry dashboard          │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 15. Compliance, Safety & Code Integrity Confirmation

- **Application Source Code:** Untouched. No files in `client/src/` or `server/src/` were edited.
- **Database Records & Migrations:** Untouched. No migrations were created or executed. Existing tables (`users`, `career_profiles`, `resumes`, `user_sessions`) and all existing database rows remain completely intact.
- **Environment Variables & Secrets:** Untouched. `.env` and configuration files were not modified.
- **Authentication:** Untouched. Session handling, Google OAuth, and Passport configurations were not altered.
- **Phase 1 Integrity:** This phase was executed purely as non-invasive research, codebase inspection, documentation, and architectural planning.
