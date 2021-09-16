const jwt = require('jsonwebtoken');
const configJWT = require('../config').jwt
const error = require("../utils/error")
const { getPermision } = require("../api/components/permissions/index")
const sign = (data) => {
    return jwt.sign(data, configJWT.secret);
}

const check = {
    permision: async (req, idPermission, next) => {
        if (!idPermission) {
            const decoded = decodeHeader(req, next)
            next()
        } else {
            const decoded = decodeHeader(req, next)
            const permision = await getPermision(req.user.id, idPermission)
            const hayPermisos = parseInt(permision.length)
            if (hayPermisos < 1) {
                next(error("No tiene los permisos", 401))
            } else {
                next()
            }
        }
    },
}

const getToken = (auth, next) => {
    if (!auth) {
        next(error("No tiene los token envíado", 400))
    }

    if (auth.indexOf('Bearer ') === -1) {
        next(error("Formato invalido", 400))
    }

    let token = auth.replace('Bearer ', "")
    return token
}

const verify = (token, next) => {
    try {
        return jwt.verify(token, configJWT.secret)
    } catch (err) {
        next(error("Token Invalido", 400))
    }

}

const decodeHeader = (req, next) => {
    const authorization = req.headers.authorization || ""
    const token = getToken(authorization, next)
    const decoded = verify(token, next)
    req.user = decoded
    return decoded
}

module.exports = {
    sign,
    check
};