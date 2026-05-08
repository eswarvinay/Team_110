// In-memory resume storage
const resumeStorage = new Map();

// ── Resume History (per-user) ─────────────────────────────
// Map<userId, Array<{ id, templateId, templateName, data, createdAt }>>
const resumeHistory = new Map();

/**
 * Save a generated resume to the user's history.
 */
function addToHistory(userId, entry) {
  if (!resumeHistory.has(userId)) {
    resumeHistory.set(userId, []);
  }
  resumeHistory.get(userId).unshift({
    id: `res_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    ...entry,
    createdAt: new Date().toISOString(),
  });
}

/**
 * Get a user's resume generation history.
 */
function getHistory(userId) {
  return resumeHistory.get(userId) || [];
}

/**
 * Get resume count statistics for a user.
 */
function getStats(userId) {
  const history = getHistory(userId);
  const templates = {};
  history.forEach((r) => {
    templates[r.templateId] = (templates[r.templateId] || 0) + 1;
  });
  return {
    totalResumes: history.length,
    templateBreakdown: templates,
    lastGenerated: history.length > 0 ? history[0].createdAt : null,
  };
}

module.exports = resumeStorage;
module.exports.resumeHistory = { addToHistory, getHistory, getStats };