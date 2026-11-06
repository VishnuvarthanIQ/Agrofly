/**
 * AgroFly - Guest Dashboard Module
 * Powers the guest overview metrics, bookings management, 5-step visual tracking,
 * interactive pricing calculator, support ticket handling, and mobile sidebar navigation.
 */
(() => {
  'use strict';

  const GUEST_BOOKINGS_KEY = 'agro_guest_bookings';

  const formatINR = (n) => '\u20B9' + Math.round(n).toLocaleString('en-IN');

  const formatDate = (d) => {
    if (!d) return '–';
    try {
      return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return d;
    }
  };

  // Seed initial realistic guest bookings if none exist
  const DEFAULT_GUEST_BOOKINGS = [
    {
      id: 'AF-7021',
      name: 'Ramesh Patel',
      mobile: '9876543210',
      email: 'ramesh.patel@example.com',
      location: 'Thanjavur Delta Zone, Field 4B',
      crop: 'Paddy',
      acres: 15,
      unit: 'Acres',
      svc: 'Paddy Spraying',
      date: '2026-10-28',
      slot: 'Morning (6:00 AM – 9:00 AM)',
      status: 'Completed',
      amount: 6750,
      notes: 'Brown planthopper and blast prevention completed with 100% boundary coverage.',
      created: '2026-10-25'
    },
    {
      id: 'AF-8412',
      name: 'Suresh Goud',
      mobile: '9848022338',
      email: 'suresh.goud@example.com',
      location: 'Warangal Cotton Belt, Plot 12',
      crop: 'Cotton',
      acres: 25,
      unit: 'Acres',
      svc: 'Cotton Spraying',
      date: '2026-11-04',
      slot: 'Midday (9:00 AM – 12:00 PM)',
      status: 'In Progress',
      amount: 18750,
      notes: 'Active sortie in progress. 18 of 25 acres completed with dual centrifugal atomizers.',
      created: '2026-11-02'
    },
    {
      id: 'AF-9230',
      name: 'Anand Verma',
      mobile: '9765412890',
      email: 'anand.verma@example.com',
      location: 'Kolhapur Sugarcane Sector, Zone A',
      crop: 'Sugarcane',
      acres: 40,
      unit: 'Acres',
      svc: 'Sugarcane Spraying',
      date: '2026-11-08',
      slot: 'Morning (6:00 AM – 9:00 AM)',
      status: 'Confirmed',
      amount: 22000,
      notes: 'DGCA-certified pilot team assigned. Liquid foliar nutrition delivery scheduled.',
      created: '2026-11-03'
    },
    {
      id: 'AF-9844',
      name: 'Vikram Singh',
      mobile: '9823456789',
      email: 'vikram.singh@example.com',
      location: 'Davangere Agro Cluster, Plot 7',
      crop: 'Maize',
      acres: 10,
      unit: 'Acres',
      svc: 'Maize Spraying',
      date: '2026-11-12',
      slot: 'Afternoon (3:00 PM – 6:00 PM)',
      status: 'Pending',
      amount: 5000,
      notes: 'Awaiting agronomist field coordinate verification and plot flight corridor check.',
      created: '2026-11-04'
    }
  ];

  const escapeHTML = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));

  const getActiveUser = () => {
    if (window.AgroAuth && typeof window.AgroAuth.getUser === 'function') {
      const u = window.AgroAuth.getUser();
      if (u) return u;
    }
    try {
      const session = JSON.parse(sessionStorage.getItem('agro_session') || localStorage.getItem('agro_session'));
      if (!session || !session.email) return null;
      const users = JSON.parse(localStorage.getItem('agro_users') || '[]');
      return users.find(u => u.email.toLowerCase() === session.email.toLowerCase()) || { name: session.name, email: session.email };
    } catch {
      return null;
    }
  };

  const getGuestBookings = () => {
    try {
      const data = localStorage.getItem(GUEST_BOOKINGS_KEY);
      if (!data) {
        localStorage.setItem(GUEST_BOOKINGS_KEY, JSON.stringify(DEFAULT_GUEST_BOOKINGS));
        return DEFAULT_GUEST_BOOKINGS;
      }
      return JSON.parse(data) || [];
    } catch {
      return DEFAULT_GUEST_BOOKINGS;
    }
  };

  const saveGuestBookings = (list) => {
    try {
      localStorage.setItem(GUEST_BOOKINGS_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('Unable to save guest bookings:', e);
    }
  };

  const getBookings = () => {
    const user = getActiveUser();
    if (user && user.email) {
      const userKey = `agro_bookings_${user.email.toLowerCase()}`;
      try {
        const data = localStorage.getItem(userKey);
        if (data) {
          return JSON.parse(data) || [];
        }
      } catch {
        return [];
      }
      return [];
    }
    return getGuestBookings();
  };

  const saveBookings = (list) => {
    const user = getActiveUser();
    const key = (user && user.email) ? `agro_bookings_${user.email.toLowerCase()}` : GUEST_BOOKINGS_KEY;
    try {
      localStorage.setItem(key, JSON.stringify(list));
    } catch (e) {
      console.warn('Unable to save bookings:', e);
    }
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return '<span class="badge bg-success-subtle text-success border border-success-subtle px-2.5 py-1 rounded-pill fw-semibold"><i class="bi bi-check-circle-fill me-1"></i>Completed</span>';
      case 'In Progress':
        return '<span class="badge bg-primary-subtle text-primary border border-primary-subtle px-2.5 py-1 rounded-pill fw-semibold"><i class="bi bi-arrow-repeat me-1 spinner-border-sm"></i>In Progress</span>';
      case 'Confirmed':
        return '<span class="badge bg-info-subtle text-info-emphasis border border-info-subtle px-2.5 py-1 rounded-pill fw-semibold"><i class="bi bi-calendar2-check-fill me-1"></i>Confirmed</span>';
      case 'Pending':
      default:
        return '<span class="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-2.5 py-1 rounded-pill fw-semibold"><i class="bi bi-clock-history me-1"></i>Pending</span>';
    }
  };

  const initDashboard = () => {
    if (!document.body.classList.contains('dash-page')) return;

    // Mobile Sidebar Drawer Toggle & Backdrop
    const sidebar = document.getElementById('sb');
    const backdrop = document.getElementById('sbBack');
    const menuBtn = document.getElementById('sbBtn');

    const toggleSidebar = () => {
      if (sidebar && backdrop) {
        sidebar.classList.toggle('open');
        backdrop.classList.toggle('show');
      }
    };

    if (menuBtn) menuBtn.addEventListener('click', toggleSidebar);

    // Dynamic Responsive Page Heading in Dashboard Header
    const setupDynamicPageHeading = () => {
      const headerTitleH1 = document.querySelector('.dtop .header-title-wrap h1');
      if (!headerTitleH1) return;

      const path = (window.location.pathname || '').toLowerCase();
      const pageTitles = {
        'index.html': { full: 'Dashboard Overview', mobile: 'Overview' },
        'bookings.html': { full: 'Booking Requests', mobile: 'Bookings' },
        'services.html': { full: 'Available Services', mobile: 'Services' },
        'book-spraying.html': { full: 'Book Drone Spraying', mobile: 'Book Spraying' },
        'calculator.html': { full: 'Cost Calculator', mobile: 'Calculator' },
        'tracking.html': { full: 'Track Service', mobile: 'Track Service' },
        'invoices.html': { full: 'Billing & Invoices', mobile: 'Invoices' },
        'profile.html': { full: 'Farmer Profile', mobile: 'Profile' },
        'settings.html': { full: 'Account Settings', mobile: 'Settings' },
        'support.html': { full: 'Customer Support', mobile: 'Support' }
      };

      let detectedKey = 'index.html';
      for (const key of Object.keys(pageTitles)) {
        if (path.endsWith(key) || path.includes('/' + key)) {
          detectedKey = key;
          break;
        }
      }

      const activeNav = document.querySelector('.sidebar nav a.active');
      if (activeNav) {
        const href = (activeNav.getAttribute('href') || '').toLowerCase();
        for (const key of Object.keys(pageTitles)) {
          if (href.includes(key)) {
            detectedKey = key;
            break;
          }
        }
      }

      const titleConfig = pageTitles[detectedKey] || { full: 'Dashboard Overview', mobile: 'Overview' };
      headerTitleH1.innerHTML = `<span class="d-none d-md-inline">${titleConfig.full}</span><span class="d-inline d-md-none">${titleConfig.mobile}</span>`;
    };
    setupDynamicPageHeading();
    if (backdrop) backdrop.addEventListener('click', toggleSidebar);

    if (sidebar) {
      // Close sidebar mobile drawer on clicking any link (Home, Brand, Back to Website, or Page links)
      sidebar.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          if (window.innerWidth < 992) {
            sidebar.classList.remove('open');
            if (backdrop) backdrop.classList.remove('show');
          }
        });
      });
    }

    // Populate Live Date in Guest Welcome Banner
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    document.querySelectorAll('[data-live-date]').forEach(el => {
      el.textContent = formattedDate;
    });

    // Dynamic welcome message & identity based on user login status
    const updateDashboardIdentity = () => {
      const user = getActiveUser();
      const welcomeTitle = document.getElementById('dashWelcomeTitle');
      const welcomeDesc = document.getElementById('dashWelcomeDesc');
      const sidebarBadge = document.getElementById('sidebarUserBadge') || document.querySelector('.sidebar .badge');
      const sessionBadge = document.getElementById('dashSessionBadge') || document.querySelector('.dtop .badge');

      if (user && user.name) {
        // Requirement 2: When the user is signed in: Display "Welcome, [User Name]!"
        // Example: Welcome, Vishnuvarthan!
        if (welcomeTitle) {
          welcomeTitle.textContent = `Welcome, ${user.name}!`;
        }
        if (welcomeDesc) {
          welcomeDesc.textContent = `Welcome back, ${user.name}! Manage your agricultural drone spraying requests, explore services, and track your bookings with ease.`;
        }
        if (sidebarBadge) {
          sidebarBadge.remove();
        }
        if (sessionBadge) {
          sessionBadge.remove();
        }
      } else {
        // Requirement 2: When the user is not signed in: Display "Welcome, Guest!"
        if (welcomeTitle) {
          welcomeTitle.textContent = 'Welcome, Guest!';
        }
        if (welcomeDesc) {
          welcomeDesc.textContent = 'Manage your agricultural drone spraying requests, explore services, and track your bookings with ease. Experience precision autonomous crop protection across India with zero signup barriers.';
        }
        if (sidebarBadge) {
          sidebarBadge.remove();
        }
        if (sessionBadge) {
          sessionBadge.remove();
        }
      }
    };

    // Centralized Farmer Profile Management (localStorage + Auth State)
    const getFarmerProfile = () => {
      const activeUser = getActiveUser();
      const saved = localStorage.getItem('agro_farmer_profile') || localStorage.getItem('agro_guest_profile');
      let data = null;
      if (saved) {
        try { data = JSON.parse(saved); } catch (e) { data = null; }
      }

      if (activeUser && activeUser.email) {
        const userProfileKey = 'agro_profile_' + activeUser.email.toLowerCase();
        const userCustom = localStorage.getItem(userProfileKey);
        if (userCustom) {
          try {
            const parsed = JSON.parse(userCustom);
            return {
              name: parsed.name || activeUser.name || 'Rajesh Patel',
              email: activeUser.email,
              mobile: parsed.mobile || activeUser.mobile || activeUser.phone || '9876543210',
              location: parsed.location || activeUser.location || 'Nashik, Maharashtra',
              picture: parsed.picture || activeUser.picture || '',
              isGuest: false
            };
          } catch (e) {}
        }
        return {
          name: activeUser.name || 'Rajesh Patel',
          email: activeUser.email,
          mobile: activeUser.mobile || activeUser.phone || '9876543210',
          location: activeUser.location || 'Nashik, Maharashtra',
          picture: activeUser.picture || '',
          isGuest: false
        };
      }

      // Guest Farmer Mode
      if (data) {
        return {
          name: data.name || 'Guest Farmer',
          email: data.email || 'guest@agrofly.in',
          mobile: data.mobile || '9876543210',
          location: data.location || 'Nashik, Maharashtra',
          picture: data.picture || '',
          isGuest: true
        };
      }

      return {
        name: 'Guest Farmer',
        email: 'guest@agrofly.in',
        mobile: '9876543210',
        location: 'Nashik, Maharashtra',
        picture: '',
        isGuest: true
      };
    };

    const saveFarmerProfile = (profileData) => {
      const activeUser = getActiveUser();
      localStorage.setItem('agro_farmer_profile', JSON.stringify(profileData));
      localStorage.setItem('agro_guest_profile', JSON.stringify(profileData));

      if (activeUser && activeUser.email) {
        const userProfileKey = 'agro_profile_' + activeUser.email.toLowerCase();
        localStorage.setItem(userProfileKey, JSON.stringify(profileData));
        if (profileData.name && activeUser.name !== profileData.name) {
          activeUser.name = profileData.name;
          localStorage.setItem('agro_current_user', JSON.stringify(activeUser));
        }
      }
      window.dispatchEvent(new CustomEvent('agro:auth-change'));
    };

    const renderDashboardTopAuth = () => {
      let slot = document.getElementById('dashAuthSlot');
      if (!slot) {
        const topActions = document.querySelector('.dtop .d-flex.align-items-center.gap-2:last-child');
        if (topActions) {
          slot = document.createElement('span');
          slot.id = 'dashAuthSlot';
          slot.className = 'd-inline-flex align-items-center flex-shrink-0';
          topActions.appendChild(slot);
        }
      }
      if (!slot) return;

      const profile = getFarmerProfile();
      const user = getActiveUser();
      const signedIn = !!(user && user.name);

      if (signedIn) {
        slot.innerHTML = `
          <div class="dropdown d-inline-block position-relative agro-user-dropdown" id="dashUserDropdownWrap">
            <button class="btn btn-outline-agro btn-sm dropdown-toggle d-flex align-items-center gap-1.5 user-profile-trigger text-nowrap flex-shrink-0" type="button" id="dashUserMenuBtn" aria-expanded="false" aria-haspopup="true">
              ${profile.picture ? `<img src="${profile.picture}" alt="${escapeHTML(user.name)}" class="rounded-circle" style="width: 20px; height: 20px; object-fit: cover;">` : `<i class="bi bi-person-circle fs-6"></i>`}
              <span class="fw-semibold user-display-name">${escapeHTML(user.name)}</span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow border rounded-3 p-2 mt-1 agro-user-menu" aria-labelledby="dashUserMenuBtn" style="min-width: 175px; z-index: 1095;">
              <li class="px-2.5 py-1.5 border-bottom mb-1 user-dropdown-header">
                <div class="d-flex align-items-center gap-2">
                  <i class="bi bi-person-circle text-success fs-6"></i>
                  <span class="fw-bold text-dark text-truncate" style="font-size: 0.88rem; max-width: 140px;">${escapeHTML(user.name)}</span>
                </div>
              </li>
              <li>
                <button type="button" class="dropdown-item rounded-2 py-2 d-flex align-items-center gap-2 text-danger fw-semibold js-dash-logout">
                  <i class="bi bi-box-arrow-right fs-6"></i>
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </div>
        `;
      } else {
        slot.innerHTML = `
          <a href="profile.html" class="btn btn-outline-agro btn-sm d-flex align-items-center gap-1.5 text-nowrap flex-shrink-0" id="dashGuestProfileBtn" title="Farmer Profile">
            <i class="bi bi-person-circle fs-6"></i>
            <span class="fw-semibold user-display-name">Guest Farmer</span>
          </a>
        `;
      }
    };

    // Dashboard User Dropdown & Logout Event Listeners (Debounced Mouse & Touch Supported)
    let lastDashUserDropdownTime = 0;
    const handleDashUserDropdownAction = (e) => {
      const trigger = e.target.closest('#dashUserMenuBtn');
      const dashMenu = document.querySelector('#dashUserDropdownWrap .agro-user-menu');

      if (trigger) {
        e.preventDefault();
        e.stopPropagation();
        const now = Date.now();
        if (now - lastDashUserDropdownTime < 320) return;
        lastDashUserDropdownTime = now;

        if (dashMenu) {
          const isShown = dashMenu.classList.contains('show');
          dashMenu.classList.toggle('show', !isShown);
          trigger.setAttribute('aria-expanded', !isShown ? 'true' : 'false');
        }
        return;
      }

      const logoutBtn = e.target.closest('.js-dash-logout');
      if (logoutBtn) {
        e.preventDefault();
        e.stopPropagation();
        const now = Date.now();
        if (now - lastDashUserDropdownTime < 320) return;
        lastDashUserDropdownTime = now;

        // Clear authenticated session keys
        sessionStorage.removeItem('agro_session');
        localStorage.removeItem('agro_session');
        localStorage.removeItem('agro_current_user');

        // Immediately update navbar and banner without redirecting away from Guest Dashboard
        updateDashboardIdentity();
        renderDashboardTopAuth();
        window.dispatchEvent(new CustomEvent('agro:auth-change'));
        return;
      }

      if (e.target.closest('#dashUserDropdownWrap .user-dropdown-header')) {
        return;
      }

      // Close dropdown if clicked or tapped outside
      if (dashMenu && dashMenu.classList.contains('show')) {
        if (!e.target.closest('#dashUserDropdownWrap')) {
          dashMenu.classList.remove('show');
          const btn = document.getElementById('dashUserMenuBtn');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        }
      }
    };

    document.addEventListener('click', handleDashUserDropdownAction);
    document.addEventListener('touchend', (e) => {
      if (e.target.closest('#dashUserMenuBtn') || e.target.closest('.js-dash-logout')) {
        handleDashUserDropdownAction(e);
      } else {
        const dashMenu = document.querySelector('#dashUserDropdownWrap .agro-user-menu.show');
        if (dashMenu && !e.target.closest('#dashUserDropdownWrap')) {
          dashMenu.classList.remove('show');
          const btn = document.getElementById('dashUserMenuBtn');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        }
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const dashMenu = document.querySelector('#dashUserDropdownWrap .agro-user-menu.show');
        if (dashMenu) {
          dashMenu.classList.remove('show');
          const btn = document.getElementById('dashUserMenuBtn');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        }
      }
    });

    updateDashboardIdentity();
    renderDashboardTopAuth();

    // Listen to storage or custom auth changes to update immediately
    window.addEventListener('storage', () => {
      updateDashboardIdentity();
      renderDashboardTopAuth();
    });
    window.addEventListener('agro:auth-change', () => {
      updateDashboardIdentity();
      renderDashboardTopAuth();
    });

    // Sticky Header Scroll Elevation Effect
    const handleDashScroll = () => {
      const dtop = document.querySelector('.dtop');
      if (dtop) {
        if (window.scrollY > 10) {
          dtop.classList.add('scrolled');
        } else {
          dtop.classList.remove('scrolled');
        }
      }
    };
    window.addEventListener('scroll', handleDashScroll, { passive: true });
    handleDashScroll();

    const page = document.body.dataset.page;
    const bookings = getBookings();

    // =========================================================================
    // 1. DASHBOARD OVERVIEW (index.html)
    // =========================================================================
    if (page === 'd-index') {
      // 4 Summary Metric Cards
      const totalCount = bookings.length;
      const pendingCount = bookings.filter(b => b.status === 'Pending').length;
      const completedCount = bookings.filter(b => b.status === 'Completed').length;
      const inProgressCount = bookings.filter(b => b.status === 'In Progress').length;
      const confirmedCount = bookings.filter(b => b.status === 'Confirmed').length;

      const kpiTotal = document.getElementById('kpiTotal');
      const kpiPending = document.getElementById('kpiPending');
      const kpiCompleted = document.getElementById('kpiCompleted');
      const kpiServices = document.getElementById('kpiServices');

      if (kpiTotal) kpiTotal.textContent = totalCount;
      if (kpiPending) kpiPending.textContent = pendingCount;
      if (kpiCompleted) kpiCompleted.textContent = completedCount;
      if (kpiServices) kpiServices.textContent = '9';

      // Status breakdown meter
      const barPending = document.getElementById('barPending');
      const barConfirmed = document.getElementById('barConfirmed');
      const barInProgress = document.getElementById('barInProgress');
      const barCompleted = document.getElementById('barCompleted');

      if (totalCount > 0) {
        if (barPending) barPending.style.width = ((pendingCount / totalCount) * 100) + '%';
        if (barConfirmed) barConfirmed.style.width = ((confirmedCount / totalCount) * 100) + '%';
        if (barInProgress) barInProgress.style.width = ((inProgressCount / totalCount) * 100) + '%';
        if (barCompleted) barCompleted.style.width = ((completedCount / totalCount) * 100) + '%';
      }

      // Recent Booking Requests Table (up to 4)
      const recentTable = document.getElementById('recentTableBody');
      if (recentTable) {
        const recentItems = [...bookings].reverse().slice(0, 5);
        if (!recentItems.length) {
          recentTable.innerHTML = '<tr><td colspan="7" class="text-center text-muted py-4">No booking requests found.</td></tr>';
        } else {
          recentTable.innerHTML = recentItems.map(b => `
            <tr>
              <td><span class="fw-bold font-monospace text-agro">${b.id}</span></td>
              <td>${b.name || 'Guest Farmer'}</td>
              <td><span class="badge bg-light text-dark border">${b.crop || 'Paddy'}</span></td>
              <td>${b.acres} ${b.unit || 'Acres'}</td>
              <td>${b.svc || 'Drone Spraying'}</td>
              <td>${formatDate(b.date)}</td>
              <td>${renderStatusBadge(b.status)}</td>
              <td class="text-end">
                <button type="button" class="btn btn-sm btn-outline-agro js-view-details" data-id="${b.id}" title="View Details">
                  <i class="bi bi-eye"></i> Details
                </button>
              </td>
            </tr>
          `).join('');
        }
      }
    }

    // =========================================================================
    // 2. MY BOOKING REQUESTS (bookings.html)
    // =========================================================================
    if (page === 'd-bookings') {
      const tableBody = document.getElementById('bookingsTableBody');
      const searchInput = document.getElementById('bookingSearchInput');
      const statusFilter = document.getElementById('bookingStatusFilter');
      const countDisplay = document.getElementById('filteredCount');

      const renderTable = () => {
        if (!tableBody) return;
        const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const filterVal = statusFilter ? statusFilter.value : 'all';

        const filtered = bookings.filter(b => {
          const matchQuery = !query || 
            b.id.toLowerCase().includes(query) ||
            (b.name && b.name.toLowerCase().includes(query)) ||
            (b.crop && b.crop.toLowerCase().includes(query)) ||
            (b.location && b.location.toLowerCase().includes(query)) ||
            (b.svc && b.svc.toLowerCase().includes(query));

          const matchStatus = (filterVal === 'all') || (b.status === filterVal);
          return matchQuery && matchStatus;
        });

        if (countDisplay) {
          countDisplay.textContent = `Showing ${filtered.length} of ${bookings.length} requests`;
        }

        if (!filtered.length) {
          tableBody.innerHTML = `
            <tr>
              <td colspan="8" class="text-center py-5 text-muted">
                <i class="bi bi-search fs-2 d-block mb-2 text-agro"></i>
                No booking requests match your search filters.
              </td>
            </tr>
          `;
          return;
        }

        tableBody.innerHTML = filtered.map(b => `
          <tr>
            <td><strong class="font-monospace text-agro">${b.id}</strong></td>
            <td><strong>${b.name || 'Guest Farmer'}</strong></td>
            <td><span class="badge bg-light text-dark border px-2 py-1"><i class="bi bi-flower1 me-1 text-success"></i>${b.crop || 'Paddy'}</span></td>
            <td>${b.acres} ${b.unit || 'Acres'}</td>
            <td>${b.svc || 'Precision Spraying'}</td>
            <td><small class="text-muted d-block">${formatDate(b.date)}</small><span class="badge bg-light text-dark" style="font-size: 0.7rem;">${b.slot || 'Morning'}</span></td>
            <td>${renderStatusBadge(b.status)}</td>
            <td class="text-end">
              <div class="btn-group btn-group-sm">
                <button type="button" class="btn btn-outline-agro js-view-details" data-id="${b.id}" title="View Details">
                  <i class="bi bi-eye"></i> Details
                </button>
                <a href="tracking.html?id=${b.id}" class="btn btn-agro" title="Track Live">
                  <i class="bi bi-geo-alt"></i> Track
                </a>
              </div>
            </td>
          </tr>
        `).join('');
      };

      if (searchInput) searchInput.addEventListener('input', renderTable);
      if (statusFilter) statusFilter.addEventListener('change', renderTable);
      renderTable();
    }

    // =========================================================================
    // 3. TRACK SERVICE (tracking.html)
    // =========================================================================
    if (page === 'd-tracking') {
      const trackForm = document.getElementById('trackingSearchForm');
      const trackIdInput = document.getElementById('trackBookingId');
      const trackMobileInput = document.getElementById('trackMobile');
      const trackResultCard = document.getElementById('trackResultCard');
      const stepperContainer = document.getElementById('trackStepper');
      const statusTitle = document.getElementById('trackStatusTitle');
      const statusBadge = document.getElementById('trackStatusBadge');
      const trackDetails = document.getElementById('trackDetails');

      const STEPS = [
        { id: 1, title: 'Request Submitted', desc: 'Recorded in dispatch queue' },
        { id: 2, title: 'Request Reviewed', desc: 'Agronomist verified crop coordinates' },
        { id: 3, title: 'Booking Confirmed', desc: 'Pilot team & flight slot assigned' },
        { id: 4, title: 'Drone Spraying in Progress', desc: 'Autonomous drone actively spraying plot' },
        { id: 5, title: 'Service Completed', desc: '100% acreage coverage & spray log delivered' }
      ];

      const STATUS_TO_STEP = {
        'Pending': 1,
        'Confirmed': 3,
        'In Progress': 4,
        'Completed': 5
      };

      const doTrack = (bookingId) => {
        const targetId = (bookingId || (trackIdInput ? trackIdInput.value : '')).trim().toUpperCase();
        if (!targetId) return;

        const b = bookings.find(x => x.id.toUpperCase() === targetId);

        if (!b) {
          if (trackResultCard) {
            trackResultCard.innerHTML = `
              <div class="alert alert-warning d-flex align-items-center gap-3 p-3">
                <i class="bi bi-exclamation-triangle-fill fs-3 text-warning"></i>
                <div>
                  <strong>Booking Not Found</strong><br>
                  No booking request matched Booking ID "<strong>${targetId}</strong>". Please verify your ID or pick from the sample bookings below.
                </div>
              </div>
            `;
          }
          return;
        }

        const currentStep = STATUS_TO_STEP[b.status] || 1;

        if (statusTitle) statusTitle.textContent = `${b.id} – ${b.crop} Spraying (${b.acres} ${b.unit || 'Acres'})`;
        if (statusBadge) statusBadge.innerHTML = renderStatusBadge(b.status);

        if (stepperContainer) {
          stepperContainer.innerHTML = STEPS.map((s, idx) => {
            const isDone = s.id < currentStep || (s.id === 5 && currentStep === 5);
            const isActive = s.id === currentStep && currentStep !== 5;
            let stateClass = '';
            if (isDone) stateClass = 'done';
            if (isActive) stateClass = 'active';

            return `
              <div class="track-step ${stateClass}">
                <div class="track-step-circle">
                  ${isDone ? '<i class="bi bi-check-lg"></i>' : s.id}
                </div>
                <div class="track-step-title">${s.title}</div>
                <div class="track-step-desc">${s.desc}</div>
                ${idx < STEPS.length - 1 ? '<div class="track-step-line"></div>' : ''}
              </div>
            `;
          }).join('');
        }

        if (trackDetails) {
          trackDetails.innerHTML = `
            <div class="row g-3">
              <div class="col-md-3 col-6">
                <div class="p-3 bg-light rounded-3 border">
                  <small class="text-muted d-block mb-1">Farmer Contact</small>
                  <strong>${b.name || 'Guest Farmer'}</strong>
                  <div class="small text-muted font-monospace">${b.mobile || '–'}</div>
                </div>
              </div>
              <div class="col-md-3 col-6">
                <div class="p-3 bg-light rounded-3 border">
                  <small class="text-muted d-block mb-1">Plot Location</small>
                  <strong>${b.location || 'Agri Plot'}</strong>
                  <div class="small text-muted">${b.crop} Â· ${b.acres} ${b.unit || 'Acres'}</div>
                </div>
              </div>
              <div class="col-md-3 col-6">
                <div class="p-3 bg-light rounded-3 border">
                  <small class="text-muted d-block mb-1">Assigned Equipment</small>
                  <strong>DJI Agras T40 / Hexa-30L</strong>
                  <div class="small text-muted">Dual Centrifugal Atomizer</div>
                </div>
              </div>
              <div class="col-md-3 col-6">
                <div class="p-3 bg-light rounded-3 border">
                  <small class="text-muted d-block mb-1">Scheduled Window</small>
                  <strong>${formatDate(b.date)}</strong>
                  <div class="small text-muted">${b.slot || 'Morning Slot'}</div>
                </div>
              </div>
            </div>

            <div class="p-3 bg-light rounded-3 border mt-3 d-flex flex-wrap align-items-center justify-content-between gap-2">
              <div class="d-flex align-items-center gap-2">
                <i class="bi bi-info-circle-fill text-agro fs-5"></i>
                <span class="small"><strong>Live Operations Note:</strong> ${b.notes || 'Drone team deployed with RTK centimetre positioning.'}</span>
              </div>
              <span class="badge bg-success text-white px-3 py-1.5 rounded-pill"><i class="bi bi-broadcast me-1"></i> Telemetry Active</span>
            </div>
          `;
        }

        if (trackIdInput) trackIdInput.value = b.id;
        if (trackMobileInput && b.mobile) trackMobileInput.value = b.mobile;
      };

      if (trackForm) {
        trackForm.addEventListener('submit', (e) => {
          e.preventDefault();
          doTrack();
        });
      }

      // Quick Demo Pills on tracking page
      document.querySelectorAll('.js-quick-track').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const bid = btn.dataset.id;
          doTrack(bid);
        });
      });

      // Check query parameter ?id=AF-8412
      const urlParams = new URLSearchParams(window.location.search);
      const paramId = urlParams.get('id');
      if (paramId) {
        doTrack(paramId);
      } else if (bookings.length) {
        // Default to the in-progress or first booking
        const inProg = bookings.find(b => b.status === 'In Progress') || bookings[0];
        doTrack(inProg.id);
      }
    }

    // =========================================================================
    // 4. PRICING & COST CALCULATOR (calculator.html)
    // =========================================================================
    if (page === 'd-calculator') {
      const acreageInput = document.getElementById('calcAcreage');
      const unitSelect = document.getElementById('calcUnit');
      const serviceSelect = document.getElementById('calcService');
      const addNdvi = document.getElementById('calcNdvi');
      const addMorning = document.getElementById('calcMorning');
      const addCanopy = document.getElementById('calcCanopy');

      const outAcreage = document.getElementById('outAcreage');
      const outService = document.getElementById('outService');
      const outRate = document.getElementById('outRate');
      const outSubtotal = document.getElementById('outSubtotal');
      const outAddons = document.getElementById('outAddons');
      const outGst = document.getElementById('outGst');
      const outTotal = document.getElementById('outTotal');
      const outSavings = document.getElementById('outSavings');
      const bookBtn = document.getElementById('calcBookBtn');

      // Unit conversion multiplier to normalized Acres
      const UNIT_MULTIPLIERS = {
        'Acres': 1.0,
        'Hectares': 2.471,
        'Bigha': 0.625,
        'Guntha': 0.025
      };

      // Service base rates per acre
      const SERVICE_RATES = {
        'Paddy Spraying': 450,
        'Cotton Spraying': 480,
        'Sugarcane Spraying': 550,
        'Maize Spraying': 460,
        'Groundnut Spraying': 450,
        'Vegetable Crop Spraying': 520,
        'Fertilizer Spraying': 500,
        'Large Acreage Spraying': 420,
        'Mustard Spraying': 480,
        'Mustard Drone Spraying': 480
      };

      const calculate = () => {
        const rawAcreage = Math.max(1, parseFloat(acreageInput ? acreageInput.value : 1) || 1);
        const unit = unitSelect ? unitSelect.value : 'Acres';
        const mult = UNIT_MULTIPLIERS[unit] || 1.0;
        const normalizedAcres = parseFloat((rawAcreage * mult).toFixed(2));

        const selectedService = serviceSelect ? serviceSelect.value : 'Paddy Spraying';
        const baseRate = SERVICE_RATES[selectedService] || 450;

        let addonRatePerAcre = 0;
        if (addNdvi && addNdvi.checked) addonRatePerAcre += 150;
        if (addMorning && addMorning.checked) addonRatePerAcre += 50;
        if (addCanopy && addCanopy.checked) addonRatePerAcre += 100;

        const subtotal = Math.round(normalizedAcres * baseRate);
        const addonsTotal = Math.round(normalizedAcres * addonRatePerAcre);
        const gst = Math.round((subtotal + addonsTotal) * 0.05); // 5% GST for agri services
        const total = subtotal + addonsTotal + gst;

        // Estimated savings vs manual laborers (Manual spray in India is approx â‚¹850/acre + chemical wastage)
        const manualCost = Math.round(normalizedAcres * 850);
        const savings = Math.max(0, manualCost - total);

        if (outAcreage) outAcreage.textContent = `${rawAcreage} ${unit} (${normalizedAcres} Acres)`;
        if (outService) outService.textContent = selectedService;
        if (outRate) outRate.textContent = `${formatINR(baseRate)} / acre`;
        if (outSubtotal) outSubtotal.textContent = formatINR(subtotal);
        if (outAddons) outAddons.textContent = formatINR(addonsTotal);
        if (outGst) outGst.textContent = formatINR(gst);
        if (outTotal) outTotal.textContent = formatINR(total);
        if (outSavings) outSavings.textContent = formatINR(savings);

        if (bookBtn) {
          bookBtn.href = `book-spraying.html?service=${encodeURIComponent(selectedService)}&acres=${rawAcreage}&unit=${encodeURIComponent(unit)}`;
        }
      };

      // Preset Acreage quick buttons
      document.querySelectorAll('.js-preset-acre').forEach(btn => {
        btn.addEventListener('click', () => {
          if (acreageInput) {
            acreageInput.value = btn.dataset.acres;
            calculate();
          }
        });
      });

      if (acreageInput) acreageInput.addEventListener('input', calculate);
      if (unitSelect) unitSelect.addEventListener('change', calculate);
      if (serviceSelect) serviceSelect.addEventListener('change', calculate);
      if (addNdvi) addNdvi.addEventListener('change', calculate);
      if (addMorning) addMorning.addEventListener('change', calculate);
      if (addCanopy) addCanopy.addEventListener('change', calculate);

      calculate();
    }

    // =========================================================================
    // 5. CONTACT SUPPORT (support.html)
    // =========================================================================
    if (page === 'd-support') {
      const supportForm = document.getElementById('supportTicketForm');
      if (supportForm) {
        supportForm.addEventListener('submit', (e) => {
          e.preventDefault();
          if (window.AgroValidator && !window.AgroValidator.validateForm(supportForm)) {
            return;
          }

          const name = document.getElementById('supName') ? document.getElementById('supName').value.trim() : 'Farmer';
          const ticketId = 'TKT-' + Math.floor(100000 + Math.random() * 900000);

          if (window.AgroUI && window.AgroUI.showModal) {
            window.AgroUI.showModal(
              'Support Request Received',
              `
                <div class="text-center py-2">
                  <div class="display-6 text-success mb-2"><i class="bi bi-check-circle-fill"></i></div>
                  <h5>Ticket Generated: <span class="text-agro font-monospace">${ticketId}</span></h5>
                  <p class="text-muted">Thank you, <strong>${name}</strong>. Your enquiry has been received by the AgroFly Flight Coordination Desk.</p>
                  <div class="p-3 bg-light rounded-3 text-start small mb-3">
                    <div><strong>Response Time:</strong> Within 30 minutes via WhatsApp / Phone</div>
                    <div><strong>Urgent Field Inquiries:</strong> Call +91 98765 43210</div>
                  </div>
                </div>
              `,
              '<button type="button" class="btn btn-agro" data-bs-dismiss="modal">Close</button>'
            );
          } else {
            alert(`Support ticket ${ticketId} created! An AgroFly coordinator will call you shortly.`);
          }

          supportForm.reset();
        });
      }
    }

    // =========================================================================
    // =========================================================================
    // 6. FARMER PROFILE (profile.html)
    // =========================================================================
    if (page === 'd-profile') {
      const profileHeroName = document.getElementById('profileHeroName');
      const profileHeroEmail = document.getElementById('profileHeroEmail');
      const profileHeroMobile = document.getElementById('profileHeroMobile');
      const profileHeroLocation = document.getElementById('profileHeroLocation');
      const profileBadgeText = document.getElementById('profileBadgeText');
      const profileHeroAvatarImg = document.getElementById('profileHeroAvatarImg');
      const profileHeroAvatarIcon = document.getElementById('profileHeroAvatarIcon');

      const viewFullName = document.getElementById('viewFullName');
      const viewEmail = document.getElementById('viewEmail');
      const viewMobile = document.getElementById('viewMobile');
      const viewLocation = document.getElementById('viewLocation');
      const viewBookingCount = document.getElementById('viewBookingCount');
      const viewAuthLevel = document.getElementById('viewAuthLevel');

      const profileViewContainer = document.getElementById('profileViewContainer');
      const profileEditContainer = document.getElementById('profileEditContainer');
      const btnTriggerEdit = document.getElementById('btnTriggerEdit');
      const btnEditInline = document.getElementById('btnEditInline');
      const btnCloseEdit = document.getElementById('btnCloseEdit');
      const btnCancelProfile = document.getElementById('btnCancelProfile');

      const farmerProfileForm = document.getElementById('farmerProfileForm');
      const inputFullName = document.getElementById('inputFullName');
      const inputEmail = document.getElementById('inputEmail');
      const inputMobile = document.getElementById('inputMobile');
      const inputLocation = document.getElementById('inputLocation');
      const profilePicInput = document.getElementById('profilePicInput');
      const editAvatarPreviewImg = document.getElementById('editAvatarPreviewImg');
      const editAvatarPreviewIcon = document.getElementById('editAvatarPreviewIcon');
      const btnRemoveAvatar = document.getElementById('btnRemoveAvatar');

      let currentTempAvatar = '';

      const renderProfileView = () => {
        const p = getFarmerProfile();
        currentTempAvatar = p.picture || '';

        // Hero Card
        if (profileHeroName) profileHeroName.textContent = p.name;
        if (profileHeroEmail) profileHeroEmail.textContent = p.email;
        if (profileHeroMobile) profileHeroMobile.textContent = p.mobile ? (p.mobile.startsWith('+91') ? p.mobile : '+91 ' + p.mobile) : '+91 98765 43210';
        if (profileHeroLocation) profileHeroLocation.textContent = p.location;
        if (profileBadgeText) profileBadgeText.textContent = p.isGuest ? 'Guest Session Active' : 'Verified Farmer';

        if (p.picture) {
          if (profileHeroAvatarImg) {
            profileHeroAvatarImg.src = p.picture;
            profileHeroAvatarImg.classList.remove('d-none');
          }
          if (profileHeroAvatarIcon) profileHeroAvatarIcon.classList.add('d-none');
        } else {
          if (profileHeroAvatarImg) profileHeroAvatarImg.classList.add('d-none');
          if (profileHeroAvatarIcon) profileHeroAvatarIcon.classList.remove('d-none');
        }

        // View Mode Container
        if (viewFullName) viewFullName.textContent = p.name;
        if (viewEmail) viewEmail.textContent = p.email;
        if (viewMobile) viewMobile.textContent = p.mobile ? (p.mobile.startsWith('+91') ? p.mobile : '+91 ' + p.mobile) : '+91 98765 43210';
        if (viewLocation) viewLocation.textContent = p.location;
        if (viewBookingCount) viewBookingCount.textContent = getBookings().length;
        if (viewAuthLevel) viewAuthLevel.textContent = p.isGuest ? 'Guest (Unrestricted)' : 'Verified Member';
      };

      const openEditMode = () => {
        const p = getFarmerProfile();
        currentTempAvatar = p.picture || '';

        if (inputFullName) inputFullName.value = p.name;
        if (inputEmail) inputEmail.value = p.email;
        if (inputMobile) inputMobile.value = p.mobile ? p.mobile.replace('+91', '').trim() : '';
        if (inputLocation) inputLocation.value = p.location;

        if (p.picture) {
          if (editAvatarPreviewImg) {
            editAvatarPreviewImg.src = p.picture;
            editAvatarPreviewImg.classList.remove('d-none');
          }
          if (editAvatarPreviewIcon) editAvatarPreviewIcon.classList.add('d-none');
        } else {
          if (editAvatarPreviewImg) editAvatarPreviewImg.classList.add('d-none');
          if (editAvatarPreviewIcon) editAvatarPreviewIcon.classList.remove('d-none');
        }

        farmerProfileForm.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));

        if (profileViewContainer) profileViewContainer.classList.add('d-none');
        if (profileEditContainer) {
          profileEditContainer.classList.remove('d-none');
          profileEditContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        if (inputFullName) inputFullName.focus();
      };

      const closeEditMode = () => {
        if (profileEditContainer) profileEditContainer.classList.add('d-none');
        if (profileViewContainer) profileViewContainer.classList.remove('d-none');
      };

      if (btnTriggerEdit) btnTriggerEdit.addEventListener('click', openEditMode);
      if (btnEditInline) btnEditInline.addEventListener('click', openEditMode);
      if (btnCloseEdit) btnCloseEdit.addEventListener('click', closeEditMode);
      if (btnCancelProfile) btnCancelProfile.addEventListener('click', closeEditMode);

      // Handle Profile Picture file upload
      if (profilePicInput) {
        profilePicInput.addEventListener('change', (e) => {
          const file = e.target.files && e.target.files[0];
          if (!file) return;
          if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file (PNG, JPG, or WebP).');
            return;
          }
          if (file.size > 2 * 1024 * 1024) {
            alert('Image file size must be less than 2MB.');
            return;
          }
          const reader = new FileReader();
          reader.onload = (loadEvt) => {
            currentTempAvatar = loadEvt.target.result;
            if (editAvatarPreviewImg) {
              editAvatarPreviewImg.src = currentTempAvatar;
              editAvatarPreviewImg.classList.remove('d-none');
            }
            if (editAvatarPreviewIcon) editAvatarPreviewIcon.classList.add('d-none');
          };
          reader.readAsDataURL(file);
        });
      }

      if (btnRemoveAvatar) {
        btnRemoveAvatar.addEventListener('click', () => {
          currentTempAvatar = '';
          if (profilePicInput) profilePicInput.value = '';
          if (editAvatarPreviewImg) editAvatarPreviewImg.classList.add('d-none');
          if (editAvatarPreviewIcon) editAvatarPreviewIcon.classList.remove('d-none');
        });
      }

      // Form submission with validation
      if (farmerProfileForm) {
        farmerProfileForm.addEventListener('submit', (e) => {
          e.preventDefault();
          let isValid = true;

          // Name validation
          const nameVal = inputFullName ? inputFullName.value.trim() : '';
          if (!nameVal || nameVal.length < 2) {
            if (inputFullName) inputFullName.classList.add('is-invalid');
            isValid = false;
          } else {
            if (inputFullName) inputFullName.classList.remove('is-invalid');
          }

          // Email validation
          const emailVal = inputEmail ? inputEmail.value.trim() : '';
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailVal || !emailRegex.test(emailVal)) {
            if (inputEmail) inputEmail.classList.add('is-invalid');
            isValid = false;
          } else {
            if (inputEmail) inputEmail.classList.remove('is-invalid');
          }

          // Mobile validation (10 digits)
          const mobileVal = inputMobile ? inputMobile.value.trim().replace(/\D/g, '') : '';
          if (!mobileVal || mobileVal.length !== 10) {
            if (inputMobile) inputMobile.classList.add('is-invalid');
            isValid = false;
          } else {
            if (inputMobile) inputMobile.classList.remove('is-invalid');
          }

          // Location validation
          const locationVal = inputLocation ? inputLocation.value.trim() : '';
          if (!locationVal || locationVal.length < 2) {
            if (inputLocation) inputLocation.classList.add('is-invalid');
            isValid = false;
          } else {
            if (inputLocation) inputLocation.classList.remove('is-invalid');
          }

          if (!isValid) {
            const firstInvalid = farmerProfileForm.querySelector('.is-invalid');
            if (firstInvalid) firstInvalid.focus();
            return;
          }

          const updatedData = {
            name: nameVal,
            email: emailVal,
            mobile: mobileVal,
            location: locationVal,
            picture: currentTempAvatar || '',
            updatedAt: new Date().toISOString()
          };

          saveFarmerProfile(updatedData);
          renderProfileView();
          closeEditMode();
          renderDashboardTopAuth();

          // Show Success Popup Modal
          const modalEl = document.getElementById('profileSavedModal');
          if (modalEl) {
            if (window.bootstrap && window.bootstrap.Modal) {
              const modalInst = new bootstrap.Modal(modalEl);
              modalInst.show();
            } else {
              modalEl.classList.add('show');
              modalEl.style.display = 'block';
              document.body.classList.add('modal-open');
              modalEl.querySelectorAll('[data-bs-dismiss="modal"]').forEach(btn => {
                btn.onclick = () => {
                  modalEl.classList.remove('show');
                  modalEl.style.display = 'none';
                  document.body.classList.remove('modal-open');
                };
              });
            }
          }
        });
      }

      // Initial render of profile view
      renderProfileView();
    }

    // UNIVERSAL MODAL FOR "VIEW DETAILS" ON ANY PAGE
    // =========================================================================
    document.addEventListener('click', (e) => {
      const viewBtn = e.target.closest('.js-view-details');
      if (!viewBtn) return;
      e.preventDefault();

      const bookingId = viewBtn.dataset.id;
      const b = bookings.find(x => x.id === bookingId);
      if (!b) return;

      if (window.AgroUI && window.AgroUI.showModal) {
        window.AgroUI.showModal(
          `Booking Details – ${b.id}`,
          `
            <div class="py-2">
              <div class="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                <div>
                  <h5 class="mb-0 text-agro">${b.crop} Drone Spraying</h5>
                  <small class="text-muted">Booking Reference: <strong class="font-monospace">${b.id}</strong></small>
                </div>
                <div>${renderStatusBadge(b.status)}</div>
              </div>

              <div class="row g-3 mb-3">
                <div class="col-6">
                  <small class="text-muted d-block">Farmer Name</small>
                  <strong>${b.name || 'Guest Farmer'}</strong>
                </div>
                <div class="col-6">
                  <small class="text-muted d-block">Contact Number</small>
                  <strong>${b.mobile || '–'}</strong>
                </div>
                <div class="col-6">
                  <small class="text-muted d-block">Plot Location</small>
                  <strong>${b.location || 'Agri Plot'}</strong>
                </div>
                <div class="col-6">
                  <small class="text-muted d-block">Acreage Coverage</small>
                  <strong>${b.acres} ${b.unit || 'Acres'}</strong>
                </div>
                <div class="col-6">
                  <small class="text-muted d-block">Service Package</small>
                  <strong>${b.svc || 'Precision Spraying'}</strong>
                </div>
                <div class="col-6">
                  <small class="text-muted d-block">Scheduled Slot</small>
                  <strong>${formatDate(b.date)} (${b.slot || 'Morning'})</strong>
                </div>
              </div>

              <div class="p-3 bg-light rounded-3 border mb-3">
                <div class="d-flex justify-content-between">
                  <span>Estimated Total Amount (incl. 5% GST):</span>
                  <strong class="text-agro fs-5">${formatINR(b.amount || 6750)}</strong>
                </div>
                ${b.notes ? `<div class="mt-2 pt-2 border-top small text-muted"><strong>Notes:</strong> ${b.notes}</div>` : ''}
              </div>
            </div>
          `,
          `
            <a href="tracking.html?id=${b.id}" class="btn btn-agro">
              <i class="bi bi-geo-alt"></i> Track This Service
            </a>
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
          `
        );
      }
    });
  };

  document.addEventListener('DOMContentLoaded', initDashboard);

  window.AgroGuestDashboard = {
    init: initDashboard,
    getBookings: getBookings,
    saveBookings: saveBookings,
    updateAuthState: () => {
      initDashboard();
    }
  };
})();
