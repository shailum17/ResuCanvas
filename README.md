# ResuCanvas

**ResuCanvas** is a free, interactive resume builder designed to help users create professional, ATS-friendly resumes quickly and easily. No design skills required—just fill out the form and see your resume update in real time.

## Features
- **Beautiful Templates:** Choose from modern, minimal, and compact resume designs.
- **Real-time Preview:** Instantly see changes as you edit your resume.
- **ATS Optimized:** All templates are designed to pass Applicant Tracking Systems.
- **Lightning Fast:** Build and export your resume to PDF in minutes.
- **Skill Chips:** Add and remove skills with a simple interface.
- **Education & Experience Sections:** Add multiple entries with details and bullet points.
- **Profile Summary:** Highlight your professional background.
- **Theme Selection:** Switch between templates for different looks.
- **Progress Bar:** Track completion of required fields.
- **Data Persistence:** Your resume data is saved locally in your browser.

## Getting Started

1. **Clone or Download** this repository.
2. **Open `index.html`** in your browser. No build step or server required.
3. **Start Building:** Fill out the form, add your details, and see your resume preview update instantly.
4. **Export:** Click "Export PDF" to print or save your resume.

## File Structure
```
index.html           # Main landing page and resume builder
LICENSE              # MIT License
README.md            # Project documentation
templates.html       # Template selection page
css/                 # Stylesheets
  base.css           # Core styles
  form.css           # Form and input styles
  landing.css        # Landing page and sections
  resume.css         # Resume template styles
js/                  # JavaScript modules
  bindings.js        # Main app logic and event bindings
  components.js      # UI rendering helpers
  landing.js         # Landing page effects
  pdf.js             # PDF export placeholder
  progress.js        # Progress bar logic
  state.js           # State management and persistence
  validate.js        # Form validation
```

## Usage
- **Start Building:** Go to the Resume Builder section and fill out your information.
- **Add Skills:** Type a skill and press Enter or comma. Click a chip to remove.
- **Add Education/Experience:** Click "Add" to insert new entries. Fill out details and bullet points.
- **Choose Template:** Switch between Modern, Minimal, and Compact designs.
- **Export PDF:** Click "Export PDF" when your resume is complete.

## Technologies Used
- **HTML5, CSS3** (with custom themes)
- **Vanilla JavaScript (ES6 modules)**
- **LocalStorage** for data persistence

## License
This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Author
**Shailendra Mourya**

---

*ResuCanvas: Building better resumes, one template at a time.*
