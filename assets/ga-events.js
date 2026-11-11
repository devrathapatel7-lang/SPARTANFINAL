/* Sends phone_click to Google Analytics on every tap of a tel: link. */
document.addEventListener('click', function (e) {
  var a = e.target && e.target.closest ? e.target.closest('a[href^="tel:"]') : null;
  if (a && window.gtag) gtag('event', 'phone_click', { link_url: a.getAttribute('href'), page_path: location.pathname });
}, true);
