const moment = require('moment')

const TABLA = 'actividad_app'

module.exports = (injectedStore) => {
    let store = injectedStore
    if (!store) {
        store = require('../../../store/dummy')
    }

    const insert = async (req) => {
        const data = {
            descr: req.body.actividad,
            usuario: req.user.id,
            fecha: moment(new Date()).format("YYYY-MM-DD")
        }
        return await store.insert(TABLA, data)
    }

    return {
        insert
    }
}