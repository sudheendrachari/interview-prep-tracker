import { CATEGORIES, SYSTEM_DESIGN_TOPICS } from './data.js';
import {
  state, saveState, removeSolvedProblem, tempVacations,
  todayStr, isWeekend, daysBetween, formatDateLabel,
  getProblemsForList, getTotalProblems, getCompletedInCategory, getDayActivity,
  calculateTargetStatus, calculateStreaks, getTargetBadgeHTML, getTargetFooterHTML,
} from './state.js';

// Notify app.js that state changed so it can trigger auto-sync.
// This replaces all direct triggerAutoSync() calls and keeps render.js
// completely decoupled from sync.js.
const notifyDataChanged = () => document.dispatchEvent(new CustomEvent('prep:data-changed'));

// ============================================================
// CHECK-IN STATE (view-local, lives here because renderCheckin
// and saveCheckin both read/write these variables)
// ============================================================
// eslint-disable-next-line import/no-mutable-exports -- live binding required for date navigation in app.js
export let selectedDate = todayStr();
// eslint-disable-next-line import/no-mutable-exports -- live binding required for list toggle in renderCheckin
export let checkinList = 'blind75';

export function setSelectedDate(d) {
  selectedDate = d;
}

// ============================================================
// RENDER: SETTINGS VACATION LIST
// ============================================================
export function renderSettingsVacations() {
  const container = document.getElementById('vacation-list');
  if (!container) return;
  if (tempVacations.length === 0) {
    container.innerHTML = '<span class="vacation-list-empty">No excluded vacation days added yet.</span>';
    return;
  }
  container.innerHTML = tempVacations.map((v, index) => {
    const days = daysBetween(v.start, v.end) + 1;
    return `
      <div class="vacation-item">
        <span>📅 ${v.start} to ${v.end} (${days} day${days > 1 ? 's' : ''})</span>
        <button class="btn-delete-vacation" data-index="${index}" type="button">✕</button>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.btn-delete-vacation').forEach((btn) => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.dataset.index, 10);
      tempVacations.splice(index, 1);
      renderSettingsVacations();
    });
  });
}

// ============================================================
// RENDER: HERO HEADER
// ============================================================
export function renderHero() {
  const today = todayStr();
  const elapsed = daysBetween(state.startDate, today);
  const dayNum = elapsed + 1;
  document.getElementById('subtitle').textContent = `Day ${dayNum} of prep • Started May 20, 2026`;

  const totalSolved = state.completedProblems.length;
  const totalSDDone = state.completedSystemDesign.length;
  const totalHours = Object.values(state.dailyLogs).reduce((sum, log) => {
    let mins = 0;
    if (log.neetcode) mins += (log.neetcode.minutes || 0);
    if (log.systemDesign) mins += (log.systemDesign.minutes || 0);
    if (log.jsReact) mins += (log.jsReact.minutes || 0);
    return sum + mins;
  }, 0);
  const daysActive = Object.keys(state.dailyLogs).filter((d) => getDayActivity(d) > 0).length;

  const targetStatus = calculateTargetStatus();

  document.getElementById('quick-stats').innerHTML = `
    <div class="quick-stat"><div class="value">${daysActive}</div><div class="label">Days Active</div></div>
    <div class="quick-stat">
      <div class="value">${totalSolved}</div>
      <div class="label">Problems Solved</div>
      ${getTargetBadgeHTML(targetStatus.dsa.diff, 'problems')}
    </div>
    <div class="quick-stat"><div class="value">${totalSDDone}</div><div class="label">SD Topics</div></div>
    <div class="quick-stat"><div class="value">${Math.round((totalHours / 60) * 10) / 10}</div><div class="label">Hours Logged</div></div>
  `;
}

// ============================================================
// RENDER: STREAK BAR
// ============================================================
export function renderStreakBar() {
  const { currentStreak, longestStreak } = calculateStreaks();
  const today = todayStr();
  const isWknd = isWeekend(today);
  const todayActivity = getDayActivity(today);

  let nudge = '';
  if (isWknd && state.settings.weekendsOff) {
    nudge = todayActivity > 0
      ? '<div class="streak-nudge">⭐ Weekend bonus! You\'re putting in extra work!</div>'
      : '<div class="streak-nudge rest-day">😴 Rest Day — Enjoy your weekend! Streak is safe.</div>';
  } else if (todayActivity === 0) {
    nudge = '<div class="streak-nudge">⚡ Don\'t break the streak! Log today\'s progress.</div>';
  } else if (todayActivity < 3) {
    nudge = `<div class="streak-nudge">Almost there! ${3 - todayActivity} more track${3 - todayActivity > 1 ? 's' : ''} to go today.</div>`;
  } else {
    nudge = '<div class="streak-nudge all-done">🎯 All 3 tracks done today — great work!</div>';
  }

  document.getElementById('streak-bar').innerHTML = `
    <div class="streak-item">
      <span class="streak-fire">${currentStreak > 0 ? '🔥' : '💤'}</span>
      <div>
        <div class="streak-number">${currentStreak}</div>
        <div class="streak-label">Current Streak (weekdays)</div>
      </div>
    </div>
    <div class="streak-item">
      <span class="streak-trophy-icon">🏆</span>
      <div>
        <div class="streak-number longest">${longestStreak}</div>
        <div class="streak-label">Longest Streak</div>
      </div>
    </div>
    ${nudge}
  `;
}

// ============================================================
// RENDER: TRACK PROGRESS CARDS
// ============================================================
export function renderTrackCards() {
  const targetStatus = calculateTargetStatus();

  const total75 = getTotalProblems('blind75');
  const total150 = getTotalProblems('neetcode150');
  const blind75Solved = CATEGORIES.flatMap((c) => c.problems.filter((p) => p.blind75))
    .filter((p) => state.completedProblems.includes(p.id)).length;
  const n150Solved = state.completedProblems.length;

  const activeTotal = state.activeList === 'blind75' ? total75 : total150;
  const activeSolved = state.activeList === 'blind75' ? blind75Solved : n150Solved;
  const pct = activeTotal > 0 ? Math.round((activeSolved / activeTotal) * 100) : 0;
  const circumference = 2 * Math.PI * 24;
  const offset = circumference - (pct / 100) * circumference;

  // System design
  const sdTotal = SYSTEM_DESIGN_TOPICS.reduce((s, g) => s + g.topics.length, 0);
  const sdDone = state.completedSystemDesign.length;
  const sdPct = sdTotal > 0 ? Math.round((sdDone / sdTotal) * 100) : 0;
  const sdOffset = circumference - (sdPct / 100) * circumference;

  const sdMinutes = Object.values(state.dailyLogs).reduce((s, l) => s + (l.systemDesign ? (l.systemDesign.minutes || 0) : 0), 0);
  const sdHours = Math.round((sdMinutes / 60) * 10) / 10;

  // JS/React hours
  const jsMinutes = Object.values(state.dailyLogs).reduce((s, l) => s + (l.jsReact ? (l.jsReact.minutes || 0) : 0), 0);
  const jsHours = Math.round((jsMinutes / 60) * 10) / 10;
  const jsSessions = Object.values(state.dailyLogs).filter(
    (l) => l.jsReact && l.jsReact.minutes > 0,
  ).length;

  document.getElementById('track-grid').innerHTML = `
    <div class="card track-card neetcode">
      <div class="track-header">
        <div class="track-icon-wrap">
          <span class="track-icon">💻</span>
          <span class="track-title">Neetcode DSA</span>
        </div>
        <span class="track-count">${activeSolved}/${activeTotal}</span>
      </div>
      <div class="progress-ring-container">
        <svg class="progress-ring" viewBox="0 0 60 60">
          <circle class="ring-bg" cx="30" cy="30" r="24"/>
          <circle class="ring-fill" cx="30" cy="30" r="24"
            stroke="var(--green-main)" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"/>
        </svg>
        <div class="progress-info">
          <div class="progress-pct">${pct}%</div>
          <div class="progress-detail">${state.activeList === 'blind75' ? 'Blind 75' : 'Neetcode 150'}</div>
        </div>
      </div>
      <div class="progress-bar-track"><div class="progress-bar-fill" style="width:${pct}%"></div></div>
      <div class="category-mini"><span>${activeSolved} solved</span><span>${activeTotal - activeSolved} remaining</span></div>
      ${getTargetFooterHTML(targetStatus.dsa.target, targetStatus.dsa.actual, targetStatus.dsa.diff, ' solved')}
    </div>

    <div class="card track-card sysdesign">
      <div class="track-header">
        <div class="track-icon-wrap">
          <span class="track-icon">🏗️</span>
          <span class="track-title">System Design</span>
        </div>
        <span class="track-count">${sdDone}/${sdTotal}</span>
      </div>
      <div class="progress-ring-container">
        <svg class="progress-ring" viewBox="0 0 60 60">
          <circle class="ring-bg" cx="30" cy="30" r="24"/>
          <circle class="ring-fill" cx="30" cy="30" r="24"
            stroke="var(--blue-main)" stroke-dasharray="${circumference}" stroke-dashoffset="${sdOffset}"/>
        </svg>
        <div class="progress-info">
          <div class="progress-pct">${sdPct}%</div>
          <div class="progress-detail">Topics (${sdHours}h logged)</div>
        </div>
      </div>
      <div class="progress-bar-track"><div class="progress-bar-fill" style="width:${sdPct}%"></div></div>
      <div class="category-mini"><span>${sdDone} covered (${sdHours}h logged)</span><span>${sdTotal - sdDone} remaining</span></div>
      ${getTargetFooterHTML(targetStatus.systemDesign.target, targetStatus.systemDesign.actual, targetStatus.systemDesign.diff, 'h')}
    </div>

    <div class="card track-card jsreact">
      <div class="track-header">
        <div class="track-icon-wrap">
          <span class="track-icon">⚛️</span>
          <span class="track-title">JS / React</span>
        </div>
        <span class="track-count">${jsHours}h</span>
      </div>
      <div class="progress-ring-container">
        <svg class="progress-ring" viewBox="0 0 60 60">
          <circle class="ring-bg" cx="30" cy="30" r="24"/>
          <circle class="ring-fill" cx="30" cy="30" r="24"
            stroke="var(--amber-main)" stroke-dasharray="${circumference}"
            stroke-dashoffset="${circumference - Math.min(1, jsHours / 50) * circumference}"/>
        </svg>
        <div class="progress-info">
          <div class="progress-pct">${jsHours}h</div>
          <div class="progress-detail">${jsSessions} sessions</div>
        </div>
      </div>
      <div class="progress-bar-track"><div class="progress-bar-fill" style="width:${Math.min(100, (jsHours / 50) * 100)}%"></div></div>
      <div class="category-mini"><span>${jsSessions} sessions</span><span>${jsMinutes} total mins</span></div>
      ${getTargetFooterHTML(targetStatus.jsReact.target, targetStatus.jsReact.actual, targetStatus.jsReact.diff, 'h')}
    </div>
  `;
}

// ============================================================
// RENDER: HEATMAP
// ============================================================
export function renderHeatmap() {
  const wrapper = document.getElementById('heatmap-wrapper');
  const today = todayStr();
  const startDate = new Date(`${state.startDate}T00:00:00`);

  // Go back to the most recent Sunday before startDate for alignment
  const gridStart = new Date(startDate);
  while (gridStart.getDay() !== 0) gridStart.setDate(gridStart.getDate() - 1);

  // Go forward to at least 2 extra weeks past today
  const gridEnd = new Date(`${today}T00:00:00`);
  gridEnd.setDate(gridEnd.getDate() + ((7 - gridEnd.getDay()) % 7) + 14);

  const totalDays = Math.ceil((gridEnd - gridStart) / (1000 * 60 * 60 * 24));
  const weeks = Math.ceil(totalDays / 7);

  let html = '<div class="heatmap-grid">';
  const d = new Date(gridStart);

  for (let i = 0; i < weeks * 7; i++) {
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const beforeStart = d < startDate;
    const isFuture = dateStr > today;
    const isToday = dateStr === today;
    const isWknd = isWeekend(dateStr);
    const activity = getDayActivity(dateStr);

    const vacations = state.settings.vacations || [];
    const isVacation = vacations.some(
      (v) => daysBetween(v.start, dateStr) >= 0 && daysBetween(dateStr, v.end) >= 0,
    );

    let levelClass = '';
    if (!beforeStart && !isFuture) {
      if (activity === 1) levelClass = 'level-1';
      else if (activity === 2) levelClass = 'level-2';
      else if (activity >= 3) levelClass = 'level-3';
    }

    let extraClasses = '';
    if (isWknd) extraClasses += ' weekend';
    if (isVacation) extraClasses += ' vacation';
    if (isFuture) extraClasses += ' future';
    if (isToday) extraClasses += ' today';
    if (beforeStart) extraClasses += ' future';

    html += `<div class="heatmap-cell ${levelClass}${extraClasses}" data-date="${dateStr}" data-activity="${activity}"></div>`;
    d.setDate(d.getDate() + 1);
  }

  html += '</div>';
  wrapper.innerHTML = html;

  // Tooltip
  const tooltip = document.getElementById('heatmap-tooltip');
  wrapper.addEventListener('mouseover', (e) => {
    const cell = e.target.closest('.heatmap-cell');
    if (!cell) { tooltip.style.display = 'none'; return; }
    const { date } = cell.dataset;
    const log = state.dailyLogs[date];
    const isWknd = isWeekend(date);
    const vacations = state.settings.vacations || [];
    const isVacation = vacations.some(
      (v) => daysBetween(v.start, date) >= 0 && daysBetween(date, v.end) >= 0,
    );

    let text = `<strong>${formatDateLabel(date)}</strong>`;
    const tags = [];
    if (isWknd) tags.push('Weekend');
    if (isVacation) tags.push('Excluded Day');
    if (tags.length > 0) text += ` (${tags.join(', ')})`;
    text += '<br>';

    if (log) {
      if (log.neetcode && log.neetcode.problemsSolved && log.neetcode.problemsSolved.length > 0) {
        text += `✅ ${log.neetcode.problemsSolved.length} problem(s) solved<br>`;
      }
      if (log.systemDesign && log.systemDesign.minutes > 0) {
        text += `🏗️ ${log.systemDesign.minutes} min System Design<br>`;
        if (log.systemDesign.topic) text += `   → ${log.systemDesign.topic}<br>`;
      }
      if (log.jsReact && log.jsReact.minutes > 0) {
        text += `⚛️ ${log.jsReact.minutes} min JS/React<br>`;
        if (log.jsReact.topic) text += `   → ${log.jsReact.topic}<br>`;
      }
      if (!log.neetcode?.problemsSolved?.length && !log.systemDesign?.minutes && !log.jsReact?.minutes) {
        text += 'No activity logged';
      }
    } else if (date > todayStr()) {
      text += 'Upcoming';
    } else if (date >= state.startDate) {
      text += 'No activity logged';
    }

    tooltip.innerHTML = text;
    tooltip.style.display = 'block';
    const rect = cell.getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
    tooltip.style.top = `${rect.top - tooltip.offsetHeight - 8}px`;
  });
  wrapper.addEventListener('mouseout', () => { tooltip.style.display = 'none'; });
}

// ============================================================
// RENDER: DAILY CHECK-IN
// ============================================================
export function renderCheckin() {
  const dateInput = document.getElementById('checkin-date');
  dateInput.value = selectedDate;
  const label = document.getElementById('checkin-day-label');
  const isWknd = isWeekend(selectedDate);
  label.textContent = `${formatDateLabel(selectedDate)}${isWknd ? ' 🏖️ Weekend' : ''}`;

  const log = state.dailyLogs[selectedDate] || {
    neetcode: { problemsSolved: [], minutes: 0, notes: '' },
    systemDesign: { topic: '', minutes: 0, notes: '' },
    jsReact: { topic: '', minutes: 0, notes: '' },
  };

  document.getElementById('checkin-grid').innerHTML = `
    <div class="card checkin-card neetcode">
      <div class="checkin-title"><span class="dot"></span> Neetcode DSA</div>
      <div class="form-group form-group--tight">
        <label>Problems Solved Today</label>
        <div class="checkin-list-header">
          <div class="list-toggle-sm" id="checkin-list-toggle">
            <button class="${checkinList === 'blind75' ? 'active' : ''}" data-list="blind75" type="button">Blind 75</button>
            <button class="${checkinList === 'neetcode150' ? 'active' : ''}" data-list="neetcode150" type="button">Neetcode 150</button>
          </div>
        </div>
        <select id="checkin-problem-cat">
          <option value="">-- Select Category --</option>
          ${getProblemsForList(checkinList).map((cat) => `<option value="${cat.id}">${cat.name}</option>`).join('')}
        </select>
        <input type="text" id="checkin-problem-search" placeholder="🔍 Search problems..." autocomplete="off">
        <div id="checkin-problem-list" class="checkin-problem-scroll"></div>
      </div>
    </div>

    <div class="card checkin-card sysdesign">
      <div class="checkin-title"><span class="dot"></span> System Design</div>
      <div class="form-group">
        <label>Topic Covered</label>
        <input type="text" id="checkin-sd-topic" list="sd-topics-list" placeholder="e.g., URL Shortener" value="${log.systemDesign.topic || ''}">
        <datalist id="sd-topics-list">
          ${SYSTEM_DESIGN_TOPICS.flatMap((g) => g.topics).map((t) => `<option value="${t.name}">`).join('')}
        </datalist>
      </div>
      <div class="form-group">
        <label>Minutes Spent</label>
        <div class="minute-input-group">
          <input type="number" id="checkin-sd-mins" min="0" value="${log.systemDesign.minutes || 0}">
          <span>minutes</span>
        </div>
      </div>
    </div>

    <div class="card checkin-card jsreact">
      <div class="checkin-title"><span class="dot"></span> JS / React</div>
      <div class="form-group">
        <label>What did you work on?</label>
        <input type="text" id="checkin-js-topic" placeholder="e.g., Built todo list component" value="${log.jsReact.topic || ''}">
      </div>
      <div class="form-group">
        <label>Minutes Spent</label>
        <div class="minute-input-group">
          <input type="number" id="checkin-js-mins" min="0" value="${log.jsReact.minutes || 0}">
          <span>minutes</span>
        </div>
      </div>
    </div>
  `;

  // Problem category change & search input change
  const catSelect = document.getElementById('checkin-problem-cat');
  const searchInput = document.getElementById('checkin-problem-search');

  const triggerFilter = () => {
    renderCheckinProblems(catSelect.value, searchInput.value, log);
  };

  catSelect.addEventListener('change', triggerFilter);
  searchInput.addEventListener('input', triggerFilter);

  // List toggle change inside checkin
  const toggleContainer = document.getElementById('checkin-list-toggle');
  if (toggleContainer) {
    toggleContainer.querySelectorAll('button').forEach((btn) => {
      btn.addEventListener('click', () => {
        checkinList = btn.dataset.list;

        // Redraw category options
        const prevSelectedCat = catSelect.value;
        catSelect.innerHTML = `<option value="">-- Select Category --</option>${
          getProblemsForList(checkinList).map((cat) => `<option value="${cat.id}">${cat.name}</option>`).join('')}`;

        if (prevSelectedCat) catSelect.value = prevSelectedCat;

        // Clear search text and re-trigger filtering
        searchInput.value = '';
        triggerFilter();

        toggleContainer.querySelectorAll('button').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  }
}

export function renderCheckinProblems(catId, searchQuery, log) {
  const container = document.getElementById('checkin-problem-list');

  const cats = getProblemsForList(checkinList);
  let problemsToDisplay = [];

  if (catId) {
    const cat = cats.find((c) => c.id === catId);
    if (cat) problemsToDisplay = cat.problems;
  } else if (searchQuery && searchQuery.trim() !== '') {
    problemsToDisplay = cats.flatMap((c) => c.problems);
  }

  if (searchQuery && searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase().trim();
    problemsToDisplay = problemsToDisplay.filter((p) => p.name.toLowerCase().includes(q));
  }

  if (problemsToDisplay.length === 0) {
    if (!catId && (!searchQuery || searchQuery.trim() === '')) {
      container.innerHTML = '<span class="checkin-empty-hint">Select a category or type to search problems</span>';
    } else {
      container.innerHTML = '<span class="checkin-empty-hint">No matching problems found</span>';
    }
    return;
  }

  const solvedToday = log.neetcode.problemsSolved || [];

  // Helper to find which date a problem was solved on
  const getSolvedDate = (pid) => {
    const found = Object.keys(state.dailyLogs).find((date) => {
      if (date === selectedDate) return false;
      const dLog = state.dailyLogs[date];
      return dLog.neetcode && dLog.neetcode.problemsSolved && dLog.neetcode.problemsSolved.includes(pid);
    });
    return found || null;
  };

  container.innerHTML = problemsToDisplay.map((p) => {
    const isSolvedToday = solvedToday.includes(p.id);
    const isSolvedElsewhere = state.completedProblems.includes(p.id) && !isSolvedToday;

    let disabledAttr = '';
    let checkedAttr = '';
    let labelSuffix = '';
    let solvedClass = '';

    if (isSolvedToday) {
      checkedAttr = 'checked';
      solvedClass = 'solved';
    } else if (isSolvedElsewhere) {
      checkedAttr = 'checked';
      disabledAttr = 'disabled';
      solvedClass = 'solved';
      const solvedDate = getSolvedDate(p.id);
      labelSuffix = `<span class="problem-solved-date">${solvedDate ? `(Solved on ${solvedDate})` : '(Solved on Roadmap)'}</span>`;
    }

    const isStarred = (state.starredProblems || []).includes(p.id);

    return `
      <div class="problem-item problem-item--compact${isSolvedElsewhere ? ' problem-item--disabled' : ''}">
        <input type="checkbox" id="checkin-p-${p.id}" data-problem-id="${p.id}" ${checkedAttr} ${disabledAttr}>
        <button class="btn-star btn-star--sm ${isStarred ? 'starred' : ''}" data-problem-id="${p.id}" title="${isStarred ? 'Unstar problem' : 'Star problem'}">
          ${isStarred ? '★' : '☆'}
        </button>
        <span class="problem-name problem-name--sm ${solvedClass}">${p.name}${labelSuffix}</span>
        <span class="difficulty-badge ${p.difficulty}">${p.difficulty}</span>
      </div>
    `;
  }).join('');

  // Star toggle in check-in problem list
  container.querySelectorAll('.btn-star').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const pid = btn.dataset.problemId;
      if (!state.starredProblems) state.starredProblems = [];
      const index = state.starredProblems.indexOf(pid);
      if (index === -1) {
        state.starredProblems.push(pid);
      } else {
        state.starredProblems.splice(index, 1);
      }
      saveState();
      renderCheckinProblems(catId, searchQuery, log);
      renderRoadmap();
      notifyDataChanged(); // was: triggerAutoSync()
    });
  });
}

// ============================================================
// RENDER: PROBLEM ROADMAP
// ============================================================
export function renderRoadmap() {
  const cats = getProblemsForList(state.activeList);
  const activeListProblemIds = new Set(cats.flatMap((cat) => cat.problems.map((p) => p.id)));
  const activeStarredCount = (state.starredProblems || []).filter((id) => activeListProblemIds.has(id)).length;

  // Filter toggle button UI
  const filterBtn = document.getElementById('filter-starred-btn');
  if (filterBtn) {
    const newFilterBtn = filterBtn.cloneNode(true);
    filterBtn.parentNode.replaceChild(newFilterBtn, filterBtn);
    newFilterBtn.classList.toggle('active', !!state.showStarredOnly);
    newFilterBtn.innerHTML = `<span class="star-icon">${state.showStarredOnly ? '★' : '☆'}</span> Show Starred Only (${activeStarredCount})`;
    newFilterBtn.addEventListener('click', () => {
      state.showStarredOnly = !state.showStarredOnly;
      saveState();
      renderRoadmap();
    });
  }

  // List toggle
  document.getElementById('list-toggle').innerHTML = `
    <button class="${state.activeList === 'blind75' ? 'active' : ''}" data-list="blind75">Blind 75</button>
    <button class="${state.activeList === 'neetcode150' ? 'active' : ''}" data-list="neetcode150">Neetcode 150</button>
  `;

  const container = document.getElementById('roadmap-categories');

  if (state.showStarredOnly && activeStarredCount === 0) {
    container.innerHTML = `
      <div class="empty-starred-state">
        <div class="empty-starred-icon">⭐</div>
        <p class="empty-starred-title">No starred problems in this list</p>
        <p class="empty-starred-desc">Star problems in the roadmap to flag them for review later.</p>
      </div>
    `;
  } else {
    container.innerHTML = cats.map((cat) => {
      const completed = getCompletedInCategory(cat);
      const total = cat.problems.length;
      const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

      let displayProblems = cat.problems;
      if (state.showStarredOnly) {
        displayProblems = cat.problems.filter((p) => (state.starredProblems || []).includes(p.id));
      }

      if (state.showStarredOnly && displayProblems.length === 0) return '';

      return `
        <div class="category-accordion">
          <button class="category-header" data-cat="${cat.id}">
            <span class="chevron ${state.showStarredOnly ? 'open' : ''}">▶</span>
            <span class="cat-name">${cat.name}</span>
            <span class="cat-progress">${completed}/${total}</span>
            <div class="cat-bar"><div class="cat-bar-fill" style="width:${pct}%"></div></div>
          </button>
          <div class="category-problems ${state.showStarredOnly ? 'open' : ''}" id="cat-${cat.id}">
            <div class="category-problems-inner">
              ${displayProblems.map((p) => {
    const isSolved = state.completedProblems.includes(p.id);
    const isStarred = (state.starredProblems || []).includes(p.id);
    return `
                  <div class="problem-item">
                    <input type="checkbox" data-problem-id="${p.id}" ${isSolved ? 'checked' : ''}>
                    <button class="btn-star ${isStarred ? 'starred' : ''}" data-problem-id="${p.id}" title="${isStarred ? 'Unstar problem' : 'Star problem'}">
                      ${isStarred ? '★' : '☆'}
                    </button>
                    <span class="problem-name ${isSolved ? 'solved' : ''}">${p.name}</span>
                    <span class="difficulty-badge ${p.difficulty}">${p.difficulty}</span>
                    <a class="problem-link" href="https://neetcode.io/problems/${p.id}" target="_blank" rel="noopener">↗ neetcode</a>
                  </div>
                `;
  }).join('')}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Accordion toggle
  container.querySelectorAll('.category-header').forEach((btn) => {
    btn.addEventListener('click', () => {
      const catId = btn.dataset.cat;
      const panel = document.getElementById(`cat-${catId}`);
      const chevron = btn.querySelector('.chevron');
      panel.classList.toggle('open');
      chevron.classList.toggle('open');
    });
  });

  // Checkbox toggle in roadmap
  container.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
    cb.addEventListener('change', () => {
      const pid = cb.dataset.problemId;
      const today = todayStr();
      if (!state.dailyLogs[today]) {
        state.dailyLogs[today] = {
          neetcode: { problemsSolved: [], minutes: 0, notes: '' },
          systemDesign: { topic: '', minutes: 0, notes: '' },
          jsReact: { topic: '', minutes: 0, notes: '' },
        };
      }
      if (!state.dailyLogs[today].neetcode) {
        state.dailyLogs[today].neetcode = { problemsSolved: [], minutes: 0, notes: '' };
      }
      if (!state.dailyLogs[today].neetcode.problemsSolved) {
        state.dailyLogs[today].neetcode.problemsSolved = [];
      }

      if (cb.checked) {
        if (!state.completedProblems.includes(pid)) state.completedProblems.push(pid);
        if (!state.dailyLogs[today].neetcode.problemsSolved.includes(pid)) {
          state.dailyLogs[today].neetcode.problemsSolved.push(pid);
        }
      } else {
        removeSolvedProblem(pid);
      }
      saveState();
      renderAll();
      checkMilestones();
      notifyDataChanged(); // was: triggerAutoSync()
    });
  });

  // Star toggle in roadmap
  container.querySelectorAll('.btn-star').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const pid = btn.dataset.problemId;
      if (!state.starredProblems) state.starredProblems = [];
      const index = state.starredProblems.indexOf(pid);
      if (index === -1) {
        state.starredProblems.push(pid);
      } else {
        state.starredProblems.splice(index, 1);
      }
      saveState();
      renderRoadmap();
      notifyDataChanged(); // was: triggerAutoSync()
    });
  });

  // List toggle
  document.getElementById('list-toggle').querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.activeList = btn.dataset.list;
      saveState();
      renderRoadmap();
      renderTrackCards();
    });
  });
}

