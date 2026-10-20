/* Caring Companions Virtual Caregiving: price builder + "Get started" form. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };

  /* RATES ARE MIRRORED FROM mo-care.com/hometogether (price per visit by
     visit length, then visits a day). If a price changes there it has to
     change here too, or the two sites quote a family different numbers. */
  var RATES = { 15: { 1: 15, 2: 13, 3: 12 }, 30: { 1: 25, 2: 22, 3: 20 } };
  var HINTS = { 1: 'One visit a day, morning or evening.', 2: 'Morning and evening pills. What most families pick.', 3: 'Morning, afternoon and bedtime.' };
  var plan = { freq: 2, len: 15 };

  function renderPrice() {
    if (!$('b-price')) return;
    var per = RATES[plan.len][plan.freq];
    $('b-price').innerHTML = '$' + (per * plan.freq * 5) + '<small> / week</small>';
    $('b-per').textContent = '$' + per + ' per visit, ' + plan.freq + ' a day';
    $('b-hint').textContent = HINTS[plan.freq];
  }
  Array.prototype.forEach.call(document.querySelectorAll('.seg[data-key]'), function (group) {
    var key = group.getAttribute('data-key');
    var btns = group.querySelectorAll('button');
    Array.prototype.forEach.call(btns, function (b) {
      b.addEventListener('click', function () {
        plan[key] = parseInt(b.getAttribute('data-v'), 10);
        Array.prototype.forEach.call(btns, function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        renderPrice();
        // carry the pick into the form so the family doesn't answer twice
        if (key === 'freq' && $('f-freq')) $('f-freq').value = String(plan.freq);
        if (key === 'len' && $('f-len')) $('f-len').value = plan.len + ' minutes';
      });
    });
  });
  renderPrice();

  /* Same door as every mo-care.com form: the shared hub's lead-intake Edge
     Function. Each submission becomes a CC Hub lead (source "Website").
     It can only create leads, never read them. */
  var LEAD_ENDPOINT =
    'https://zngsgedlsxinbygwmxwn.supabase.co/functions/v1/lead-intake?token=cclead_b36832b06f2bb8d58b7d6302';

  var form = $('start-form');
  if (!form) return;
  var status = $('form-status');

  function showError(msg) {
    status.hidden = false;
    status.className = 'form-status err';
    status.textContent = msg;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = new FormData(form);
    var name = (f.get('name') || '').trim();
    var phone = (f.get('phone') || '').trim();
    var email = (f.get('email') || '').trim();
    if (!name) { showError('Please tell us your name.'); $('f-name').focus(); return; }
    if (!phone && !email) { showError('Please give us a phone number or an email so we can reach you.'); $('f-phone').focus(); return; }

    var windows = f.getAll('windows');
    var lines = [
      'VIRTUAL CAREGIVING inquiry from the Virtual Caregiving website.',
      'Parent: ' + ((f.get('parent') || '').trim() || 'not given') + ', lives in ' + ((f.get('where') || '').trim() || 'not given'),
      'Visits: ' + f.get('freq') + ' a day, ' + f.get('len'),
      'Good times: ' + (windows.length ? windows.join(', ') : 'not given'),
      'Set time needed: ' + ((f.get('settime') || '').trim() || 'no'),
      (f.get('note') || '').trim() ? 'Their note: ' + f.get('note').trim() : ''
    ].filter(Boolean);

    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true; btn.textContent = 'Sending...';
    status.hidden = true;

    fetch(LEAD_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.slice(0, 120),
        phone: phone.slice(0, 40),
        email: email.slice(0, 200),
        care_for: 'Virtual Caregiving',
        message: lines.join('\n').slice(0, 2000)
      })
    }).then(function (res) {
      if (!res.ok) throw new Error('lead-intake HTTP ' + res.status);
      form.hidden = true;
      $('form-done').hidden = false;
    }).catch(function () {
      btn.disabled = false; btn.textContent = 'Ask us to call me';
      showError('Sorry, that didn’t go through. Please try again, or call us at (417) 234-8494.');
    });
  });
})();
