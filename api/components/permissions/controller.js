const TABLA = 'users_permissions'
const customQuerys = require('./customQuery')

module.exports = (injectedStore) => {
    let store = injectedStore
    if (!store) {
        store = require('../../../store/dummy')
    }

    const upsert = async (body) => {
        await store.remove(TABLA, { id_user: body.idUser })
        return await store.customQuery(await customQuerys.insertPermissions(TABLA, body.permisos, body.idUser))
    }

    const getPermision = async (idUser, idPermission) => {
        return await store.customQuery(customQuerys.getPermision(TABLA, idPermission, idUser))
    }
    const get = (idUser) => {
        return store.customQuery(customQuerys.get(TABLA, idUser))
    }
    return {
        upsert,
        getPermision,
        get
    }
}