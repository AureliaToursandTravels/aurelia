require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const path = require('path');

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schema Definition
const RequestSchema = new mongoose.Schema({
  travelType: { type: String, enum: ['flight', 'train'], required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  departureDate: { type: Date, required: true },
  returnDate: { type: Date },
  passengers: { type: Number, required: true, default: 1 },
  travelClass: { type: String, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userPhone: { type: String, required: true },
  // Extended booking options
  tripType: { type: String, default: '' },          // oneway / roundtrip
  routeType: { type: String, default: '' },         // domestic / international (flights)
  flexibleDates: { type: Boolean, default: false }, // willing to shift ±2 days
  preferredTime: { type: String, default: '' },     // Morning / Afternoon / Evening / Night
  alternatePhone: { type: String, default: '' },
  contactMethod: { type: String, default: '' },     // whatsapp / call / email
  specialRequests: { type: String, default: '' },
  travelNumber: { type: String, default: '' },      // preferred flight/train number
  hearAbout: { type: String, default: '' },         // Google / Instagram / etc.
  // Deep preferences (round 2)
  baggage: { type: String, default: '' },           // flight: hand / 15kg / 20kg / 23kg
  seatPref: { type: String, default: '' },          // window / aisle / any
  mealPref: { type: String, default: '' },          // veg / non-veg / jain / none
  travelReason: { type: String, default: '' },      // business / leisure / family / urgent
  stopPref: { type: String, default: '' },          // flight: non-stop / 1 stop / any
  airlinePref: { type: String, default: '' },       // flight: airline name
  berthPref: { type: String, default: '' },         // train: lower / middle / upper / side
  trainType: { type: String, default: '' },         // train: Express / Rajdhani / etc.
  quota: { type: String, default: '' },             // train: General / Tatkal / etc.
  budget: { type: String, default: '' },            // ₹ per person
  urgency: { type: String, default: '' },           // Not urgent / Within a week / ASAP
  paymentPref: { type: String, default: '' },       // UPI / Card / NetBanking / Cash
  status: { type: String, enum: ['pending', 'quoted', 'booked', 'closed'], default: 'pending' },
  quotePrice: { type: Number, default: null },
  commission: { type: Number, default: null },
  adminNotes: { type: String, default: '' },
}, { timestamps: true });

const Request = mongoose.model('Request', RequestSchema);

// Transporters & Services
const mailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

// WhatsApp Dispatcher Helper
async function sendWhatsApp(to, body) {
  if (!twilioClient || !process.env.TWILIO_WHATSAPP_NUMBER) return;
  const formattedTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
  try {
    await twilioClient.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: formattedTo,
      body: body
    });
  } catch (err) {
    console.error(`Failed to dispatch WhatsApp to ${to}:`, err.message);
  }
}

// Authentication Middleware
function authenticateAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

// Rate Limiter for Submission
const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { error: 'Too many requests created from this IP, please try again in an hour.' }
});

