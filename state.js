import { CATEGORIES } from './data.js';

// ============================================================
// STATE MANAGEMENT
// ============================================================
export const STORAGE_KEY = 'interviewPrepTracker';
export const START_DATE = '2026-05-20';

export function getDefaultState() {
  return {
    startDate: START_DATE,
    settings: {
      weekendsOff: true,
      dailyProblemTarget: 4,
      dailySystemDesignMinutes: 60,
      dailyJsMinutes: 60,
      vacations: [],
    },
    dailyLogs: {},
    completedProblems: [],
    completedSystemDesign: [],
    activeList: 'blind75',
    milestonesShown: [],
    starredProblems: [],
    showStarredOnly: false,
  };
}

// Exported as `let` so other modules get a live binding — always reflects the latest value.
// Only functions in THIS module may reassign `state`.
// eslint-disable-next-line import/no-mutable-exports -- live binding required for ES module state sharing
export let state = getDefaultState();

// eslint-disable-next-line import/no-mutable-exports -- live binding required so setTempVacations updates propagate
export let tempVacations = [];

export function setTempVacations(arr) {
  tempVacations = arr;
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      state = { ...getDefaultState(), ...parsed };
      state.settings = { ...getDefaultState().settings, ...state.settings };
    }
  } catch (e) {
    console.error('Failed to load state:', e);
  }
}

export function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

/**
 * Merge remote Gist data into local state (called by doSync in app.js).
 * Reassigning `state` here keeps all live bindings in other modules up to date.
 */
export function mergeState(remoteData) {
  state = { ...getDefaultState(), ...remoteData };
  state.settings = { ...getDefaultState().settings, ...state.settings };
}

/**
 * Replace state with imported JSON data (called by importData in app.js).
 */
export function importStateData(imported) {
  state = { ...getDefaultState(), ...imported };
}

/**
 * Reset state to factory defaults (called by resetAll in app.js).
 */
export function resetState() {
  state = getDefaultState();
}

export function removeSolvedProblem(pid) {
  state.completedProblems = state.completedProblems.filter((id) => id !== pid);
  Object.keys(state.dailyLogs).forEach((date) => {
    const log = state.dailyLogs[date];
    if (log.neetcode && log.neetcode.problemsSolved) {
      log.neetcode.problemsSolved = log.neetcode.problemsSolved.filter((id) => id !== pid);
    }
  });
}

// ============================================================
// UTILITIES
// ============================================================
export function todayStr() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export function isWeekend(dateStr) {
  const d = new Date(`${dateStr}T00:00:00`);
  const day = d.getDay();
  return day === 0 || day === 6;
}

