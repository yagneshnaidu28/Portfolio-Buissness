/**
 * ==========================================================================
 * MALLARAPU GURUNADHA NAIDU - Main JavaScript Controller
 * Interactivity: Themes, Live Filter, Modal Lightbox, Estimator, Mobile Nav
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Current Year
  const yearElem = document.getElementById('current-year');
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear();
  }

  // 2. Scroll Progress Bar & Back-to-Top Button
  const progressBar = document.getElementById('scroll-progress');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    
    if (progressBar) {
      progressBar.style.width = scrolled + '%';
    }

    if (backToTopBtn) {
      if (winScroll > 380) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 3. Theme Toggle (Dark / Light) with LocalStorage
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const savedTheme = localStorage.getItem('naidu-theme') || 'dark';

  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      if (themeIcon) {
        themeIcon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
      }
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (themeIcon) {
        themeIcon.innerHTML = `
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        `;
      }
    }
    localStorage.setItem('naidu-theme', theme);
  }

  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      applyTheme(isLight ? 'dark' : 'light');
    });
  }

  // 4. Mobile Navigation Drawer
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    });

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        mobileMenu.setAttribute('aria-hidden', 'true');
      });
    });
  }

  // 5. Modal Lightbox
  const plantModal = document.getElementById('plant-modal');
  const modalCloseBtn = document.getElementById('modal-close');
  const modalImg = document.getElementById('modal-img');
  const modalBadge = document.getElementById('modal-badge');
  const modalTitle = document.getElementById('modal-title');
  const modalBotanical = document.getElementById('modal-botanical');
  const modalDesc = document.getElementById('modal-desc');
  const modalCare = document.getElementById('modal-care');
  const modalWaBtn = document.getElementById('modal-wa-btn');

  function openModalWithCard(card) {
    const img = card.getAttribute('data-img') || '';
    const title = card.getAttribute('data-title') || '';
    const botanical = card.getAttribute('data-botanical') || '';
    const desc = card.getAttribute('data-desc') || '';
    const care = card.getAttribute('data-care') || '';

    if (modalImg) {
      modalImg.src = img;
      modalImg.alt = title;
    }
    if (modalTitle) modalTitle.textContent = title;
    if (modalBotanical) modalBotanical.textContent = botanical;
    if (modalDesc) modalDesc.textContent = desc;
    if (modalCare) modalCare.textContent = care;

    const badgeElem = card.querySelector('.plant-badge-overlay');
    if (modalBadge) {
      modalBadge.textContent = badgeElem ? badgeElem.textContent : 'Certified Nursery Plant';
    }

    if (modalWaBtn) {
      const waText = encodeURIComponent(`Hello Mr. Naidu, I am inquiring about ${title} (${botanical}). Please provide pricing, age of saplings, and delivery schedule to my farm.`);
      modalWaBtn.href = `https://wa.me/919898418582?text=${waText}`;
    }

    if (plantModal) {
      plantModal.classList.add('open');
      plantModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (plantModal) {
      plantModal.classList.remove('open');
      plantModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  document.querySelectorAll('.plant-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.card-wa-icon-btn')) return;
      openModalWithCard(card);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModalWithCard(card);
      }
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (plantModal) {
    plantModal.addEventListener('click', (e) => {
      if (e.target === plantModal) {
        closeModal();
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && plantModal && plantModal.classList.contains('open')) {
      closeModal();
    }
  });

  // 6. Dynamic Cost Estimator Calculation
  window.calculateEstimate = function() {
    const landSizeSelect = document.getElementById('est-land-size');
    const fruitTypeSelect = document.getElementById('est-fruit-type');
    const boundaryPalmsSelect = document.getElementById('est-boundary-palms');
    const fencingTypeSelect = document.getElementById('est-fencing-type');

    if (!landSizeSelect) return;

    const vigha = parseFloat(landSizeSelect.value) || 3;
    const fruit = fruitTypeSelect ? fruitTypeSelect.value : 'kesar';
    const palms = boundaryPalmsSelect ? boundaryPalmsSelect.value : 'malaysian-coconut';
    const fence = fencingTypeSelect ? fencingTypeSelect.value : 'chainlink';

    // Base fruit plantation cost per vigha (plants + digging + organic manuring)
    let fruitCostPerVigha = 28000;
    if (fruit === 'miyazaki') fruitCostPerVigha = 65000;
    if (fruit === 'guava') fruitCostPerVigha = 22000;
    if (fruit === 'mixed') fruitCostPerVigha = 35000;

    // Perimeter palm trees
    let palmCost = 0;
    if (palms === 'malaysian-coconut') palmCost = vigha * 18000;
    if (palms === 'foxtail-palms') palmCost = vigha * 32000;
    if (palms === 'areca-palms') palmCost = vigha * 25000;

    // Boundary perimeter (approx 380-420 RFT per Vigha)
    let fenceCost = 0;
    const rft = Math.round(Math.sqrt(vigha) * 380);
    if (fence === 'chainlink') fenceCost = rft * 140;
    if (fence === 'solar') fenceCost = rft * 95 + 25000;
    if (fence === 'combo') fenceCost = rft * 210 + 25000;
    if (fence === 'rcc-wall') fenceCost = rft * 420;

    const subtotalMin = Math.round((fruitCostPerVigha * vigha + palmCost + fenceCost) * 0.95);
    const subtotalMax = Math.round((fruitCostPerVigha * vigha + palmCost + fenceCost) * 1.15);

    const formatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
    const outputElem = document.getElementById('estimate-output-val');
    if (outputElem) {
      outputElem.textContent = `${formatter.format(subtotalMin)} - ${formatter.format(subtotalMax)}`;
    }

    // Update WhatsApp direct quote button
    const waBtn = document.getElementById('estimator-wa-btn');
    if (waBtn) {
      const waMsg = encodeURIComponent(`Hello Mr. Naidu, I calculated an estimate for ${vigha} Vigha land (Fruit: ${fruit}, Palms: ${palms}, Fencing: ${fence}). Estimated budget: ${formatter.format(subtotalMin)} - ${formatter.format(subtotalMax)}. Please provide an itemized official quotation.`);
      waBtn.href = `https://wa.me/919898418582?text=${waMsg}`;
    }
  };

  // Initial calculation
  window.calculateEstimate();

  // 7. Contact Form WhatsApp Handler
  window.handleFormSubmit = function(e) {
    e.preventDefault();
    const name = document.getElementById('inq-name')?.value || '';
    const phone = document.getElementById('inq-phone')?.value || '';
    const service = document.getElementById('inq-service')?.value || '';
    const msg = document.getElementById('inq-msg')?.value || '';

    const text = encodeURIComponent(`*New Farm Portfolio Inquiry*\n*Name:* ${name}\n*Phone:* ${phone}\n*Service:* ${service}\n*Details:* ${msg}`);
    window.open(`https://wa.me/919898418582?text=${text}`, '_blank');
  };
});

// 8. Global Filter Function for Search Inputs
window.filterCatalog = function(inputElem, gridId) {
  const term = (inputElem.value || '').toLowerCase().trim();
  const grid = document.getElementById(gridId);
  if (!grid) return;

  const cards = grid.querySelectorAll('.plant-card');
  let visibleCount = 0;

  cards.forEach(card => {
    const searchData = (card.getAttribute('data-search') || '').toLowerCase();
    if (searchData.includes(term) || term === '') {
      card.style.display = 'flex';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  const counterElem = document.getElementById(gridId + '-count');
  if (counterElem) {
    counterElem.textContent = visibleCount;
  }
};
