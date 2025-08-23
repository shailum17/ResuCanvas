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
  // Personal details fields
  const name = document.getElementById("name");
  const title = document.getElementById("title");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const location = document.getElementById("location");
  const website = document.getElementById("website");
  const linkedin = document.getElementById("linkedin");
  const github = document.getElementById("github");
  const summary = document.getElementById("summary");

  if (name) name.value = state.name || "";
  if (title) title.value = state.title || "";
  if (email) email.value = state.email || "";
  if (phone) phone.value = state.phone || "";
  if (location) location.value = state.location || "";
  if (website) website.value = state.website || "";
  if (linkedin) linkedin.value = state.linkedin || "";
  if (github) github.value = state.github || "";
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
  const title = document.getElementById("title");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const location = document.getElementById("location");
  const website = document.getElementById("website");
  const linkedin = document.getElementById("linkedin");
  const github = document.getElementById("github");

  const onName = debounce(() => {
    state.name = name.value;
    renderPreviewContact();
    dPersist();
  });
  const onTitle = debounce(() => {
    state.title = title.value;
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
  const onLocation = debounce(() => {
    state.location = location.value;
    renderPreviewContact();
    dPersist();
  });
  const onWebsite = debounce(() => {
    state.website = website.value;
    renderPreviewContact();
    dPersist();
  });
  const onLinkedin = debounce(() => {
    state.linkedin = linkedin.value;
    renderPreviewContact();
    dPersist();
  });
  const onGithub = debounce(() => {
    state.github = github.value;
    renderPreviewContact();
    dPersist();
  });
  const onPostCode = debounce(() => {
    state.postCode = postCode.value;
    renderPreviewContact();
    dPersist();
  });
  const onCity = debounce(() => {
    state.city = city.value;
    renderPreviewContact();
    dPersist();
  });
  const onUseAsHeadline = () => {
    state.useAsHeadline = useAsHeadline.checked;
    renderPreviewContact();
    dPersist();
  };

  if (name) name.addEventListener("input", onName);
  if (title) title.addEventListener("input", onTitle);
  if (email) email.addEventListener("input", onEmail);
  if (phone) phone.addEventListener("input", onPhone);
  if (location) location.addEventListener("input", onLocation);
  if (website) website.addEventListener("input", onWebsite);
  if (linkedin) linkedin.addEventListener("input", onLinkedin);
  if (github) github.addEventListener("input", onGithub);

  // validation on blur
  if (name) name.addEventListener("blur", () => {
    const msg = rules.name(name.value);
    setFieldError(name, msg);
  });
  if (email) email.addEventListener("blur", () => {
    const msg = rules.email(email.value);
    setFieldError(email, msg);
  });
  if (phone) phone.addEventListener("blur", () => {
    const msg = rules.phone(phone.value);
    setFieldError(phone, msg);
  });
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
  const entry = document.getElementById("skills-input");
  if (!entry) return; // Guard against null element
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
  const addBtn = document.getElementById("add-education");
  if (!addBtn) return; // Guard against null element
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
  const addBtn = document.getElementById("add-experience");
  if (!addBtn) return; // Guard against null element
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

function setupDynamicFields() {
  // Handle additional personal field buttons
  document.querySelectorAll('.add-field-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const fieldType = btn.dataset.field;
      if (fieldType) {
        addDynamicPersonalField(fieldType);
      }
    });
  });

  // Handle photo upload
  const photoInput = document.getElementById('photo');
  if (photoInput) {
    photoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          state.photo = e.target.result;
          updatePhotoPreview();
          dPersist();
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Handle photo placeholder click
  const photoPlaceholder = document.querySelector('.photo-placeholder');
  if (photoPlaceholder) {
    photoPlaceholder.addEventListener('click', () => {
      photoInput?.click();
    });
  }
}

function addDynamicPersonalField(fieldType) {
  const container = document.getElementById('dynamic-personal-fields');
  const fieldId = `${fieldType}-${Date.now()}`;
  
  const fieldLabels = {
    'date-of-birth': 'Date of birth',
    'place-of-birth': 'Place of birth',
    'drivers-license': "Driver's license",
    'gender': 'Gender',
    'nationality': 'Nationality',
    'civil-status': 'Civil status',
    'website': 'Website',
    'linkedin': 'LinkedIn'
  };

  const fieldDiv = document.createElement('div');
  fieldDiv.className = 'field dynamic-field';
  fieldDiv.innerHTML = `
    <label for="${fieldId}">${fieldLabels[fieldType]}</label>
    <input id="${fieldId}" name="${fieldType}" type="${fieldType === 'date-of-birth' ? 'date' : fieldType === 'website' || fieldType === 'linkedin' ? 'url' : 'text'}" />
    <button type="button" class="remove-field-btn" onclick="this.parentElement.remove()">×</button>
  `;
  
  container.appendChild(fieldDiv);
  
  // Add event listener for the new field
  const input = fieldDiv.querySelector('input');
  input.addEventListener('input', debounce(() => {
    if (!state.additionalFields) state.additionalFields = {};
    state.additionalFields[fieldType] = input.value;
    renderPreviewContact();
    dPersist();
  }));
}

