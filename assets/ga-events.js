/* Sends phone_click to Google Analytics on every tap of a tel: link. */
document.addEventListener('click', function (e) {
  var a = e.target && e.target.closest ? e.target.closest('a[href^="tel:"]') : null;
  if (a && window.gtag) gtag('event', 'phone_click', { link_url: a.getAttribute('href'), page_path: location.pathname });
}, true);
/* Escape closes an open header dropdown (row 119) until the pointer leaves it. */
document.addEventListener('keydown', function (e) {
  if (e.key !== 'Escape') return;
  var open = document.querySelectorAll('header li.has-sub:hover, header li.has-sub:focus-within');
  open.forEach(function (li) { li.classList.add('dd-closed'); li.addEventListener('mouseleave', function () { li.classList.remove('dd-closed'); }, { once: true }); });
  if (document.activeElement && document.activeElement.closest('header')) document.activeElement.blur();
});
