/**
 * Ereny Shehata — Developer Portfolio Scripts
 * Vanilla JavaScript (No Frameworks, No Dependencies)
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. Theme Toggle (Dark Mode Default + LocalStorage Persistence)
  // -------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // Retrieve saved preference or default to 'dark'
  const savedTheme = localStorage.getItem('esb-portfolio-theme') || 'dark';
  setTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    });
  }

  function setTheme(theme) {
    if (theme === 'light') {
      htmlRoot.setAttribute('data-theme', 'light');
      localStorage.setItem('esb-portfolio-theme', 'light');
      if (themeToggleBtn) {
        themeToggleBtn.setAttribute('aria-label', 'Switch to dark theme');
      }
    } else {
      htmlRoot.removeAttribute('data-theme'); // default is dark via :root
      localStorage.setItem('esb-portfolio-theme', 'dark');
      if (themeToggleBtn) {
        themeToggleBtn.setAttribute('aria-label', 'Switch to light theme');
      }
    }
  }

  // -------------------------------------------------------------------------
  // 2. Sticky Header Elevation on Scroll
  // -------------------------------------------------------------------------
  const header = document.querySelector('.header');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY || window.pageYOffset;
    
    // Header elevation
    if (header) {
      if (scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollY > 500) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.pointerEvents = 'auto';
      } else {
        backToTopBtn.style.opacity = '0.5';
      }
    }
  }, { passive: true });

  // -------------------------------------------------------------------------
  // 3. Mobile Navigation Drawer & Hamburger Toggle
  // -------------------------------------------------------------------------
  const hamburger = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close menu when clicking on any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Close menu when pressing Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        closeMobileMenu();
      }
    });

    // Close menu if clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && 
          !navMenu.contains(e.target) && 
          !hamburger.contains(e.target)) {
        closeMobileMenu();
      }
    });
  }

  function openMobileMenu() {
    navMenu.classList.add('open');
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeMobileMenu() {
    navMenu.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  // -------------------------------------------------------------------------
  // 4. Active Navigation Link Spy
  // -------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    const scrollY = window.pageYOffset + 120;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop;
      const sectionId = section.getAttribute('id');
      const matchingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (matchingLink) {
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          navLinks.forEach(l => l.classList.remove('active'));
          matchingLink.classList.add('active');
        }
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // -------------------------------------------------------------------------
  // 5. Scroll Reveal Animations (IntersectionObserver)
  // -------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver is not available
    revealElements.forEach(el => el.classList.add('active'));
  }

  // -------------------------------------------------------------------------
  // 6. Interactive Hero Code Window Tabs
  // -------------------------------------------------------------------------
  const ideTabs = document.querySelectorAll('.ide-tab');
  const idePanes = document.querySelectorAll('.ide-pane');

  ideTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetPaneId = tab.getAttribute('data-target');
      
      ideTabs.forEach(t => t.classList.remove('active'));
      idePanes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const activePane = document.getElementById(targetPaneId);
      if (activePane) {
        activePane.classList.add('active');
      }
    });
  });

  // -------------------------------------------------------------------------
  // 7. Numerical Achievements Count-Up Animation
  // -------------------------------------------------------------------------
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsCounted = false;

  function runStatsCounter() {
    if (statsCounted) return;

    statNumbers.forEach(stat => {
      const target = parseFloat(stat.getAttribute('data-count'));
      const format = stat.getAttribute('data-format') || '';
      
      if (isNaN(target)) return;

      const duration = 1800; // ms
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        const currentVal = target * ease;

        if (format === 'decimal') {
          stat.textContent = currentVal.toFixed(2) + ' / 4.00';
        } else if (format === 'plus') {
          stat.textContent = Math.floor(currentVal) + '+';
        } else if (format === 'times') {
          stat.textContent = Math.floor(currentVal) + '×';
        } else {
          stat.textContent = Math.floor(currentVal);
        }

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      }

      requestAnimationFrame(updateCounter);
    });

    statsCounted = true;
  }

  const achievementsSection = document.getElementById('achievements');
  if (achievementsSection && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runStatsCounter();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    statsObserver.observe(achievementsSection);
  }

  // // -------------------------------------------------------------------------
  // // 8. Contact Form Interaction & Client Feedback
  // // -------------------------------------------------------------------------
  // const contactForm = document.getElementById('portfolio-contact-form');
  // const formStatus = document.getElementById('form-status');

  // if (contactForm && formStatus) {
  //   contactForm.addEventListener('submit', (e) => {
  //     e.preventDefault();
      
  //     const nameInput = document.getElementById('sender-name');
  //     const emailInput = document.getElementById('sender-email');
  //     const submitBtn = contactForm.querySelector('button[type="submit"]');

  //     if (!contactForm.checkValidity()) {
  //       contactForm.reportValidity();
  //       return;
  //     }

  //     // Visual feedback
  //     const originalBtnHtml = submitBtn.innerHTML;
  //     submitBtn.disabled = true;
  //     submitBtn.innerHTML = 'Sending...';

  //     setTimeout(() => {
  //       formStatus.className = 'form-status success';
  //       formStatus.textContent = `Thank you, ${nameInput.value.trim() || 'friend'}! Your message has been prepared. I will get back to you promptly.`;
  //       contactForm.reset();
  //       submitBtn.disabled = false;
  //       submitBtn.innerHTML = originalBtnHtml;

  //       setTimeout(() => {
  //         formStatus.style.display = 'none';
  //       }, 6000);
  //     }, 700);
  //   });
  // }

  
// -------------------------------------------------------------------------
// 8. Contact Form - EmailJS
// -------------------------------------------------------------------------

const contactForm = document.getElementById('portfolio-contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm && formStatus) {

  // Initialize EmailJS
  emailjs.init({
    publicKey: 'YxnZf5fzGdhJgWfsR'
  });

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('sender-name');
    const emailInput = document.getElementById('sender-email');
    const subjectInput = document.getElementById('msg-subject');
    const messageInput = document.getElementById('msg-content');
    const submitBtn = contactForm.querySelector('button[type="submit"]');

    // Validate form
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    // Save original button content
    const originalBtnHtml = submitBtn.innerHTML;

    // Disable button while sending
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending...';

    // Hide previous status
    formStatus.style.display = 'none';
    formStatus.className = 'form-status';

    // Data sent to EmailJS template
    const templateParams = {
      from_name: nameInput.value.trim(),
      reply_to: emailInput.value.trim(),
      subject: subjectInput.value.trim(),
      message: messageInput.value.trim()
    };

    try {
      // Send email through EmailJS
      await emailjs.send(
        'service_m86c6pd',
        'template_flucpvd',
        templateParams
      );

      // Success message
      formStatus.style.display = 'block';
      formStatus.className = 'form-status success';
      formStatus.textContent =
        `Thank you, ${nameInput.value.trim() || 'friend'}! Your message has been sent successfully. I will get back to you soon.`;

      // Clear form
      contactForm.reset();

    } catch (error) {

      // Error message
      console.error('EmailJS Error:', error);

      formStatus.style.display = 'block';
      formStatus.className = 'form-status error';
      formStatus.textContent =
        'Sorry, something went wrong. Please try again later or contact me directly by email.';

    } finally {

      // Enable button again
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHtml;
    }
  });
}
  // -------------------------------------------------------------------------
  // 9. Smooth Scroll for Back to Top
  // -------------------------------------------------------------------------
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
