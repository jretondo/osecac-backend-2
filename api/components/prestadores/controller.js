const TABLA = 'prestadores_db'
const getPages = require('../../../utils/getPages')
const customQuerys = require("./customQuery")

module.exports = (injectedStore) => {
    let store = injectedStore
    if (!store) {
        store = require('../../../store/dummy')
    }

    const getNroProv = (nroProv) => {
        return store.getProv(TABLA, nroProv)
    }

    const list = async (page, palabra) => {
        const listado = await store.customQuery(customQuerys.getListLimit(TABLA, page, palabra))
        const cant = await store.customQuery(customQuerys.getCantTotal(TABLA, palabra))
        const cantTotal = parseInt(cant[0].CANT)
        const pages = await getPages(cantTotal, 10, page)
        return {
            listado,
            pages
        }
    }

    return {
        getNroProv,
        list
    }
}