/* ============================================================
   FORTITUDE FABRICS — main.js
   Handles: nav toggle, active link, FAQ accordion,
            product tab, smooth anchor scroll
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. Nav hamburger ── */
  const hamburger = document.getElementById('nav-hamburger');
  const mobileNav = document.getElementById('nav-mobile');
  const menuIcon  = hamburger ? hamburger.querySelector('.material-icons') : null;

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('open');
      if (menuIcon) menuIcon.textContent = open ? 'close' : 'menu';
      hamburger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        if (menuIcon) menuIcon.textContent = 'menu';
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024) {
        mobileNav.classList.remove('open');
        if (menuIcon) menuIcon.textContent = 'menu';
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── 2. Active nav link ── */
  function setActiveNavLink() {
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'index.html';

    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href') || '';
      const linkFile = href.split('/').pop();

      let isActive = false;

      if (filename === '' || filename === 'index.html') {
        isActive = linkFile === 'index.html' || linkFile === '';
      } else {
        isActive = linkFile === filename;
      }

      // For product category/individual pages — highlight Products
      const productPages = [
        'products.html', 'antistatic.html', 'woven.html', 'nonwoven.html', 'uniforms.html',
        'antistatic-coveralls.html','antistatic-head-caps.html','antistatic-shoe-covers.html',
        'antistatic-gloves.html','antistatic-mats.html',
        'woven-coveralls.html','woven-head-caps.html','woven-shoe-covers.html','woven-gloves.html',
        'nonwoven-coveralls.html','nonwoven-head-caps.html','nonwoven-shoe-covers.html',
        'nonwoven-gloves.html','lint-free-cloths.html',
        'uniforms-mens-shirts.html','uniforms-mens-shorts.html','uniforms-mens-pants.html',
        'uniforms-mens-vest-coats.html','uniforms-womens-skirts.html','uniforms-womens-shirts.html',
        'uniforms-womens-vest-coats.html','uniforms-womens-pants.html','uniforms-womens-churidars.html'
      ];
      if (productPages.includes(filename) && linkFile === 'products.html') {
        isActive = true;
      }

      link.classList.toggle('active', isActive);
    });
  }
  setActiveNavLink();

  /* ── 3. FAQ Accordion ── */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = btn.nextElementSibling;
      const isOpen = btn.classList.contains('open');

      // Close all others
      document.querySelectorAll('.faq-question.open').forEach(openBtn => {
        if (openBtn !== btn) {
          openBtn.classList.remove('open');
          const ans = openBtn.nextElementSibling;
          if (ans) ans.style.maxHeight = '0';
        }
      });

      btn.classList.toggle('open', !isOpen);
      if (answer) {
        answer.style.maxHeight = isOpen ? '0' : answer.scrollHeight + 'px';
      }
    });
  });

  // Open first FAQ by default if present
  const firstFaq = document.querySelector('.faq-question');
  if (firstFaq) {
    firstFaq.classList.add('open');
    const firstAnswer = firstFaq.nextElementSibling;
    if (firstAnswer) firstAnswer.style.maxHeight = firstAnswer.scrollHeight + 'px';
  }

  /* ── 4. Product Tab (collapsible, open by default) ── */
  document.querySelectorAll('.product-tab-header').forEach(header => {
    header.addEventListener('click', () => {
      const body = header.nextElementSibling;
      const isCollapsed = header.classList.contains('collapsed');
      header.classList.toggle('collapsed', !isCollapsed);
      if (body) {
        body.style.maxHeight = isCollapsed ? body.scrollHeight + 'px' : '0';
        body.style.overflow = isCollapsed ? 'visible' : 'hidden';
      }
    });

    // Open by default
    const body = header.nextElementSibling;
    if (body) {
      body.style.maxHeight = 'none';
      body.style.overflow = 'visible';
    }
  });

  /* ── 5. Category Jump Nav active on scroll (products.html) ── */
  const jumpLinks = document.querySelectorAll('.cat-jump-link');
  if (jumpLinks.length) {
    const sections = Array.from(jumpLinks).map(link => {
      const id = link.getAttribute('href').replace('#', '');
      return document.getElementById(id);
    }).filter(Boolean);

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          jumpLinks.forEach(link => {
            const id = link.getAttribute('href').replace('#', '');
            link.classList.toggle('active', id === entry.target.id);
          });
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });

    sections.forEach(s => observer.observe(s));
  }

  /* ── 6. Smooth anchor scroll with offset ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 70;
        const extra = document.querySelector('.cat-jump-nav') ? 50 : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - navH - extra - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── 7. Nav scroll shadow ── */
  const siteNav = document.getElementById('site-nav');
  if (siteNav) {
    window.addEventListener('scroll', () => {
      siteNav.style.boxShadow = window.scrollY > 10
        ? '0 4px 20px rgba(0,0,0,0.4)'
        : 'none';
    }, { passive: true });
  }

  /* ── 8. Form Submission Handling ── */
  const contactForm = document.getElementById('enquiry-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span class="material-icons" style="font-size:1rem;">hourglass_empty</span> Sending...';
      submitBtn.disabled = true;

      const formData = {
        name: document.getElementById('cf-name').value,
        company: document.getElementById('cf-company').value,
        email: document.getElementById('cf-email').value,
        phone: document.getElementById('cf-phone')?.value || '',
        product: document.getElementById('cf-product')?.value || '',
        volume: document.getElementById('cf-volume')?.value || '',
        message: document.getElementById('cf-message').value
      };

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (res.ok) {
          document.getElementById('form-container').style.display = 'none';
          const successDiv = document.getElementById('form-success');
          if (successDiv) successDiv.style.display = 'block';
        } else {
          const data = await res.json();
          alert('Error: ' + (data.error || 'Failed to send enquiry.'));
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }
      } catch (err) {
        alert('Network error. Please try again.');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    });
  }

})();
