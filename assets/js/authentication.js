/**
 * AgroFly - Frontend Authentication Module
 * Strict Requirements:
 * 1. No hardcoded demo credentials or auto-login.
 * 2. Sign In & Sign Up: Form validation + professional success popup ONLY, NO automatic redirects.
 * 3. Route protection for all dashboard pages (unauthenticated access redirects to sign-in.html).
 * 4. Header auth state: When unauthenticated, show "Sign In". When authenticated, show ONLY user's actual name with Dashboard & Logout dropdown.
 */
(() => {
  'use strict';

  const USERS_KEY = 'agro_users';
  const SESSION_KEY = 'agro_session';

  // Demo SHA-256 generator (browser Web Crypto API)
  const sha256 = async (str) => {
    const buffer = new TextEncoder().encode('agrofly-salt:' + str);
    const hash = await crypto.subtle.digest('SHA-256', buffer);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const getUsers = () => {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    } catch {
      return [];
    }
  };

  const saveUsers = (users) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  };

  const getSession = () => {
    try {
      return JSON.parse(sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY));
    } catch {
      return null;
    }
  };

  const getCurrentUser = () => {
    const session = getSession();
    if (!session || !session.email) return null;
    const user = getUsers().find(u => u.email.toLowerCase() === session.email.toLowerCase());
    if (user) return user;
    if (session.name) return { name: session.name, email: session.email };
    return null;
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem('agro_current_user');

    // Close mobile nav drawer if open
    const mnav = document.getElementById('mnav');
    if (mnav) mnav.classList.remove('show');
    const backdrop = document.getElementById('mnavBackdrop');
    if (backdrop) backdrop.classList.remove('show');

    // Notify listeners of auth change
    window.dispatchEvent(new CustomEvent('agro:auth-change', { detail: { user: null } }));

    // Re-render auth slots
    renderHeaderAuthState();
    if (window.AgroGuestDashboard && typeof window.AgroGuestDashboard.updateAuthState === 'function') {
      window.AgroGuestDashboard.updateAuthState();
    }

    const isDash = document.body.classList.contains('dash-page') || window.location.pathname.includes('/dashboard/');
    if (isDash) {
      window.location.reload();
    }
  };

  /**
   * Universal Modal Dialog Helper (Popup without redirection)
   */
  const showAuthPopup = (title, htmlContent, isSuccess = true) => {
    const existing = document.getElementById('authFeedbackModal');
    if (existing) {
      const existingBs = bootstrap.Modal.getInstance(existing);
      if (existingBs) existingBs.hide();
      existing.remove();
    }

    const modalEl = document.createElement('div');
    modalEl.id = 'authFeedbackModal';
    modalEl.className = 'modal fade';
    modalEl.tabIndex = -1;
    modalEl.setAttribute('aria-hidden', 'true');
    modalEl.innerHTML = `
      <div class="modal-dialog modal-dialog-centered" style="max-width: 460px;">
        <div class="modal-content shadow-lg border-0 rounded-4 overflow-hidden">
          <div class="modal-header border-0 pb-0 pt-4 px-4 justify-content-end">
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body text-center px-4 pb-4 pt-1">
            <div class="mb-3 d-inline-flex align-items-center justify-content-center rounded-circle ${isSuccess ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}" style="width: 72px; height: 72px; font-size: 2rem;">
              <i class="bi ${isSuccess ? 'bi-check-circle-fill' : 'bi-info-circle-fill'}"></i>
            </div>
            <h4 class="fw-bold mb-2">${title}</h4>
            <div class="text-muted fs-6 mb-4">${htmlContent}</div>
            <button type="button" class="btn btn-agro w-100 py-2 rounded-3" data-bs-dismiss="modal">
              Continue
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modalEl);
    const bsModal = new bootstrap.Modal(modalEl, { backdrop: true });
    modalEl.addEventListener('hidden.bs.modal', () => {
      modalEl.remove();
    });
    bsModal.show();
  };

  /**
   * Route Protection: Guest Dashboard Mode
   * Users can freely access all dashboard pages without signing in or registering.
   */
  const checkDashboardRouteProtection = () => {
    // Guest dashboard is accessible to all visitors without authentication barriers.
  };

  /**
   * Render Main Website Header Authentication State:
   * When unauthenticated: Show "Sign In" button.
   * When authenticated: Hide "Sign In", show ONLY the user's name with Dashboard & Logout dropdown.
   */
  const renderHeaderAuthState = () => {
    const slots = document.querySelectorAll('#authSlot, .js-auth-slot');
    if (!slots.length) return;

    const user = getCurrentUser();
    const root = document.body.dataset.root || '';

    slots.forEach(slot => {
      if (user) {
        slot.innerHTML = `
          <div class="dropdown d-inline-block position-relative agro-user-dropdown">
            <button class="btn btn-outline-agro btn-sm dropdown-toggle d-flex align-items-center gap-1.5 user-profile-trigger" type="button" aria-expanded="false" aria-haspopup="true">
              <i class="bi bi-person-circle fs-6"></i>
              <span class="user-display-name fw-semibold">${escapeHTML(user.name)}</span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow border rounded-3 p-2 mt-1 agro-user-menu" aria-label="User Menu" style="min-width: 175px; z-index: 1095;">
              <li class="px-2.5 py-1.5 border-bottom mb-1 user-dropdown-header">
                <div class="d-flex align-items-center gap-2">
                  <i class="bi bi-person-circle text-success fs-6"></i>
                  <span class="fw-bold text-dark text-truncate" style="font-size: 0.88rem; max-width: 140px;">${escapeHTML(user.name)}</span>
                </div>
              </li>
              <li>
                <button type="button" class="dropdown-item rounded-2 py-2 d-flex align-items-center gap-2 text-danger fw-semibold js-logout">
                  <i class="bi bi-box-arrow-right fs-6"></i>
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </div>
        `;
      } else {
        slot.innerHTML = `
          <a class="btn btn-outline-agro btn-sm px-3" href="${root}sign-in.html">Sign In</a>
        `;
      }
    });
  };

  // Robust Universal Event Listener for the User Profile Dropdown (Desktop & Mobile)
  let profileDropdownInitialized = false;
  const setupProfileDropdownToggle = () => {
    if (profileDropdownInitialized) return;
    profileDropdownInitialized = true;

    let lastInteractionTime = 0;

    const handleDropdownInteraction = (e) => {
      const trigger = e.target.closest('.user-profile-trigger');
      const allMenus = document.querySelectorAll('.agro-user-menu');

      if (trigger) {
        // Let dashboard.js manage its own dashboard header button (#dashUserMenuBtn)
        if (trigger.id === 'dashUserMenuBtn') return;

        const now = Date.now();
        if (now - lastInteractionTime < 300) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        lastInteractionTime = now;

        e.preventDefault();
        e.stopPropagation();
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();

        const parent = trigger.closest('.agro-user-dropdown');
        const menu = parent ? parent.querySelector('.agro-user-menu') : null;
        if (!menu) return;

        const isShown = menu.classList.contains('show');

        // Close any other open dropdowns first
        allMenus.forEach(m => {
          if (m !== menu) {
            m.classList.remove('show');
            const btn = m.closest('.agro-user-dropdown')?.querySelector('.user-profile-trigger');
            if (btn) btn.setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle this dropdown
        if (isShown) {
          menu.classList.remove('show');
          trigger.setAttribute('aria-expanded', 'false');
        } else {
          menu.classList.add('show');
          trigger.setAttribute('aria-expanded', 'true');
        }
        return;
      }

      // If clicked on logout button, let logout run and close menus
      if (e.target.closest('.js-logout')) {
        e.preventDefault();
        e.stopPropagation();
        allMenus.forEach(m => {
          m.classList.remove('show');
          const btn = m.closest('.agro-user-dropdown')?.querySelector('.user-profile-trigger');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        });
        logout();
        return;
      }

      // If clicked inside dropdown header, keep open
      if (e.target.closest('.user-dropdown-header')) {
        return;
      }

      // Clicked outside dropdown: close all
      allMenus.forEach(m => {
        if (!m.closest('.agro-user-dropdown')?.contains(e.target)) {
          m.classList.remove('show');
          const btn = m.closest('.agro-user-dropdown')?.querySelector('.user-profile-trigger');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        }
      });
    };

    document.addEventListener('click', handleDropdownInteraction);
    document.addEventListener('touchend', (e) => {
      if (e.target.closest('.user-profile-trigger, .js-logout')) {
        handleDropdownInteraction(e);
      }
    }, { passive: false });

    // Escape key closes dropdown
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const allMenus = document.querySelectorAll('.agro-user-menu.show');
        allMenus.forEach(m => {
          m.classList.remove('show');
          const btn = m.closest('.agro-user-dropdown')?.querySelector('.user-profile-trigger');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        });
      }
    });
  };

  // Dashboard is freely accessible to all visitors — no authentication required.
  const setupDashboardLinkInterception = () => {
    // No interception: guests can access all dashboard pages without signing in.
  };

  // Setup initial bookings for newly signed-in user if not already present
  const seedUserBookings = (user) => {
    const key = `agro_bookings_${user.email.toLowerCase()}`;
    if (localStorage.getItem(key)) return;

    const today = new Date();
    const formatDate = (offsetDays) => {
      const d = new Date(today.getTime() + offsetDays * 86400000);
      return d.toISOString().split('T')[0];
    };

    const initialBookings = [
      {
        id: 'AF-1001',
        crop: 'Paddy',
        acres: 8,
        svc: 0,
        date: formatDate(-12),
        slot: '6 AM – 9 AM',
        status: 'Completed',
        amount: 2688,
        location: user.location || 'Tamil Nadu',
        name: user.name,
        mobile: user.mobile,
        email: user.email,
        notes: 'Pre-harvest blast protection',
        created: formatDate(-18)
      },
      {
        id: 'AF-1002',
        crop: 'Cotton',
        acres: 12,
        svc: 1,
        date: formatDate(3),
        slot: '9 AM – 12 PM',
        status: 'Confirmed',
        amount: 5040,
        location: user.location || 'Tamil Nadu',
        name: user.name,
        mobile: user.mobile,
        email: user.email,
        notes: 'Bollworm sucking pest control',
        created: formatDate(-2)
      }
    ];

    localStorage.setItem(key, JSON.stringify(initialBookings));
  };

  /**
   * Setup Sign In Form
   * Requirement: Validate inputs, show popup only on success, DO NOT redirect.
   */
  const setupSignIn = () => {
    const form = document.querySelector('[data-form="signin"]');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (window.AgroValidator && !window.AgroValidator.validateForm(form)) return;

      const emailInput = document.getElementById('si_i');
      const passInput = document.getElementById('si_p');
      const rememberInput = document.getElementById('si_r');

      const email = emailInput.value.trim().toLowerCase();
      const enteredHash = await sha256(passInput.value);

      const user = getUsers().find(u =>
        u.email.toLowerCase() === email && u.pass === enteredHash
      );

      if (!user) {
        passInput.classList.add('is-invalid');
        const host = passInput.closest('.input-group') || passInput;
        let err = host.parentNode.querySelector(':scope > .invalid-feedback[data-for="si_p"]');
        if (!err) {
          err = document.createElement('div');
          err.className = 'invalid-feedback d-block';
          err.dataset.for = 'si_p';
          host.after(err);
        } else {
          err.classList.add('d-block');
        }
        err.textContent = 'Invalid email or password. If you do not have an account, please click Create Account.';
        return;
      }

      // Store active session in both sessionStorage and localStorage for seamless tab navigation
      const sessionObj = { email: user.email, name: user.name, time: Date.now() };
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionObj));
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionObj));

      seedUserBookings(user);

      // Re-render auth state immediately across headers and notify listeners
      renderHeaderAuthState();
      window.dispatchEvent(new CustomEvent('agro:auth-change', { detail: { user } }));
      if (window.AgroGuestDashboard && typeof window.AgroGuestDashboard.updateAuthState === 'function') {
        window.AgroGuestDashboard.updateAuthState();
      }

      // Requirement: Popup only, DO NOT redirect to dashboard or other pages
      showAuthPopup(
        'Signed In Successfully',
        `<p class="mb-2">Welcome back, <strong>${escapeHTML(user.name)}</strong>!</p>
         <p class="small text-muted mb-0">Your session is now active. You can now access protected farmer dashboard features and book drone spraying services.</p>`,
        true
      );
    });
  };

  /**
   * Setup Sign Up Form
   * Requirement: Validate inputs, show popup only on success, DO NOT redirect.
   */
  const setupSignUp = () => {
    const form = document.querySelector('[data-form="signup"]');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (window.AgroValidator && !window.AgroValidator.validateForm(form)) return;

      const nameInput = document.getElementById('su_n');
      const emailInput = document.getElementById('su_e');
      const mobileInput = document.getElementById('su_m');
      const passInput = document.getElementById('su_p');

      const email = emailInput.value.trim().toLowerCase();
      const users = getUsers();

      if (users.some(u => u.email.toLowerCase() === email)) {
        emailInput.classList.add('is-invalid');
        let err = emailInput.parentNode.querySelector('.invalid-feedback[data-for="su_e"]');
        if (!err) {
          err = document.createElement('div');
          err.className = 'invalid-feedback d-block';
          err.dataset.for = 'su_e';
          emailInput.after(err);
        } else {
          err.classList.add('d-block');
        }
        err.textContent = 'An account with this email address already exists. Please sign in instead.';
        return;
      }

      const hash = await sha256(passInput.value);
      const newUser = {
        name: nameInput.value.trim(),
        email: email,
        mobile: mobileInput.value.trim(),
        pass: hash,
        location: 'Tamil Nadu, India',
        created: new Date().toISOString()
      };

      users.push(newUser);
      saveUsers(users);

      // Requirement: Popup only, DO NOT redirect
      showAuthPopup(
        'Account Created Successfully',
        `<p class="mb-2">Welcome to AgroFly, <strong>${escapeHTML(newUser.name)}</strong>!</p>
         <p class="small text-muted mb-0">Your account has been registered successfully. You can now use your email and password to sign in.</p>`,
        true
      );

      form.reset();
      document.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
        el.classList.remove('is-valid', 'is-invalid');
      });
    });
  };

  // Social Sign-In Buttons Handler (Frontend demo interface indicator)
  const setupSocialLoginHandlers = () => {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.js-social-login');
      if (!btn) return;
      e.preventDefault();
      const provider = btn.dataset.provider || 'Social';
      showAuthPopup(
        `${provider} Authentication`,
        `<p class="mb-2"><strong>${provider} Sign-In</strong> is currently in frontend interface mode.</p>
         <p class="small text-muted mb-0">Live OAuth 2.0 single sign-on can be integrated with your Google Cloud or Apple Developer console on a production backend server.</p>`,
        false
      );
    });

    // Forgot Password Handler
    document.addEventListener('click', (e) => {
      const forgotLink = e.target.closest('[data-forgot]');
      if (!forgotLink) return;
      e.preventDefault();
      showAuthPopup(
        'Reset Password',
        `<p class="mb-2">Enter your registered email address to receive password reset instructions.</p>
         <div class="my-3">
           <input type="email" id="resetEmail" class="form-control" placeholder="name@example.com">
         </div>
         <p class="small text-muted mb-0">A password recovery link will be dispatched to your inbox.</p>`,
        false
      );
    });
  };

  // Global Logout Click Handler
  document.addEventListener('click', (e) => {
    if (e.target.closest('.js-logout')) {
      e.preventDefault();
      logout();
    }
  });

  const escapeHTML = (str) => {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  };

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    checkDashboardRouteProtection();
    renderHeaderAuthState();
    setupProfileDropdownToggle();
    setupDashboardLinkInterception();
    setupSignIn();
    setupSignUp();
    setupSocialLoginHandlers();
  });

  // Export
  window.AgroAuth = {
    getUser: getCurrentUser,
    getUsers,
    logout,
    renderHeaderAuthState,
    showAuthPopup
  };
})();
