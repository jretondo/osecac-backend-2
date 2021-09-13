const nodemailer = require("nodemailer")

const sendEmail = async (recepter, subject, msg) => {
    const tranporter = nodemailer.createTransport({
        host: process.env.HOST_EMAIL,
        port: parseInt(process.env.PORT_EMAIL),
        secure: false,
        auth: {
            user: process.env.SENDER_EMAIL_CONF_INFO,
            pass: process.env.PASS_EMAIL
        }
    })

    return await tranporter.sendMail({
        from: process.env.SENDER_EMAIL_INFO,
        to: recepter,
        subject: subject,
        html: msg
    })
}

module.exports = sendEmail
