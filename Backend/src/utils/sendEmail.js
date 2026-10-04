import nodemailer from 'nodemailer';

let transporter;

const getTransporter = () => {
  const user = process.env.EMAIL_USER?.trim();
  const pass = process.env.EMAIL_PASS?.replace(/\s/g, '');

  if (!user || !pass) {
    throw new Error(
      'Email credentials are missing. Set EMAIL_USER and EMAIL_PASS.',
    );
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });
  }

  return transporter;
};

export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const info = await getTransporter().sendMail({
      from: `"G71 Logistics" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: text || subject,
      html,
    });
    console.log(`✅ Email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown email error';
    console.error(`❌ Email failed to ${to}:`, error);
    return { success: false, error };
  }
};

export const sendOtpEmail = async (
  clientEmail,
  clientName,
  trackingId,
  otp,
) => {
  const html = `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; background: #0a0a0a; color: #fff; padding: 0; border-radius: 20px; overflow: hidden; border: 1px solid #222;">
    <div style="background: #ef4444; padding: 16px 30px; text-align: center;">
      <p style="margin:0; font-weight: bold; letter-spacing: 0.4em; font-size: 11px; color: #fff;">G71 LOGISTICS • SECURE DELIVERY</p>
    </div>
    <div style="padding: 30px;">
      <h1 style="font-size: 26px; line-height: 1.1; margin: 0;">Your package is<br>out for delivery.</h1>
      <p style="color: #999; margin-top: 12px; font-size: 14px;">Tracking ID: <span style="color: #fff; font-weight: bold; letter-spacing: 0.1em;">${trackingId}</span></p>
      <p style="color: #ccc; line-height: 1.7; margin-top: 20px; font-size: 14px;">Hi ${clientName || 'Customer'},<br>Your rider is at your location. Please share the OTP below with the rider <b style="color:#fff">only after</b> you physically receive your package.</p>
      
      <div style="background: #111; border: 1px dashed #333; padding: 24px; text-align: center; border-radius: 16px; margin: 28px 0;">
        <p style="letter-spacing: 0.4em; color: #666; font-size: 10px; margin: 0; font-weight: bold;">ONE TIME PASSWORD</p>
        <p style="font-size: 42px; font-weight: 900; letter-spacing: 0.25em; margin: 12px 0; color: #fff;">${otp}</p>
        <p style="color: #ef4444; font-size: 11px; font-weight: bold; letter-spacing: 0.1em; margin: 0;">EXPIRES IN 5 MINUTES • 3 ATTEMPTS MAX</p>
      </div>

      <div style="background: #1a1a1a; padding: 16px; border-radius: 12px; border-left: 3px solid #ef4444;">
        <p style="margin:0; font-size: 12px; color: #aaa; line-height: 1.6;">⚠️ Security: Delivery cannot be completed without this OTP. Do not share via phone. Give it face-to-face to rider.</p>
      </div>

      <p style="color: #555; font-size: 11px; margin-top: 24px; text-align: center;">This is an automated email from G71 Logistics. Need help? Contact ${process.env.CONTACT_EMAIL || process.env.EMAIL_USER}</p>
    </div>
  </div>
  `;
  return sendEmail({
    to: clientEmail,
    subject: `Your G71 OTP is ${otp} - ${trackingId} out for delivery`,
    html,
    text: `Hi ${clientName}, Your OTP for ${trackingId} is ${otp}. Expires in 5 mins. Share only after receiving package.`,
  });
};

const escapeHtml = (value = '') =>
  String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return entities[character];
  });

export const sendTrackingCodeEmail = async ({
  to,
  name,
  trackingCode,
  price,
}) => {
  if (!to) return { success: false, error: 'Customer email is missing' };

  const frontendUrl = (
    process.env.FRONTEND_URL || 'http://localhost:5173'
  ).replace(/\/+$/, '');
  const trackingUrl = `${frontendUrl}/track/${encodeURIComponent(trackingCode)}`;
  const safeName = escapeHtml(name || 'Customer');
  const safeTrackingCode = escapeHtml(trackingCode);
  const formattedPrice = Number.isFinite(Number(price))
    ? `₦${Number(price).toLocaleString()}`
    : 'Confirmed by our dispatch team';

  return sendEmail({
    to,
    subject: `Your G71 delivery is approved - ${trackingCode}`,
    text: `Hi ${name || 'Customer'}, your delivery request has been approved. Tracking code: ${trackingCode}. Price: ${formattedPrice}. Track your delivery: ${trackingUrl}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#111;line-height:1.6">
        <h1>Your delivery is approved</h1>
        <p>Hi ${safeName}, your G71 delivery request has been approved.</p>
        <p>Your tracking code is <strong>${safeTrackingCode}</strong>.</p>
        <p>Current approved price: <strong>${formattedPrice}</strong></p>
        <p><a href="${trackingUrl}">Track your delivery</a></p>
        <p>Keep this tracking code so you can check your delivery status.</p>
      </div>
    `,
  });
};

export const sendContactEmail = async ({ name, email, message }) => {
  const html = `
    <h3>New Contact Message from G71 Website</h3>
    <p><b>Name:</b> ${name}</p>
    <p><b>Email:</b> ${email}</p>
    <p><b>Message:</b></p>
    <p>${message}</p>
  `;
  return sendEmail({
    to: process.env.CONTACT_EMAIL || process.env.EMAIL_USER,
    subject: `New Contact: ${name} - G71`,
    html,
    text: message,
  });
};
export const sendDriverWelcomeEmail = async ({
  to,
  name,
  email,
  tempPassword,
  loginUrl,
}) => {
  const html = `<div style="font-family:Arial;max-width:600px;margin:auto;background:#0a0a0a;color:#fff;border-radius:20px;overflow:hidden;border:1px solid #222"><div style="background:#ef4444;padding:16px;text-align:center"><p style="margin:0;font-weight:bold;letter-spacing:0.4em;font-size:11px">G71 LOGISTICS • DRIVER APPROVED</p></div><div style="padding:30px"><h1>Welcome aboard, ${name}!</h1><p>Your CV was ACCEPTED. Your driver account is live.</p><div style="background:#111;border:1px dashed #333;padding:20px;border-radius:16px;margin:24px 0"><p>LOGIN EMAIL</p><p style="font-weight:bold;font-size:16px">${email}</p><p>TEMP PASSWORD</p><p style="font-weight:900;font-size:22px;color:#ef4444">${tempPassword}</p></div><a href="${loginUrl}" style="background:#fff;color:#000;padding:14px 24px;text-decoration:none;border-radius:10px;font-weight:bold;display:inline-block">Login to Driver Portal</a><p style="color:#ef4444;font-size:12px;margin-top:20px">⚠️ You MUST change password on first login.</p></div></div>`;
  return sendEmail({
    to,
    subject: `G71 Driver Account Approved - Welcome ${name}!`,
    html,
  });
};
