import nodemailer from 'nodemailer';

let transporter;

function getTransporter() {
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: Number(process.env.SMTP_PORT) || 587,
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });
  return transporter;
}

export async function sendAppointmentNotification(appointment) {
  const mailOptions = {
    from: process.env.ADMIN_EMAIL || 'noreply@dryeye.local',
    to: appointment.email,
    subject: 'Dry Eye Screening – Appointment Request Received',
    html: `
      <h2>Appointment Request Confirmed</h2>
      <p>Dear ${appointment.patientName},</p>
      <p>We received your appointment request for <strong>${new Date(appointment.appointmentDate).toLocaleDateString()}</strong>.</p>
      <p><strong>Symptoms summary:</strong> ${appointment.symptoms}</p>
      <p>Our team will contact you at ${appointment.phone} within 1–2 business days.</p>
      <p><em>This is a simulated notification for demo purposes.</em></p>
    `,
  };

  try {
    const info = await getTransporter().sendMail(mailOptions);
    return { sent: true, preview: info.messageId };
  } catch (err) {
    console.log('[Email simulation]', mailOptions.subject, '→', appointment.email);
    return { sent: false, simulated: true };
  }
}

export async function sendScreeningReport(email, screening) {
  const mailOptions = {
    from: process.env.ADMIN_EMAIL || 'noreply@dryeye.local',
    to: email,
    subject: `Your Dry Eye Screening Report – ${screening.riskCategory}`,
    html: `
      <h2>Screening Results</h2>
      <p>Risk Level: <strong>${screening.riskCategory}</strong></p>
      <p>Clinical Score: <strong>${screening.riskScore}</strong> points</p>
      <h3>Recommendations</h3>
      <ul>${screening.recommendations.map((r) => `<li><b>${r.title}</b>: ${r.text}</li>`).join('')}</ul>
    `,
  };

  try {
    await getTransporter().sendMail(mailOptions);
    return { sent: true };
  } catch {
    console.log('[Email simulation] Report sent to', email);
    return { sent: false, simulated: true };
  }
}