// Routes
// 1. Submit Request
app.post('/api/submit', submitLimiter, async (req, res) => {
  try {
    const { travelType, origin, destination, departureDate, returnDate, passengers, travelClass, userName, userEmail, userPhone, tripType, routeType, flexibleDates, preferredTime, alternatePhone, contactMethod, specialRequests, travelNumber, hearAbout, baggage, seatPref, mealPref, travelReason, stopPref, airlinePref, berthPref, trainType, quota, budget, urgency, paymentPref } = req.body;

    if (!travelType || !origin || !destination || !departureDate || !userName || !userEmail || !userPhone) {
      return res.status(400).json({ error: 'Please provide all required fields.' });
    }

    const newRequest = await Request.create({
      travelType,
      origin,
      destination,
      departureDate,
      returnDate: returnDate || null,
      passengers,
      travelClass,
      userName,
      userEmail,
      userPhone,
      tripType: tripType || '',
      routeType: routeType || '',
      flexibleDates: !!flexibleDates,
      preferredTime: preferredTime || '',
      alternatePhone: alternatePhone || '',
      contactMethod: contactMethod || '',
      specialRequests: specialRequests || '',
      travelNumber: travelNumber || '',
      hearAbout: hearAbout || '',
      baggage: baggage || '',
      seatPref: seatPref || '',
      mealPref: mealPref || '',
      travelReason: travelReason || '',
      stopPref: stopPref || '',
      airlinePref: airlinePref || '',
      berthPref: berthPref || '',
      trainType: trainType || '',
      quota: quota || '',
      budget: budget || '',
      urgency: urgency || '',
      paymentPref: paymentPref || ''
    });

    const adminLink = `${process.env.BASE_URL}/admin.html?id=${newRequest._id}`;

    const emailBody = `
      <h3>New Travel Request (#${newRequest._id})</h3>
      <p><strong>Type:</strong> ${travelType.toUpperCase()}${routeType ? ` (${routeType})` : ''}</p>
      <p><strong>Route:</strong> ${origin} &rarr; ${destination}</p>
      <p><strong>Departure:</strong> ${new Date(departureDate).toDateString()}</p>
      ${returnDate ? `<p><strong>Return:</strong> ${new Date(returnDate).toDateString()}</p>` : ''}
      <p><strong>Trip:</strong> ${tripType === 'roundtrip' ? 'Round Trip' : 'One Way'}${preferredTime ? ` | Preferred time: ${preferredTime}` : ''}${flexibleDates ? ' | Dates flexible (±2 days)' : ''}</p>
      <p><strong>Passengers:</strong> ${passengers} | <strong>Class:</strong> ${travelClass}</p>
      ${travelNumber ? `<p><strong>Preferred ${travelType} no.:</strong> ${travelNumber}</p>` : ''}
      <p><strong>Preferences:</strong> ${travelType === 'flight'
        ? [stopPref, baggage, seatPref, mealPref, airlinePref].filter(Boolean).join(' · ') || 'None specified'
        : [trainType, berthPref, quota, mealPref].filter(Boolean).join(' · ') || 'None specified'}</p>
      <p><strong>Reason:</strong> ${travelReason || 'Not specified'} | <strong>Budget:</strong> ${budget ? `₹${budget} per person` : 'Not specified'} | <strong>Urgency:</strong> ${urgency || 'Not urgent'}</p>
      <p><strong>Payment:</strong> ${paymentPref || 'Will decide later'}</p>
      <hr/>
      <p><strong>User:</strong> ${userName}</p>
      <p><strong>Phone:</strong> ${userPhone}${alternatePhone ? ` | Alt: ${alternatePhone}` : ''}</p>
      <p><strong>Email:</strong> <a href="mailto:${userEmail}">${userEmail}</a></p>
      <p><strong>Contact pref:</strong> ${contactMethod || 'Any'}</p>
      ${hearAbout ? `<p><strong>Found via:</strong> ${hearAbout}</p>` : ''}
      ${specialRequests ? `<p><strong>Special requests:</strong> ${specialRequests}</p>` : ''}
      <hr/>
      <p><a href="${adminLink}">Click here to view in Admin Panel and Quote</a></p>
    `;

    // Notify Admins by Email
    const adminRecipients = [process.env.ADMIN_PRIMARY_EMAIL, process.env.ADMIN_SECONDARY_EMAIL].filter(Boolean);
    if (adminRecipients.length > 0) {
      mailTransporter.sendMail({
        from: `"Aurelia Tours & Travels Bookings" <${process.env.SMTP_USER}>`,
        to: adminRecipients,
        subject: `New ${travelType.toUpperCase()} Request from ${userName} – Aurelia Tours & Travels`,
        html: emailBody
      }).catch(err => console.error('Admin Email error:', err.message));
    }

    // Notify Primary Admin by WhatsApp
    const waText = `✈️ *New Request – Aurelia Tours & Travels*\nType: ${travelType.toUpperCase()}${routeType ? ` (${routeType})` : ''}\nFrom: ${origin} to ${destination}\nDate: ${new Date(departureDate).toDateString()}${returnDate ? `\nReturn: ${new Date(returnDate).toDateString()}` : ''}${preferredTime ? `\nTime: ${preferredTime}` : ''}\nPax: ${passengers} | ${travelClass}${urgency ? `\nUrgency: ${urgency}` : ''}${budget ? `\nBudget: ₹${budget}/pax` : ''}\nClient: ${userName} (${userPhone})\nContact pref: ${contactMethod || 'any'}\nReview: ${adminLink}`;
    sendWhatsApp(process.env.ADMIN_PRIMARY_PHONE, waText);

    res.status(201).json({ success: true, message: 'Request submitted successfully!', id: newRequest._id });
  } catch (error) {
    console.error('Submit error:', error);
    res.status(500).json({ error: 'Server error processing request.' });
  }
});

