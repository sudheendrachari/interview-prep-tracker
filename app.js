import {
  state, saveState, loadState,
  mergeState, importStateData, resetState,
  setTempVacations, tempVacations,
  todayStr, addDays, daysBetween,
} from './state.js';
import {
  renderAll, renderSettingsVacations,
  saveCheckin, setSelectedDate, selectedDate,
} from './render.js';

// ============================================================
// CROSS-MODULE EVENT BRIDGES (eliminates circular dependencies)
//
//  render.js  ──dispatch('prep:data-changed')──►  document
//                                                      │
//  app.js  ◄──listen('prep:data-changed')─────────────┘──► triggerAutoSync()
//
//  sync (below)  ──dispatch('prep:state-updated')──►  document
//                                                           │
//  app.js  ◄──listen('prep:state-updated')──────────────────┘──► renderAll()
// ============================================================

// ============================================================
// GITHUB GIST SYNC
// ============================================================
const SYNC_TOKEN_KEY = 'interviewPrepTracker_ghToken';
const SYNC_GIST_KEY = 'interviewPrepTracker_gistId';
const GIST_FILENAME = 'interview-prep-tracker-data.json';
const GITHUB_API = 'https://api.github.com';

function getSyncToken() { return localStorage.getItem(SYNC_TOKEN_KEY) || ''; }
function getSyncGistId() { return localStorage.getItem(SYNC_GIST_KEY) || ''; }
function setSyncToken(t) { localStorage.setItem(SYNC_TOKEN_KEY, t); }
function setSyncGistId(id) { localStorage.setItem(SYNC_GIST_KEY, id); }
function clearSyncConfig() {
  localStorage.removeItem(SYNC_TOKEN_KEY);
  localStorage.removeItem(SYNC_GIST_KEY);
}

function updateSyncUI(status, text) {
  const dot = document.getElementById('sync-dot');
  const label = document.getElementById('sync-status-text');
  dot.className = 'sync-dot';
  if (status === 'connected') dot.classList.add('connected');
  else if (status === 'syncing') dot.classList.add('syncing');
  else if (status === 'error') dot.classList.add('error');
  label.textContent = text;
}

function setSyncBtnLoading(loading) {
  const btn = document.getElementById('sync-btn');
  if (loading) {
    btn.disabled = true;
    btn.innerHTML = '<span class="spin">⟳</span> Syncing…';
  } else {
    btn.disabled = false;
    btn.innerHTML = '☁️ Sync';
  }
}

function renderSyncStatus() {
  const token = getSyncToken();
  const gistId = getSyncGistId();
  if (token && gistId) {
    updateSyncUI('connected', 'Connected to Gist');
  } else if (token) {
    updateSyncUI('connected', 'Token set — will create Gist on sync');
  } else {
    updateSyncUI('', 'Not connected');
  }
}

