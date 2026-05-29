/**
 * nav-footer.js — Injects shared nav and footer into any page
 * Include AFTER the opening <body> tag
 */
(function(){
  const LOGO = 'logo.jpg';
  const navHTML = `
<nav class="site-nav" id="site-nav">
  <div class="nav-container">
    <a href="index.html" class="nav-logo"><img src="${LOGO}" alt="Fortitude Fabrics Logo"></a>
    <nav class="nav-links">
      <a href="index.html" class="nav-link">Home</a>
      <a href="products.html" class="nav-link">Products</a>
      <a href="industries.html" class="nav-link">Industries</a>
      <a href="certifications.html" class="nav-link">Quality</a>
      <a href="about.html" class="nav-link">About</a>
    </nav>
    <a href="contact.html" class="btn btn-primary nav-cta">Contact Us</a>
    <button class="nav-hamburger" id="nav-hamburger" aria-label="Toggle navigation" aria-expanded="false">
      <span class="material-icons">menu</span>
    </button>
  </div>
  <div class="nav-mobile" id="nav-mobile">
    <a href="index.html" class="nav-link">Home</a>
    <a href="products.html" class="nav-link">Products</a>
    <a href="industries.html" class="nav-link">Industries</a>
    <a href="certifications.html" class="nav-link">Quality</a>
    <a href="about.html" class="nav-link">About</a>
    <a href="contact.html" class="btn btn-primary">Contact Us</a>
  </div>
</nav>`;

  const footerHTML = `
<footer class="site-footer" role="contentinfo">
  <div class="footer-grid">
    <div class="footer-col">
      <img class="footer-logo" src="${LOGO}" alt="Fortitude Fabrics">
      <p class="footer-tagline">Technical textiles and industrial workwear precision-engineered in Hyderabad, India for the global market.</p>
    </div>
    <div class="footer-col">
      <h4>Quick Links</h4>
      <nav class="footer-links">
        <a href="index.html">Home</a><a href="products.html">Products</a><a href="industries.html">Industries</a>
        <a href="certifications.html">Quality</a><a href="about.html">About</a><a href="contact.html">Contact Us</a>
      </nav>
    </div>
    <div class="footer-col">
      <h4>Contact HQ</h4>
      <address class="footer-contact" style="font-style:normal;">
        <div class="footer-contact-item"><span class="material-icons">location_on</span><span>Plot 124, Industrial Area Phase II, Hyderabad, Telangana, 500072</span></div>
        <div class="footer-contact-item"><span class="material-icons">call</span><span>+91 40 2300 8899</span></div>
        <div class="footer-contact-item"><span class="material-icons">mail</span><span>inquiry@fortitudefabrics.com</span></div>
      </address>
    </div>
    <div class="footer-col">
      <h4>Compliance</h4>
      <nav class="footer-links"><a href="#">Privacy Policy</a><a href="#">Terms of Service</a><a href="#">Material SDS</a></nav>
    </div>
  </div>
  <div class="footer-bottom">
    <div class="footer-bottom-inner">
      <p class="footer-copy">© 2024 Fortitude Fabrics. TEX-ENGINEERED MANUFACTURING • TECHNICAL PRECISION GUARANTEED</p>
      <div style="display:flex;gap:1rem;">
        <span class="badge badge-cyan">ISO 9001</span>
        <span class="badge badge-green">SGS Audited</span>
      </div>
    </div>
  </div>
</footer>`;

  // Insert nav at top of body
  document.body.insertAdjacentHTML('afterbegin', navHTML);
  // Insert footer before closing body
  document.body.insertAdjacentHTML('beforeend', footerHTML);
})();