// ============================================================
// RENDER: SYSTEM DESIGN ROADMAP
// ============================================================
export function renderSDRoadmap() {
  const container = document.getElementById('sd-roadmap');
  const sdTotal = SYSTEM_DESIGN_TOPICS.reduce((s, g) => s + g.topics.length, 0);
  const sdDone = state.completedSystemDesign.length;

  container.innerHTML = `
    <div class="sd-roadmap-count">
      ${sdDone}/${sdTotal} topics covered
    </div>
    ${SYSTEM_DESIGN_TOPICS.map((group) => `
      <div class="sd-topic-group">
        <div class="sd-topic-group-title">${group.group}</div>
        ${group.topics.map((t) => {
    const done = state.completedSystemDesign.includes(t.id);
    return `
            <div class="sd-topic-item">
              <input type="checkbox" data-sd-id="${t.id}" ${done ? 'checked' : ''}>
              <span class="sd-name ${done ? 'solved' : ''}">${t.name}</span>
            </div>
          `;
  }).join('')}
      </div>
    `).join('')}
  `;

  container.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
    cb.addEventListener('change', () => {
      const sid = cb.dataset.sdId;
      if (cb.checked && !state.completedSystemDesign.includes(sid)) {
        state.completedSystemDesign.push(sid);
      } else if (!cb.checked) {
        state.completedSystemDesign = state.completedSystemDesign.filter((id) => id !== sid);
      }
      saveState();
      renderTrackCards();
      notifyDataChanged(); // was: triggerAutoSync()
    });
  });
}

