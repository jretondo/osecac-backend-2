const Store = require('../../../store/mysql2')
const Controller = require("./controller")

module.exports = Controller(Store)