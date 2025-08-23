import { state, persistState } from "./state.js";
import { updateProgressBar } from "./progress.js";

// Utility
const byId = (id) => document.getElementById(id);
const html = (strings, ...values) => strings.map((s, i) => s + (values[i] ?? "")).join("");

export function renderPreviewContact() {
  // Update name
  byId("resume-name").textContent = state.name || "Your Name";
  
  // Update job title
  byId("resume-title").textContent = state.title || "Professional Title";
  
  // Update contact info
  if (state.email) {
    const emailEl = byId("resume-email");
    if (emailEl) {
      emailEl.querySelector("span:last-child").textContent = state.email;
      emailEl.style.display = "flex";
    }
  }
  
  if (state.phone) {
    const phoneEl = byId("resume-phone");
    if (phoneEl) {
      phoneEl.querySelector("span:last-child").textContent = state.phone;
      phoneEl.style.display = "flex";
    }
  }
  
  // Update location if available
  const locationEl = byId("resume-location");
  if (locationEl) {
    if (state.location) {
      locationEl.querySelector("span:last-child").textContent = state.location;
      locationEl.style.display = "flex";
    } else {
      locationEl.style.display = "none";
    }
  }
  
  // Update website if available
  const websiteEl = byId("resume-website");
  if (websiteEl) {
    if (state.website) {
      websiteEl.querySelector("span:last-child").textContent = state.website;
      websiteEl.style.display = "flex";
    } else {
      websiteEl.style.display = "none";
    }
  }
  
  // Update LinkedIn if available
  const linkedinEl = byId("resume-linkedin");
  if (linkedinEl) {
    if (state.linkedin) {
      linkedinEl.querySelector("span:last-child").textContent = state.linkedin;
      linkedinEl.style.display = "flex";
    } else {
      linkedinEl.style.display = "none";
    }
  }
  
  // Update GitHub if available
  const githubEl = byId("resume-github");
  if (githubEl) {
    if (state.github) {
      githubEl.querySelector("span:last-child").textContent = state.github;
      githubEl.style.display = "flex";
    } else {
      githubEl.style.display = "none";
    }
  }
}

export function renderPreviewSummary() {
  byId("resume-summary").textContent = state.summary || "A brief professional summary highlighting your experience, skills, and career goals.";
}

export function drawPreviewSkills() {
  byId("resume-skills").innerHTML = state.skills.length
    ? state.skills.map((s) => `<span class="skill-tag">${escapeHtml(s)}</span>`).join("")
    : `<span class="skill-tag">Add skills in the form</span>`;
}

export function renderPreviewEducation() {
  const root = byId("resume-education");
  root.innerHTML = state.education.length
    ? state.education.map((e) => educationItem(e)).join("")
    : `<div class="education-entry">
         <h4>Degree Name</h4>
         <div class="institution">Institution Name</div>
         <div class="date">Start Date - End Date</div>
       </div>`;
}

export function renderPreviewExperience() {
  const root = byId("resume-experience");
  root.innerHTML = state.experience.length
    ? state.experience.map((e) => experienceItem(e)).join("")
    : `<div class="experience-entry">
         <div class="experience-header">
           <h4>Job Title</h4>
           <span class="date">Start Date - End Date</span>
         </div>
         <div class="company">Company Name</div>
         <ul class="experience-details">
           <li>Responsibility or achievement</li>
         </ul>
       </div>`;
}

function educationItem(e) {
  const when = [e.start, e.end].filter(Boolean).join(" – ");
  return html`
    <div class="education-entry">
      <h4>${escapeHtml(e.degree || "Degree Name")}</h4>
      <div class="institution">${escapeHtml(e.school || "Institution Name")}</div>
      <div class="date">${escapeHtml(when || "Start Date - End Date")}</div>
      ${e.details ? `<div class="details">${escapeHtml(e.details)}</div>` : ""}
    </div>`;
}

function experienceItem(e) {
  const when = [e.start, e.end].filter(Boolean).join(" – ");
  const bullets = (e.bullets || []).filter(Boolean);
  return html`
    <div class="experience-entry">
      <div class="experience-header">
        <h4>${escapeHtml(e.role || "Job Title")}</h4>
        <span class="date">${escapeHtml(when || "Start Date - End Date")}</span>
      </div>
      <div class="company">${escapeHtml(e.company || "Company Name")}</div>
      ${bullets.length ? `
        <ul class="experience-details">
          ${bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}
        </ul>` : 
        `<ul class="experience-details">
          <li>Responsibility or achievement</li>
        </ul>`
      }
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
  const chipBox = byId("skills-tags");
  if (!chipBox) return; // Guard against null element
  chipBox.innerHTML = "";
  state.skills.forEach((s, i) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "skill-tag";
    chip.innerHTML = s + '<button aria-label="Remove skill">&times;</button>';
    chip.setAttribute("role", "option");
    chip.setAttribute("tabindex", "0");
    chip.style.animation = 'fade-in-up .2s ease-out';
    
    const removeBtn = chip.querySelector('button');
    if (removeBtn) {
      removeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        state.skills.splice(i, 1);
        drawChips();
        drawPreviewSkills();
        persistState();
      });
    }
    
    // Keep the whole tag clickable as a fallback
    chip.addEventListener("click", () => {
      state.skills.splice(i, 1);
      drawChips();
      drawPreviewSkills();
      persistState();
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


