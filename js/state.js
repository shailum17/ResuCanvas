// Central application state and persistence helpers

const initialState = {
  name: "",
  email: "",
  phone: "",
  summary: "",
  skills: [],
  education: [],
  experience: [],
  theme: "modern"
};

const STORAGE_KEY = "resumeState";

export const state = loadState();

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return { ...initialState };
    const parsed = JSON.parse(saved);
    return { ...initialState, ...parsed };
  } catch (e) {
    console.error("Failed to load state", e);
    return { ...initialState };
  }
}

let persistTimer = null;
export function persistState(throttleMs = 500) {
  if (persistTimer) window.clearTimeout(persistTimer);
  persistTimer = window.setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to save state", e);
    }
  }, throttleMs);
}

export function resetState() {
  Object.assign(state, { ...initialState });
}


