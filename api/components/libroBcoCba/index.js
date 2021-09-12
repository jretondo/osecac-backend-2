const Store = require('../../../store/mysql')
const Controller = require("./controller")

module.exports = Controller(Store)