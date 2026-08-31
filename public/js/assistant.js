/* ============================================================
   AURELIA CONCIERGE — premium AI-style guided booking assistant
   - Handles visitors end-to-end (all site assistance is AI-handled)
   - Human contact happens ONLY via WhatsApp / email (yours)
   - Submits requests to your team so YOU quote the cheapest fare
   ============================================================ */
(function () {
  if (document.getElementById('assistantRoot')) return;

  const root = document.createElement('div');
  root.id = 'assistantRoot';
  root.innerHTML = `
    <style>
      #assistantRoot { font-family: ui-sans-serif, system-ui, sans-serif; }
      #asChat { position: fixed; bottom: 24px; left: 24px; z-index: 60; width: min(92vw, 370px); max-height: 72vh;
                display: flex; flex-direction: column; background: rgba(255,255,255,.98); border-radius: 20px;
                box-shadow: 0 30px 80px -20px rgba(7,26,58,.55); border: 1px solid rgba(249,168,38,.4);
                overflow: hidden; backdrop-filter: blur(12px);
                transition: transform .3s cubic-bezier(.2,.9,.3,1.2), opacity .3s; }
      #asChat.closed { transform: translateY(24px) scale(.94); opacity: 0; pointer-events: none; }
      #asHeader { background: linear-gradient(120deg,#071a3a 0%,#0b2b5c 55%,#123a7a 100%); color: #fff; padding: 14px 16px;
                  display: flex; align-items: center; gap: 11px; position: relative; }
      #asHeader::after { content:''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
                         background: linear-gradient(90deg,#f9a826,#fcd34d,#d97706); }
      #asAvatar { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg,#f9a826,#d97706);
                  display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0;
                  box-shadow: 0 0 0 3px rgba(249,168,38,.35); }
      #asClose { margin-left: auto; background: rgba(255,255,255,.12); border: 0; color: #fff; width: 26px; height: 26px;
                 border-radius: 50%; font-size: 13px; cursor: pointer; line-height: 1; }
      #asClose:hover { background: rgba(255,255,255,.25); }
      #asMsg { flex: 1; overflow-y: auto; padding: 14px; background: linear-gradient(180deg,#f8fafc,#f1f5f9);
               display: flex; flex-direction: column; gap: 9px; min-height: 260px; max-height: 46vh; }
      .as-row { display: flex; align-items: flex-end; gap: 7px; animation: asIn .3s ease; }
      @keyframes asIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
      .as-avatar-mini { width: 24px; height: 24px; border-radius: 50%; background: linear-gradient(135deg,#f9a826,#d97706);
                        display: flex; align-items: center; justify-content: center; font-size: 12px; flex-shrink: 0; }
      .as-bot, .as-user { max-width: 82%; padding: 10px 14px; font-size: 13.5px; line-height: 1.5; white-space: pre-wrap; }
      .as-bot { background: #fff; border: 1px solid #e6d9b8; border-left: 3px solid #f9a826; border-radius: 4px 14px 14px 14px;
                align-self: flex-start; color: #1e293b; box-shadow: 0 2px 6px rgba(7,26,58,.06); }
      .as-user { background: linear-gradient(135deg,#0b2b5c,#123a7a); color: #fff; border-radius: 14px 4px 14px 14px;
                 align-self: flex-end; box-shadow: 0 2px 8px rgba(11,43,92,.25); }
      .as-chips { display: flex; flex-wrap: wrap; gap: 6px; padding: 10px 14px 6px; background: #fff; border-top: 1px solid #f1f5f9; }
      .as-chip { border: 1.5px solid #0b2b5c; color: #0b2b5c; background: #fff; font-size: 12px; font-weight: 700;
                 padding: 7px 13px; border-radius: 999px; cursor: pointer; transition: all .18s; }
      .as-chip:hover { background: linear-gradient(90deg,#f9a826,#fcd34d); border-color: #f9a826; color: #0b2b5c;
                       transform: translateY(-1px); box-shadow: 0 4px 10px rgba(249,168,38,.35); }
      #asInputRow { display: flex; gap: 8px; padding: 10px 14px 14px; background: #fff; }
      #asInput { flex: 1; border: 1.5px solid #e2e8f0; border-radius: 999px; padding: 10px 16px; font-size: 13.5px; outline: none;
                 background: #f8fafc; transition: border-color .2s, box-shadow .2s; }
      #asInput:focus { border-color: #f9a826; box-shadow: 0 0 0 3px rgba(249,168,38,.18); background: #fff; }
      #asSend { background: linear-gradient(135deg,#f9a826,#d97706); color: #071a3a; font-weight: 800; border: 0;
                width: 40px; height: 40px; border-radius: 50%; cursor: pointer; font-size: 15px;
                box-shadow: 0 4px 12px rgba(249,168,38,.4); transition: transform .15s; }
      #asSend:hover { transform: scale(1.08); }
      #asFab { position: fixed; bottom: 24px; left: 24px; z-index: 59; width: 62px; height: 62px; border-radius: 50%;
               background: linear-gradient(135deg,#0b2b5c,#123a7a); border: 2px solid #f9a826; font-size: 26px;
               display: flex; align-items: center; justify-content: center; cursor: pointer;
               box-shadow: 0 14px 34px -8px rgba(7,26,58,.65); transition: transform .2s; }
      #asFab:hover { transform: scale(1.1) rotate(6deg); }
      #asBadge { position: fixed; bottom: 92px; left: 30px; z-index: 58; background: #fff; color: #0b2b5c;
                 font-size: 12px; font-weight: 700; padding: 8px 14px; border-radius: 999px;
                 box-shadow: 0 8px 24px rgba(7,26,58,.25); border: 1px solid #e6d9b8; animation: asIn .4s .6s both; }
      .as-typing { display: inline-flex; gap: 4px; padding: 12px 16px; background: #fff; border: 1px solid #e6d9b8;
                   border-left: 3px solid #f9a826; border-radius: 4px 14px 14px 14px; }
      .as-typing i { width: 7px; height: 7px; border-radius: 50%; background: #94a3b8; animation: asB 1s infinite; }
      .as-typing i:nth-child(2){ animation-delay:.2s } .as-typing i:nth-child(3){ animation-delay:.4s }
      @keyframes asB { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
      @media (max-width: 480px) {
        #asChat { width: 94vw; max-height: 64vh; bottom: 14px; left: 3vw; }
        #asMsg { max-height: 36vh; }
        #asFab { width: 54px; height: 54px; font-size: 22px; bottom: 18px; left: 18px; }
        #asBadge { font-size: 11px; bottom: 80px; left: 20px; padding: 6px 11px; }
      }
    </style>
    <button id="asFab" title="Chat with Aurelia Concierge">🤖</button>
    <div id="asBadge">✨ Need the cheapest fare? Chat with me</div>
    <div id="asChat" class="closed">
      <div id="asHeader">
        <div id="asAvatar">🤖</div>
        <div><div style="font-weight:800;font-size:14.5px;letter-spacing:.2px">Aurelia Concierge</div>
        <div style="font-size:11px;opacity:.85;display:flex;align-items:center;gap:5px"><span style="width:7px;height:7px;border-radius:50%;background:#22c55e;display:inline-block"></span>Online · finds the best fares</div></div>
        <button id="asClose" title="Close">✕</button>
      </div>
      <div id="asMsg"></div>
      <div id="asChips" class="as-chips"></div>
      <div id="asInputRow"><input id="asInput" placeholder="Type your answer..." autocomplete="off"><button id="asSend">➤</button></div>
    </div>`;
  document.body.appendChild(root);

  const chat = root.querySelector('#asChat');
  const fab = root.querySelector('#asFab');
  const badge = root.querySelector('#asBadge');
  const closeBtn = root.querySelector('#asClose');
  const msgBox = root.querySelector('#asMsg');
  const chipsBox = root.querySelector('#asChips');
  const input = root.querySelector('#asInput');
  const sendBtn = root.querySelector('#asSend');

  const F = { type: 'flight', origin: '', destination: '', date: '', pax: '1', name: '', phone: '', email: '' };
  let step = 'greet';
  let opened = false;

  function openChat() {
    chat.classList.remove('closed');
    fab.style.display = 'none';
    badge.style.display = 'none';
    if (!opened) { opened = true; step = 'type'; botSay('Hi! 👋 I\'m the Aurelia Concierge — your personal fare-finder.\n\nTell me what you need and I\'ll get our team to hunt the cheapest price for you.', ['✈️ Flight', '🚆 Train', '🛂 Passport & Visa help', '💬 Talk to a human']); }
  }
  fab.addEventListener('click', openChat);
  badge.addEventListener('click', openChat);
  closeBtn.addEventListener('click', () => { chat.classList.add('closed'); fab.style.display = 'flex'; badge.style.display = 'block'; });

  function scroll() { msgBox.scrollTop = msgBox.scrollHeight; }
  function setChips(list) {
    chipsBox.innerHTML = '';
    list.forEach(label => {
      const b = document.createElement('button');
      b.className = 'as-chip'; b.textContent = label;
      b.addEventListener('click', () => handle(label));
      chipsBox.appendChild(b);
    });
  }
  function addBot(txt, chips) {
    const row = document.createElement('div');
    row.className = 'as-row';
    row.innerHTML = '<span class="as-avatar-mini">🤖</span>';
    const d = document.createElement('div');
    d.className = 'as-bot'; d.textContent = txt;
    row.appendChild(d);
    msgBox.appendChild(row); scroll();
    setChips(chips || []);
  }
  function addUser(txt) {
    const d = document.createElement('div');
    d.className = 'as-user'; d.textContent = txt;
    msgBox.appendChild(d); scroll();
  }
  function addTyping() {
    const row = document.createElement('div');
    row.className = 'as-row';
    row.innerHTML = '<span class="as-avatar-mini">🤖</span><div class="as-typing"><i></i><i></i><i></i></div>';
    msgBox.appendChild(row); scroll();
    return row;
  }
  function botSay(txt, chips, delay) {
    const t = addTyping();
    setTimeout(() => { t.remove(); addBot(txt, chips); }, delay || 650);
  }

  function normalizeDate(s) {
    const m = String(s).match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{2,4})$/);
    if (!m) return null;
    const d = new Date(`${m[3].length === 2 ? '20' + m[3] : m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`);
    return isNaN(d) ? null : d.toISOString().slice(0, 10);
  }
  function handle(text) {
    const t = String(text).trim();
    if (!t) return;
    addUser(t);
    input.value = '';
    setTimeout(() => {
      switch (step) {
        case 'type':
          if (t.toLowerCase().includes('human') || t.toLowerCase().includes('talk') || t.includes('💬')) {
            window.open('https://wa.me/919323003681?text=' + encodeURIComponent('Hi Aurelia! I need advice on my trip.'), '_blank');
            botSay('I\'ve opened WhatsApp — our team will talk to you there directly! 💬 Meanwhile, I can still book for you.', ['✈️ Flight', '🚆 Train', '↩️ Never mind']);
            break;
          }
          if (t.includes('Flight') || t.toLowerCase().includes('flight')) { F.type = 'flight'; }
          else if (t.includes('Train') || t.toLowerCase().includes('train')) { F.type = 'train'; }
          else if (t.toLowerCase().includes('passport') || t.toLowerCase().includes('visa')) {
            botSay('You can open our free Passport & Visa Help Center — official links, no agents, no fees. 🌍', ['📖 Open Help Center', '↩️ Back to booking']);
            step = 'guides';
            break;
          } else { botSay('Please pick one:', ['✈️ Flight', '🚆 Train', '🛂 Passport & Visa help', '💬 Talk to a human']); break; }
          step = 'origin';
          botSay(F.type === 'flight' ? 'Wonderful! ✈️ Where are you flying FROM? (city name works)' : 'Wonderful! 🚆 Which station are you departing FROM?');
          break;
        case 'guides':
          if (t.includes('Help Center')) { window.location.href = '/guides.html'; }
          else { step = 'type'; botSay('Back to booking — what are you looking for?', ['✈️ Flight', '🚆 Train']); }
          break;
        case 'origin':
          F.origin = t; step = 'destination';
          botSay(`Got it — ${F.origin}. And where are you going?`);
          break;
        case 'destination':
          F.destination = t; step = 'date';
          botSay(`Perfect: ${F.origin} → ${F.destination}. What date? (write like 15/12/2026)`);
          break;
        case 'date':
          const d = normalizeDate(t);
          if (!d) { botSay('Please write the date like this: 15/12/2026'); break; }
          F.date = d; step = 'pax';
          botSay('Date noted ✅ How many travellers?', ['1', '2', '3', '4', '5+']);
          break;
        case 'pax':
          if (/^5\+?$/.test(t) || parseInt(t) >= 5) {
            F.pax = '5';
            botSay('5 or more — a group! Our team loves group fares. 🎉\n\nNow, your name?');
          } else if (/^\d+$/.test(t)) { F.pax = t; botSay(`Great, ${F.pax} traveller(s). What's your name?`); }
          else { botSay('Please tell me the number of travellers (1–10):', ['1', '2', '3', '4']); break; }
          step = 'name';
          break;
        case 'name':
          F.name = t; step = 'phone';
          botSay(`Nice to meet you, ${t.split(' ')[0]}! 👋 What's your WhatsApp number? (with country code, e.g. +91 98765 43210)`);
          break;
        case 'phone':
          if (!/^\+?[0-9\s\-]{8,15}$/.test(t)) { botSay('That number looks off — please include country code, e.g. +91 98765 43210'); break; }
          F.phone = t; step = 'email';
          botSay('And your email (for the quote and ticket)?');
          break;
        case 'email':
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)) { botSay('That email doesn\'t look right — try again, e.g. name@gmail.com'); break; }
          F.email = t; step = 'confirm';
          botSay(`Here's your request 📋\n\n${F.type === 'flight' ? '✈️ Flight' : '🚆 Train'}\n${F.origin} → ${F.destination}\n📅 ${F.date}\n👥 ${F.pax} traveller(s)\n👤 ${F.name}\n📱 ${F.phone}\n📧 ${F.email}\n\nEverything correct?`, ['✅ Confirm & Send', '🔁 Start over']);
          break;
        case 'confirm':
          if (t.includes('Confirm')) submit();
          else { step = 'type'; botSay('No problem — let\'s start fresh! 😊', ['✈️ Flight', '🚆 Train']); }
          break;
        default:
          botSay('I\'m here for your booking! 😊', ['✈️ Flight', '🚆 Train', '🛂 Passport & Visa help']);
      }
    }, 350);
  }

  function submit() {
    const payload = {
      travelType: F.type,
      tripType: 'oneway',
      origin: F.origin,
      destination: F.destination,
      departureDate: F.date,
      passengers: parseInt(F.pax) || 1,
      travelClass: F.type === 'flight' ? 'Economy' : 'Sleeper (SL)',
      userName: F.name,
      userEmail: F.email,
      userPhone: F.phone,
      contactMethod: 'WhatsApp',
      hearAbout: 'AI Concierge',
      specialRequests: F.pax === '5' ? 'Group of 5+ travellers' : ''
    };
    const typing = addTyping();
    fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(r => r.json()).then(data => {
      typing.remove();
      if (data.success) {
        addBot(`🎉 Request sent successfully!\n\nOur team is now hunting the cheapest fare for ${F.origin} → ${F.destination}. You'll get your quote on WhatsApp within ~30 minutes.\n\nNeed a human right now?`, ['💬 Chat on WhatsApp']);
        step = 'done';
      } else {
        addBot('⚠️ Something went wrong. Please try again or message us on WhatsApp.', ['💬 Chat on WhatsApp', '↩️ Try again']);
        step = 'type';
      }
    }).catch(() => {
      typing.remove();
      addBot('⚠️ Connection issue. Please message us on WhatsApp instead.', ['💬 Chat on WhatsApp']);
      step = 'type';
    });
  }

  function send() { const v = input.value.trim(); if (v) handle(v); }
  sendBtn.addEventListener('click', send);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') send(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { chat.classList.add('closed'); fab.style.display = 'flex'; badge.style.display = 'block'; } });

  if (window.location.search.includes('chat=1')) {
    fab.style.display = 'none';
    badge.style.display = 'none';
    openChat();
  }
})();
