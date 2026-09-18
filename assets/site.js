/* =============================================================
   Shared prototype behaviour for ALL UX design variants.
   Referenced from each variant folder as:  <script src="../assets/site.js"></script>
   - mobile menu toggle (.burger -> .links.open)
   - highlights the nav link for the current page
   - demo form submit (the UX prototype has no backend)
   ============================================================= */
(function () {
  var burger = document.querySelector('.burger');
  var links = document.querySelector('.links');
  if (burger && links) {
    burger.addEventListener('click', function () {
      links.classList.toggle('open');
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') links.classList.remove('open');
    });
  }

  var here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.links a, .site-foot a, .crumbs a').forEach(function (a) {
    var target = (a.getAttribute('href') || '').split('#')[0].toLowerCase();
    if (target && target === here) a.classList.add('on');
  });

  document.querySelectorAll('form[data-demo]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = form.querySelector('.form-ok');
      if (ok) ok.style.display = 'block';
      form.reset();
    });
  });
})();