// 2. Admin Auth
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '12h' });
    return res.json({ success: true, token });
  }
  res.status(401).json({ error: 'Invalid username or password' });
});

// 3. Get Requests
app.get('/api/admin/requests', authenticateAdmin, async (req, res) => {
  try {
    const { status, travelType } = req.query;
    let query = {};
    if (status) query.status = status;
    if (travelType) query.travelType = travelType;
    const requests = await Request.find(query).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

// 4. Update Quote & Dispatch Notifications
app.post('/api/admin/send-quote', authenticateAdmin, async (req, res) => {
  try {
    const { id, quotePrice, commission, customMessage } = req.body;
    const targetRequest = await Request.findById(id);
    if (!targetRequest) return res.status(404).json({ error: 'Request not found' });

    targetRequest.quotePrice = Number(quotePrice);
    targetRequest.commission = Number(commission);
    targetRequest.status = 'quoted';
    await targetRequest.save();

    // Send Quote Email to Client
    const clientEmailHtml = `
      <div style="font-family: Arial, sans-serif; color: #1e293b; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px;">
        <h2 style="color: #0b2b5c; margin-top: 0;">Your Travel Quote from Aurelia</h2>
        <p>Dear ${targetRequest.userName},</p>
        <p>We found an exclusive rate for your upcoming journey from <strong>${targetRequest.origin}</strong> to <strong>${targetRequest.destination}</strong>.</p>
        <div style="background-color: #f8fafc; padding: 16px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 0; font-size: 14px; color: #64748b;">Special Quoted Price:</p>
          <p style="margin: 4px 0 0 0; font-size: 28px; font-weight: bold; color: #f9a826;">₹${targetRequest.quotePrice}</p>
        </div>
        ${customMessage ? `<p><em>${customMessage}</em></p>` : ''}
        <p>To confirm and book your seat at this rate, reply directly to this email or reach us immediately:</p>
        <p>📞 Phone/WhatsApp: <strong>+91 9323003681</strong> / <strong>+91 9011383313</strong></p>
        <p style="font-size: 12px; color: #94a3b8; margin-top: 24px;">Thank you for choosing Aurelia.</p>
      </div>
    `;

    mailTransporter.sendMail({
      from: `"Aurelia Tours & Travels" <${process.env.SMTP_USER}>`,
      to: targetRequest.userEmail,
      subject: `Exclusive Quote: ${targetRequest.origin} to ${targetRequest.destination} – Aurelia Tours & Travels`,
      html: clientEmailHtml
    }).catch(err => console.error('Client quote email error:', err.message));

    // Optional WhatsApp to Client
    const clientWaMsg = `Hello ${targetRequest.userName}, your custom quote for ${targetRequest.origin} to ${targetRequest.destination} (${new Date(targetRequest.departureDate).toLocaleDateString()}) is ₹${targetRequest.quotePrice}. Reply to this chat to finalize booking!`;
    sendWhatsApp(targetRequest.userPhone, clientWaMsg);

    res.json({ success: true, message: 'Quote updated and notifications sent.' });
  } catch (error) {
    console.error('Send quote error:', error);
    res.status(500).json({ error: 'Failed to dispatch quote' });
  }
});

// 5. Update Status Only
app.put('/api/admin/status/:id', authenticateAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Request.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Aurelia Server running on port ${PORT}`));
