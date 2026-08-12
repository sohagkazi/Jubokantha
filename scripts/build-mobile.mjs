import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const apiDir = path.join(process.cwd(), 'src', 'app', 'api');
const tempDir = path.join(process.cwd(), 'src', 'api_temp');

// Move API directory out of the way
if (fs.existsSync(apiDir)) {
  console.log('Temporarily moving API directory...');
  fs.renameSync(apiDir, tempDir);
}

// Clear .next cache so TS doesn't look for cached API routes
const nextDir = path.join(process.cwd(), '.next');
if (fs.existsSync(nextDir)) {
  console.log('Clearing .next cache...');
  fs.rmSync(nextDir, { recursive: true, force: true });
}

try {
  console.log('Building Next.js for mobile...');
  // Use Turbopack if previously used, or just next build
  execSync('npx next build', { 
    stdio: 'inherit',
    env: { ...process.env, BUILD_TARGET: 'mobile' }
  });
  console.log('Build successful!');
} catch (error) {
  console.error('Build failed!');
  process.exitCode = 1;
} finally {
  // Always restore the API directory
  if (fs.existsSync(tempDir)) {
    console.log('Restoring API directory...');
    fs.renameSync(tempDir, apiDir);
  }
}
