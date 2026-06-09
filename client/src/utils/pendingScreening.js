const KEY = 'dryEyePendingAnswers';

export function savePendingScreening(answers) {
  localStorage.setItem(KEY, JSON.stringify(answers));
}

export function getPendingScreening() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearPendingScreening() {
  localStorage.removeItem(KEY);
}
