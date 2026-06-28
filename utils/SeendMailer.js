const nodeMailer = require('nodemailer');
require('dotenv').config();

const transporter = nodeMailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

function layout({ preheader, body }) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>OrderFood</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
<span style="display:none;max-height:0;overflow:hidden;">${preheader}</span>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0a0a0a;padding:40px 16px;">
  <tr><td align="center">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">

      <!-- Logo -->
      <tr><td align="center" style="padding-bottom:28px;">
        <table cellpadding="0" cellspacing="0" border="0">
          <tr><td style="background:#111;border:1px solid #1f1f1f;border-radius:16px;padding:14px 28px;">
            <span style="font-size:22px;font-weight:800;color:#fff;letter-spacing:-0.5px;">Order<span style="color:#1db954;">Food</span></span>
          </td></tr>
        </table>
      </td></tr>

      <!-- Card -->
      <tr><td style="background:#111;border:1px solid #1f1f1f;border-radius:24px;padding:40px 36px;">
        ${body}
      </td></tr>

      <!-- Footer -->
      <tr><td align="center" style="padding-top:28px;">
        <p style="margin:0 0 6px;font-size:12px;color:#374151;">© ${new Date().getFullYear()} OrderFood · Colombia</p>
        <p style="margin:0;font-size:11px;color:#1f2937;">Este correo fue enviado automáticamente, por favor no respondas.</p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

function featureRow(icon, text) {
  return `
    <tr><td style="padding:6px 0;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
        <td width="36" valign="middle">
          <div style="width:28px;height:28px;border-radius:8px;background:rgba(29,185,84,0.12);border:1px solid rgba(29,185,84,0.25);text-align:center;line-height:28px;font-size:13px;">${icon}</div>
        </td>
        <td style="padding-left:12px;vertical-align:middle;">
          <span style="font-size:14px;color:#d1d5db;line-height:1.5;">${text}</span>
        </td>
      </tr></table>
    </td></tr>`;
}

function htmlCustomer(name) {
  return layout({
    preheader: `¡Bienvenido ${name}! Tu cuenta en OrderFood está lista.`,
    body: `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
        <tr><td align="center">
          <div style="width:72px;height:72px;border-radius:50%;background:rgba(29,185,84,0.12);border:1.5px solid rgba(29,185,84,0.3);text-align:center;line-height:72px;font-size:30px;display:inline-block;">✓</div>
        </td></tr>
      </table>

      <h1 style="margin:0 0 8px;font-size:26px;font-weight:800;color:#fff;text-align:center;line-height:1.2;">¡Hola, ${name}! 👋</h1>
      <p style="margin:0 0 6px;font-size:15px;color:#1db954;font-weight:600;text-align:center;">Tu cuenta ha sido creada exitosamente</p>
      <p style="margin:0 0 32px;font-size:14px;color:#6b7280;text-align:center;line-height:1.6;">Ya eres parte de la familia OrderFood.<br/>Esto es lo que puedes hacer ahora:</p>

      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0d0d0d;border:1px solid #1a1a1a;border-radius:16px;padding:20px 20px 14px;">
        <tbody>
          ${featureRow('🍔', 'Explora cientos de restaurantes y pide en segundos.')}
          ${featureRow('📍', 'Sigue tu pedido en tiempo real desde la cocina hasta tu puerta.')}
          ${featureRow('❤️', 'Guarda tus platos favoritos y repide con un solo toque.')}
          ${featureRow('🎁', 'Accede a promociones exclusivas y descuentos personalizados.')}
        </tbody>
      </table>

      <div style="height:1px;background:#1a1a1a;margin:28px 0;"></div>

      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr><td align="center">
          <a href="#" style="display:inline-block;background:#1db954;color:#000;font-size:15px;font-weight:800;text-decoration:none;padding:15px 40px;border-radius:30px;">Abrir OrderFood →</a>
        </td></tr>
      </table>

      <p style="margin:32px 0 0;font-size:13px;color:#4b5563;text-align:center;line-height:1.6;">
        Con gusto,<br/><span style="color:#9ca3af;font-weight:600;">El equipo de OrderFood</span>
      </p>`
  });
}

function htmlOwner(name) {
  return layout({
    preheader: `¡Bienvenido ${name}! Tu cuenta de propietario en OrderFood está lista.`,
    body: `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
        <tr><td align="center">
          <div style="width:72px;height:72px;border-radius:50%;background:rgba(29,185,84,0.12);border:1.5px solid rgba(29,185,84,0.3);text-align:center;line-height:72px;font-size:30px;display:inline-block;">🏪</div>
        </td></tr>
      </table>

      <h1 style="margin:0 0 8px;font-size:26px;font-weight:800;color:#fff;text-align:center;line-height:1.2;">¡Bienvenido, ${name}!</h1>
      <p style="margin:0 0 6px;font-size:15px;color:#1db954;font-weight:600;text-align:center;">Tu cuenta de propietario está activa</p>
      <p style="margin:0 0 32px;font-size:14px;color:#6b7280;text-align:center;line-height:1.6;">Estamos emocionados de ayudarte a crecer tu negocio.<br/>Con tu cuenta puedes:</p>

      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0d0d0d;border:1px solid #1a1a1a;border-radius:16px;padding:20px 20px 14px;">
        <tbody>
          ${featureRow('🍽️', 'Crea y gestiona el menú de tu restaurante con fotos y precios.')}
          ${featureRow('📦', 'Recibe y administra pedidos de clientes en tiempo real.')}
          ${featureRow('📊', 'Consulta estadísticas de ventas y reportes de rendimiento.')}
          ${featureRow('⭐', 'Gestiona reseñas y construye tu reputación online.')}
        </tbody>
      </table>

      <div style="height:1px;background:#1a1a1a;margin:28px 0;"></div>

      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr><td align="center">
          <a href="#" style="display:inline-block;background:#1db954;color:#000;font-size:15px;font-weight:800;text-decoration:none;padding:15px 40px;border-radius:30px;">Ir al panel de control →</a>
        </td></tr>
      </table>

      <p style="margin:32px 0 0;font-size:13px;color:#4b5563;text-align:center;line-height:1.6;">
        Con gusto,<br/><span style="color:#9ca3af;font-weight:600;">El equipo de OrderFood</span>
      </p>`
  });
}

