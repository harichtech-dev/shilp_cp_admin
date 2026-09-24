// scripts/railway-log-checker-upload-build.js
//
// Runs on Vercel's build machine right after `npm run build` (see
// vercel.json). Sends logs/build.log to your Railway backend so it shows
// under Build logs -> Source: Admin. Runs even when the build FAILED, which
// is when you most need to read it. Never fails the build itself.

// Node stdlib imports (CommonJS build utility)
const fs = require('fs');
const path = require('path');

// Load local config defaults; overridable through environment variables
const cfg = require('../src/lib/railway-log-checker/config.json');
const backendUrl = (process.env.LOG_BACKEND_URL || cfg.backendUrl || '').replace(/\/+$/, '');
const ingestKey = process.env.LOG_INGEST_KEY || cfg.ingestKey || '';

// --- Build log upload flow ---
(async () => {
  try {
    // Skip silently when the checker has not been configured yet
    if (!backendUrl.startsWith('http') || !ingestKey || ingestKey.startsWith('PASTE')) {
      console.log('[log-checker] not configured, skipping build log upload');
      return;
    }
    // Read the build output produced by `npm run build`
    let text = fs.readFileSync(path.join(process.cwd(), 'logs', 'build.log'), 'utf-8');
    // eslint-disable-next-line no-control-regex
    text = text.replace(/\x1b\[[0-9;]*m/g, ''); // Strip ANSI color escape codes for clean storage
    // Cap the payload to 1 MB and keep only the most recent portion
    if (text.length > 1024 * 1024) text = '...(truncated)\n' + text.slice(-1024 * 1024);
    // Prepend a timestamp so the log shows when the build finished
    text = `Build finished at ${new Date().toISOString()}\n\n` + text;

    // Upload the log text to the Railway ingest endpoint with a 10s timeout
    const res = await fetch(`${backendUrl}/railway-log-checker/ingest/build`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain', 'x-ingest-key': ingestKey },
      body: text,
      signal: AbortSignal.timeout(10000),
    });
    console.log(`[log-checker] build log upload: HTTP ${res.status}`);
  } catch (err) {
    // Never fail the deployment - just log the upload failure
    console.log('[log-checker] build log upload failed:', err.message);
  }
})();