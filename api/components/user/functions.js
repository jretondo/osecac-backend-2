const ejs = require('ejs')
const sendEmail = require('../../../utils/sendmail')
const path = require('path')

const passCreator = async () => {
    const cadenaLarga = "QWERTYUIOPASDFGHJKLZXCVBNM12345678909876543210mnbvcxzlkjhgfdsapoiuytrewq"
    let rndm = 0

    const nvaPass = new Promise((resolve, reject) => {
        let pass = ""
        while (pass.length < 10) {
            rndm = Math.round(Math.random() * 72)
            pass = pass + cadenaLarga.substring(rndm, (rndm + 1))
        }
        resolve(pass)
    })

    return nvaPass
}

const sendPass = async (email, user, nvaPass) => {
    const userData = {
        nvaPass,
        user
    }

    const res = new Promise((resolve, reject) => {
        ejs.renderFile(path.join("views", "emails", "recPass.ejs"), userData, (err, data) => {
            if (err) {
                resolve(false)
            } else {
                try {
                    resolve(sendEmail(email, "Nueva Contraseña", data))
                } catch (error) {
                    reject(error)
                }
            }
        })
    })

    return res
}


module.exports = {
    passCreator,
    sendPass
}