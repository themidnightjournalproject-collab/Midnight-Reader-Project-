/**
 * Standalone GitHub Synchronization Script for The Midnight Reader
 * 
 * Usage:
 *   npx tsx scripts/sync-github.ts <GITHUB_PAT_TOKEN> [REPO_OWNER/REPO_NAME]
 * Or:
 *   GITHUB_TOKEN=ghp_xxx npx tsx scripts/sync-github.ts
 */

import fs from 'fs';
import path from 'path';

async function run() {
  const token = process.argv[2] || process.env.GITHUB_TOKEN || process.env.GH_TOKEN || process.env.GITHUB_PAT;
  const targetRepo = process.argv[3] || 'themidnightjournalproject-collab/Midnight-Reader-Project-';

  if (!token) {
    console.error('❌ Error: GitHub Personal Access Token required.');
    console.log('Usage: npx tsx scripts/sync-github.ts <TOKEN> [REPO_NAME]');
    console.log('Example: npx tsx scripts/sync-github.ts ghp_xxxx themidnightjournalproject-collab/Midnight-Reader-Project-');
    process.exit(1);
  }

  console.log(`🔐 Validating GitHub Token with API...`);
  const userRes = await fetch('https://api.github.com/user', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'User-Agent': 'TheMidnightReader-AIStudio',
      'Accept': 'application/vnd.github.v3+json',
    }
  });

  if (!userRes.ok) {
    console.error(`❌ Token verification failed: HTTP ${userRes.status} ${userRes.statusText}`);
    const errText = await userRes.text();
    console.error(errText);
    process.exit(1);
  }

  const user = await userRes.json() as any;
  console.log(`✅ Authenticated as @${user.login} (${user.name || user.login})`);

  const [repoOwner, repoName] = targetRepo.split('/');
  console.log(`📦 Target Repository: ${repoOwner}/${repoName}`);

  // Load state and build payload
  const initialDataPath = path.join(process.cwd(), 'src', 'data', 'initialData.ts');
  const backupJsonPath = path.join(process.cwd(), 'public', 'backup-latest.json');
  const journalStorePath = path.join(process.cwd(), 'data', 'journal_store.json');

  const filesToSync: { path: string; contentBuffer: Buffer; message: string }[] = [];

  if (fs.existsSync(initialDataPath)) {
    filesToSync.push({
      path: 'src/data/initialData.ts',
      contentBuffer: fs.readFileSync(initialDataPath),
      message: 'Update non-fiction ledger & case reviews (Stone Blind, Gray After Dark, Listen For The Lie)',
    });
  }

  if (fs.existsSync(backupJsonPath)) {
    filesToSync.push({
      path: 'public/backup-latest.json',
      contentBuffer: fs.readFileSync(backupJsonPath),
      message: 'Automated archive sync - non-fiction dossiers and case files',
    });
  }

  if (fs.existsSync(journalStorePath)) {
    filesToSync.push({
      path: 'data/journal_store.json',
      contentBuffer: fs.readFileSync(journalStorePath),
      message: 'Update persistent journal store with latest non-fiction entries and reviews',
    });
  }

  const coversDir = path.join(process.cwd(), 'public', 'covers');
  if (fs.existsSync(coversDir)) {
    const coverFiles = fs.readdirSync(coversDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
    for (const cf of coverFiles) {
      const cp = path.join(coversDir, cf);
      filesToSync.push({
        path: `public/covers/${cf}`,
        contentBuffer: fs.readFileSync(cp),
        message: `Add verified book cover asset for ${cf}`,
      });
    }
  }

  console.log(`🚀 Synchronizing ${filesToSync.length} files to ${targetRepo}...`);

  for (const item of filesToSync) {
    let existingSha: string | undefined;
    try {
      const getRes = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${item.path}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'User-Agent': 'TheMidnightReader-AIStudio',
          'Accept': 'application/vnd.github.v3+json',
        }
      });
      if (getRes.ok) {
        const fileData = await getRes.json() as any;
        existingSha = fileData.sha;
      }
    } catch {
      // ignore
    }

    const putRes = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${item.path}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'TheMidnightReader-AIStudio',
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: item.message,
        content: item.contentBuffer.toString('base64'),
        sha: existingSha,
      })
    });

    if (putRes.ok) {
      const commitData = await putRes.json() as any;
      console.log(`  ✓ Synced ${item.path} -> ${commitData.commit?.html_url || commitData.content?.html_url}`);
    } else {
      const errText = await putRes.text();
      console.error(`  ✗ Failed to sync ${item.path}:`, errText);
    }
  }

  console.log(`\n🎉 GitHub synchronization complete! All non-fiction changes and case reviews are live on GitHub.`);
}

run().catch((err) => {
  console.error('Fatal error syncing to GitHub:', err);
  process.exit(1);
});
