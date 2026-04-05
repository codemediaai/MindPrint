/**
 * MindPrint — Daily Page Generator & Delivery
 * Google Cloud Function (2nd gen)
 *
 * Triggered nightly by Cloud Scheduler.
 * For each active subscriber:
 *   1. Pulls today's virtue from the 52-week framework
 *   2. Fetches Google Calendar events via Calendar API
 *   3. Renders the daily page as a PDF (HTML → Puppeteer)
 *   4. Emails the PDF simultaneously to:
 *      - User's HP ePrint address (auto-prints)
 *      - User's personal email (backup copy)
 *
 * Environment variables required:
 *   SUPABASE_URL        - Supabase project URL
 *   SUPABASE_SERVICE_KEY - Supabase service role key
 *   SENDGRID_API_KEY    - SendGrid API key for transactional email
 *   FROM_EMAIL          - Sender email address
 */

import { createClient } from '@supabase/supabase-js';
import puppeteer from 'puppeteer';
import sgMail from '@sendgrid/mail';

// ── Config ──
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const FROM_EMAIL = process.env.FROM_EMAIL || 'daily@mindrootfoundation.org';

// ── Virtue lookup (same data as frontend) ──
import VIRTUES from '../src/data/virtues.js';
import { getWeekNumber, getSeason, getDayOfYear, DAYS } from '../src/lib/helpers.js';

/**
 * Generate the daily page HTML for a single user.
 */
