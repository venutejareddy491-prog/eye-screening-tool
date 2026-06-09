/**
 * Quick setup verification — run: node scripts/verify-setup.js
 */
const API = process.env.API_URL || 'http://localhost:5000/api';

async function check(name, fn) {
  try {
    await fn();
    console.log(`✓ ${name}`);
    return true;
  } catch (e) {
    console.log(`✗ ${name}: ${e.message}`);
    return false;
  }
}

async function main() {
  console.log('\nSmart Dry Eye Screening — Setup Check\n');

  let ok = 0;
  const total = 3;

  if (
    await check('API health', async () => {
      const res = await fetch(`${API}/health`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    })
  )
    ok++;

  if (
    await check('MongoDB (via API)', async () => {
      const res = await fetch(`${API}/health`);
      const data = await res.json();
      if (!data.success) throw new Error('API unhealthy');
    })
  )
    ok++;

  if (
    await check('Frontend (optional)', async () => {
      const res = await fetch('http://localhost:5173', { signal: AbortSignal.timeout(2000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    })
  )
    ok++;

  console.log(`\n${ok}/${total} checks passed.\n`);
  if (ok < 2) {
    console.log('Fix: Start MongoDB, then run START.bat or npm run dev\n');
    process.exit(1);
  }
}

main();
