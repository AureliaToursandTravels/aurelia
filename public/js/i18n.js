/* Aurelia Tours & Travels — Indian language switcher (English / हिंदी / বাংলা / ଓଡ଼ିଆ)
   Matches elements by their current English text and swaps in the selected language.
   Add more entries/languages freely. */
(function () {
  const LANG_KEY = 'aurelia_lang';
  const LANGS = ['en', 'hi', 'bn', 'or'];
  const DICT = [
    // ---------- Nav ----------
    { sel: 'nav a', en: 'Home', hi: 'होम', bn: 'হোম', or: 'ହୋମ' },
    { sel: 'nav a', en: 'How It Works', hi: 'यह कैसे काम करता है', bn: 'কীভাবে কাজ করে', or: 'ଏହା କିପରି କାମ କରେ' },
    { sel: 'nav a', en: 'Contact', hi: 'संपर्क', bn: 'যোগাযোগ', or: 'ଯୋଗାଯୋଗ' },
    { sel: 'nav a', en: 'Passport & Visa', hi: 'पासपोर्ट और वीज़ा', bn: 'পাসপোর্ট ও ভিসা', or: 'ପାସପୋର୍ଟ ଓ ଭିସା' },

    // ---------- Hero ----------
    { sel: '#heroT1', en: 'Fly & Ride Smarter —', hi: 'उड़ान और सफ़र, स्मार्ट तरीके से —', bn: 'স্মার্ট ভাবে উড়ুন ও যান —', or: 'ସ୍ମାର୍ଟ ଭାବେ ଉଡ଼ନ୍ତୁ ଓ ଯାଆନ୍ତୁ —' },
    { sel: '#heroT2', en: 'Save More on Every Trip', hi: 'सबसे सस्ते दाम पाएं', bn: 'সবচেয়ে সস্তা দাম পান', or: 'ସବୁଠାରୁ ଶସ୍ତା ମୂଲ୍ୟ ପାଆନ୍ତୁ' },
    { sel: '#heroSub', en: 'Hand-picked fares from exclusive channels, sourced personally by our brokers — often cheaper than what you\'ll find online.', hi: 'हमारे एक्सपर्ट हर रूट के लिए छिपे हुए सस्ते दाम खोजते हैं — ऑनलाइन मिलने वाले दामों से भी सस्ता।', bn: 'আমাদের এক্সপার্টরা প্রতিটি রুটের জন্য লুকানো সস্তা দাম খুঁজে আনেন — অনলাইনে পাওয়া দামের চেয়েও সস্তা।', or: 'ଆମର ବିଶେଷଜ୍ଞମାନେ ପ୍ରତ୍ୟେକ ରୁଟ୍ ପାଇଁ ଲୁକ୍କାୟିତ ଶସ୍ତା ମୂଲ୍ୟ ଖୋଜି ଆଣନ୍ତି — ଅନଲାଇନରେ ମିଳୁଥିବା ମୂଲ୍ୟ ଅପେକ୍ଷା ଶସ୍ତା।' },
    { sel: '.hero-badge', en: '✓ No Hidden Fees', hi: '✓ कोई छिपी फीस नहीं', bn: '✓ কোনো লুকানো ফি নেই', or: '✓ କୌଣସି ଲୁକ୍କାୟିତ ଫି ନାହିଁ' },
    { sel: '.hero-badge', en: '✓ Big Savings', hi: '✓ बड़ी बचत', bn: '✓ বড় সাশ্রয়', or: '✓ ବଡ଼ ସଞ୍ଚୟ' },
    { sel: '.hero-badge', en: '✓ Personal Expert Quotes', hi: '✓ एक्सपर्ट से निजी कोट', bn: '✓ এক্সপার্টের ব্যক্তিগত কোটা', or: '✓ ବିଶେଷଜ୍ଞଙ୍କ ବ୍ୟକ୍ତିଗତ କୋଟ' },
    { sel: '.hero-badge', en: '✓ Expert help daily 11am–3pm', hi: '✓ रोज़ सुबह 11–3 बजे एक्सपर्ट सहायता', bn: '✓ প্রতিদিন সকাল ১১টা–৩টা এক্সপার্ট সহায়তা', or: '✓ ପ୍ରତିଦିନ ସକାଳ ୧୧–୩ଟାରେ ବିଶେଷଜ୍ଞ ସହାୟତା' },

    // ---------- Step bar ----------
    { sel: '.stepbar-txt', en: 'Trip Details', hi: 'यात्रा विवरण', bn: 'ভ্রমণ বিবরণ', or: 'ଯାତ୍ରା ବିବରଣୀ' },
    { sel: '.stepbar-txt', en: 'Preferences', hi: 'पसंद', bn: 'পছন্দ', or: 'ପସନ୍ଦ' },
    { sel: '.stepbar-txt', en: 'Contact', hi: 'संपर्क', bn: 'যোগাযোগ', or: 'ଯୋଗାଯୋଗ' },
    { sel: '.stepbar span', en: 'No payment needed for quotes', hi: 'कोट के लिए कोई भुगतान नहीं', bn: 'কোটার জন্য কোনো পেমেন্ট নেই', or: 'କୋଟ ପାଇଁ କୌଣସି ଦେୟ ନାହିଁ' },

    // ---------- Section headings (keep gold kicker markup) ----------
    { sel: '#bookingForm h2', en: '1 · What are you booking?', hi: '1 · क्या बुक करना है?', bn: '১ · কী বুক করছেন?', or: '୧ · କ\'ଣ ବୁକ୍ କରୁଛନ୍ତି?', html: true },
    { sel: '#bookingForm h2', en: '2 · Trip type', hi: '2 · यात्रा प्रकार', bn: '২ · ভ্রমণের ধরন', or: '୨ · ଯାତ୍ରା ପ୍ରକାର', html: true },
    { sel: '#bookingForm h2', en: '3 · Dates', hi: '3 · तारीखें', bn: '৩ · তারিখ', or: '୩ · ତାରିଖ', html: true },
    { sel: '#bookingForm h2', en: '4 · Preferred departure time', hi: '4 · पसंदीदा प्रस्थान समय', bn: '৪ · পছন্দের রওনা সময়', or: '୪ · ପସନ୍ଦର ପ୍ରସ୍ଥାନ ସମୟ', html: true },
    { sel: '#bookingForm h2', en: '5 · Flight preferences', hi: '5 · फ्लाइट पसंद', bn: '৫ · ফ্লাইট পছন্দ', or: '୫ · ଫ୍ଲାଇଟ୍ ପସନ୍ଦ', html: true },
    { sel: '#bookingForm h2', en: '5 · Train preferences', hi: '5 · ट्रेन पसंद', bn: '৫ · ট্রেন পছন্দ', or: '୫ · ଟ୍ରେନ୍ ପସନ୍ଦ', html: true },
    { sel: '#bookingForm h2', en: '6 · Budget &amp; urgency', hi: '6 · बजट और ज़रूरत', bn: '৬ · বাজেট ও জরুরি', or: '୬ · ବଜେଟ୍ ଓ ଜରୁରୀ', html: true },
    { sel: '#bookingForm h2', en: '7 · Your contact details', hi: '7 · आपकी संपर्क जानकारी', bn: '৭ · আপনার যোগাযোগের তথ্য', or: '୭ · ଆପଣଙ୍କ ସମ୍ପର୍କ ସୂଚନା', html: true },

    // ---------- Labels ----------
    { sel: 'label', en: 'Origin City / Station', hi: 'प्रस्थान शहर / स्टेशन', bn: 'যাত্রা শুরুর শহর / স্টেশন', or: 'ପ୍ରସ୍ଥାନ ସହର / ଷ୍ଟେସନ୍' },
    { sel: 'label', en: 'Destination City / Station', hi: 'गंतव्य शहर / स्टेशन', bn: 'গন্তব্য শহর / স্টেশন', or: 'ଗନ୍ତବ୍ୟ ସହର / ଷ୍ଟେସନ୍' },
    { sel: 'label', en: 'Departure Date', hi: 'प्रस्थान तिथि', bn: 'রওনা তারিখ', or: 'ପ୍ରସ୍ଥାନ ତାରିଖ' },
    { sel: 'label', en: 'Return Date', hi: 'वापसी तिथि', bn: 'ফেরার তারিখ', or: 'ଫେରିବା ତାରିଖ' },
    { sel: 'label', en: 'Passengers', hi: 'यात्री', bn: 'যাত্রী', or: 'ଯାତ୍ରୀ' },
    { sel: 'label', en: 'Preferred Class', hi: 'पसंदीदा क्लास', bn: 'পছন্দের ক্লাস', or: 'ପସନ୍ଦର କ୍ଲାସ୍' },
    { sel: 'label', en: 'Flight / Train No.', hi: 'फ्लाइट / ट्रेन नं.', bn: 'ফ্লাইট / ট্রেন নং', or: 'ଫ୍ଲାଇଟ୍ / ଟ୍ରେନ୍ ନଂ' },
    { sel: 'label', en: 'Stops', hi: 'स्टॉप्स', bn: 'স্টপ', or: 'ଷ୍ଟପ୍' },
    { sel: 'label', en: 'Baggage', hi: 'सामान', bn: 'ব্যাগেজ', or: 'ସାମଗ୍ରୀ' },
    { sel: 'label', en: 'Seat preference', hi: 'सीट पसंद', bn: 'সিট পছন্দ', or: 'ସିଟ୍ ପସନ୍ଦ' },
    { sel: 'label', en: 'Airline preference', hi: 'एयरलाइन पसंद', bn: 'এয়ারলাইন পছন্দ', or: 'ଏୟାରଲାଇନ ପସନ୍ଦ' },
    { sel: 'label', en: 'Train type', hi: 'ट्रेन प्रकार', bn: 'ট্রেনের ধরন', or: 'ଟ୍ରେନ୍ ପ୍ରକାର' },
    { sel: 'label', en: 'Berth preference', hi: 'बर्थ पसंद', bn: 'বার্থ পছন্দ', or: 'ବର୍ଥ ପସନ୍ଦ' },
    { sel: 'label', en: 'Quota', hi: 'कोटा', bn: 'কোটা', or: 'କୋଟା' },
    { sel: 'label', en: 'Meals', hi: 'भोजन', bn: 'খাবার', or: 'ଖାଦ୍ୟ' },
    { sel: 'label', en: 'Reason for travel', hi: 'यात्रा का कारण', bn: 'ভ্রমণের কারণ', or: 'ଯାତ୍ରା କାରଣ' },
    { sel: 'label', en: 'Budget per person (₹)', hi: 'प्रति व्यक्ति बजट (₹)', bn: 'প্রতি ব্যক্তি বাজেট (₹)', or: 'ପ୍ରତି ବ୍ୟକ୍ତି ବଜେଟ୍ (₹)' },
    { sel: 'label', en: 'How urgent?', hi: 'कितनी ज़रूरी?', bn: 'কতটা জরুরি?', or: 'କେତେ ଜରୁରୀ?' },
    { sel: 'label', en: 'Payment preference', hi: 'भुगतान पसंद', bn: 'পেমেন্ট পছন্দ', or: 'ଦେୟ ପସନ୍ଦ' },
    { sel: 'label', en: 'Full Name', hi: 'पूरा नाम', bn: 'পুরো নাম', or: 'ପୂର୍ଣ୍ଣ ନାମ' },
    { sel: 'label', en: 'Email Address', hi: 'ईमेल पता', bn: 'ইমেইল ঠিকানা', or: 'ଇମେଲ୍ ଠିକଣା' },
    { sel: 'label', en: 'WhatsApp / Phone', hi: 'व्हाट्सऐप / फोन', bn: 'হোয়াটসঅ্যাপ / ফোন', or: 'ୱାଟ୍ସଆପ୍ / ଫୋନ୍' },
    { sel: 'label', en: 'Alternate Number', hi: 'वैकल्पिक नंबर', bn: 'বিকল্প নম্বর', or: 'ବିକଳ୍ପ ନମ୍ବର' },
    { sel: 'label', en: 'How should we contact you?', hi: 'हम आपसे कैसे संपर्क करें?', bn: 'আপনার সাথে কীভাবে যোগাযোগ করব?', or: 'ଆପଣଙ୍କ ସହ କିପରି ଯୋଗାଯୋଗ କରିବା?' },
    { sel: 'label', en: 'Special requests', hi: 'विशेष अनुरोध', bn: 'বিশেষ অনুরোধ', or: 'ବିଶେଷ ଅନୁରୋଧ' },
    { sel: 'label', en: 'How did you hear about us?', hi: 'आप हमारे बारे में कैसे जाने?', bn: 'আমাদের সম্পর্কে কীভাবে জানলেন?', or: 'ଆମ ବିଷୟରେ କିପରି ଜାଣିଲେ?' },

    // ---------- Placeholders ----------
    { sel: 'input[placeholder]', en: 'e.g. Mumbai (BOM)', hi: 'जैसे: मुंबई (BOM)', bn: 'যেমন: মুম্বই (BOM)', or: 'ଯଥା: ମୁମ୍ବାଇ (BOM)' },
    { sel: 'input[placeholder]', en: 'e.g. Delhi (DEL)', hi: 'जैसे: दिल्ली (DEL)', bn: 'যেমন: দিল্লি (DEL)', or: 'ଯଥା: ଦିଲ୍ଲୀ (DEL)' },
    { sel: 'input[placeholder]', en: 'John Doe', hi: 'आपका नाम', bn: 'আপনার নাম', or: 'ଆପଣଙ୍କ ନାମ' },
    { sel: 'input[placeholder]', en: 'john@example.com', hi: 'आपका ईमेल', bn: 'আপনার ইমেইল', or: 'ଆପଣଙ୍କ ଇମେଲ୍' },
    { sel: 'input[placeholder]', en: '+91 9876543210', hi: '+91 9876543210', bn: '+91 9876543210', or: '+91 9876543210' },
    { sel: 'input[placeholder]', en: '+91 ...', hi: '+91 ...', bn: '+91 ...', or: '+91 ...' },
    { sel: 'input[placeholder]', en: 'e.g. 8000', hi: 'जैसे: 8000', bn: 'যেমন: 8000', or: 'ଯଥା: 8000' },
    { sel: 'input[placeholder]', en: 'e.g. 6E-123 / 12952', hi: 'जैसे: 6E-123 / 12952', bn: 'যেমন: 6E-123 / 12952', or: 'ଯଥା: 6E-123 / 12952' },

    // ---------- Flexible dates box ----------
    { sel: 'label', en: 'My dates are flexible', hi: 'मेरी तारीखें लचीली हैं', bn: 'আমার তারিখ নমনীয়', or: 'ମୋ ତାରିଖ ନମନୀୟ', html: true },

    // ---------- Summary panel ----------
    { sel: 'aside .text-slate-300', en: 'Type', hi: 'प्रकार', bn: 'ধরন', or: 'ପ୍ରକାର' },
    { sel: 'aside .text-slate-300', en: 'Route', hi: 'रूट', bn: 'রুট', or: 'ରୁଟ୍' },
    { sel: 'aside .text-slate-300', en: 'Dates', hi: 'तारीखें', bn: 'তারিখ', or: 'ତାରିଖ' },
    { sel: 'aside .text-slate-300', en: 'Pax & Class', hi: 'यात्री और क्लास', bn: 'যাত্রী ও ক্লাস', or: 'ଯାତ୍ରୀ ଓ କ୍ଲାସ୍' },
    { sel: 'aside .text-slate-300', en: 'Contact', hi: 'संपर्क', bn: 'যোগাযোগ', or: 'ଯୋଗାଯୋଗ' },
    { sel: 'aside .text-slate-300', en: 'Budget', hi: 'बजट', bn: 'বাজেট', or: 'ବଜେଟ୍' },
    { sel: 'aside .text-slate-300', en: 'Urgency', hi: 'ज़रूरत', bn: 'জরুরি', or: 'ଜରୁରୀ' },
    { sel: 'aside', en: 'Updates automatically as you type', hi: 'टाइप करते ही अपडेट होता है', bn: 'টাইপ করার সাথে সাথে আপডেট হয়', or: 'ଟାଇପ୍ କଲେ ତୁରନ୍ତ ଅପଡେଟ୍ ହୁଏ' },
    { sel: 'aside', en: 'Request completeness', hi: 'अनुरोध पूर्णता', bn: 'অনুরোধ সম্পূর্ণতা', or: 'ଅନୁରୋଧ ସମ୍ପୂର୍ଣ୍ଣତା' },
    { sel: 'aside', en: 'What happens next:', hi: 'आगे क्या होगा:', bn: 'এরপর কী হবে:', or: 'ଏହାପରେ କ\'ଣ ହେବ:' },
    { sel: 'aside', en: 'We search exclusive channels for your route', hi: 'हम आपके रूट के लिए खास चैनल खोजते हैं', bn: 'আমরা আপনার রুটের জন্য বিশেষ চ্যানেল খুঁজি', or: 'ଆମେ ଆପଣଙ୍କ ରୁଟ୍ ପାଇଁ ସ୍ୱତନ୍ତ୍ର ଚ୍ୟାନେଲ୍ ଖୋଜୁ' },
    { sel: 'aside', en: 'You get your quote on WhatsApp / Email', hi: 'व्हाट्सऐप / ईमेल पर कोट मिलेगा', bn: 'হোয়াটসঅ্যাপ / ইমেইলে কোটা পাবেন', or: 'ୱାଟ୍ସଆପ୍ / ଇମେଲରେ କୋଟ ପାଇବେ' },
    { sel: 'aside', en: 'Confirm & we book your ticket instantly', hi: 'कन्फर्म करें, टिकट तुरंत बुक', bn: 'নিশ্চিত করুন, টিকিট সঙ্গে সঙ্গে বুক', or: 'ନିଶ୍ଚିତ କରନ୍ତୁ, ଟିକେଟ୍ ତୁରନ୍ତ ବୁକ୍' },

    // ---------- Buttons ----------
    { sel: '#submitBtn', en: '🔥 Request My Best Quote', hi: '🔥 मेरा सबसे अच्छा कोट मांगें', bn: '🔥 আমার সেরা কোটা চাই', or: '🔥 ମୋର ସର୍ବୋତ୍ତମ କୋଟ ମାଗନ୍ତୁ' },
    { sel: '#newRequestBtn', en: '+ Submit Another Request', hi: '+ एक और अनुरोध भेजें', bn: '+ আরেকটি অনুরোধ পাঠান', or: '+ ଆଉ ଗୋଟିଏ ଅନୁରୋଧ ପଠାନ୍ତୁ' },
    { sel: 'form', en: 'Free service · No advance payment · Response within 30 min on WhatsApp', hi: 'मुफ्त सेवा · कोई अग्रिम भुगतान नहीं · 30 मिनट में जवाब', bn: 'ফ্রি সার্ভিস · কোনো অগ্রিম পেমেন্ট নেই · ৩০ মিনিটে উত্তর', or: 'ମାଗଣା ସେବା · କୌଣସି ଅଗ୍ରୀମ ଦେୟ ନାହିଁ · ୩୦ ମିନିଟରେ ଉତ୍ତର' },

    // ---------- Success ----------
    { sel: '#successPanel h3', en: 'Request received! 🎉', hi: 'अनुरोध मिल गया! 🎉', bn: 'অনুরোধ পেয়েছি! 🎉', or: 'ଅନୁରୋଧ ମିଳିଗଲା! 🎉' },

    // ---------- Destination desks ----------
    { sel: '.desks-kicker', en: 'Where are you heading?', hi: 'कहाँ जा रहे हैं?', bn: 'কোথায় যাচ্ছেন?', or: 'କୁଆଡ଼େ ଯାଉଛନ୍ତି?' },
    { sel: '.desks-h2', en: 'Your journey deserves its own desk', hi: 'आपकी यात्रा की अपनी खास टीम है', bn: 'আপনার যাত্রার নিজস্ব বিশেষ ডেস্ক আছে', or: 'ଆପଣଙ୍କ ଯାତ୍ରାର ନିଜସ୍ୱ ବିଶେଷ ଡେସ୍କ ଅଛି' },
    { sel: '.desks-sub', en: 'Every path has a dedicated specialist and exclusive fares. Tap your world — we\'ll pre-fill your request.', hi: 'हर रास्ते के लिए एक खास एक्सपर्ट और खास दाम। अपनी दुनिया चुनें — हम आपका अनुरोध भर देंगे।', bn: 'প্রতিটি পথের জন্য রয়েছে নিবেদিত বিশেষজ্ঞ ও বিশেষ দাম। আপনার জগৎ বেছে নিন — আমরা আপনার অনুরোধ পূরণ করে দেব।', or: 'ପ୍ରତ୍ୟେକ ପଥ ପାଇଁ ଜଣେ ବିଶେଷଜ୍ଞ ଓ ସ୍ୱତନ୍ତ୍ର ମୂଲ୍ୟ ଅଛି। ଆପଣଙ୍କ ଦୁନିଆ ବାଛନ୍ତୁ — ଆମେ ଆପଣଙ୍କ ଅନୁରୋଧ ପୂରଣ କରିଦେବୁ।' },
    { sel: '.cat-card h3', en: 'Gulf & Middle East', hi: 'गल्फ और मिडिल ईस्ट', bn: 'গালফ ও মধ্যপ্রাচ্য', or: 'ଗଲ୍ଫ୍ ଓ ମଧ୍ୟପ୍ରାଚ୍ୟ' },
    { sel: '.cat-card h3', en: 'Student Journeys', hi: 'स्टूडेंट जर्नी', bn: 'স্টুডেন্ট জার্নি', or: 'ଛାତ୍ର ଯାତ୍ରା' },
    { sel: '.cat-card h3', en: 'Europe', hi: 'यूरोप', bn: 'ইউরোপ', or: 'ୟୁରୋପ' },
    { sel: '.cat-card h3', en: 'North America', hi: 'उत्तर अमेरिका', bn: 'উত্তর আমেরিকা', or: 'ଉତ୍ତର ଆମେରିକା' },
    { sel: '.cat-card h3', en: 'South America', hi: 'दक्षिण अमेरिका', bn: 'দক্ষিণ আমেরিকা', or: 'ଦକ୍ଷିଣ ଆମେରିକା' },
    { sel: '.cat-card h3', en: 'Group & Family Travel', hi: 'ग्रुप और फैमिली यात्रा', bn: 'গ্রুপ ও পারিবারিক ভ্রমণ', or: 'ଗ୍ରୁପ୍ ଓ ପରିବାର ଯାତ୍ରା' },
    { sel: '.cat-card span', en: 'Get my Gulf quote →', hi: 'गल्फ कोट पाएं →', bn: 'গালফ কোটা নিন →', or: 'ଗଲ୍ଫ କୋଟ ପାଆନ୍ତୁ →' },
    { sel: '.cat-card span', en: 'Get my student quote →', hi: 'स्टूडेंट कोट पाएं →', bn: 'স্টুডেন্ট কোটা নিন →', or: 'ଛାତ୍ର କୋଟ ପାଆନ୍ତୁ →' },
    { sel: '.cat-card span', en: 'Get my Europe quote →', hi: 'यूरोप कोट पाएं →', bn: 'ইউরোপ কোটা নিন →', or: 'ୟୁରୋପ କୋଟ ପାଆନ୍ତୁ →' },
    { sel: '.cat-card span', en: 'Get my North America quote →', hi: 'उत्तर अमेरिका कोट पाएं →', bn: 'উত্তর আমেরিকা কোটা নিন →', or: 'ଉତ୍ତର ଆମେରିକା କୋଟ ପାଆନ୍ତୁ →' },
    { sel: '.cat-card span', en: 'Get my South America quote →', hi: 'दक्षिण अमेरिका कोट पाएं →', bn: 'দক্ষিণ আমেরিকা কোটা নিন →', or: 'ଦକ୍ଷିଣ ଆମେରିକା କୋଟ ପାଆନ୍ତୁ →' },
    { sel: '.cat-card span', en: 'Get my group quote →', hi: 'ग्रुप कोट पाएं →', bn: 'গ্রুপ কোটা নিন →', or: 'ଗ୍ରୁପ୍ କୋଟ ପାଆନ୍ତୁ →' },

    // ---------- Help center strip ----------
    { sel: '.help-kicker', en: 'Going abroad? Start here', hi: 'विदेश जा रहे हैं? यहाँ से शुरू करें', bn: 'বিদেশ যাচ্ছেন? এখান থেকে শুরু করুন', or: 'ବିଦେଶ ଯାଉଛନ୍ତି? ଏଠାରୁ ଆରମ୍ଭ କରନ୍ତୁ' },
    { sel: '.help-h2', en: 'Passport & Visa Help Center', hi: 'पासपोर्ट और वीज़ा सहायता केंद्र', bn: 'পাসপোর্ট ও ভিসা হেল্প সেন্টার', or: 'ପାସପୋର୍ଟ ଓ ଭିସା ସହାୟତା କେନ୍ଦ୍ର' },
    { sel: '.help-sub', en: 'Free step-by-step guides + official government links. We never charge for help — and we never stand between you and the official portals.', hi: 'मुफ्त चरण-दर-चरण गाइड + सरकारी आधिकारिक लिंक। हम मदद के लिए कभी पैसे नहीं लेते।', bn: 'ফ্রি ধাপে ধাপে গাইড + সরকারি অফিসিয়াল লিংক। সাহায্যের জন্য আমরা কখনো টাকা নেই না।', or: 'ମାଗଣା ପଦକ୍ଷେପ ଗାଇଡ୍ + ସରକାରୀ ଅଫିସିଆଲ ଲିଙ୍କ୍। ସାହାଯ୍ୟ ପାଇଁ ଆମେ କେବେ ଟଙ୍କା ନେଉନାହୁଁ।' },
    { sel: '.help-card .font-bold', en: 'Passport Guide', hi: 'पासपोर्ट गाइड', bn: 'পাসপোর্ট গাইড', or: 'ପାସପୋର୍ଟ ଗାଇଡ୍' },
    { sel: '.help-card .font-bold', en: 'Visa Guide', hi: 'वीज़ा गाइड', bn: 'ভিসা গাইড', or: 'ଭିସା ଗାଇଡ୍' },
    { sel: '.help-card .font-bold', en: 'Student Guide', hi: 'स्टूडेंट गाइड', bn: 'স্টুডেন্ট গাইড', or: 'ଛାତ୍ର ଗାଇଡ୍' },
    { sel: '.help-card .text-brandGold', en: 'Open guide →', hi: 'गाइड खोलें →', bn: 'গাইড খুলুন →', or: 'ଗାଇଡ୍ ଖୋଲନ୍ତୁ →' },

    // ---------- Footer ----------
    { sel: 'footer a', en: 'How It Works', hi: 'यह कैसे काम करता है', bn: 'কীভাবে কাজ করে', or: 'ଏହା କିପରି କାମ କରେ' },
    { sel: 'footer a', en: 'Contact', hi: 'संपर्क', bn: 'যোগাযোগ', or: 'ଯୋଗାଯୋଗ' }
  ];

  function apply(lang) {
    if (!LANGS.includes(lang)) lang = 'en';
    DICT.forEach(entry => {
      const txt = entry[lang];
      document.querySelectorAll(entry.sel).forEach(el => {
        const ph = el.getAttribute ? el.getAttribute('placeholder') : null;
        if (ph !== null && ph === entry.en) { el.setAttribute('placeholder', txt); return; }
        if (entry.html) {
          if (el.innerHTML && el.innerHTML.includes(entry.en)) el.innerHTML = el.innerHTML.split(entry.en).join(txt);
        } else {
          const cur = (el.textContent || '').trim();
          if (cur === entry.en || cur.startsWith(entry.en)) el.textContent = txt;
        }
      });
    });
    localStorage.setItem(LANG_KEY, lang);
    document.querySelectorAll('#langSwitcher, #langSwitcherM').forEach(sw => { sw.value = lang; });
    document.documentElement.lang = lang === 'en' ? 'en' : lang;
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('#langSwitcher, #langSwitcherM').forEach(sw => {
      sw.value = localStorage.getItem(LANG_KEY) || 'en';
      sw.addEventListener('change', () => apply(sw.value));
    });
    apply(localStorage.getItem(LANG_KEY) || 'en');
  });
})();
