import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface DiffSizeResult {
  lines: number;
  severity: 'ok' | 'warn' | 'critical';
  message?: string;
}

export async function checkGitDiffSize(): Promise<DiffSizeResult> {
  try {
    const { stdout } = await execAsync('git diff --numstat');
    return processDiffOutput(stdout);
  } catch (error) {
    return { lines: 0, severity: 'ok' };
  }
}

function processDiffOutput(stdout: string): DiffSizeResult {
  if (!stdout.trim()) {
    return { lines: 0, severity: 'ok' };
  }
  
  const totalChanges = calculateTotalChanges(stdout);
  return createDiffSizeResult(totalChanges);
}

function calculateTotalChanges(stdout: string): number {
  const lines = stdout.trim().split('\n');
  return lines.reduce((sum, line) => {
    const [added, deleted] = line.split('\t').map(Number);
    return sum + (added || 0) + (deleted || 0);
  }, 0);
}

function createDiffSizeResult(totalChanges: number): DiffSizeResult {
  if (totalChanges > 200) {
    return createCriticalDiffResult(totalChanges);
  } else if (totalChanges > 100) {
    return createWarningDiffResult(totalChanges);
  }
  
  return { lines: totalChanges, severity: 'ok' };
}

function createCriticalDiffResult(totalChanges: number): DiffSizeResult {
  return {
    lines: totalChanges,
    severity: 'critical',
    message: '👧🏻💬 STOP! Your diff is over 200 lines. This is too much change at once. Revert to last commit and break this into smaller steps with passing tests between each step.'
  };
}

function createWarningDiffResult(totalChanges: number): DiffSizeResult {
  return {
    lines: totalChanges,
    severity: 'warn',
    message: '👧🏻💬 Your diff is getting large (100+ lines). Consider committing smaller incremental changes with passing tests to maintain code quality.'
  };
}