export function daysBetween(d1, d2) {
  const a = new Date(`${d1}T00:00:00`);
  const b = new Date(`${d2}T00:00:00`);
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

export function addDays(dateStr, n) {
  const d = new Date(`${dateStr}T00:00:00`);
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function formatDateLabel(dateStr) {
  const d = new Date(`${dateStr}T00:00:00`);
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export function shortMonth(monthIndex) {
  return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][monthIndex];
}

export function getProblemsForList(listId) {
  return CATEGORIES.map((cat) => ({
    ...cat,
    problems: cat.problems.filter((p) => (listId === 'neetcode150' ? true : p.blind75)),
  })).filter((cat) => cat.problems.length > 0);
}

export function getTotalProblems(listId) {
  return getProblemsForList(listId).reduce((sum, cat) => sum + cat.problems.length, 0);
}

export function getCompletedInCategory(cat) {
  return cat.problems.filter((p) => state.completedProblems.includes(p.id)).length;
}

export function getDayActivity(dateStr) {
  const log = state.dailyLogs[dateStr];
  if (!log) return 0;
  let count = 0;
  if (log.neetcode && log.neetcode.problemsSolved && log.neetcode.problemsSolved.length > 0) count++;
  if (log.systemDesign && log.systemDesign.minutes > 0) count++;
  if (log.jsReact && log.jsReact.minutes > 0) count++;
  return count;
}

export function calculateTargetStatus() {
  const today = todayStr();

  // 1. Calculate elapsed target days (inclusive of today)
  let targetDays = 0;
  let curr = state.startDate;
  const vacations = state.settings.vacations || [];
  while (daysBetween(curr, today) >= 0) {
    const isVacation = vacations.some(
      (v) => daysBetween(v.start, curr) >= 0 && daysBetween(curr, v.end) >= 0,
    );
    if (!isVacation && !(isWeekend(curr) && state.settings.weekendsOff)) {
      targetDays++;
    }
    curr = addDays(curr, 1);
  }

  // 2. DSA Target
  const dsaDaily = state.settings.dailyProblemTarget || 4;
  const dsaTargetVal = targetDays * dsaDaily;
  const dsaSolved = state.completedProblems.length;
  const dsaDiff = dsaSolved - dsaTargetVal;

  // 3. System Design Target
  const sdDailyMins = state.settings.dailySystemDesignMinutes || 60;
  const sdTargetMins = targetDays * sdDailyMins;
  const sdTargetHours = Math.round((sdTargetMins / 60) * 10) / 10;
  const sdMinutes = Object.values(state.dailyLogs).reduce((s, l) => s + (l.systemDesign ? (l.systemDesign.minutes || 0) : 0), 0);
  const sdHours = Math.round((sdMinutes / 60) * 10) / 10;
  const sdDiffHours = Math.round((sdHours - sdTargetHours) * 10) / 10;

  // 4. JS/React Target
  const jsDailyMins = state.settings.dailyJsMinutes || 60;
  const jsTargetMins = targetDays * jsDailyMins;
  const jsTargetHours = Math.round((jsTargetMins / 60) * 10) / 10;
  const jsMinutes = Object.values(state.dailyLogs).reduce((s, l) => s + (l.jsReact ? (l.jsReact.minutes || 0) : 0), 0);
  const jsHours = Math.round((jsMinutes / 60) * 10) / 10;
  const jsDiffHours = Math.round((jsHours - jsTargetHours) * 10) / 10;

  return {
    targetDays,
    dsa: { target: dsaTargetVal, actual: dsaSolved, diff: dsaDiff },
    systemDesign: { target: sdTargetHours, actual: sdHours, diff: sdDiffHours },
    jsReact: { target: jsTargetHours, actual: jsHours, diff: jsDiffHours },
  };
}

export function getTargetBadgeHTML(diff, unit = 'problems') {
  if (diff < 0) {
    const val = Math.abs(diff);
    return `<span class="stat-target lagging">${val} ${unit} behind</span>`;
  } if (diff > 0) {
    return `<span class="stat-target ahead">+${diff} ${unit} ahead</span>`;
  }
  return '<span class="stat-target ontrack">On track</span>';
}

export function getTargetFooterHTML(target, actual, diff, unit = '') {
  let diffClass = 'ontrack';
  let diffText = 'On track';

  if (diff < 0) {
    diffClass = 'lagging';
    diffText = `${Math.abs(diff)}${unit} behind`;
  } else if (diff > 0) {
    diffClass = 'ahead';
    diffText = `+${diff}${unit} ahead`;
  }

  return `
    <div class="track-target-status">
      <span class="target-label">Target: ${target}${unit}</span>
      <span class="target-value ${diffClass}">${diffText}</span>
    </div>
  `;
}

// ============================================================
// STREAK CALCULATOR
// ============================================================
export function calculateStreaks() {
  const today = todayStr();
  let longestStreak = 0;
  let tempStreak = 0;

  // Walk backward from today
  let d = today;
  let checkingCurrent = true;

  // First pass: calculate longest streak
  while (true) {
    const isWknd = isWeekend(d);
    const activity = getDayActivity(d);

    if (isWknd && state.settings.weekendsOff) {
      d = addDays(d, -1);
      if (daysBetween(state.startDate, d) < 0) break;
      continue;
    }

    if (activity > 0) {
      tempStreak++;
    } else {
      if (checkingCurrent && d === today) {
        d = addDays(d, -1);
        if (daysBetween(state.startDate, d) < 0) break;
        continue;
      }
      checkingCurrent = false;
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 0;
    }
    d = addDays(d, -1);
    if (daysBetween(state.startDate, d) < 0) break;
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  // Second pass: calculate current streak accurately
  let currentStreak = 0;
  d = today;
  if (isWeekend(today) && state.settings.weekendsOff && getDayActivity(today) === 0) {
    while (isWeekend(d)) d = addDays(d, -1);
  } else if (getDayActivity(today) === 0 && !isWeekend(today)) {
    d = addDays(d, -1);
  }

  while (daysBetween(state.startDate, d) >= 0) {
    if (isWeekend(d) && state.settings.weekendsOff) {
      d = addDays(d, -1);
      continue;
    }
    if (getDayActivity(d) > 0) {
      currentStreak++;
      d = addDays(d, -1);
    } else {
      break;
    }
  }

  longestStreak = Math.max(longestStreak, currentStreak);
  return { currentStreak, longestStreak };
}
