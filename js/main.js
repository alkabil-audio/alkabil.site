// ALKABIL.audio — small site helpers

// Mobile menu toggle
(function () {
  var burger = document.querySelector('.burger');
  if (!burger) return;
  burger.addEventListener('click', function () {
    var open = document.body.classList.toggle('menu-open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
})();

// Newsletter form: submit in the background, then show the thank-you note
(function () {
  var box = document.querySelector('.newsletter');
  if (!box) return;
  var form = box.querySelector('form');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var data = new URLSearchParams(new FormData(form));
    fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: data })
      .catch(function () { /* static hosting without a form backend — ignore */ })
      .finally(function () { box.classList.add('submitted'); });
  });
})();
