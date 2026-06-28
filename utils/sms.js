/*const twilio = require("../config/twilio");


const sendSMS = async(phone, code)=>{


    await twilio.messages.create({

        body:
        `Tu código de verificación es: ${code}`,

        from:
        process.env.TWILIO_PHONE_NUMBER,

        to:
        `+57${phone}`

    });


};


module.exports = sendSMS;*/
const twilio = require("../config/twilio");

const sendSMS = async (phone, code) => {

    if (process.env.NODE_ENV !== "production") {
        console.log(`📱 [SMS MOCK] -> +57${phone}: tu código es ${code}`);
        return;
    }

    await twilio.messages.create({

        body:
        `Tu código de verificación es: ${code}`,

        from:
        process.env.TWILIO_PHONE_NUMBER,

        to:
        `+57${phone}`

    });

};

module.exports = sendSMS;