/**
 * AgroFly - Comprehensive Form Validation Module
 * Validates inputs in real-time according to strict specifications:
 * - Name: alphabetic characters and spaces only (strictly NO numbers)
 * - Mobile: 10-digit Indian format starting with 6-9 (strictly NO letters)
 * - Email: RFC-compliant email address
 * - Password: min 8 chars with uppercase, lowercase, digit, and special char
 * - Acreage: positive number
 * - Date: today or future dates
 */
(() => {
  'use strict';

  const RULES = {
    required: (val) => {
      return (val && val.trim() !== '') || 'This field is required.';
    },

    name: (val) => {
      if (!val || !val.trim()) return true;
      const clean = val.trim();
      if (/\d/.test(clean)) {
        return 'Name must contain only letters and spaces. Numbers are not allowed.';
      }
      // Alphabetic characters only, single spaces between words
      const isValid = /^[A-Za-z]+(?: [A-Za-z]+)*$/.test(clean);
      return isValid || 'Name must contain only letters and spaces (e.g. Tamil Selvan). Numbers and symbols are not allowed.';
    },

    mobile: (val) => {
      if (!val) return true;
      const clean = val.trim();
      if (/[^0-9]/.test(clean)) {
        return 'Mobile number must contain digits only. Letters are not allowed.';
      }
      if (clean.length !== 10) {
        return `Enter a complete 10-digit mobile number (currently ${clean.length} digits).`;
      }
      // Valid Indian 10-digit mobile number: starts with 6, 7, 8, or 9 and followed by 9 digits
      const isValid = /^[6-9]\d{9}$/.test(clean);
      return isValid || 'Mobile number must start with 6, 7, 8, or 9 (e.g. 9876543210).';
    },

    email: (val) => {
      if (!val) return true;
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val.trim());
      return isValid || 'Enter a valid email address (e.g. name@example.com).';
    },

    idn: (val) => {
      if (!val) return true;
      const clean = val.trim();
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clean);
      const isMobile = /^[6-9]\d{9}$/.test(clean);
      return (isEmail || isMobile) || 'Enter a valid email address or 10-digit mobile number.';
    },

    password: (val) => {
      if (!val) return true;
      const hasLength = val.length >= 8;
      const hasUpper = /[A-Z]/.test(val);
      const hasLower = /[a-z]/.test(val);
      const hasDigit = /\d/.test(val);
      const hasSpecial = /[^A-Za-z0-9]/.test(val);

      if (!hasLength) return 'Password must be at least 8 characters.';
      if (!hasUpper) return 'Password must include at least one uppercase letter.';
      if (!hasLower) return 'Password must include at least one lowercase letter.';
      if (!hasDigit) return 'Password must include at least one number.';
      if (!hasSpecial) return 'Password must include at least one special character.';
      return true;
    },

    acres: (val) => {
      if (!val) return true;
      const num = parseFloat(val);
      return (!isNaN(num) && num > 0) || 'Please enter a valid positive acreage (e.g. 5).';
    },

    date: (val) => {
      if (!val) return true;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(val + 'T00:00:00');
      return selectedDate >= today || 'Booking date cannot be in the past.';
    },

    agree: (val, input) => {
      return input.checked || 'You must agree to the Terms and Privacy Policy to continue.';
    }
  };

  /**
   * Validate a single input element
   * @param {HTMLElement} input
   * @returns {boolean} isValid
   */
  const validateField = (input) => {
    if (!input.dataset || !input.dataset.v) return true;

    const ruleKeys = input.dataset.v.split(' ').filter(Boolean);
    let errorResult = true;

    for (const rule of ruleKeys) {
      if (rule === 'match') {
        const targetSelector = input.dataset.match;
        const target = targetSelector ? document.querySelector(targetSelector) : null;
        if (target && input.value !== target.value) {
          errorResult = 'Passwords do not match.';
          break;
        }
      } else if (RULES[rule]) {
        const res = RULES[rule](input.value, input);
        if (res !== true) {
          errorResult = res;
          break;
        }
      }
    }

    const host = input.closest('.input-group') || input;
    const parent = host.parentNode;
    const fieldId = input.id || 'field_' + Math.random().toString(36).substring(2, 7);
    let feedback = parent.querySelector(`:scope > .invalid-feedback[data-for="${fieldId}"]`);

    if (errorResult !== true) {
      input.classList.add('is-invalid');
      if (!feedback) {
        feedback = document.createElement('div');
        feedback.className = 'invalid-feedback';
        feedback.dataset.for = fieldId;
        host.after(feedback);
      }
      feedback.textContent = errorResult;
      return false;
    } else {
      input.classList.remove('is-invalid');
      if (feedback) {
        feedback.remove();
      }
      return true;
    }
  };

  /**
   * Validate all annotated fields inside a form
   * @param {HTMLFormElement} form
   * @returns {boolean} isFormValid
   */
  const validateForm = (form) => {
    const fields = form.querySelectorAll('[data-v]');
    let isValid = true;
    let firstInvalid = null;

    fields.forEach((field) => {
      const fieldValid = validateField(field);
      if (!fieldValid) {
        isValid = false;
        if (!firstInvalid) firstInvalid = field;
      }
    });

    if (firstInvalid) {
      firstInvalid.focus();
    }

    return isValid;
  };

  // Real-time character guard on keydown: Mobile (no letters), Name (no numbers)
  document.addEventListener('keydown', (e) => {
    const input = e.target;
    if (!input || !input.dataset || !input.dataset.v) return;

    // Allow navigation/editing/clipboard shortcuts
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab', 'Enter', 'Home', 'End'].includes(e.key)) {
      return;
    }

    const rules = input.dataset.v.split(' ');

    // 1. Mobile number: Block all letters and non-numeric characters
    if (rules.includes('mobile') || input.type === 'tel') {
      if (!/^\d$/.test(e.key)) {
        e.preventDefault();
      }
    }

    // 2. Name: Block all numbers / digits
    if (rules.includes('name')) {
      if (/^\d$/.test(e.key)) {
        e.preventDefault();
      }
    }
  });

  // Real-time sanitizer on input (handles paste / virtual keyboard / autofill / drop)
  document.addEventListener('input', (e) => {
    const input = e.target;
    if (!input || !input.dataset || !input.dataset.v) return;

    const rules = input.dataset.v.split(' ');

    // 1. Mobile field: strictly strip all non-digits and cap at 10 digits
    if (rules.includes('mobile') || input.type === 'tel') {
      const sanitized = input.value.replace(/\D/g, '').slice(0, 10);
      if (input.value !== sanitized) {
        input.value = sanitized;
      }
    }

    // 2. Name field: strictly strip all numbers
    if (rules.includes('name')) {
      const sanitized = input.value.replace(/[0-9]/g, '');
      if (input.value !== sanitized) {
        input.value = sanitized;
      }
    }

    // Revalidate if field has invalid state
    if (input.classList.contains('is-invalid')) {
      validateField(input);
    }
  });

  document.addEventListener('change', (e) => {
    if (e.target.dataset && e.target.dataset.v) {
      validateField(e.target);
    }
  });

  // Password visibility toggle helper
  document.addEventListener('click', (e) => {
    const toggleBtn = e.target.closest('.btn-eye');
    if (toggleBtn) {
      const container = toggleBtn.parentNode;
      const passInput = container.querySelector('input');
      const icon = toggleBtn.querySelector('i');
      if (passInput) {
        const isPass = passInput.type === 'password';
        passInput.type = isPass ? 'text' : 'password';
        if (icon) {
          icon.className = isPass ? 'bi bi-eye-slash' : 'bi bi-eye';
        }
      }
    }
  });

  // Global export
  window.AgroValidator = {
    validateField,
    validateForm,
    rules: RULES
  };
})();
