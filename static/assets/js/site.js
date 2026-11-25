// Yaqeen Advisory: small enhancements. The site works without JavaScript; this adds menus, tabs and the contact form.
(function () {
  var doc = document;
  var header = doc.querySelector('.site-header');
  var toggle = doc.querySelector('.menu-toggle');
  var nav = doc.getElementById('primary-nav');

  function closeMenus(except) {
    doc.querySelectorAll('.has-menu').forEach(function (li) {
      if (li !== except) {
        li.classList.remove('open');
        var b = li.querySelector('button');
        if (b) b.setAttribute('aria-expanded', 'false');
      }
    });
  }

  doc.querySelectorAll('.has-menu > button').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var li = btn.parentElement;
      var open = !li.classList.contains('open');
      closeMenus(li);
      li.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      e.stopPropagation();
    });
  });

  doc.addEventListener('click', function (e) {
    if (!e.target.closest('.has-menu')) closeMenus();
  });
  doc.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeMenus();
      if (doc.body.classList.contains('nav-open')) setNav(false);
    }
  });

  function setNav(open) {
    doc.body.classList.toggle('nav-open', open);
    if (toggle) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
  }
  if (toggle) toggle.addEventListener('click', function () { setNav(!doc.body.classList.contains('nav-open')); });
  if (nav) nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setNav(false); }); });

  // Header shadow on scroll
  function onScroll() { if (header) header.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Plan comparison tabs
  var tabs = doc.querySelectorAll('.tabs [role="tab"]');
  if (tabs.length) {
    doc.documentElement.classList.add('js-tabs');
    var show = function (id) {
      tabs.forEach(function (t) {
        var on = t.getAttribute('aria-controls') === id;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      doc.querySelectorAll('.tabpanels .table-wrap').forEach(function (p) { p.hidden = p.id !== id; });
    };
    tabs.forEach(function (t) { t.addEventListener('click', function () { show(t.getAttribute('aria-controls')); }); });
    show(location.hash === '#gcc' ? 'tbl-gcc' : 'tbl-india');
  }

  // Contact form
  var form = doc.getElementById('contact-form');
  if (form) {
    var params = new URLSearchParams(location.search);
    var sel = doc.getElementById('f-service');
    var pre = params.get('service') || params.get('topic');
    if (sel && pre) {
      var found = false;
      Array.prototype.forEach.call(sel.options, function (o) { if (o.value === pre) { sel.value = pre; found = true; } });
      if (!found) {
        // A specific service page was used: pick its parent group if we can guess, otherwise leave as "Not sure yet".
        sel.value = '';
        var msg = form.querySelector('textarea');
        if (msg && !msg.value) msg.value = 'I am interested in: ' + pre.replace(/-/g, ' ') + '.\n\n';
      }
    }
    var status = form.querySelector('.form-status');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      if (data.get('_gotcha')) return;
      var name = (data.get('name') || '').trim();
      var email = (data.get('email') || '').trim();
      if (!name || !/^\S+@\S+\.\S+$/.test(email)) {
        status.className = 'form-status error';
        status.textContent = 'Please enter your name and a valid email address.';
        return;
      }
      var endpoint = form.getAttribute('data-endpoint');
      if (!endpoint) {
        var to = form.getAttribute('data-email');
        var body = 'Name: ' + name + '\nEmail: ' + email + '\nPhone: ' + (data.get('phone') || '') + '\nCompany: ' + (data.get('company') || '') + '\nCountry: ' + (data.get('country') || '') + '\nInterested in: ' + (data.get('service') || '') + '\n\n' + (data.get('message') || '');
        location.href = 'mailto:' + to + '?subject=' + encodeURIComponent('Enquiry from ' + name) + '&body=' + encodeURIComponent(body);
        return;
      }
      var btn = form.querySelector('button[type=submit]');
      btn.disabled = true;
      status.className = 'form-status';
      status.textContent = 'Sending...';
      fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
        .then(function (r) {
          if (!r.ok) throw new Error('bad');
          form.reset();
          status.className = 'form-status ok';
          status.textContent = 'Thank you. We have your message and will reply within 1 working day.';
          if (window.gtag) window.gtag('event', 'generate_lead');
        })
        .catch(function () {
          status.className = 'form-status error';
          status.textContent = 'Sorry, that did not send. Please email us directly instead.';
        })
        .then(function () { btn.disabled = false; });
    });
  }
})();
