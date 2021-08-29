const auth = require('../../../auth')

module.exports = checkAuth = (idPermission) => {

    const middleware = async (req, res, next) => {
        auth.check.permision(req, idPermission, next)
    }
    return middleware
}