function htmlNuevoLogin(name) {
  const now = new Date().toLocaleString('es-CO', {
    dateStyle: 'long', timeStyle: 'short', timeZone: 'America/Bogota',
  });
  return layout({
    preheader: `Nuevo inicio de sesión detectado en tu cuenta OrderFood.`,
    body: `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
        <tr><td align="center">
          <div style="width:72px;height:72px;border-radius:50%;background:rgba(251,191,36,0.1);border:1.5px solid rgba(251,191,36,0.3);text-align:center;line-height:72px;font-size:30px;display:inline-block;">🔐</div>
        </td></tr>
      </table>

      <h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#fff;text-align:center;">Nuevo inicio de sesión</h1>
      <p style="margin:0 0 32px;font-size:14px;color:#6b7280;text-align:center;line-height:1.6;">
        Hola <strong style="color:#d1d5db;">${name}</strong>, detectamos un acceso reciente a tu cuenta.
      </p>

      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0d0d0d;border:1px solid #1a1a1a;border-radius:16px;padding:20px;">
        <tr><td>
          <p style="margin:0 0 4px;font-size:11px;color:#4b5563;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Fecha y hora</p>
          <p style="margin:0;font-size:14px;color:#d1d5db;font-weight:600;">${now} (hora Colombia)</p>
        </td></tr>
      </table>

      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:12px;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);border-radius:14px;padding:16px;">
        <tr>
          <td width="28" valign="top" style="font-size:16px;">⚠️</td>
          <td style="padding-left:10px;">
            <p style="margin:0;font-size:13px;color:#fca5a5;line-height:1.5;">Si no fuiste tú, <strong>cambia tu contraseña de inmediato</strong> y contacta a nuestro soporte.</p>
          </td>
        </tr>
      </table>

      <div style="height:1px;background:#1a1a1a;margin:28px 0;"></div>

      <p style="margin:0;font-size:13px;color:#4b5563;text-align:center;line-height:1.6;">
        Si fuiste tú, puedes ignorar este mensaje.<br/>
        <span style="color:#9ca3af;font-weight:600;">El equipo de OrderFood</span>
      </p>`
  });
}

async function enviarBienvenidaCustomer({ to, name, role }) {
  try {
    const info = await transporter.sendMail({
      from: `"OrderFood" <${process.env.EMAIL_USER}>`,
      to,
      subject: `¡Bienvenido a OrderFood, ${name}! 🎉`,
      html: htmlCustomer(name),
    });

    console.log(`Bienvenida CUSTOMER enviada a ${to} | ID: ${info.messageId}`);

  } catch (error) {
    console.error('Error enviando bienvenida customer:', error);
    throw new Error('No se pudo enviar el correo de bienvenida');
  }
}

async function enviarBienvenidaOwner({ to, name, role }) {
  try {
    const info = await transporter.sendMail({
      from: `"OrderFood" <${process.env.EMAIL_USER}>`,
      to,
      subject: `¡Bienvenido a OrderFood, ${name}! Tu cuenta de propietario está lista`,
      html: htmlOwner(name),
    });

    console.log(`Bienvenida OWNER enviada a ${to} | ID: ${info.messageId}`);

  } catch (error) {
    console.error('Error enviando bienvenida owner:', error);
    throw new Error('No se pudo enviar el correo de bienvenida');
  }
}

async function enviarNuevoInicioSesion({ to, name }) {
  try {
    const info = await transporter.sendMail({
      from: `"OrderFood" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Nuevo inicio de sesión en tu cuenta OrderFood`,
      html: htmlNuevoLogin(name),
    });
    console.log(`Alerta de sesión enviada a ${to} | ID: ${info.messageId}`);
  } catch (error) {
    console.error('Error enviando alerta de sesión:', error);
    throw new Error('No se pudo enviar el correo de inicio de sesión');
  }
}

async function nuevoUsuarioRegistrado({ name, role, phone, email }) {
  return transporter.sendMail({
    from: `"OrderFood" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `Nuevo usuario registrado`,
    html: `
            <h2>Nuevo registro</h2>
            <p><b>Nombre:</b> ${name}</p>
            <p><b>Rol:</b> ${role}</p>
            <p><b>Teléfono:</b> ${phone ?? "N/A"}</p>
            <p><b>Email:</b> ${email ?? "N/A"}</p>
        `
  });
}

module.exports = { enviarBienvenidaCustomer, enviarNuevoInicioSesion, nuevoUsuarioRegistrado };