const nodemailer = require("nodemailer");
const env = require("./env");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS,
    },
});

const sendEmail = async ({ to, subject, html }) => {
    await transporter.sendMail({
        from: `"Order Food" <${env.EMAIL_USER}>`,
        to,
        subject,
        html,
    });
};

const nuevoUsuarioRegistrado = async ({ name, role, phone, email }) => {
    await transporter.sendMail({
        from: `"OrderFood" <${env.EMAIL_USER}>`,
        to: env.ADMIN_EMAIL,
        subject: `Nuevo usuario registrado`,
        html: `
            <h2>Nuevo registro</h2>
            <p><b>Nombre:</b> ${name}</p>
            <p><b>Rol:</b> ${role}</p>
            <p><b>Teléfono:</b> ${phone ?? "N/A"}</p>
            <p><b>Email:</b> ${email ?? "N/A"}</p>
        `
    });
};

const newRestaurantApplication = async ({ restaurantName, ownerName, restaurantEmail, restaurantPhone }) => {
    await transporter.sendMail({
        from: `"OrderFood" <${env.EMAIL_USER}>`,
        to: env.ADMIN_EMAIL,
        subject: "Nueva solicitud de restaurante",
        html: `
            <h2>Nueva solicitud de restaurante</h2>
            <p><b>Restaurante:</b> ${restaurantName}</p>
            <p><b>Propietario:</b> ${ownerName}</p>
            <p><b>Correo:</b> ${restaurantEmail}</p>
            <p><b>Teléfono:</b> ${restaurantPhone}</p>
            <p><b>Ciudad:</b> ${city ?? "N/A"}</p>
            <p><b>Notas:</b> ${notes ?? "Sin observaciones"}</p>
        `,
    });
}

const ownerActivationEmail = async ({email, ownerName, activationLink,}) => {
    await transporter.sendMail({
        from: `"OrderFood" <${env.EMAIL_USER}>`,
        to: email,
        subject: "Activa tu cuenta de restaurante",
        html: `
            <h2>Hola ${ownerName}</h2>
            <p>
                Tu solicitud de restaurante ha sido aprobada.
            </p>
            <p>
                Para activar tu cuenta y crear tu contraseña,
                haz clic en el siguiente enlace:
            </p>
            <p>
                <a href="${activationLink}">
                    Activar cuenta
                </a>
            </p>
            <p>
                Si no solicitaste esta cuenta,
                puedes ignorar este correo.
            </p>
        `,
    });
};
module.exports = { sendEmail, nuevoUsuarioRegistrado, newRestaurantApplication, ownerActivationEmail };