// ============================================================
// MILESTONES & CONFETTI
// ============================================================
export function checkMilestones() {
  const total = getTotalProblems(state.activeList);
  const solved = state.activeList === 'blind75'
    ? CATEGORIES.flatMap((c) => c.problems.filter((p) => p.blind75))
      .filter((p) => state.completedProblems.includes(p.id)).length
    : state.completedProblems.length;
  const pct = Math.round((solved / total) * 100);

  const milestones = [25, 50, 75, 100];
  for (const m of milestones) {
    const key = `${state.activeList}-${m}`;
    if (pct >= m && !state.milestonesShown.includes(key)) {
      state.milestonesShown.push(key);
      saveState();
      fireCelebration(m);
      break;
    }
  }
}

export function fireCelebration(pct) {
  if (typeof confetti === 'function') {
    const colors = pct === 100
      ? ['#10b981', '#3b82f6', '#f59e0b', '#f97316', '#ef4444']
      : ['#10b981', '#34d399', '#059669'];

    confetti({
      particleCount: pct === 100 ? 200 : 100, spread: 80, origin: { y: 0.6 }, colors,
    });
    if (pct === 100) {
      setTimeout(() => confetti({
        particleCount: 100, angle: 60, spread: 55, origin: { x: 0 }, colors,
      }), 300);
      setTimeout(() => confetti({
        particleCount: 100, angle: 120, spread: 55, origin: { x: 1 }, colors,
      }), 500);
    }
  }
}

