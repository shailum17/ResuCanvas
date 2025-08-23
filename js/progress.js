import { state } from "./state.js";

export function computeCompletion() {
  // Required: name, email, phone, and (education.length>0 || experience.length>0)
  const requirements = [
    Boolean(state.name?.trim()),
    Boolean(state.title?.trim()),
    Boolean(state.email?.trim()),
    Boolean(state.phone?.trim()),
    Boolean(state.summary?.trim()),
    (state.education?.length || 0) > 0 || (state.experience?.length || 0) > 0,
    (state.skills?.length || 0) > 0
  ];
  const filled = requirements.filter(Boolean).length;
  return Math.round((filled / requirements.length) * 100);
}

export function updateProgressBar() {
  const pct = computeCompletion();
  const bar = document.getElementById("progress-bar");
  if (bar) bar.style.width = `${pct}%`;
}


