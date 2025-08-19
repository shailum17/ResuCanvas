import { state, persistState } from "./state.js";
import { updateProgressBar } from "./progress.js";

// Utility
const byId = (id) => document.getElementById(id);
const html = (strings, ...values) => strings.map((s, i) => s + (values[i] ?? "")).join("");

export function renderPreviewContact() {
  byId("pv-name").textContent = state.name || "Your Name";
  const contact = [state.email, state.phone].filter(Boolean).join(" • ");
  byId("pv-contact").textContent = contact || "email • phone";
}

export function renderPreviewSummary() {
  byId("pv-summary").textContent = state.summary || "A short professional summary appears here.";
}

export function drawPreviewSkills() {
  byId("pv-skills").innerHTML = state.skills.length
    ? state.skills.map((s) => `<li>${escapeHtml(s)}</li>`).join("")
    : `<li>—</li>`;
}

export function renderPreviewEducation() {
  const root = byId("pv-education");
  root.innerHTML = state.education.length
    ? state.education.map((e) => educationItem(e)).join("")
    : `<em>No education added yet.</em>`;
}

export function renderPreviewExperience() {
  const root = byId("pv-experience");
  root.innerHTML = state.experience.length
    ? state.experience.map((e) => experienceItem(e)).join("")
    : `<em>No experience added yet.</em>`;
}

function educationItem(e) {
  const when = [e.start, e.end].filter(Boolean).join(" – ");
  return html`
    <div class="row">
      <div class="left">
        <strong>${escapeHtml(e.degree || "")}</strong><br/>
        <span>${escapeHtml(e.school || "")}</span>
      </div>
      <div class="right">${escapeHtml(when)}</div>
      <div class="sub">${escapeHtml(e.location || "")}</div>
      ${e.details ? `<ul><li>${escapeHtml(e.details)}</li></ul>` : ""}
    </div>`;
}

function experienceItem(e) {
  const when = [e.start, e.end].filter(Boolean).join(" – ");
  const bullets = (e.bullets || []).filter(Boolean);
  return html`
    <div class="row">
      <div class="left">
        <strong>${escapeHtml(e.role || "")}</strong><br/>
        <span>${escapeHtml(e.company || "")}</span>
      </div>
      <div class="right">${escapeHtml(when)}</div>
      <div class="sub">${escapeHtml(e.location || "")}</div>
      ${bullets.length ? `<ul>${bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>` : ""}
    </div>`;
}

export function renderEduRow(item) {
  const eduList = byId("education-list");
  const wrap = document.createElement("div");
  wrap.className = "card card-appear edu-row";
  wrap.dataset.id = item.id;
  wrap.innerHTML = html`
    <div class="two">
      <input placeholder="School" data-k="school" value="${escapeAttr(item.school)}"/>
      <input placeholder="Degree" data-k="degree" value="${escapeAttr(item.degree)}"/>
    </div>
    <div class="two">
      <input placeholder="Start (e.g., 2022)" data-k="start" value="${escapeAttr(item.start)}"/>
      <input placeholder="End (e.g., Present)" data-k="end" value="${escapeAttr(item.end)}"/>
    </div>
    <div class="two">
      <input placeholder="Location" data-k="location" value="${escapeAttr(item.location)}"/>
      <button type="button" class="btn danger">Remove</button>
    </div>
    <textarea placeholder="Details (optional)" data-k="details">${item.details ? escapeHtml(item.details) : ""}</textarea>`;
  wrap.addEventListener("input", (e) => {
    const key = e.target.dataset.k; if (!key) return;
    const idx = state.education.findIndex((x) => x.id === item.id);
    if (idx !== -1) {
      state.education[idx][key] = e.target.value;
      renderPreviewEducation();
      persistState();
      updateProgressBar();
    }
  });
  wrap.querySelector(".danger").onclick = () => {
    wrap.classList.remove("card-appear");
    wrap.style.opacity = 0;
    window.setTimeout(() => {
      wrap.remove();
      state.education = state.education.filter((x) => x.id !== item.id);
      renderPreviewEducation();
      persistState();
      updateProgressBar();
    }, 200);
  };
  eduList.appendChild(wrap);
}

export function renderExpRow(item) {
  const expList = byId("experience-list");
  const wrap = document.createElement("div");
  wrap.className = "card card-appear exp-row";
  wrap.dataset.id = item.id;
  wrap.innerHTML = html`
    <div class="two">
      <input placeholder="Role" data-k="role" value="${escapeAttr(item.role)}"/>
      <input placeholder="Company" data-k="company" value="${escapeAttr(item.company)}"/>
    </div>
    <div class="two">
      <input placeholder="Start (e.g., 2022)" data-k="start" value="${escapeAttr(item.start)}"/>
      <input placeholder="End (e.g., Present)" data-k="end" value="${escapeAttr(item.end)}"/>
    </div>
    <div class="two">
      <input placeholder="Location" data-k="location" value="${escapeAttr(item.location)}"/>
      <button type="button" class="btn danger">Remove</button>
    </div>
    <textarea placeholder="Bullet points (one per line)" data-k="bullets">${(item.bullets||[]).join("\n")}</textarea>`;
  wrap.addEventListener("input", (e) => {
    const key = e.target.dataset.k; if (!key) return;
    const idx = state.experience.findIndex((x) => x.id === item.id);
    if (idx !== -1) {
      if (key === "bullets") {
        state.experience[idx].bullets = e.target.value.split(/\n+/).map((s) => s.trim()).filter(Boolean);
      } else {
        state.experience[idx][key] = e.target.value;
      }
      renderPreviewExperience();
      persistState();
      updateProgressBar();
    }
  });
  wrap.querySelector(".danger").onclick = () => {
    wrap.classList.remove("card-appear");
    wrap.style.opacity = 0;
    window.setTimeout(() => {
      wrap.remove();
      state.experience = state.experience.filter((x) => x.id !== item.id);
      renderPreviewExperience();
      persistState();
      updateProgressBar();
    }, 200);
  };
  expList.appendChild(wrap);
}

export function drawChips() {
  const entry = byId("skill-entry");
  const chipBox = byId("skills-input");
  chipBox.innerHTML = "";
  state.skills.forEach((s, i) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.textContent = s;
    chip.title = "Remove";
    chip.setAttribute("role", "option");
    chip.setAttribute("tabindex", "0");
    chip.style.animation = 'fade-in-up .2s ease-out';
    chip.addEventListener("click", () => {
      state.skills.splice(i, 1);
      drawChips();
      drawPreviewSkills();
      persistState();
      entry.focus();
    });
    chip.addEventListener("keydown", (e) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        state.skills.splice(i, 1);
        drawChips();
        drawPreviewSkills();
        persistState();
      }
    });
    chipBox.appendChild(chip);
  });
}

export function escapeHtml(s = "") {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttr(s = "") { return escapeHtml(String(s)); }