// ============================================================
// SAVE CHECK-IN
// ============================================================
export function saveCheckin() {
  const log = state.dailyLogs[selectedDate] || {
    neetcode: { problemsSolved: [], minutes: 0, notes: '' },
    systemDesign: { topic: '', minutes: 0, notes: '' },
    jsReact: { topic: '', minutes: 0, notes: '' },
  };

  // Gather checked problems from the checkin area (only the currently-visible list)
  const checkinProblems = document.querySelectorAll('#checkin-problem-list input[type="checkbox"]');

  // The IDs currently rendered in the form — we only touch these.
  // Problems ticked via the Roadmap that aren't visible here are preserved as-is.
  const visibleIds = new Set(
    [...checkinProblems].map((cb) => cb.dataset.problemId).filter(Boolean),
  );

  // Start from whatever is already in the log for today
  const existingSolved = new Set(log.neetcode.problemsSolved || []);

  checkinProblems.forEach((cb) => {
    if (cb.disabled) return; // Skip problems solved on other days
    const pid = cb.dataset.problemId;
    if (cb.checked) {
      existingSolved.add(pid);
      if (!state.completedProblems.includes(pid)) state.completedProblems.push(pid);
    } else {
      // Only uncheck if it was in the visible set (user explicitly unchecked it)
      existingSolved.delete(pid);
      // Only remove from completedProblems if it's not ticked elsewhere (roadmap)
      if (!state.completedProblems.includes(pid) || visibleIds.has(pid)) {
        removeSolvedProblem(pid);
      }
    }
  });

  const solvedToday = [...existingSolved];

  log.neetcode.problemsSolved = solvedToday;
  log.neetcode.minutes = 0;
  log.neetcode.notes = '';

  const oldTopic = log.systemDesign.topic || '';
  const newTopic = document.getElementById('checkin-sd-topic').value.trim();

  // Auto-link/cleanup System Design topic to/from roadmap
  const allSdTopics = SYSTEM_DESIGN_TOPICS.flatMap((g) => g.topics);

  // 1. If old topic is changed/cleared, check if we should uncheck it from the roadmap
  if (oldTopic && oldTopic.toLowerCase() !== newTopic.toLowerCase()) {
    const matchedOld = allSdTopics.find((t) => t.name.toLowerCase() === oldTopic.toLowerCase());
    if (matchedOld) {
      const isLoggedElsewhere = Object.entries(state.dailyLogs).some(
        ([date, l]) => date !== selectedDate && l.systemDesign?.topic?.toLowerCase() === oldTopic.toLowerCase(),
      );
      if (!isLoggedElsewhere) {
        state.completedSystemDesign = state.completedSystemDesign.filter((id) => id !== matchedOld.id);
      }
    }
  }

  log.systemDesign.topic = newTopic;
  log.systemDesign.minutes = parseInt(document.getElementById('checkin-sd-mins').value, 10) || 0;
  log.systemDesign.notes = '';

  // 2. If new topic matches a predefined one, auto-check it on the roadmap
  if (newTopic) {
    const matchedNew = allSdTopics.find((t) => t.name.toLowerCase() === newTopic.toLowerCase());
    if (matchedNew) {
      log.systemDesign.topic = matchedNew.name; // Normalize capitalization
      if (!state.completedSystemDesign.includes(matchedNew.id)) {
        state.completedSystemDesign.push(matchedNew.id);
      }
    }
  }

  log.jsReact.topic = document.getElementById('checkin-js-topic').value;
  log.jsReact.minutes = parseInt(document.getElementById('checkin-js-mins').value, 10) || 0;
  log.jsReact.notes = '';

  state.dailyLogs[selectedDate] = log;
  saveState();

  // Show feedback
  const fb = document.getElementById('save-feedback');
  fb.classList.add('show');
  setTimeout(() => fb.classList.remove('show'), 2000);

  renderAll();
  checkMilestones();
}

// ============================================================
// RENDER ALL
// ============================================================
export function renderAll() {
  renderHero();
  renderStreakBar();
  renderTrackCards();
  renderHeatmap();
  renderCheckin();
  renderRoadmap();
  renderSDRoadmap();
}
