(() => {
const $ = s => document.querySelector(s);
const KEY = 'partysheet.v1';
let B = JSON.parse(localStorage.getItem(KEY) || '[]');
let mode = 'day';
const save = () => localStorage.setItem(KEY, JSON.stringify(B));
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const iso = d => d.toISOString().slice(0,10);
const money = n => '$' + Number(n).toFixed(0);
// A booking is ready when deposit is fully paid and the waiver is signed. Balance is due on the day.
const ready = b => b.depPaid >= b.dep && b.waiver;
function render(){
  const day = $('#day').value;
  const list = (mode === 'day' ? B.filter(b => b.date === day) : B.filter(b => b.date >= iso(new Date()))).sort((a,b) => (a.date + a.time).localeCompare(b.date + b.time));
  const guests = list.reduce((s,b) => s + (b.actual ?? b.exp), 0), due = list.reduce((s,b) => s + Math.max(b.price - b.depPaid - (b.balPaid||0), 0), 0);
  $('#sum').innerHTML = `<div><b>${list.length}</b>bookings</div><div><b>${guests}</b>guests</div><div><b>${money(due)}</b>still to collect</div>`;
  $('#list').innerHTML = list.length ? list.map(b => {
    const balance = Math.max(b.price - b.depPaid - (b.balPaid||0), 0);
    return `<div class="card" data-b="${b.id}"><h2>${esc(b.host)} <span class="pill ${ready(b) ? 'ok' : 'no'}">${ready(b) ? 'Ready' : 'Action needed'}</span></h2>
      <div class="hint">${b.date} at ${b.time} · package ${money(b.price)}</div>
      <div class="pb"><b>Deposit</b> <span class="pill ${b.depPaid >= b.dep ? 'ok' : b.depPaid > 0 ? 'part' : 'no'}">${money(b.depPaid)} of ${money(b.dep)}</span>
        <div class="row"><input type="number" min="0" placeholder="amount" data-pay><button data-dep>Record deposit</button></div></div>
      <div class="pb"><b>Waiver</b> <span class="pill ${b.waiver ? 'ok' : 'no'}">${b.waiver ? 'Signed' : 'Missing'}</span>
        <div class="row"><button data-waiver>${b.waiver ? 'Mark unsigned' : 'Mark signed'}</button></div></div>
      <div class="pb"><b>Headcount</b> expected ${b.exp}${b.actual != null ? `, confirmed ${b.actual}` : ', not confirmed'}
        <div class="row"><input type="number" min="0" data-hc value="${b.actual ?? ''}" placeholder="final"><button data-hcset>Confirm</button></div></div>
      <div class="pb"><b>Balance on the day</b> ${money(balance)}
        <div class="row"><button data-bal ${balance ? '' : 'disabled'}>Mark balance paid</button><button data-del class="noprint">Delete booking</button></div></div></div>`;
  }).join('') : '<div class="card hint">No bookings for this view.</div>';
}
$('#f').addEventListener('submit', e => { e.preventDefault();
  B.push({id: Date.now(), host: $('#host').value.trim(), date: $('#date').value, time: $('#time').value, price: +$('#price').value, dep: +$('#dep').value, depPaid: 0, balPaid: 0, exp: +$('#exp').value, actual: null, waiver: false});
  save(); $('#day').value = $('#date').value; mode = 'day'; e.target.reset(); render(); });
$('#list').addEventListener('click', e => {
  const card = e.target.closest('[data-b]'); if (!card) return; const b = B.find(x => x.id == card.dataset.b);
  if (e.target.matches('[data-dep]')) { const v = +card.querySelector('[data-pay]').value; if (v > 0) b.depPaid += v; }
  if (e.target.matches('[data-waiver]')) b.waiver = !b.waiver;
  if (e.target.matches('[data-hcset]')) { const v = card.querySelector('[data-hc]').value; b.actual = v === '' ? null : +v; }
  if (e.target.matches('[data-bal]')) b.balPaid = b.price - b.depPaid;
  if (e.target.matches('[data-del]') && !confirm('Delete this booking?')) return; else if (e.target.matches('[data-del]')) B = B.filter(x => x !== b);
  save(); render(); });
$('#day').onchange = () => { mode = 'day'; render(); };
$('#all').onclick = () => { mode = 'all'; render(); };
$('#print').onclick = () => window.print();
$('#day').value = iso(new Date()); render();
})();