async function gistRequest(method, path, body) {
  const token = getSyncToken();
  if (!token) throw new Error('No GitHub token configured');
  const opts = {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github+json',
    },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${GITHUB_API}${path}`, opts);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `GitHub API error ${res.status}`);
  }
  return res.json();
}

async function createGist() {
  const data = await gistRequest('POST', '/gists', {
    description: 'Interview Prep Tracker — auto-synced data',
    public: false,
    files: { [GIST_FILENAME]: { content: JSON.stringify(state, null, 2) } },
  });
  setSyncGistId(data.id);
  return data;
}

async function pushToGist() {
  const gistId = getSyncGistId();
  if (!gistId) return createGist();
  return gistRequest('PATCH', `/gists/${gistId}`, {
    files: { [GIST_FILENAME]: { content: JSON.stringify(state, null, 2) } },
  });
}

async function pullFromGist() {
  const gistId = getSyncGistId();
  if (!gistId) throw new Error('No Gist ID — sync first to create one');
  const data = await gistRequest('GET', `/gists/${gistId}`);
  const file = data.files[GIST_FILENAME];
  if (!file) throw new Error(`File "${GIST_FILENAME}" not found in Gist`);
  return JSON.parse(file.content);
}

async function doSync() {
  const token = getSyncToken();
  if (!token) {
    document.getElementById('sync-modal').classList.add('show');
    return;
  }
  setSyncBtnLoading(true);
  updateSyncUI('syncing', 'Syncing…');
  try {
    const gistId = getSyncGistId();
    if (gistId) {
      // Pull remote, merge (remote wins for conflicts based on timestamp)
      const remote = await pullFromGist();
      const localTs = state.lastSyncedAt || 0;
      const remoteTs = remote.lastSyncedAt || 0;
      if (remoteTs > localTs) {
        // Remote is newer — adopt remote data (mergeState lives in state.js)
        mergeState(remote);
        saveState();
        // Notify render.js to re-render without importing it directly
        document.dispatchEvent(new CustomEvent('prep:state-updated'));
      }
    }
    // Now push current local state
    state.lastSyncedAt = Date.now();
    saveState();
    await pushToGist();
    updateSyncUI('connected', `Synced — ${new Date().toLocaleTimeString()}`);
  } catch (err) {
    console.error('Sync failed:', err);
    updateSyncUI('error', `Sync failed: ${err.message}`);
  } finally {
    setSyncBtnLoading(false);
  }
}

let syncTimeout = null;
function triggerAutoSync() {
  if (!getSyncToken()) return;
  if (syncTimeout) clearTimeout(syncTimeout);
  syncTimeout = setTimeout(() => { doSync(); }, 1500);
}

// Cross-module event bridges — placed here so both triggerAutoSync (above)
// and renderAll (imported at top) are fully resolved before registration.
document.addEventListener('prep:data-changed', () => triggerAutoSync());
document.addEventListener('prep:state-updated', () => renderAll());

function initSync() {
  renderSyncStatus();

  // Sync button
  document.getElementById('sync-btn').addEventListener('click', doSync);

  // Settings button opens modal
  document.getElementById('sync-settings-btn').addEventListener('click', () => {
    const modal = document.getElementById('sync-modal');
    document.getElementById('settings-dsa-target').value = state.settings.dailyProblemTarget || 4;
    document.getElementById('settings-sd-target').value = state.settings.dailySystemDesignMinutes || 60;
    document.getElementById('settings-js-target').value = state.settings.dailyJsMinutes || 60;
    document.getElementById('settings-weekends-off').checked = !!state.settings.weekendsOff;

    // Load vacations into temp list and render
    setTempVacations(JSON.parse(JSON.stringify(state.settings.vacations || [])));
    renderSettingsVacations();

    document.getElementById('sync-token-input').value = getSyncToken();
    document.getElementById('sync-gist-id-input').value = getSyncGistId();

    // Show connected banner if applicable
    const banner = document.getElementById('sync-connected-banner');
    const gistId = getSyncGistId();
    if (gistId) {
      banner.style.display = 'flex';
      document.getElementById('sync-gist-id-display').textContent = gistId;
    } else {
      banner.style.display = 'none';
    }
    modal.classList.add('show');
  });

  // Add vacation range in modal
  document.getElementById('btn-add-vacation').addEventListener('click', () => {
    const startInput = document.getElementById('vacation-start');
    const endInput = document.getElementById('vacation-end');
    const startVal = startInput.value;
    const endVal = endInput.value;
    if (!startVal || !endVal) {
      alert('Please select both start and end dates.');
      return;
    }
    if (daysBetween(startVal, endVal) < 0) {
      alert('End date cannot be before start date.');
      return;
    }
    // tempVacations is the statically-imported live binding from state.js
    tempVacations.push({ start: startVal, end: endVal });
    tempVacations.sort((a, b) => a.start.localeCompare(b.start));
    renderSettingsVacations();
    startInput.value = '';
    endInput.value = '';
  });

  // Token visibility toggle
  document.getElementById('token-toggle-btn').addEventListener('click', () => {
    const inp = document.getElementById('sync-token-input');
    inp.type = inp.type === 'password' ? 'text' : 'password';
  });

  // Modal cancel
  document.getElementById('sync-modal-cancel').addEventListener('click', () => {
    document.getElementById('sync-modal').classList.remove('show');
  });

  // Modal save
  document.getElementById('sync-modal-save').addEventListener('click', () => {
    // 1. Save Study Targets & Vacations
    state.settings.dailyProblemTarget = parseInt(document.getElementById('settings-dsa-target').value, 10) || 4;
    state.settings.dailySystemDesignMinutes = parseInt(document.getElementById('settings-sd-target').value, 10) || 0;
    state.settings.dailyJsMinutes = parseInt(document.getElementById('settings-js-target').value, 10) || 0;
    state.settings.weekendsOff = document.getElementById('settings-weekends-off').checked;
    // tempVacations is the statically-imported live binding from state.js
    state.settings.vacations = [...tempVacations];
    saveState();

    // 2. Save Sync Config
    const token = document.getElementById('sync-token-input').value.trim();
    const gistId = document.getElementById('sync-gist-id-input').value.trim();

    let shouldSync = false;
    if (token) {
      setSyncToken(token);
      if (gistId) setSyncGistId(gistId);
      shouldSync = true;
    } else if (getSyncToken()) {
      clearSyncConfig();
    }

    document.getElementById('sync-modal').classList.remove('show');
    renderAll();
    renderSyncStatus();

    if (shouldSync) doSync();
  });

  // Disconnect
  document.getElementById('sync-disconnect-btn').addEventListener('click', () => {
    if (confirm('Disconnect from GitHub Gist? Your local data will be kept.')) {
      clearSyncConfig();
      document.getElementById('sync-modal').classList.remove('show');
      renderAll();
      renderSyncStatus();
    }
  });
}

// ============================================================
// EXPORT / IMPORT / RESET
// ============================================================
function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `interview-prep-tracker-${todayStr()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importData(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      importStateData(imported); // state.js owns the reassignment
      saveState();
      renderAll();
      alert('Data imported successfully!');
    } catch (err) {
      alert('Invalid JSON file. Please check the file and try again.');
    }
  };
  reader.readAsText(file);
}

