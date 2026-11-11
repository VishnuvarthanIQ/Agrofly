/**
 * AgroFly - Guest Booking & Live Acreage Cost Calculator Module
 * Calculates dynamic service estimates, handles pre-filled query parameters,
 * validates farmer details, saves to localStorage (agro_guest_bookings),
 * and triggers a professional confirmation modal without unwanted redirects.
 */
(() => {
  'use strict';

  const GUEST_BOOKINGS_KEY = 'agro_guest_bookings';
  const formatINR = (num) => '\u20B9' + Math.round(num).toLocaleString('en-IN');

  const setupBookingForm = () => {
    const form = document.querySelector('[data-form="booking"]');
    if (!form) return;

    // Form input references
    const nameInput = document.getElementById('b_n');
    const mobileInput = document.getElementById('b_m');
    const emailInput = document.getElementById('b_e');
    const locationInput = document.getElementById('b_l');
    const cropSelect = document.getElementById('b_c');
    const serviceSelect = document.getElementById('b_s');
    const acreageInput = document.getElementById('b_a');
    const unitSelect = document.getElementById('b_u');
    const dateInput = document.getElementById('b_d');
    const slotSelect = document.getElementById('b_t');
    const notesInput = document.getElementById('b_x');
    const summaryBox = document.getElementById('sum');

    // Unit conversion factors to normalized Acres
    const UNIT_MULTIPLIERS = {
      'Acres': 1.0,
      'Hectares': 2.471,
      'Bigha': 0.625,
      'Guntha': 0.025
    };

    // Service rate mapping per acre
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
      'Mustard Drone Spraying': 480,
      // fallback legacy values
      'Pesticide Spraying': 450,
      'Crop Protection': 550,
      'Ultra-Low Volume Foliar': 600
    };

    // Parse URL query parameters for pre-filling
    const urlParams = new URLSearchParams(window.location.search);
    const paramService = urlParams.get('service') || urlParams.get('svc');
    const paramCrop = urlParams.get('crop');
    const paramAcres = urlParams.get('acres');
    const paramUnit = urlParams.get('unit');

    if (paramService && serviceSelect) {
      const pLower = paramService.toLowerCase().trim();
      let matchedIndex = -1;
      
      // If an index was passed e.g. ?svc=0..7
      const numIdx = parseInt(paramService, 10);
      if (!isNaN(numIdx) && numIdx >= 0 && numIdx < serviceSelect.options.length) {
        matchedIndex = numIdx;
      } else {
        // Keyword / substring matching
        for (let i = 0; i < serviceSelect.options.length; i++) {
          const optText = serviceSelect.options[i].text.toLowerCase();
          const optVal = serviceSelect.options[i].value.toLowerCase();
          if (optVal === pLower || optText === pLower || optText.includes(pLower) || pLower.includes(optVal)) {
            matchedIndex = i;
            break;
          }
        }
        // Fallback crop word matching (paddy, cotton, sugarcane, maize, groundnut, vegetable, fertilizer, cluster)
        if (matchedIndex === -1) {
          const keywords = ['paddy', 'cotton', 'sugarcane', 'maize', 'groundnut', 'vegetable', 'fertilizer', 'large', 'cluster'];
          const matchedKw = keywords.find(k => pLower.includes(k));
          if (matchedKw) {
            for (let i = 0; i < serviceSelect.options.length; i++) {
              if (serviceSelect.options[i].text.toLowerCase().includes(matchedKw)) {
                matchedIndex = i;
                break;
              }
            }
          }
        }
      }
      if (matchedIndex !== -1) {
        serviceSelect.selectedIndex = matchedIndex;
      }
    }

    if (paramCrop && cropSelect) {
      const cLower = paramCrop.toLowerCase().trim();
      for (let i = 0; i < cropSelect.options.length; i++) {
        const optText = cropSelect.options[i].text.toLowerCase();
        const optVal = cropSelect.options[i].value.toLowerCase();
        if (optText.includes(cLower) || cLower.includes(optText) || optVal === cLower) {
          cropSelect.selectedIndex = i;
          break;
        }
      }
    }

    if (paramAcres && acreageInput) {
      acreageInput.value = paramAcres;
    }

    if (paramUnit && unitSelect) {
      unitSelect.value = paramUnit;
    }

    // Prefill authenticated user contact info
    try {
      const getActiveUser = () => {
        if (window.AgroAuth && typeof window.AgroAuth.getUser === 'function') {
          const u = window.AgroAuth.getUser();
          if (u) return u;
        }
        try {
          const s = JSON.parse(sessionStorage.getItem('agro_session') || localStorage.getItem('agro_session'));
          if (!s || !s.email) return null;
          const us = JSON.parse(localStorage.getItem('agro_users') || '[]');
          return us.find(u => u.email.toLowerCase() === s.email.toLowerCase()) || { name: s.name, email: s.email };
        } catch {
          return null;
        }
      };
      const activeUser = getActiveUser();
      if (activeUser) {
        if (nameInput && !nameInput.value) nameInput.value = activeUser.name || '';
        if (mobileInput && !mobileInput.value && activeUser.mobile) mobileInput.value = activeUser.mobile || '';
        if (emailInput && !emailInput.value && activeUser.email) emailInput.value = activeUser.email || '';
        if (locationInput && !locationInput.value && activeUser.location) locationInput.value = activeUser.location || '';
      }
    } catch (e) {}

    // Set minimum date to tomorrow
    if (dateInput) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dateInput.min = tomorrow.toISOString().slice(0, 10);
      if (!dateInput.value) {
        dateInput.value = tomorrow.toISOString().slice(0, 10);
      }
    }

    // Real-time Cost Estimation
    const calculateEstimate = () => {
      const rawAcres = Math.max(1, parseFloat(acreageInput ? acreageInput.value : 1) || 1);
      const unit = unitSelect ? unitSelect.value : 'Acres';
      const mult = UNIT_MULTIPLIERS[unit] || 1.0;
      const normalizedAcres = parseFloat((rawAcres * mult).toFixed(2));

      const selectedOptionText = serviceSelect && serviceSelect.options[serviceSelect.selectedIndex] 
        ? serviceSelect.options[serviceSelect.selectedIndex].text 
        : 'Paddy Spraying';

      let ratePerAcre = 450;
      for (const [key, rate] of Object.entries(SERVICE_RATES)) {
        if (selectedOptionText.includes(key)) {
          ratePerAcre = rate;
          break;
        }
      }

      const subtotal = Math.round(normalizedAcres * ratePerAcre);
      const gst = Math.round(subtotal * 0.05); // 5% GST
      const totalAmount = subtotal + gst;

      // Estimated flight duration (~6 minutes per acre for standard hexacopter)
      const flightMinutes = Math.round(normalizedAcres * 6);
      const waterSaved = Math.round(normalizedAcres * 180); // ~180 Litres saved vs manual sprayers

      if (summaryBox) {
        summaryBox.innerHTML = `
          <div class="sumrow"><span class="text-secondary fw-semibold">Acreage Coverage:</span><strong class="font-monospace text-body text-end">${rawAcres} ${unit} (${normalizedAcres} Acres)</strong></div>
          <div class="sumrow"><span class="text-secondary fw-semibold">Base Service Rate:</span><strong class="font-monospace text-body text-end">${formatINR(ratePerAcre)} / acre</strong></div>
          <div class="sumrow"><span class="text-secondary fw-semibold">Estimated Subtotal:</span><strong class="font-monospace text-body text-end">${formatINR(subtotal)}</strong></div>
          <div class="sumrow"><span class="text-secondary fw-semibold">Agri GST (5%):</span><strong class="font-monospace text-body text-end">${formatINR(gst)}</strong></div>
          <div class="sumrow t"><span class="text-body fw-bold">Total Estimated Cost:</span><strong class="text-agro fs-4 font-monospace text-end">${formatINR(totalAmount)}</strong></div>
          <hr class="my-2">
          <div class="d-flex justify-content-between small text-muted flex-wrap gap-2">
            <span><i class="bi bi-clock-history me-1 text-agro"></i>Flight Duration: ~${flightMinutes} mins</span>
            <span><i class="bi bi-droplet-half me-1 text-primary"></i>Water Saved: ~${waterSaved}L</span>
          </div>
        `;
      }

      return {
        rawAcres,
        normalizedAcres,
        unit,
        ratePerAcre,
        subtotal,
        gst,
        totalAmount,
        serviceName: selectedOptionText.split('–')[0].trim()
      };
    };

    if (acreageInput) acreageInput.addEventListener('input', calculateEstimate);
    if (unitSelect) unitSelect.addEventListener('change', calculateEstimate);
    if (serviceSelect) serviceSelect.addEventListener('change', calculateEstimate);

    calculateEstimate();

    // Form Submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (window.AgroValidator && !window.AgroValidator.validateForm(form)) {
        return;
      }

      const estimate = calculateEstimate();
      let bookings = [];
      const activeUser = (window.AgroAuth && typeof window.AgroAuth.getUser === 'function') ? window.AgroAuth.getUser() : null;
      const targetStorageKey = (activeUser && activeUser.email) ? ('agro_bookings_' + activeUser.email.toLowerCase()) : GUEST_BOOKINGS_KEY;
      try {
        bookings = JSON.parse(localStorage.getItem(targetStorageKey)) || [];
      } catch {
        bookings = [];
      }

      // Generate next Booking ID
      const maxNum = bookings.reduce((max, b) => {
        const idNum = parseInt((b.id || '').replace('AF-', ''), 10);
        return isNaN(idNum) ? max : Math.max(max, idNum);
      }, 9850);
      const newId = 'AF-' + (maxNum + 1);

      const newBooking = {
        id: newId,
        name: nameInput && nameInput.value.trim() ? nameInput.value.trim() : (activeUser ? activeUser.name : 'Guest Farmer'),
        mobile: mobileInput && mobileInput.value.trim() ? mobileInput.value.trim() : (activeUser && activeUser.mobile ? activeUser.mobile : ''),
        email: emailInput && emailInput.value.trim() ? emailInput.value.trim() : (activeUser && activeUser.email ? activeUser.email : ''),
        location: locationInput ? locationInput.value.trim() : 'Farm Plot',
        crop: cropSelect ? cropSelect.value : 'Paddy',
        acres: estimate.rawAcres,
        unit: estimate.unit,
        svc: estimate.serviceName,
        date: dateInput ? dateInput.value : new Date().toISOString().slice(0, 10),
        slot: slotSelect ? slotSelect.value : 'Morning (6:00 AM – 9:00 AM)',
        notes: notesInput ? notesInput.value.trim() : '',
        amount: estimate.totalAmount,
        status: 'Pending',
        created: new Date().toISOString().slice(0, 10)
      };

      // Prepend so the newest booking is on top
      bookings.unshift(newBooking);
      localStorage.setItem(targetStorageKey, JSON.stringify(bookings));

      // Professional Confirmation Modal (No redirect!)
      if (window.AgroUI && window.AgroUI.showModal) {
        window.AgroUI.showModal(
          'Booking Request Submitted Successfully!',
          `
            <div class="text-center py-2">
              <div class="display-5 text-success mb-2"><i class="bi bi-check-circle-fill"></i></div>
              <h4 class="fw-bold mb-1">Booking Confirmed: <span class="text-agro font-monospace">${newBooking.id}</span></h4>
              <p class="text-muted">We have scheduled your drone spraying request. Our flight operations coordinator will review your plot coordinates.</p>
              
              <div class="p-3 bg-light rounded-3 text-start small mb-3 border">
                <div class="row g-2">
                  <div class="col-6"><strong>Farmer Name:</strong> ${newBooking.name}</div>
                  <div class="col-6"><strong>Mobile Number:</strong> ${newBooking.mobile}</div>
                  <div class="col-6"><strong>Crop Type:</strong> ${newBooking.crop}</div>
                  <div class="col-6"><strong>Acreage:</strong> ${newBooking.acres} ${newBooking.unit}</div>
                  <div class="col-6"><strong>Scheduled Date:</strong> ${newBooking.date}</div>
                  <div class="col-6"><strong>Time Window:</strong> ${newBooking.slot}</div>
                  <div class="col-12 mt-2 pt-2 border-top">
                    <strong>Estimated Total:</strong> <span class="text-agro fw-bold fs-6">${formatINR(newBooking.amount)}</span> (incl. 5% GST)
                  </div>
                </div>
              </div>
              <p class="small text-muted mb-0"><i class="bi bi-info-circle me-1"></i>You can monitor live pilot assignment and flight status at any time using the Track Service option.</p>
            </div>
          `,
          `
            <a class="btn btn-agro" href="tracking.html?id=${newBooking.id}">
              <i class="bi bi-geo-alt"></i> Track This Booking
            </a>
            <a class="btn btn-outline-agro" href="bookings.html">
              <i class="bi bi-card-checklist"></i> View in My Requests
            </a>
          `
        );
      } else {
        alert(`Booking request ${newBooking.id} created successfully!`);
      }

      // Reset requirements and recalculate
      if (notesInput) notesInput.value = '';
      calculateEstimate();
    });
  };

  document.addEventListener('DOMContentLoaded', setupBookingForm);

  window.AgroBooking = {
    setup: setupBookingForm
  };
})();
