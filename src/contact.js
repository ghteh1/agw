export async function onContactRequest(request, env) {
  try {
    if (!env.RESEND_API_KEY || !env.CONTACT_FROM_EMAIL) {
      console.error('Contact form is missing one or more Resend environment variables.');
      return json({ ok: false, error: 'Email service is not configured yet.' }, 503);
    }

    const data = await request.formData();

    // Honeypot: if this hidden field is filled, silently pretend success (bot caught).
    if (data.get('company_website')) {
      return json({ ok: true });
    }

    const name = field(data, 'name', 120);
    const email = field(data, 'email', 254);
    const company = field(data, 'company', 160);
    const port = field(data, 'port', 160);
    const interest = field(data, 'interest', 160);
    const vol = field(data, 'vol', 80);
    const msg = field(data, 'msg', 5_000);

    if (!name || !email) {
      return json({ ok: false, error: 'Name and email are required.' }, 400);
    }
    if (!isEmail(email)) {
      return json({ ok: false, error: 'Please enter a valid email address.' }, 400);
    }

    const isBiocharEnquiry = interest.toLowerCase().includes('biochar');
    const recipients = isBiocharEnquiry
      ? { to: ['chengfa@asiagreenwood.com'], cc: ['lktan.agg@gmail.com'] }
      : { to: ['lktan.agg@gmail.com'], cc: ['lktan@asiagreenwood.com'] };

    const html = `
      <h2>New enquiry from asiagreenwood.com</h2>
      <p><b>Name:</b> ${escapeHtml(name)}</p>
      <p><b>Company:</b> ${escapeHtml(company)}</p>
      <p><b>Email:</b> ${escapeHtml(email)}</p>
      <p><b>Destination port:</b> ${escapeHtml(port)}</p>
      <p><b>Interest:</b> ${escapeHtml(interest)}</p>
      <p><b>Volume (m³/month):</b> ${escapeHtml(vol)}</p>
      <p><b>Message:</b><br>${escapeHtml(msg).replace(/\n/g, '<br>')}</p>
    `;

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM_EMAIL,
        to: recipients.to,
        cc: recipients.cc,
        reply_to: email,
        subject: `New ${isBiocharEnquiry ? 'Biochar' : 'Plywood'} enquiry from ${name}${company ? ' — ' + company : ''}`,
        html,
      }),
    });

    if (!resendRes.ok) {
      const errText = await resendRes.text();
      console.error('Resend rejected contact form email:', resendRes.status, errText);
      return json({ ok: false, error: 'Email service error. Please try again shortly.' }, 502);
    }

    return json({ ok: true });
  } catch (err) {
    console.error('Contact form request failed:', err);
    return json({ ok: false, error: 'Unexpected error. Please try again shortly.' }, 500);
  }
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

function field(data, name, maxLength) {
  return (data.get(name) || '').toString().trim().slice(0, maxLength);
}

function isEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
