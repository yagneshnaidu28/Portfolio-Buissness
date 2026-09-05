/**
 * ==========================================================================
 * MALLARAPU GURUNADHA NAIDU - Main JavaScript Controller
 * Interactivity: Live Search Filter, Modal Lightbox, Mobile Nav, Scroll Bar
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

  // 3. Mobile Navigation Drawer
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

  // 4. Modal Lightbox
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

  // 5. Contact Form WhatsApp Handler
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

// 6. Global Filter Function for Search Inputs
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