function renderDailyHTML(user, virtue, weekNum, season, events, targetDate) {
  const dayName = DAYS[targetDate.getDay()];
  const dayOfYear = getDayOfYear(targetDate);
  const dateStr = targetDate.toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  }).toUpperCase();

  // Returns a complete HTML document styled for legal-size PDF output
  // Ink-efficient: no fills, no backgrounds, typography carries all weight
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @page { size: 8.5in 14in; margin: 0.6in 0.75in 0.5in 0.75in; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Georgia, serif; color: #1a1a1a; font-size: 11px; line-height: 1.4; }
  .label { font-family: system-ui, sans-serif; font-size: 9px; font-weight: 700; color: #999; letter-spacing: 2px; }
  .rule { border-top: 0.5px solid #ccc; margin: 14px 0; padding-top: 14px; }
  .rule-heavy { border-top: 2.5px solid #1a1a1a; margin: 10px 0; padding-top: 14px; }
  .header-top { display: flex; justify-content: space-between; border-top: 1px solid #333; padding-top: 6px; }
  .brand { font-family: system-ui, sans-serif; font-size: 9px; font-weight: 700; color: #888; letter-spacing: 4px; }
  .date-text { font-family: system-ui, sans-serif; font-size: 9px; color: #888; letter-spacing: 1px; }
  .day-name { font-size: 32px; font-weight: 700; letter-spacing: -1px; }
  .meta { font-family: system-ui, sans-serif; font-size: 10px; color: #999; }
  .season { font-style: italic; font-size: 10px; color: #888; }
  .virtue-name { font-size: 24px; font-weight: 700; }
  .virtue-latin { font-size: 14px; font-style: italic; color: #999; margin-left: 10px; }
  .virtue-def { font-size: 12px; font-style: italic; color: #555; margin-top: 6px; }
  .columns { display: flex; gap: 24px; }
  .col { flex: 1; }
  .event { display: flex; gap: 8px; margin-bottom: 5px; }
  .event-time { font-family: system-ui, sans-serif; font-size: 10px; font-weight: 700; color: #444; min-width: 65px; }
  .checkbox { display: inline-block; width: 10px; height: 10px; border: 1px solid #ccc; margin-right: 6px; }
  .write-line { border-bottom: 0.5px solid #ddd; height: 18px; margin-bottom: 2px; }
  .quote-mark { font-size: 32px; color: #ddd; line-height: 0; }
  .quote-text { font-size: 12.5px; font-style: italic; color: #333; line-height: 1.6; margin-left: 4px; }
  .quote-author { font-size: 10px; color: #999; margin-left: 4px; font-family: system-ui, sans-serif; }
  .xp { font-family: system-ui, sans-serif; font-size: 9px; font-weight: 700; color: #bbb; }
  .footer { border-top: 1px solid #333; margin-top: 20px; padding-top: 6px; display: flex; justify-content: space-between; font-family: system-ui, sans-serif; font-size: 8px; color: #bbb; }
  .refl-label { font-family: system-ui, sans-serif; font-size: 9px; color: #bbb; }
  .dot { display: inline-block; width: 20px; height: 20px; border-radius: 50%; border: 1px solid #ccc; text-align: center; margin: 0 3px; }
  .dot.done { background: #e0e0e0; }
  .dot.today { border: 2px solid #1a1a1a; }
  .dot-label { font-family: system-ui, sans-serif; font-size: 7px; color: #bbb; }
</style>
</head>
<body>

<div class="header-top">
  <span class="brand">M I N D P R I N T</span>
  <span class="date-text">${dateStr}</span>
</div>
<div style="display:flex; justify-content:space-between; align-items:baseline; margin-top:4px;">
  <div class="day-name">${dayName}</div>
  <div style="text-align:right">
    <div class="meta">Day ${dayOfYear} of 365 · Week ${weekNum}</div>
    <div class="season">${season.name.toUpperCase()} — ${season.description}</div>
  </div>
</div>

<div class="rule-heavy">
  <div style="display:flex; justify-content:space-between;">
    <span class="label">VIRTUE OF THE WEEK</span>
    <span class="label">WEEK ${weekNum} OF 52</span>
  </div>
  <div style="margin-top:10px">
    <span class="virtue-name">${virtue.name}</span>
    <span class="virtue-latin">${virtue.latin}</span>
  </div>
  <div class="virtue-def">${virtue.def}</div>
  <p style="font-size:11px; color:#444; margin-top:8px;">
    <span class="label">TODAY'S FOCUS: </span>${virtue.prompt}
  </p>
</div>

<div class="rule">
  <div class="columns">
    <div class="col">
      <span class="label">TODAY'S SCHEDULE</span>
      <div style="margin-top:10px">
        ${events.length > 0
          ? events.slice(0, 8).map(ev => `<div class="event"><span class="event-time">${ev.time}</span><span>${ev.title}</span></div>`).join('')
          : '<p style="font-style:italic; color:#bbb;">No events scheduled</p>'
        }
      </div>
      <div style="margin-top:20px">
        <span class="label">PRIORITIES</span>
        <div style="margin-top:10px">
          ${[1,2,3,4,5,6].map(() => `<div style="display:flex; align-items:center; gap:8px; margin-bottom:10px;"><span class="checkbox"></span><div style="flex:1; border-bottom:0.5px solid #ddd; height:14px;"></div></div>`).join('')}
        </div>
      </div>
    </div>
    <div class="col">
      <span class="label">DAILY CHALLENGE</span>
      <p style="margin-top:8px">${virtue.challenge.daily}</p>
      <span class="xp">+${virtue.challenge.dxp} XP</span>

      <div style="margin-top:18px">
        <span class="label">WEEKLY CHALLENGE</span>
        <p style="margin-top:8px">${virtue.challenge.weekly}</p>
        <span class="xp">+${virtue.challenge.wxp} XP</span>
      </div>

      <div style="margin-top:18px">
        <span class="label">WEEK PROGRESS</span>
        <div style="display:flex; gap:6px; margin-top:10px">
          ${['S','M','T','W','T','F','S'].map((d, i) => {
            const cls = i < targetDate.getDay() ? 'dot done' : i === targetDate.getDay() ? 'dot today' : 'dot';
            return `<div style="text-align:center"><div class="${cls}"></div><div class="dot-label">${d}</div></div>`;
          }).join('')}
        </div>
      </div>
    </div>
  </div>
</div>

<div class="rule">
  <span class="label">QUOTE OF THE DAY</span>
  <div style="margin-top:10px; padding-left:16px;">
    <span class="quote-mark">"</span>
    <p class="quote-text">${virtue.quote.text}</p>
    <p class="quote-author">— ${virtue.quote.author}</p>
  </div>
</div>

<div class="rule">
  <span class="label">EVENING REFLECTION</span>
  <p style="font-size:11px; font-style:italic; color:#666; margin-top:8px;">${virtue.reflection}</p>

  ${["What went well today?", "What could I improve?", "Notes & observations"].map(label => `
    <div style="margin-top:14px">
      <span class="refl-label">${label}</span>
      <div style="margin-top:6px">
        ${[1,2,3].map(() => '<div class="write-line"></div>').join('')}
      </div>
    </div>
  `).join('')}
</div>

<div class="footer">
  <span>MindPrint · ${targetDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} · ${virtue.name} (${virtue.latin})</span>
  <span>Day ${dayOfYear} · Week ${weekNum}</span>
</div>

</body>
</html>`;
}

/**
 * Convert HTML to PDF buffer using Puppeteer.
 */
async function htmlToPdf(html) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdf = await page.pdf({
    width: '8.5in',
    height: '14in',
    printBackground: false,
    margin: { top: '0.6in', right: '0.75in', bottom: '0.5in', left: '0.75in' }
  });
  await browser.close();
  return pdf;
}

/**
 * Send PDF to both ePrint and personal email.
 */
async function deliverPdf(pdfBuffer, user, targetDate, virtueName) {
  const dateStr = targetDate.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  });
  const filename = `mindprint-${targetDate.toISOString().split('T')[0]}.pdf`;
  const attachment = {
    content: pdfBuffer.toString('base64'),
    filename,
    type: 'application/pdf',
    disposition: 'attachment'
  };

  const recipients = [];
  if (user.eprint_email) recipients.push(user.eprint_email);
  if (user.personal_email) recipients.push(user.personal_email);

  if (recipients.length === 0) {
    console.warn(`User ${user.id} has no delivery addresses configured.`);
    return;
  }

  const msg = {
    to: recipients,
    from: FROM_EMAIL,
    subject: `MindPrint — ${dateStr} — ${virtueName}`,
    text: `Your MindPrint daily page for ${dateStr} is attached.\n\nThis week's virtue: ${virtueName}\n\n— Mindroot Foundation`,
    attachments: [attachment]
  };

  await sgMail.send(msg);
  console.log(`Delivered to ${recipients.join(', ')} for ${dateStr}`);
}

/**
 * Fetch Google Calendar events for a user.
 * Requires stored OAuth refresh token in Supabase.
 */
async function fetchCalendarEvents(user, targetDate) {
  // TODO: Implement Google Calendar API fetch using stored OAuth tokens
  // For now, returns empty array — calendar integration is Phase 2
  //
  // When implemented:
  // 1. Use user's stored refresh_token to get an access_token
  // 2. Call Google Calendar API: GET /calendars/primary/events
  //    with timeMin/timeMax set to the target date
  // 3. Map results to { time: "9:00 AM", title: "Meeting name" }
  return [];
}

/**
 * Main Cloud Function entry point.
 * Called by Cloud Scheduler at each user's configured print time.
 */
export async function generateDailyPages(req, res) {
  try {
    const targetDate = new Date();
    const weekNum = getWeekNumber(targetDate);
    const virtue = VIRTUES.find(v => v.week === weekNum) || VIRTUES[0];
    const season = getSeason(weekNum);

    // Fetch all active subscribers
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('active', true);

    if (error) throw error;

    console.log(`Generating daily pages for ${users.length} users — Week ${weekNum}: ${virtue.name}`);

    for (const user of users) {
      try {
        // Fetch calendar events
        const events = await fetchCalendarEvents(user, targetDate);

        // Render HTML
        const html = renderDailyHTML(user, virtue, weekNum, season, events, targetDate);

        // Convert to PDF
        const pdfBuffer = await htmlToPdf(html);

        // Deliver to printer + email
        await deliverPdf(pdfBuffer, user, targetDate, virtue.name);

        // Log delivery
        await supabase.from('deliveries').insert({
          user_id: user.id,
          date: targetDate.toISOString().split('T')[0],
          week: weekNum,
          virtue: virtue.name,
          status: 'delivered'
        });

      } catch (userErr) {
        console.error(`Failed for user ${user.id}:`, userErr.message);
        await supabase.from('deliveries').insert({
          user_id: user.id,
          date: targetDate.toISOString().split('T')[0],
          week: weekNum,
          virtue: virtue.name,
          status: 'failed',
          error: userErr.message
        });
      }
    }

    res.status(200).json({ ok: true, users: users.length, week: weekNum, virtue: virtue.name });
  } catch (err) {
    console.error('Daily generation failed:', err);
    res.status(500).json({ error: err.message });
  }
}
