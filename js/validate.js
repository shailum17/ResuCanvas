// Basic validation helpers

export const rules = {
  name(value) {
    const v = value.trim();
    if (!v) return "Name is required";
    if (v.length < 2 || v.length > 80) return "Name must be 2–80 characters";
    if (!/^[-'A-Za-z\s]+$/.test(v)) return "Only letters, spaces, and - ' allowed";
    return "";
  },
  email(value) {
    const v = value.trim();
    if (!v) return "Email is required";
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!re.test(v)) return "Enter a valid email";
    return "";
  },
  phone(value) {
    const v = value.trim();
    if (!v) return "Phone is required";
    const digits = v.replace(/[^\d+]/g, "");
    const re = /^\+?\d{7,15}$/;
    if (!re.test(digits)) return "Enter 7–15 digits (optional +)";
    return "";
  }
};

export function setFieldError(inputEl, message) {
  const err = document.getElementById(`err-${inputEl.id}`);
  if (!err) return;
  if (message) {
    inputEl.setAttribute("aria-invalid", "true");
    err.textContent = message;
  } else {
    inputEl.removeAttribute("aria-invalid");
    err.textContent = "";
  }
}

export function validateFormRequired(fields) {
  // fields: array of {el, rule}
  let valid = true;
  for (const { el, rule } of fields) {
    const msg = rules[rule](el.value);
    setFieldError(el, msg);
    if (msg) valid = false;
  }
  return valid;
}


