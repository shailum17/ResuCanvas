import { state, persistState, resetState } from "./state.js";
import { rules, setFieldError, validateFormRequired } from "./validate.js";
import {
  renderPreviewContact,
  renderPreviewSummary,
  drawPreviewSkills,
  renderPreviewEducation,
  renderPreviewExperience,
  renderEduRow,
  renderExpRow,
  drawChips
} from "./components.js";
import { updateProgressBar } from "./progress.js";

// Debounce helper
function debounce(fn, ms = 100) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(null, args), ms);
  };
}

const dPersist = debounce(() => { persistState(); updateProgressBar(); }, 150);

// Initial render from state (possibly loaded from storage)
function hydrateFromState() {
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const summary = document.getElementById("summary");
  if (name) name.value = state.name || "";
  if (email) email.value = state.email || "";
  if (phone) phone.value = state.phone || "";
  if (summary) summary.value = state.summary || "";

  // skills
  drawChips();
  drawPreviewSkills();

  // education
  state.education.forEach(renderEduRow);
  renderPreviewEducation();

  // experience
  state.experience.forEach(renderExpRow);
  renderPreviewExperience();

  renderPreviewContact();
  renderPreviewSummary();
  updateProgressBar();
}

function setupContactBindings() {
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");

  const onName = debounce(() => {
    state.name = name.value;
    renderPreviewContact();
    dPersist();
  });
  const onEmail = debounce(() => {
    state.email = email.value;
    renderPreviewContact();
    dPersist();
  });
  const onPhone = debounce(() => {
    state.phone = phone.value;
    renderPreviewContact();
    dPersist();
  });

  name.addEventListener("input", onName);
  email.addEventListener("input", onEmail);
  phone.addEventListener("input", onPhone);

  // validation on blur
  name.addEventListener("blur", () => setFieldError(name, rules.name(name.value)));
  email.addEventListener("blur", () => setFieldError(email, rules.email(email.value)));
  phone.addEventListener("blur", () => setFieldError(phone, rules.phone(phone.value)));
}

function setupSummaryBinding() {
  const summary = document.getElementById("summary");
  const onSummary = debounce(() => {
    state.summary = summary.value;
    renderPreviewSummary();
    dPersist();
  });
  summary.addEventListener("input", onSummary);
}

function setupSkills() {
  const entry = document.getElementById("skill-entry");
  entry.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const v = entry.value.trim();
      if (!v) return;
      state.skills.push(v);
      entry.value = "";
      drawChips();
      drawPreviewSkills();
      dPersist();
    }
  });
}

function setupEducation() {
  const addBtn = document.getElementById("add-edu");
  addBtn.addEventListener("click", () => {
    const id = crypto.randomUUID();
    const obj = { id, school: "", degree: "", start: "", end: "", location: "", details: "" };
    state.education.push(obj);
    renderEduRow(obj);
    renderPreviewEducation();
    dPersist();
  });
}

function setupExperience() {
  const addBtn = document.getElementById("add-exp");
  addBtn.addEventListener("click", () => {
    const id = crypto.randomUUID();
    const obj = { id, role: "", company: "", start: "", end: "", location: "", bullets: [] };
    state.experience.push(obj);
    renderExpRow(obj);
    renderPreviewExperience();
    dPersist();
  });
}

function setupToolbar() {
  document.getElementById("btn-clear").addEventListener("click", () => {
    if (!confirm("Clear all data?")) return;
    localStorage.removeItem("resumeState");
    resetState();
    location.reload();
  });
}

function setupExport() {
  const btn = document.getElementById("btn-export");
  btn.addEventListener("click", () => {
    // Validate minimal requirements
    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const valid = validateFormRequired([
      { el: name, rule: "name" },
      { el: email, rule: "email" },
      { el: phone, rule: "phone" }
    ]);
    const hasContent = (state.education.length > 0) || (state.experience.length > 0);
    if (!valid || !hasContent) {
      alert("Please complete the required fields and add at least one Education or Experience entry before exporting.");
      return;
    }
    window.print();
  });
}

window.addEventListener("DOMContentLoaded", () => {
  hydrateFromState();
  setupContactBindings();
  setupSummaryBinding();
  setupSkills();
  setupEducation();
  setupExperience();
  setupToolbar();
  setupExport();

  // collapsibles
  document.querySelectorAll('.group.collapsible').forEach((grp) => {
    const head = grp.querySelector('.group-head');
    head?.addEventListener('click', () => {
      grp.classList.toggle('closed');
    });
  });

  // apply saved theme
  applyTheme(state.theme || 'modern');
});

function applyTheme(theme) {
  const resume = document.getElementById('resume');
  resume.classList.remove('theme-modern', 'theme-minimal', 'theme-compact');
  const className = `theme-${theme}`;
  resume.classList.add(className);
}

// expose for template page callback (optional)
window.__setTheme = function(theme) {
  state.theme = theme;
  persistState();
  updateProgressBar();
  const resume = document.getElementById('resume');
  if (resume) {
    const className = `theme-${theme}`;
    resume.classList.remove('theme-modern', 'theme-minimal', 'theme-compact');
    resume.classList.add(className);
  }
}


