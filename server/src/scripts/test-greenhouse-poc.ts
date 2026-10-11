/**
 * HireMate — Phase 2A: Greenhouse API Proof of Concept (Read-Only)
 *
 * This script verifies that HireMate's Node.js + TypeScript environment
 * can reliably retrieve real, publicly available job postings from Greenhouse's
 * documented public Job Board API without modifying any database records or application code.
 *
 * Usage:
 *   npx tsx src/scripts/test-greenhouse-poc.ts [board_token]
 *
 * Default board token: "razorpaysoftwareprivatelimited" (Razorpay)
 * Alternate verified tokens: "inmobi", "thoughtworks", "databricks", "cloudflare"
 */

interface GreenhouseJobLocation {
  name?: string;
}

interface GreenhouseDepartment {
  id?: number;
  name?: string;
}

interface GreenhouseJobItem {
  id: number;
  title: string;
  location?: GreenhouseJobLocation;
  absolute_url: string;
  updated_at?: string;
  first_published?: string;
  requisition_id?: string;
  departments?: GreenhouseDepartment[];
  apply_url?: string;
  application_url?: string;
  [key: string]: unknown;
}

interface GreenhouseResponse {
  jobs?: GreenhouseJobItem[];
  meta?: {
    total?: number;
  };
  error?: string;
  status?: number;
}

const DEFAULT_BOARD_TOKEN = 'razorpaysoftwareprivatelimited';
const TIMEOUT_MS = 10000;

async function runGreenhouseProofOfConcept(): Promise<void> {
  const boardToken = process.argv[2]?.trim() || DEFAULT_BOARD_TOKEN;
  const endpointUrl = `https://boards-api.greenhouse.io/v1/boards/${encodeURIComponent(boardToken)}/jobs?content=true`;

  console.log('================================================================');
  console.log('  HIREMATE — PHASE 2A: GREENHOUSE API PROOF OF CONCEPT (READ-ONLY)');
  console.log('================================================================');
  console.log(`Board Token Target : ${boardToken}`);
  console.log(`Endpoint URL Tested: ${endpointUrl}`);
  console.log(`Request Timeout     : ${TIMEOUT_MS}ms`);
  console.log('----------------------------------------------------------------\n');

  const startTime = Date.now();

  try {
    const response = await fetch(endpointUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'User-Agent': 'HireMate-Research-Bot/1.0 (+https://hiremate.dev)',
      },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    const elapsedMs = Date.now() - startTime;
    console.log(`HTTP Response Status: ${response.status} ${response.statusText} (${elapsedMs}ms)`);

    if (!response.ok) {
      let errorBody = '';
      try {
        errorBody = await response.text();
      } catch {
        errorBody = '<Unable to read response body>';
      }
      console.error(`\n❌ Error: Greenhouse API returned non-200 HTTP status: ${response.status}`);
      console.error(`Response snippet: ${errorBody.slice(0, 300)}`);
      process.exitCode = 1;
      return;
    }

    let payload: GreenhouseResponse;
    try {
      payload = (await response.json()) as GreenhouseResponse;
    } catch (parseErr) {
      console.error('\n❌ Error: Response was not valid JSON.');
      console.error(parseErr instanceof Error ? parseErr.message : String(parseErr));
      process.exitCode = 1;
      return;
    }

    if (!payload || !Array.isArray(payload.jobs)) {
      console.error('\n❌ Error: Response payload does not contain a "jobs" array.');
      console.error('Payload preview:', JSON.stringify(payload).slice(0, 300));
      process.exitCode = 1;
      return;
    }

    const totalJobs = payload.jobs.length;
    console.log(`\n✅ Successfully retrieved jobs feed from Greenhouse.`);
    console.log(`Total Published Postings Found: ${totalJobs}\n`);

    if (totalJobs === 0) {
      console.log('⚠️ Notice: Board returned 0 active job postings at this time.');
      return;
    }

    // Inspect first job item for application URL keys
    const firstJob = payload.jobs[0];
    const hasExplicitApplyUrlKey = 'apply_url' in firstJob || 'application_url' in firstJob;

    console.log('--- APPLICATION URL INTEGRITY CHECK ---');
    if (hasExplicitApplyUrlKey) {
      console.log('Explicit Application URL Key in Response: YES');
    } else {
      console.log('Explicit Application URL Key in Response: NO (API only returns "absolute_url")');
      console.log('Note: Greenhouse embeds application forms on the canonical job details page.');
    }
    console.log('---------------------------------------\n');

    const sampleCount = Math.min(totalJobs, 5);
    console.log(`Displaying ${sampleCount} Example Postings:\n`);

    for (let i = 0; i < sampleCount; i++) {
      const job = payload.jobs[i];
      const locationName = job.location?.name?.trim() || 'Unspecified / Remote';
      const externalId = String(job.id);
      const detailsUrl = job.absolute_url || 'Missing URL';
      const title = job.title?.trim() || 'Untitled Position';
      const separateApplyUrl = job.apply_url || job.application_url || null;

      console.log(`[Job ${i + 1}/${sampleCount}]`);
      console.log(`  Title               : ${title}`);
      console.log(`  Location            : ${locationName}`);
      console.log(`  External Requisition: ${externalId}`);
      console.log(`  Job Details URL     : ${detailsUrl}`);
      console.log(
        `  Separate Apply URL  : ${
          separateApplyUrl ? separateApplyUrl : 'None (Only canonical job details URL provided)'
        }`
      );
      console.log('');
    }

    console.log('================================================================');
    console.log('  PROOF OF CONCEPT RESULT: SUCCESSFUL (READ-ONLY)');
    console.log('  - Zero database records were modified or inserted.');
    console.log('  - Zero application code files were changed.');
    console.log('  - Zero credentials or secrets were exposed.');
    console.log('================================================================');
  } catch (error) {
    const elapsedMs = Date.now() - startTime;
    console.error(`\n❌ Request failed after ${elapsedMs}ms:`);
    if (error instanceof Error) {
      if (error.name === 'TimeoutError' || error.name === 'AbortError') {
        console.error(`Timeout: The request exceeded ${TIMEOUT_MS}ms.`);
      } else {
        console.error(`Network / Runtime Error: ${error.message}`);
      }
    } else {
      console.error('Unknown failure:', error);
    }
    process.exitCode = 1;
    return;
  }
}

runGreenhouseProofOfConcept();
