import { screeningAPI } from '../services/api';
import { getPendingScreening, clearPendingScreening } from './pendingScreening';

/** After login/register, submit guest screening answers to the API if any were saved. */
export async function syncPendingScreening() {
  const answers = getPendingScreening();
  if (!answers) return null;
  try {
    const { data } = await screeningAPI.submit({ answers, emailReport: false });
    clearPendingScreening();
    return data.screening;
  } catch {
    return null;
  }
}