function doReset() {
  localStorage.removeItem('interviewPrepTracker');
  resetState(); // state.js owns the reassignment
  saveState();
  renderAll();
  document.getElementById('reset-modal').classList.remove('show');
}

// ============================================================
// TABS
// ============================================================
function initTabs() {
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach((c) => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab).classList.add('active');
    });
  });
}

// ============================================================
// INIT
// ============================================================
function init() {
  loadState();
  renderAll();
  initTabs();
  initSync();

  // Date navigation
  document.getElementById('checkin-date').addEventListener('change', (e) => {
    setSelectedDate(e.target.value);
    renderAll();
  });
  document.getElementById('date-prev').addEventListener('click', () => {
    setSelectedDate(addDays(selectedDate, -1));
    renderAll();
  });
  document.getElementById('date-next').addEventListener('click', () => {
    setSelectedDate(addDays(selectedDate, 1));
    renderAll();
  });

  // Save + optional sync
  document.getElementById('save-checkin').addEventListener('click', () => {
    saveCheckin();
    if (getSyncToken()) doSync();
  });

  // Export / Import / Reset
  document.getElementById('export-btn').addEventListener('click', exportData);
  document.getElementById('import-btn').addEventListener('click', () => {
    document.getElementById('import-file').click();
  });
  document.getElementById('import-file').addEventListener('change', (e) => {
    if (e.target.files[0]) importData(e.target.files[0]);
  });
  document.getElementById('reset-btn').addEventListener('click', () => {
    document.getElementById('reset-modal').classList.add('show');
  });
  document.getElementById('reset-cancel').addEventListener('click', () => {
    document.getElementById('reset-modal').classList.remove('show');
  });
  document.getElementById('reset-confirm').addEventListener('click', doReset);
}

document.addEventListener('DOMContentLoaded', init);
