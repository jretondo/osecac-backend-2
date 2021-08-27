const jwt = require('jsonwebtoken');
const configJWT = require('../config').jwt
const error = require("../utils/error")

const sign = (data) => {
    return jwt.sign(data, configJWT.secret);
}

const check = {
    own: (req, owner) => {
        const decoded = decodeHeader(req)
        if (decoded.id !== owner) {
            throw error("No autorizado", 401)
        }
    },
    logged: (req) => {
        const decoded = decodeHeader(req)
    }
}

const getToken = (auth) => {
    if (!auth) {
        throw new Error("No hay token envíado")
    }

    if (auth.indexOf('Bearer ') === -1) {
        throw new Error("Formato inválido")
    }

    let token = auth.replace('Bearer ', "")
    return token
}

const verify = (token) => {
    return jwt.verify(token, configJWT.secret)
}

const decodeHeader = (req) => {
    const authorization = req.headers.authorization || ""
    const token = getToken(authorization)
    const decoded = verify(token)
    req.user = decoded
    return decoded
}

module.exports = {
    sign,
    check
};