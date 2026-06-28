const { z } = require("zod");


const nameField = (label) =>
    z.string()
        .min(2, `${label} muy corto`)
        .max(100, `${label} muy largo`)
        .regex(
            /^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]+$/,
            `${label}: solo letras`
        )
        .transform((v) => v.trim());



// ===============================
// REGISTER
// ===============================

const registerCustomerSchema = z.object({

    first_name: nameField("Nombre"),

    last_name: nameField("Apellido"),


    username: z.string()
        .min(3, "Username muy corto")
        .max(50, "Username muy largo")
        .regex(
            /^[a-zA-Z0-9_]+$/,
            "Solo letras, números y guion bajo"
        )
        .toLowerCase()
        .optional()
        .nullable(),


    phone: z.string()
        .length(10, "El teléfono debe tener 10 dígitos")
        .regex(
            /^[0-9]+$/,
            "Solo dígitos"
        ),


    pin: z.string()
        .length(4, "El PIN debe tener exactamente 4 dígitos")
        .regex(
            /^[0-9]+$/,
            "Solo números"
        ),

});



// ===============================
// LOGIN
// ===============================

const loginCustomerSchema = z.object({

    identifier: z.string()
        .min(3, "Ingresa tu teléfono o usuario")
        .max(50),


    pin: z.string()
        .min(4)
        .max(6)
        .regex(
            /^[0-9]+$/,
            "Solo números"
        ),

});



// ===============================
// VERIFY PHONE
// ===============================
const verifyPhoneSchema = z.object({

    phone: z.string()
        .length(10)
        .regex(/^[0-9]+$/, "Solo números"),

    code: z.string()
        .length(6)
        .regex(/^[0-9]+$/, "Código inválido")

});


const resendPhoneCodeSchema = z.object({

    phone: z.string()
        .length(10)
        .regex(/^[0-9]+$/)

});



// ===============================
// EMAIL FUTURO
// ===============================

const verifyEmailSchema = z.object({

    email:
    z.string()
    .email("Correo inválido"),


    token:
    z.string()
    .length(6)
    .regex(/^[0-9]+$/)

});

const startVerificationSchema = z.object({
    type: z.enum(["phone", "email"]),
    contact: z.string(),
}).refine(
    (data) => data.type === "phone"
        ? /^[0-9]{10}$/.test(data.contact)
        : z.string().email().safeParse(data.contact).success,
    { message: "Contacto inválido para el tipo seleccionado" }
);

const verifyCodeSchema = z.object({
    type: z.enum(["phone", "email"]),
    contact: z.string(),
    code: z.string().length(6).regex(/^[0-9]+$/, "Código inválido"),
});

const completeRegistrationSchema = z.object({
    verification_token: z.string(),
    first_name: nameField("Nombre"),
    last_name: nameField("Apellido"),
    username: z.string()
        .min(3, "Username muy corto")
        .max(50, "Username muy largo")
        .regex(/^[a-zA-Z0-9_]+$/, "Solo letras, números y guion bajo")
        .toLowerCase()
        .optional()
        .nullable(),
    pin: z.string().length(4, "El PIN debe tener exactamente 4 dígitos").regex(/^[0-9]+$/, "Solo números"),
});

const updateProfileSchema = z.object({
    first_name: nameField("Nombre").optional(),
    last_name: nameField("Apellido").optional(),
    username: z.string()
        .min(3, "Username muy corto")
        .max(50, "Username muy largo")
        .regex(/^[a-zA-Z0-9_]+$/, "Solo letras, números y guion bajo")
        .toLowerCase()
        .optional(),
    birth_date: z.string().date().optional(),
    gender: z.enum(["male", "female", "other"]).optional(),
    avatar_url: z.string().url().optional(),
}).strict();

module.exports = {

    registerCustomerSchema,

    loginCustomerSchema,

    verifyPhoneSchema,

    resendPhoneCodeSchema,

    verifyEmailSchema,

    startVerificationSchema,

    verifyCodeSchema,

    completeRegistrationSchema,

    updateProfileSchema

};