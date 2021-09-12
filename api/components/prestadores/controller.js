const TABLA = 'prestadores_db'

module.exports = (injectedStore) => {
    let store = injectedStore
    if (!store) {
        store = require('../../../store/dummy')
    }

    const getNroProv = (nroProv) => {
        return store.getProv(TABLA, nroProv)
    }

    return {
        getNroProv
    }
}