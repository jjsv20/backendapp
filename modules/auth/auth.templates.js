const emailVerificationTemplate = (code) => `
  <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
    
    <h2 style="color: #1a1a1a; margin-bottom: 8px;">Verifica tu cuenta</h2>
    <p style="color: #555; margin-bottom: 32px;">
      Ingresa este código en la app para activar tu cuenta:
    </p>

    <div style="
      background: #f4f4f4;
      border-radius: 12px;
      padding: 24px;
      text-align: center;
      letter-spacing: 12px;
      font-size: 36px;
      font-weight: bold;
      color: #1a1a1a;
      margin-bottom: 24px;
    ">
      ${code}
    </div>

    <p style="color: #888; font-size: 13px;">
      Este código expira en <strong>15 minutos</strong>.<br/>
      Si no creaste esta cuenta, ignora este correo.
    </p>

  </div>
`;

const emailWolcomeTemplate = (fullName) => `
  <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
    
    <h2 style="color: #1a1a1a; margin-bottom: 8px;">¡Bienvenido a OrderFood, ${fullName}!</h2>
    <p style="color: #555; margin-bottom: 32px;">
      Gracias por registrarte. Estamos emocionados de tenerte con nosotros.
    </p>

  </div>
`;

module.exports = { emailVerificationTemplate, emailWolcomeTemplate };