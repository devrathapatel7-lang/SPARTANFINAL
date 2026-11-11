/* Copies every website lead into Spartan's CRM, the same as the old site did. Never blocks the form. */
document.addEventListener('submit', function (e) {
  var f = e.target;
  if (!f || !f.action || f.action.indexOf('formsubmit.co') < 0) return;
  try { if (window.gtag) gtag('event', 'generate_lead', { form_page: location.pathname, transport_type: 'beacon' }); } catch (err) {}
  try {
    var d = new FormData(f), name = String(d.get('name') || '').trim(), i = name.indexOf(' ');
    fetch('https://spartan-crm-beta.vercel.app/api/lead', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, keepalive: true,
      body: JSON.stringify({
        'First Name': i > 0 ? name.slice(0, i) : name,
        'Last Name': i > 0 ? name.slice(i + 1) : '',
        'Phone': d.get('phone') || '',
        'Property Address': d.get('address') || '',
        'What They Want Done': d.get('message') || '',
        'Source Page': 'Spartan Roofing website: ' + (d.get('source') || location.pathname),
        '_honey': d.get('_honey') || ''
      })
    }).catch(function () {});
  } catch (err) {}
}, true);