function setupOptionalSections() {
  document.querySelectorAll('.add-optional-section').forEach(btn => {
    btn.addEventListener('click', () => {
      const sectionType = btn.dataset.section;
      if (sectionType) {
        addOptionalSection(sectionType);
      }
    });
  });
}

function addOptionalSection(sectionType) {
  const container = document.getElementById('dynamic-optional-sections');
  const sectionId = `${sectionType}-${Date.now()}`;
  
  const sectionLabels = {
    'profile': 'Profile',
    'courses': 'Courses',
    'internships': 'Internships',
    'extracurricular': 'Extracurricular activities',
    'references': 'References',
    'qualifies': 'Qualifies',
    'certificates': 'Certificates',
    'achievements': 'Achievements',
    'signature': 'Signature',
    'footer': 'Footer'
  };

  const sectionDiv = document.createElement('div');
  sectionDiv.className = 'group collapsible optional-section';
  sectionDiv.innerHTML = `
    <div class="group-head">
      <h3><span class="chev">▾</span> ${sectionLabels[sectionType]}</h3>
      <button type="button" class="remove-section-btn" onclick="this.closest('.optional-section').remove()">×</button>
    </div>
    <div class="content">
      <div class="field">
        <textarea id="${sectionId}" rows="3" placeholder="Enter ${sectionLabels[sectionType].toLowerCase()} details..."></textarea>
      </div>
    </div>
  `;
  
  container.appendChild(sectionDiv);
  
  // Add collapsible functionality
  const head = sectionDiv.querySelector('.group-head');
  head.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-section-btn')) return;
    sectionDiv.classList.toggle('closed');
  });
  
  // Add event listener for the textarea
  const textarea = sectionDiv.querySelector('textarea');
  textarea.addEventListener('input', debounce(() => {
    if (!state.optionalSections) state.optionalSections = {};
    state.optionalSections[sectionType] = textarea.value;
    renderOptionalSections();
    dPersist();
  }));
}

function updatePhotoPreview() {
  const preview = document.getElementById('pv-photo');
  if (preview && state.photo) {
    preview.style.backgroundImage = `url(${state.photo})`;
    preview.style.backgroundSize = 'cover';
    preview.style.backgroundPosition = 'center';
  }
}

function renderOptionalSections() {
  const container = document.getElementById('pv-optional-sections');
  if (!container || !state.optionalSections) return;
  
  container.innerHTML = '';
  
  Object.entries(state.optionalSections).forEach(([type, content]) => {
    if (content.trim()) {
      const sectionDiv = document.createElement('section');
      sectionDiv.className = 'resume-section';
      sectionDiv.innerHTML = `
        <h2>${type.charAt(0).toUpperCase() + type.slice(1)}</h2>
        <p>${content}</p>
      `;
      container.appendChild(sectionDiv);
    }
  });
}

function setupExport() {
  const btn = document.getElementById("btn-export");
  const downloadBtn = document.getElementById("download-resume");
  
  const exportFunction = () => {
    // Validate minimal requirements
    const givenName = document.getElementById("given-name");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const valid = validateFormRequired([
      { el: givenName, rule: "name" },
      { el: email, rule: "email" },
      { el: phone, rule: "phone" }
    ]);
    const hasContent = (state.education.length > 0) || (state.experience.length > 0);
    if (!valid || !hasContent) {
      alert("Please complete the required fields and add at least one Education or Experience entry before exporting.");
      return;
    }
    window.print();
  };

  if (btn) btn.addEventListener("click", exportFunction);
  if (downloadBtn) downloadBtn.addEventListener("click", exportFunction);
}

window.addEventListener("DOMContentLoaded", () => {
  hydrateFromState();
  setupContactBindings();
  setupSummaryBinding();
  setupSkills();
  setupEducation();
  setupExperience();
  setupDynamicFields();
  setupOptionalSections();
  setupToolbar();
  setupExport();

  // collapsibles
  document.querySelectorAll('.group.collapsible').forEach((grp) => {
    const head = grp.querySelector('.group-head');
    head?.addEventListener('click', (e) => {
      if (e.target.classList.contains('remove-section-btn')) return;
      grp.classList.toggle('closed');
      
      // Animate content height
      const content = grp.querySelector('.content');
      if (content) {
        if (grp.classList.contains('closed')) {
          content.style.maxHeight = '0';
        } else {
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      }
    });
    
    // Initialize content heights
    const content = grp.querySelector('.content');
    if (content) {
      if (grp.classList.contains('closed')) {
        content.style.maxHeight = '0';
      } else {
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    }
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


